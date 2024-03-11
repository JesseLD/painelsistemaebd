import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import prisma from "@/app/utils/prisma";
// import { select } from "@prisma/client";

// import { sequelize } from "@/app/utils/sequelize";
export async function GET(req: Request) {
  const apiKey = req.headers.get("authorization");

  if (apiKey !== process.env.API_KEY) {
    return NextResponse.json(
      {
        name: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const url = new URL(req.url);

  const email = url.searchParams.get("email") || 0;

  if (email == 0) {
    return NextResponse.json(
      {
        name: "Invalid data",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,

      },
      where: {
        email
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 400,
        },
      );
    }
    return NextResponse.json({
      user,
    });
  } catch (e) {
    return NextResponse.json(
      {
        name: "Erro ao deletar usuário",
      },
      {
        status: 400,
      },
    );
  }
}
