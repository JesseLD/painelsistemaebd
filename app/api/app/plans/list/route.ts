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

  const results = await prisma.plans.findMany({
    select: {
      id: true,
      name: true,
      duration: true,
      price: true,
      description: true,
      maxBranches: true,
      maxStudents: true,
    },
  });
  // setData(data);
  const data = results;
  // console.log(data)

  return NextResponse.json({
    data,
  });
}
