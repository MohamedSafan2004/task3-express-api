import { Request, Response, NextFunction } from "express";

//middleware to protect routes with an API key
export const requireAPIKey = (req: Request, res: Response, next: NextFunction) => {
  const expectedKey = process.env.API_KEY;

  if (!expectedKey) {
    res.status(500).json({ message: "Server error: API key is not configured" });
    return;
  }

  const apiKey = req.headers["x-api-key"];

  if (apiKey !== expectedKey) {
    res.status(401).json({ message: "Unauthorized: invalid or missing API key" });
    return;
  }

  next();
};
