import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
import { sequelize } from "@/app/utils/sequelize";
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

  const time = url.searchParams.get("time") || 0;
  const id = url.searchParams.get("id") || 0;
  
  // const OFFSET = skip;
  if(time == 0 || id == 0){
    return NextResponse.json(
      {
        name: "Bad Request",
      },
      {
        status: 400,
      },
    );
  }

  await sequelize.query(
    `UPDATE Church SET datePlan = '${time}' WHERE id = ${id};`,
  );


  return NextResponse.json({
    message: "Updated",
  });
}
