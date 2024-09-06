import "dotenv/config";
import express from "express";
import cors from "cors";

// Importar conexão com o banco de dados
import conn from "./config/conn.js";

// Importar as ROTAS
import postagensRouter from "./routes/postagensRouter.js";

const PORT = process.env.PORT || 3333;
const app = express();

// 3 middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conexão com o banco de dados
conn
    .sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor ON PORT: ${PORT}`);
        });
    })
    .catch((error) => console.error('Erro na conexão com o banco de dados:', error));

// Utilizar as Rotas
app.use("/postagens", postagensRouter);

// Middleware para rota não encontrada
app.use((request, response) => {
    response.status(404).json({ message: "Rota não encontrada" });
});