import { Request, Response } from "express";
import { User } from "@prisma/client";

import { readTaskGroups } from "../db";

export async function handleUserDataGet(req: Request, res: Response) {
  const { id, firstName, lastName, email } = req.user as User;
  const taskGroups = await readTaskGroups(id);

  res.json({ user: { firstName, lastName, email }, taskGroups });
}
