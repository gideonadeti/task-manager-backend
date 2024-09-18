import { Request, Response } from "express";
import { User } from "@prisma/client";

export function handleUserGet(req: Request, res: Response) {
  const { firstName, lastName, email } = req.user as User;

  res.json({ user: { firstName, lastName, email } });
}
