import { Request, Response } from "express";

export const notFound = async (req: Request, res: Response) => {
      res.status(404).json({
            success: false,
            statusCode: 404,
            path: req.originalUrl,
            message: "Route not found!",
            date: Date(),
      })
};