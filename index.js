const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const cors = require("cors");
const bodyParser = require("body-parser");
const clientsRoutes = require("./routes/clients");
const professionalsRoutes = require("./routes/professionals");
const servicesRoutes = require("./routes/services");
const prestationsRoutes = require("./routes/prestations");
const categoriesRoutes = require("./routes/categories");
const usersRoutes = require("./routes/users");

const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

app.use(cors());
// app.use(express.json({ limit: "30mb", extended: true }));
// app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/prestations", prestationsRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/professionals", professionalsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/categories", categoriesRoutes);

const io = new Server(httpServer, {
  cors: {
    origin: "exp://192.168.1.7:19000",
  },
});
io.on("connection", (socket) => {
  socket.on("request-prestation", ({ prestationId }) => {
    socket.join(prestationId);
  });
  socket.on("sendResponse", ({ response, prestationId }) => {
    socket.to(prestationId).emit("professionalResponse", response);
  });
});

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
  console.log("connected");
});

httpServer.listen(process.env.PORT, () => {
  console.log("listening on port 5000");
});
