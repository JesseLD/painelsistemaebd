import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import prisma from "@/app/utils/prisma";

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

  const id = url.searchParams.get("id") || 0;

  if (id == 0) {
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
    await prisma.plans.delete({
      where: {
        id: Number(id),
      },
    });
  } catch (e) {
    return NextResponse.json(
      {
        name: "Erro ao deletar plano",
      },
      {
        status: 400,
      },
    );
  }

  return NextResponse.json({
    message: "Deleted",
  });
}
