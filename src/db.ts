import { PrismaClient } from "@prisma/client";

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
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

export async function readUser(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (error) {
    console.error("Error reading user:", error);
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
  }
}
