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

  const skip = url.searchParams.get("offset") || 0;

  const OFFSET = skip;

  const results = await sequelize.query(
    `SELECT id,name,CPF_CNPJ,isActiveted,dateplan,creationDate,TypePlan FROM Church WHERE idChurch IS NULL LIMIT 25 OFFSET ${OFFSET}`,
  );
  // setData(data);
  const data = results[0];
  // console.log(data)

  return NextResponse.json({
    data,
  });
}
