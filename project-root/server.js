const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const workoutRoutes = require("./routes/workoutRoutes");

const nutritionRoutes = require("./routes/nutritionRoutes");
const scannerRouter = require('./routes/scannerRouter');
const http = require("http");
const { setupVideoCall } = require("./services/video-call");



dotenv.config();
connectDB();
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/workouts", workoutRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/diet", require("./routes/dietRoutes"));
app.use('/api', scannerRouter);

setupVideoCall(server);



app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
