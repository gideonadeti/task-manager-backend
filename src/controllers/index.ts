import { Request, Response } from "express";
import { User } from "@prisma/client";
import { body, validationResult } from "express-validator";

import { readTaskGroups, createTask, createTaskGroup } from "../db";

export async function handleUserDataGet(req: Request, res: Response) {
  const { id, firstName, lastName, email } = req.user as User;
  const taskGroups = await readTaskGroups(id);

  res.json({ user: { firstName, lastName, email }, taskGroups });
}

export const handleTasksPost = [
  body("title").trim().notEmpty().withMessage("Title is required"),

  body("priority")
    .trim()
    .notEmpty()
    .withMessage("Priority is required")
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Priority must be either LOW, MEDIUM, or HIGH"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = req.body;
    const { id } = req.user as User;
    const taskGroupId = task.groupId;

    try {
      const newTask = await createTask(task, id, taskGroupId);

      res.status(201).json({
        message: "Task added successfully",
        newTask,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errors: [
          {
            msg: "An error occurred during task addition. Please try again later.",
          },
        ],
      });
    }
  },
];

export const handleTaskGroupsPost = [
  body("name").trim().notEmpty().withMessage("Name is required"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const { id } = req.user as User;

    try {
      const newTaskGroup = await createTaskGroup(name, id);

      res.status(201).json({
        message: "Task Group added successfully",
        groupId: newTaskGroup.id,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        errors: [
          {
            msg: "An error occurred during task group addition. Please try again later.",
          },
        ],
      });
    }
  },
];
