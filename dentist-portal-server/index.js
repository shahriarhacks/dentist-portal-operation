const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("unauthorized access");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECURE_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

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
    const usersCollections = client.db("DentistPortal").collection("users");

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

    app.get("/bookings", verifyJWT, async (req, res) => {
      // const accessToken = req.headers;
      const email = req.query.email;
      const decodedEmail = req.decoded.email;
      if (email !== decodedEmail) {
        return res.status(403).send({ message: "Forbidden Access" });
      }
      const query = { email: email };
      const result = await bookingsCollections.find(query).toArray();
      res.send(result);
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

    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollections.findOne(query);
      if (user) {
        const token = jwt.sign({ email }, process.env.SECURE_TOKEN, {
          expiresIn: "1h",
        });
        return res.send({ accessToken: token });
      }
      res.status(403).send({ accessToken: "" });
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollections.insertOne(user);
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
