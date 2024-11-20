import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import Auth from "./routes/auth";
import Policy from "./routes/policy";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", Auth);
app.use("/policies", Policy);

app.use((req, res) => {
  res.status(404).json({
    message: "Not Found",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
