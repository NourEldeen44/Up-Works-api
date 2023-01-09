require("dotenv").config();
require("express-async-errors");
const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
//secruity packages
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
var xss = require("xss-clean");
var cors = require("cors");

//routes
const authRoutes = require("./routes/auth");
const jobsRoutes = require("./routes/jobs");
const chatRoutes = require("./routes/chat");
const connectDB = require("./db/connect");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const auth = require("./middleware/authentication");
const IO = require("./utils/io");
const port = process.env.PORT || 5000;
const dbUri = process.env.DB_URI;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const createIO = new IO(io);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const startServer = async (dbUri) => {
  try {
    await connectDB(dbUri);
    server.listen(port, () => {
      console.log(`server is connected to db and listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

//middleware
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(limiter);
app.use(helmet());
app.use(xss());

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", auth, jobsRoutes);
app.use("/api/v1/chats", auth, chatRoutes);
//notfound
app.use(notFound);
//errs
app.use(errorHandler);
startServer(dbUri);
module.exports = { io };
