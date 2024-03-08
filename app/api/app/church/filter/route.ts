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

  const churchName = url.searchParams.get("churchName") || "";
  const CPF_CNPJ = url.searchParams.get("churchCNPJ") || "";
  const plan = url.searchParams.get("plan") || "";
  const status = url.searchParams.get("status") || "";

  // const date = new Date().toISOString().replace("T", " ").replace("Z", "");

  // console.log("DATEEEEEEEEEEEEEEEEEEEEEEEEEEE", date.replace(/T.*/, " "));
  let statusQuery = "";

  if (status == "2") {
    statusQuery = `AND isActiveted = 0`;
  } else if (status == "3") {
    statusQuery = `AND isActiveted = 1 AND datePlan  <= DATE_SUB(CURDATE(), INTERVAL 1 DAY)`;
  }

  const results = await sequelize.query(
    `SELECT 
    id,
    name,
    REPLACE(REPLACE(REPLACE(CPF_CNPJ, '.', ''), '-', ''), '/', '') AS CPF_CNPJ,
    isActiveted,
    dateplan,
    creationDate,
    TypePlan 
  FROM 
    Church 
  WHERE 
    idChurch IS NULL 
    AND name LIKE '%${churchName}%'
    AND REPLACE(REPLACE(REPLACE(CPF_CNPJ, '.', ''), '-', ''), '/', '') LIKE '%${CPF_CNPJ.replace(/\//g, "")}%' 
    AND TypePlan LIKE '%${plan}%' ${statusQuery}
  `,
  );
  // setData(data);
  const data = results[0];
  // console.log(data)

  return NextResponse.json({
    data,
  });
}
