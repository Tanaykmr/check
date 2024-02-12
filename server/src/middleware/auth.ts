import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Response, Request, NextFunction } from "express";


dotenv.config({ path: "./config/.env.local" });
export const secret = process.env.JWT_SECRET;
if (!secret) {
  console.error("JWT_SECRET is not defined in the environment variables in auth.ts.");
  process.exit(1);
}
// we verify the jwt here
export const authenticatejwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secret, function (err, payload)  {
      if (err) {
        res.status(401).json({ message: "encountered an error, enable to login" });
        console.error(err);
      } else if (!payload) {
        res.sendStatus(403);
      } else if (typeof payload === "string") {
        return res.sendStatus(403);
      } else {
        req.headers.userId = payload.id; //this id is the mongoDB _id of the user
		next();
      }
    });
  } else {
    res.status(401).send({ message: "authorization token does not exist" });
  }
};
