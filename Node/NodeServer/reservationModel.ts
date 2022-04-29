import { Schema } from "mongoose";

export interface Reservation {
  hotelId: number;
  checkIn: string;
  checkOut: string;
  roomNo: number;
  customerName: string;
  customerEmail: string;
  CustomerAddress: string;
}

export const reservationSchema = new Schema<Reservation>({
  hotelId: { type: Number, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  roomNo: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  CustomerAddress: { type: String, required: true },
});
