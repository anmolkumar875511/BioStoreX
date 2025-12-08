import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
    batchNo: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date },
}, { _id: false });

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { 
        type: String,
        required: true,
        enum: ["CHEMICAL", "GLASSWARE", "CONSUMABLE", "BIO_MATERIAL", "EQUIPMENT"]
    },
    unitType: { 
        type: String,
        required: true,
        enum: ["g", "mg", "kg", "mL", "L", "pieces", "box", "pack"]
    },
    image: { type: String },
    batches: [batchSchema],
    totalQuantity: { type: Number, default: 0 },
    minThreshold: { type: Number, default: 5 },
    sku: { type: String, unique: true },
}, { timestamps: true });


export const Item = mongoose.model("Item", itemSchema);

