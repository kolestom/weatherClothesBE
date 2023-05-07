import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../util/envParser";
import { z } from "zod";

const TokenSchema = z.object({
  name: z.string(),
  sub: z.string(),
  email: z.string()
});

const authMW = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);
  const token = header.split(" ")[1];
  if (!token) return res.status(401);
  try {
    const verifiedUser = jwt.verify(token, env.JWT_SECRET_KEY);
    const parseResult = TokenSchema.safeParse(verifiedUser);
    if (!parseResult.success) return res.sendStatus(401).json("An error occurred. Please, log in again");
    res.locals.sub = parseResult.data.sub;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json("Your session expired. Please, log in again");
  }
};

export default authMW;
