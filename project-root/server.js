const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const scannerRouter = require('./routes/scannerRouter');



dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/diet", require("./routes/dietRoutes"));
app.use('/api', scannerRouter);



app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
