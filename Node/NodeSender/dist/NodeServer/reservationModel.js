"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.reservationSchema = new mongoose_1.Schema({
    hotelId: { type: Number, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    roomNo: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    CustomerAddress: { type: String, required: true },
});
