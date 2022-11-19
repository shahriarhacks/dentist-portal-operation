const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.whzqc0b.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const appointmentOptionsCollections = client
      .db("DentistPortal")
      .collection("appointmentOptions");
    const bookingsCollections = client
      .db("DentistPortal")
      .collection("bookings");

    app.get("/appointment-options", async (req, res) => {
      const date = req.query.date;
      const query = {};
      const bookingQuery = { appointmentDate: date };
      const options = await appointmentOptionsCollections.find(query).toArray();
      const alreadyBooked = await bookingsCollections
        .find(bookingQuery)
        .toArray();

      options.forEach((option) => {
        const optionBooked = alreadyBooked.filter(
          (book) => book?.treatment === option?.name
        );
        const bookedSlots = optionBooked.map((book) => book.slot);
        const remainingSlots = option.slots.filter(
          (slot) => !bookedSlots.includes(slot)
        );
        option.slots = remainingSlots;
      });
      res.send(options);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const query = {
        appointmentDate: booking.appointmentDate,
        treatment: booking?.treatment,
        email: booking?.email,
      };
      const alreadyBooked = await bookingsCollections.find(query).toArray();
      if (alreadyBooked.length) {
        const message = `You already have a booking on ${booking?.appointmentDate}`;
        return res.send({ acknowledged: false, message });
      }
      const result = await bookingsCollections.insertOne(booking);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is Ready to Run");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
