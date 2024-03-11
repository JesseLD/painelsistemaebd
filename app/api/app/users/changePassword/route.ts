import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import prisma from "@/app/utils/prisma";
import { where } from "sequelize";
import bcrypt from "bcryptjs";

// import { sequelize } from "@/app/utils/sequelize";
export async function POST(req: Request) {
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

  try {
    const data = await req.json();

    if (!data.id || !data.password) {
      return NextResponse.json(
        {
          name: "Invalid data",
        },
        {
          status: 400,
        },
      );
    }

    const exists = await prisma.user.findUnique({
      where: {
        id: Number.parseInt(data.id),
      },
    });

    if (!exists) {
      return NextResponse.json(
        {
          message: "Erro ao atualizar o usuário",
          error: "O usuário não existe", // Adicionando a mensagem de erro à resposta
        },
        {
          status: 400,
        },
      );
    }
    try {

      const hashedPassword = await bcrypt.hash(data.password, 10);
      await prisma.user.update({
        data: {
          password: hashedPassword,
        },
        where: {
          id: Number.parseInt(data.id),
        },
      });

      return NextResponse.json({
        message: "Senha atualizada com sucesso!",
        status: 200,
      });
    } catch (e: any) {
      return NextResponse.json(
        {
          message: "Internal Server Error",
          error: e.message, // Adicionando a mensagem de erro à resposta
        },
        {
          status: 500,
        },
      );
    }
  } catch (e: any) {
    console.log(e);
    return NextResponse.json(
      {
        name: "Internal Server Error",
        error: e.message, // Adicionando a mensagem de erro à resposta
      },
      {
        status: 500,
      },
    );
  }
}
