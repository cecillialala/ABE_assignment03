var amqp = require("amqplib/callback_api");
import { Reservation } from "../NodeServer/reservationModel";
amqp.connect("amqp://localhost", function (error0: any, connection: any) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1: any, channel: any) {
    if (error1) {
      throw error1;
    }

    var queue = "MQReservation";

    // https://stackoverflow.com/questions/49788162/rabbitmq-send-a-json-message
    var reservationBooking: Reservation = {
      hotelId: 0,
      checkIn: "2022-04-29",
      checkOut: "2022-05-29",
      roomNo: 123,
      customerName: "Mumu",
      customerEmail: "Mumu@Yuhu.dk",
      CustomerAddress: "Katrinebjerg",
    };
    var msg = JSON.stringify(reservationBooking);

    channel.assertQueue(queue, {
      durable: false,
    });
    channel.sendToQueue(queue, Buffer.from(msg));

    console.log(" [x] Sent %s", msg);
  });
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
