 import mongoose from "mongoose";

 const billRegistrySchema = new mongoose.Schema({
    BillNo:{
        type: String,
        required: true,
    },
    CustomerName:{
        type: String,
        required: true,
    },
    CustomerContact:{
        type: String,
        required: true,
    },
    CustomerAddress:{
        type: String,
        required: false,
    },
    BillDescription:{
        type: String,
        required: false,
    },
    BillAmount: {
        type: Number,
        required: true,
    },
    BillDate: {
        type: Date,
        required: true,
    },
    Attachments:{
        type: String,
        required: false, // Optional field for attachments
    },
    PaymentStatus: {
        type: String,
        enum: ['paid', 'unpaid','partial' ],
        default: 'unpaid',
    },
    CurrentDate: {
        type: Date,
        default: Date.now,
    },
 })

 export const BillRegistry =  mongoose.model('BillRegistry', billRegistrySchema);