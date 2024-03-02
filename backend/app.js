const connectDB = require("./config/db-connection");
const express = require("express");
const expressSession = require("express-session");
const cors = require("cors");
const passport = require("passport");
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();
connectDB();
const { infoLogger } = require("./helpers/logger");
const { rateLimiter } = require("./helpers/rate-limiter");

const app = express();

console.log(process.env.PORT);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  expressSession({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);
app.use(infoLogger);
app.use(rateLimiter);

const users_route = require("./routes/userRoutes");
const chat_route = require("./routes/chatRoutes");

app.use("/api/v1/user", users_route);
app.use("/api/v1/chat", chat_route);

// default case for unmatched routes
app.use(function (req, res) {
  res.status(404);
});

app.listen(process.env.PORT, () => {
  console.log(`\nServer Started on ${process.env.PORT}`);
});
