const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const limiter = require("./middlewares/limiter");

const compression = require("compression");
const bodyParser = require("body-parser");

const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

// Middlewares
app.use(limiter);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(helmet());

// Routes
app.use("/auth", authRoutes);
app.use("/members", memberRoutes);
app.use("/owners", ownerRoutes);
app.use("/tasks", taskRoutes);
app.use("/projects", projectRoutes);

// test route (check the tailwind css is working)
app.get("/", (req, res) => {
    res.render("index");
});

// Catch 404 errors
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;
