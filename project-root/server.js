const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const creatorRoutes = require("./routes/creatorAuth");

const workoutPlanRoutes = require("./routes/workoutPlanRoutes.js");
const dietPlanRoutes = require("./routes/dietPlanRoutes.js");




dotenv.config();
connectDB();
const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);



app.use("/api/creator", creatorRoutes);
app.use("/api/workoutPlans", workoutPlanRoutes);
app.use("/api/dietPlans", dietPlanRoutes);






app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
