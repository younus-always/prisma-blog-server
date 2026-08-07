import express, { Application } from "express";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(cors());



app.get("/", (req, res) => {
      res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Prisma Blog App Server"
      });
});


export default app;