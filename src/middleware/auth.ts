// src/middleware/auth.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: IUser;
}

export function protect(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized, token missing" });
    return; // <— stop here
  }

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    User.findById(payload.id)
      .select("-password")
      .then((user) => {
        if (!user) {
          res.status(401).json({ error: "Unauthorized, user not found" });
          return; // <— stop if no user
        }
        req.user = user;
        next(); // <— proceed if OK
      });
  } catch {
    res.status(401).json({ error: "Unauthorized, token invalid" });
    return; // <— stop here
  }
}
