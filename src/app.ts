import express, { Application } from "express";
import cors from "cors";
import { postRoutes } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { commentRoutes } from "./modules/comment/comment.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app: Application = express();
app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());
app.use(cors({
      origin: process.env.APP_URL || "http://localhost:4000",
      credentials: true
}));

app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

app.get("/", (req, res) => {
      res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Prisma Blog App Server"
      });
});


app.use(globalErrorHandler);

export default app;