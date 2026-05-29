import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import albumRoutes from "./routes/albumRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    message: "Backend do portfólio de fotografia rodando!"
  });
});

app.use("/albums", albumRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});