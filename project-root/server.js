require("dotenv").config();
const app = require("./config/app");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});
