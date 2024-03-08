import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import prisma from "@/app/utils/prisma";
import bcrypt from "bcryptjs";

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

  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      {
        name: "Bad Request",
      },
      {
        status: 400,
      },
    );
  }

  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exists) {
    return NextResponse.json(
      {
        message: "Usuário já existe",
        status: 400,
      },
      {
        status: 400,
      },
    );
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);

    try{
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return NextResponse.json({
        message: "Usuário criado com sucesso",
        status:200
      });
    }
    catch(e){
      return NextResponse.json(
        {
          name: "Internal Server Error",
        },
        {
          status: 500,
        },
      );
    }
  }
}
