import express from "express";
import dotenv from "dotenv";
import sequelize from "./db.js";
import routes from "./routes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/", routes);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    await sequelize.sync();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server", err);
  }
}

start();
