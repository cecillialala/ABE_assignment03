import { reservationSchema } from "./reservationModel";
import mongoose from "mongoose";

var amqp = require("amqplib/callback_api");

const reservationConnection = mongoose.createConnection(
  "mongodb://localhost:27017/rabbitMQHotel"
);
const ReservationModel = reservationConnection.model(
  "Reservation",
  reservationSchema
);

amqp.connect("amqp://localhost", function (error0: any, connection: any) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1: any, channel: any) {
    if (error1) {
      throw error1;
    }

    var queue = "MQReservation";
    channel.assertQueue(queue, {
      durable: true,
    });
    channel.prefetch(1);

    var confirmQueue = "MQConfirms";
    channel.assertQueue(queue, {
      durable: true,
    });

    console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(
      queue,
      async function reply(msg: any) {
        console.log(" [x] Received %s", msg.content.toString());
        var bookedReservation = JSON.parse(msg.content);
        var { id } = await new ReservationModel(bookedReservation).save();
        channel.sendToQueue(
          confirmQueue,
          Buffer.from(bookedReservation.customerName + " " + id)
        );
      },
      {
        noAck: true,
      }
    );
  });
});
