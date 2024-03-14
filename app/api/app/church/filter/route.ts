import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
import { sequelize } from "@/app/utils/sequelize";
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
  const url = new URL(req.url);

  const request = await req.json();

  const churchName = request.churchName || "";
  const CPF_CNPJ = request.churchCNPJ.replace(/[./-]/g,'') || "";
  const plans = request.plans || [""];
  const status = request.status || "";
  const email = request.email || "";
  const phone = request.phone || "";

  // const date = new Date().toISOString().replace("T", " ").replace("Z", "");

  // console.log("DATEEEEEEEEEEEEEEEEEEEEEEEEEEE", date.replace(/T.*/, " "));
  let statusQuery = "";

  if (status == "2") {
    statusQuery = `AND isActiveted = 0`;
  } else if (status == "3") {
    statusQuery = `AND isActiveted = 1 AND datePlan  <= DATE_SUB(CURDATE(), INTERVAL 1 DAY)`;
  }
  // console.log(plans)

  const values = plans.map((plan:string )=> plan);

  
  const placeholders = values.map(() => '?').join(','); // Criar os placeholders para a consulta SQL


  const results = await sequelize.query(
    `SELECT 
        id,
        name,
        REPLACE(REPLACE(REPLACE(CPF_CNPJ, '.', ''), '-', ''), '/', '') AS CPF_CNPJ,
        isActiveted,
        dateplan,
        creationDate,
        TypePlan,
        emailAdmin,
        contact 
      FROM 
        Church 
      WHERE 
        idChurch IS NULL 
        AND name LIKE ?
        AND REPLACE(REPLACE(REPLACE(CPF_CNPJ, '.', ''), '-', ''), '/', '') LIKE ?
        AND emailAdmin LIKE ?
        AND contact LIKE ?
        AND TypePlan IN (${placeholders}) ${statusQuery}
        `,
    { replacements: [`%${churchName}%`, `%${CPF_CNPJ}%`,`%${email}%`,`%${phone}%`, ...values] }
  );
  // setData(data);
  const data = results[0];
  // console.log(data)

  return NextResponse.json({
    data,
  });
}
