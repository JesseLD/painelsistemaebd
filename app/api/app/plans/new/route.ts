import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import prisma from "@/app/utils/prisma";
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

    if (!data.name || !data.value || !data.duration) {
      return NextResponse.json(
        {
          name: "Invalid data",
        },
        {
          status: 400,
        },
      );
    }

    const exists = await prisma.plans.findUnique({
      where: {
        name: data.name,
      },
    });

    if (exists) {
      return NextResponse.json(
        {
          message: "Erro ao criar o plano",
          error: "O Plano já existe", // Adicionando a mensagem de erro à resposta
        },
        {
          status: 400,
        },
      );
    }

    console.log(data.value)
    try {
      await prisma.plans.create({
        data: {
          name: data.name,
          price: Number.parseFloat(data.value.replace(",", ".")),
          duration: Number(data.duration),
          description: data.description,
          maxBranches: Number(data.maxBranches),
          maxStudents: Number(data.maxStudents)
        },
      });

      return NextResponse.json({
        message: "Plano criado",
        status: 200,
      });
    } catch (e: any) {
      console.log(e.message);
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
    console.log("DATAAAAAA");
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
