import { Item } from "../models/item.model.js";
import { StockLog } from "../models/stockLog.model.js"; // Import StockLog
import { uploadImage } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";

const addStock = async (req, res, next) => {
    try {
        const { name, category, unitType, quantity, batchNo, expiryDate } = req.body;

        if (!name || !category || !unitType || !quantity || !batchNo) {
            throw new ApiError(400, "All fields are required");
        }

        let imageUrl = null;
        if (req.file) {
            const img = await uploadImage(req.file.path);
            imageUrl = img?.secure_url || null;

            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }

        let item = await Item.findOne({ name: name.trim().toLowerCase() });

        const batchData = {
            batchNo,
            quantity: Number(quantity),
            expiryDate: expiryDate || null
        };

        if (!item) {
            item = await Item.create({
                name: name.trim().toLowerCase(),
                category,
                unitType,
                batches: [batchData],
                totalQuantity: Number(quantity),
                image: imageUrl,
                sku: "SKU-" + Date.now()
            });
        } else {
            item.batches.push(batchData);
            item.totalQuantity += Number(quantity);

            if (imageUrl) item.image = imageUrl;

            await item.save();
        }

        await StockLog.create({
            item: item._id,
            type: "ADD",
            quantity: Number(quantity),
            performedBy: req.user._id,
            note: `Added batch ${batchNo}${expiryDate ? ` (Expiry: ${expiryDate})` : ""}`
        });

        return res.status(201).json(
            new ApiResponse(201, item, "Stock added successfully")
        );

    } catch (error) {
        next(error);
    }
};

const removeStock = async (req, res, next) => {
    try {
        const { itemId, quantity, batchNo, note } = req.body;

        if (!itemId || !quantity) {
            throw new ApiError(400, "Item ID and quantity are required");
        }

        const item = await Item.findById(itemId);
        if (!item) {
            throw new ApiError(404, "Item not found");
        }

        let qtyToRemove = Number(quantity);

        if (batchNo) {
            const batch = item.batches.find(b => b.batchNo === batchNo);
            if (!batch) {
                throw new ApiError(404, `Batch ${batchNo} not found`);
            }

            if (batch.quantity < qtyToRemove) {
                throw new ApiError(400, `Insufficient stock in batch ${batchNo}`);
            }

            batch.quantity -= qtyToRemove;
        } else {
            let totalAvailable = item.totalQuantity;
            if (totalAvailable < qtyToRemove) {
                throw new ApiError(400, "Insufficient total stock");
            }

            for (const batch of item.batches) {
                if (qtyToRemove <= 0) break;

                if (batch.quantity >= qtyToRemove) {
                    batch.quantity -= qtyToRemove;
                    qtyToRemove = 0;
                } else {
                    qtyToRemove -= batch.quantity;
                    batch.quantity = 0;
                }
            }
        }

        item.totalQuantity -= Number(quantity);

        await StockLog.create({
            item: item._id,
            type: "REMOVE",
            quantity: Number(quantity),
            performedBy: req.user._id,
            note: note || `Removed ${quantity} units${batchNo ? ` from batch ${batchNo}` : ""}`
        });

        if (item.totalQuantity <= 0) {
            if (item.image?.publicId) {
                await cloudinary.uploader.destroy(item.image.publicId);
            }

            await Item.findByIdAndDelete(item._id);

            return res.status(200).json(
                new ApiResponse(200, null, "Stock removed and item deleted as stock reached 0")
            );
        }else {
            await item.save();
            return res.status(200).json(
                new ApiResponse(200, item, "Stock removed successfully")
            );
        }

    } catch (error) {
        next(error);
    }
};



export { addStock, removeStock };