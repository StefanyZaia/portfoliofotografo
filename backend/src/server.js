import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import albumRoutes from "./routes/albumRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  return res.json({
    message: "Backend do portfólio de fotografia rodando!",
  });
});

app.use("/albums", albumRoutes);
app.use("/photos", photoRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
