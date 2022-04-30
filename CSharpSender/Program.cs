using System;
using RabbitMQ.Client;
using System.Text;
using Newtonsoft.Json;
using CSharpSender.Model;

class Send
{
    public static void Main()
    {
        var factory = new ConnectionFactory() { HostName = "localhost" };
        using (var connection = factory.CreateConnection())
        using (var channel = connection.CreateModel())
        {
            channel.QueueDeclare(queue: "MQReservation",
                                 durable: false,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);


            var reservation = new Reservation()
            {
                hotelId = 1,
                checkIn = "2022-04-30",
                checkOut = "2022-05-30",
                roomNo = 223,
                customerName = "Yuhu",
                customerEmail = "Yuhu@Yuhu.dk",
                CustomerAddress = "Ravnsbjerg"
            };

            var message = JsonConvert.SerializeObject(reservation);

            var body = Encoding.UTF8.GetBytes(message);

            channel.BasicPublish(exchange: "",
                                 routingKey: "MQReservation",
                                 basicProperties: null,
                                 body: body);
            Console.WriteLine(" [x] Sent {0}", message);
        }

        Console.WriteLine(" Press [enter] to exit.");
        Console.ReadLine();
    }
}
