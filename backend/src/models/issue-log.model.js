import mongoose from 'mongoose';

const issueLogSchema = new mongoose.Schema({
    item: { type: mongoose.Types.ObjectId, ref: "Item", required: true },
    issuedTo: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["PENDING", "APPROVED", "ISSUED", "DECLINED"], default: "PENDING", required: true },
    quantity: { type: Number, required: true },
    issuedBy: { type: mongoose.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export const IssueLog = mongoose.model("IssueLog", issueLogSchema);