import { Request } from "../models/request.model.js";
import { IssueLog } from "../models/issue-log.model.js";
import { Item } from "../models/item.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const requestItem = async (req, res, next) => {
    try {
        const { itemId, quantity } = req.body;

        if (!itemId || !quantity) {
            throw new ApiError(400, "Item ID and quantity are required");
        }

        const item = await Item.findById(itemId);
        if (!item) throw new ApiError(404, "Item not found");

        if (quantity > item.totalQuantity) {
            throw new ApiError(400, "Requested quantity exceeds available stock");
        }

        const existing = await Request.findOne({ user: req.user._id, item: itemId, status: "PENDING" });
        if (existing) {
            throw new ApiError(400, "You already have a pending request for this item");
        }

        const request = await Request.create({
            user: req.user._id, 
            item: itemId,
            quantityRequested: quantity,
            status: "PENDING"
        });

        return res
            .status(201)
            .json(new ApiResponse(201, request, "Request submitted successfully"));
    } catch (error) {
        next(error);
    }
};

const approveRequest = async (req, res, next) => {
    try {
        const {id: requestId } = req.params;

        const request = await Request.findById(requestId).populate("item");
        if (!request) throw new ApiError(404, "Request not found");

        if (request.status !== "PENDING") {
            throw new ApiError(400, "Request is already processed");
        }

        if (request.quantityRequested > request.item.totalQuantity) {
            throw new ApiError(400, "Not enough stock available");
        }

        request.status = "APPROVED";
        request.quantityApproved = request.quantityRequested;
        request.approvedBy = req.user._id;

        await request.save();

        return res.status(200).json(
            new ApiResponse(200, request, "Request approved successfully")
        );
    } catch (error) {
        next(error);
    }
};


const declineRequest = async (req, res, next) => {
    try {
        const { id: requestId } = req.params;
        const { reason } = req.body;

        const request = await Request.findById(requestId);
        if (!request) throw new ApiError(404, "Request not found");

        if (request.status !== "PENDING") {
            throw new ApiError(400, "Request is already processed");
        }

        request.status = "DECLINED";
        request.declineReason = reason || "No reason provided";
        request.approvedBy = req.user._id;

        await request.save();

        return res
            .status(200)
            .json(new ApiResponse(200, request, "Request declined"));
    } catch (error) {
        next(error);
    }
};


const issueItem = async (req, res, next) => {
    try {
        const {id: requestId } = req.params;

        const request = await Request.findById(requestId).populate("item user");
        if (!request) throw new ApiError(404, "Request not found");

        if (request.status !== "APPROVED") {
            throw new ApiError(400, "Request must be approved before issuing");
        }

        const qty = request.quantityApproved;
        const item = await Item.findById(request.item._id);

        if (item.totalQuantity < qty) {
            throw new ApiError(400, "Insufficient stock");
        }

        let remaining = qty;

        for (const batch of item.batches) {
            if (remaining <= 0) break;

            if (batch.quantity >= remaining) {
                batch.quantity -= remaining;
                remaining = 0;
            } else {
                remaining -= batch.quantity;
                batch.quantity = 0;
            }
        }

        item.totalQuantity -= qty;
        await item.save();

        request.status = "ISSUED";
        request.issuedAt = new Date();
        await request.save();

        await IssueLog.create({
            item: item._id,
            issuedTo: request.user._id,
            quantity: qty,
            issuedBy: req.user._id
        });

        return res.status(200).json(
            new ApiResponse(200, request, "Item issued successfully")
        );
    } catch (error) {
        next(error);
    }
};


const getAllRequests = async (req, res, next) => {
    try {
        const requests = await Request.find()
            .populate("user", "fullName username email role")
            .populate("item", "name category unitType totalQuantity")
            .sort({ createdAt: -1 });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    requests, "All requests fetched successfully"
                )
            );
    } catch (error) {
        next(error);
    }
};


const getMyRequests = async (req, res, next) => {
    try {
        const requests = await Request.find({ user: req.user._id })
            .populate("item", "name category unitType totalQuantity")
            .sort({ createdAt: -1 });

        return res
            .status(200)
            .json(new ApiResponse(200, requests, "Your requests fetched successfully"));
    } catch (error) {
        next(error);
    }
};


const returnItem = async (req, res, next) => {
    try {
        const { id: requestId } = req.params;
        const { quantity, note } = req.body;

        if (!quantity) {
            throw new ApiError(400, "Quantity is required");
        }

        const request = await Request.findById(requestId).populate("item user");
        if (!request) throw new ApiError(404, "Request not found");

        if (request.status !== "ISSUED") {
            throw new ApiError(400, "Item must be issued before it can be returned");
        }

        if (quantity > request.quantityApproved) {
            throw new ApiError(400, "Return quantity exceeds issued quantity");
        }

        const item = await Item.findById(request.item._id);
        if (!item) {
            throw new ApiError(404, "Item not found");
        }

        let qtyToRestore = Number(quantity);
        for (const batch of item.batches) {
            if (qtyToRestore <= 0) break;

            batch.quantity += qtyToRestore;
            qtyToRestore = 0;
        }

        item.totalQuantity += Number(quantity);
        await item.save();

        request.status = "RETURNED";
        request.returnedAt = new Date();
        request.quantityReturned = Number(quantity);
        request.returnProcessedBy = req.user._id;
        await request.save();

        await IssueLog.create({
            item: item._id,
            issuedTo: request.user._id,
            quantity: -Math.abs(quantity), 
            issuedBy: req.user._id,
            note: note || "Item returned"
        });

        return res.status(200).json(
            new ApiResponse(200, request, "Item returned successfully")
        );
    } catch (error) {
        next(error);
    }
};




export {
    requestItem,
    approveRequest,
    declineRequest,
    issueItem,
    getAllRequests,
    getMyRequests,
    returnItem
};
