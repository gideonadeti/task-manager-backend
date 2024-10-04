import { PrismaClient, Task } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkEmailExistence(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user !== null;
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw error;
  }
}

export async function createUser({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  try {
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        taskGroups: {
          create: {
            name: "Inbox",
          },
        },
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function readUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  } catch (error) {
    console.error("Error reading user by Id:", error);
    throw error;
  }
}

export async function readUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  } catch (error) {
    console.error("Error reading user by email:", error);
    throw error;
  }
}

export async function createRefreshToken(refreshToken: string, userId: string) {
  try {
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
      },
    });
  } catch (error) {
    console.error("Error creating refresh token:", error);
    throw error;
  }
}

export async function readRefreshToken(refreshToken: string) {
  try {
    const storedRefreshToken = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
    });

    return storedRefreshToken;
  } catch (error) {
    console.error("Error checking refresh token existence:", error);
    throw error;
  }
}

export async function readTaskGroups(userId: string) {
  try {
    const taskGroups = await prisma.taskGroup.findMany({
      where: {
        userId,
      },
      include: {
        tasks: true,
      },
    });

    return taskGroups;
  } catch (error) {
    console.error(
      `Error reading task groups of user with ID: ${userId}:`,
      error
    );
    throw error;
  }
}

export async function readTasks(userId: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
      },
    });

    return tasks;
  } catch (error) {
    console.error("Error reading tasks:", error);
    throw error;
  }
}

export async function createTask(
  task: Task,
  userId: string,
  taskGroupId: string
) {
  try {
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;

    await prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate,
        userId,
        taskGroupId,
      },
    });
  } catch (error) {
    console.error("Error creating task", error);
    throw error;
  }
}

export async function readUserByGoogleId(googleId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        googleId,
      },
    });

    return user;
  } catch (error) {
    console.error("Error reading user from Google ID:", error);
    throw error;
  }
}

export async function createUserFromGoogle(
  googleId: string,
  firstName: string,
  lastName: string,
  email: string
) {
  try {
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        googleId,
        taskGroups: {
          create: {
            name: "Inbox",
          },
        },
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user from Google:", error);
    throw error;
  }
}

export async function createTaskGroup(name: string, userId: string) {
  try {
    const newTaskGroup = await prisma.taskGroup.create({
      data: {
        name,
        userId,
      },
    });

    return newTaskGroup;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
