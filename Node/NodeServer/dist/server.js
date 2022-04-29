"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reservationModel_1 = require("./reservationModel");
const mongoose_1 = __importDefault(require("mongoose"));
var amqp = require("amqplib/callback_api");
const reservationConnection = mongoose_1.default.createConnection("mongodb://localhost:27017/rabbitMQHotel");
const ReservationModel = reservationConnection.model("Reservation", reservationModel_1.reservationSchema);
amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = "MQReservation";
        channel.assertQueue(queue, {
            durable: false,
        });
        channel.prefetch(1);
        var confirmQueue = "MQConfirms";
        channel.assertQueue(queue, {
            durable: false,
        });
        console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function reply(msg) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(" [x] Received %s", msg.content.toString());
                var bookedReservation = JSON.parse(msg.content);
                var { id } = yield new ReservationModel(bookedReservation).save();
                channel.sendToQueue(confirmQueue, Buffer.from(id));
            });
        }, {
            noAck: true,
        });
    });
});
