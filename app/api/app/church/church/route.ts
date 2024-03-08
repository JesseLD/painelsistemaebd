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

  // const plan = url.searchParams.get("plan") || 0;
  const id = url.searchParams.get("id") || 0;
  
  // const OFFSET = skip;
  if(id == 0){
    return NextResponse.json(
      {
        name: "Bad Request",
      },
      {
        status: 400,
      },
    );
  }

  const churchData = await sequelize.query(
    `SELECT name, emailAdmin, CPF_CNPJ, city, state, contact, creationDate, isActiveted FROM Church WHERE id = ${id};`,
  );
  const branchesTotal = await sequelize.query(`SELECT COUNT(*) AS total FROM Church WHERE idChurch = ${id};`);
  const totalStudents = await sequelize.query(`SELECT COUNT(DISTINCT User.id) AS total FROM User INNER JOIN User_PermissionLevel ON User.id = User_PermissionLevel.idUser WHERE User_PermissionLevel.idPermissionLevel = 7 AND User.idChurch = ${id};`);

  const totalTeachers = await sequelize.query(`SELECT COUNT(DISTINCT User.id) AS total FROM User INNER JOIN User_PermissionLevel ON User.id = User_PermissionLevel.idUser WHERE (User_PermissionLevel.idPermissionLevel = 4 OR User_PermissionLevel.idPermissionLevel = 5) AND User.idChurch = ${id};`);
  const matrixTeams = await sequelize.query(`SELECT COUNT(*) AS total FROM Team WHERE idChurch = ${id};`);

  const matrizClasses = await sequelize.query(`SELECT COUNT(*) AS total FROM Classroom WHERE idChurch = ${id};`);
  const studentsMatrixAndBranch = await sequelize.query(`SELECT COUNT(DISTINCT User.id) AS total FROM User INNER JOIN User_PermissionLevel ON User.id = User_PermissionLevel.idUser WHERE User_PermissionLevel.idPermissionLevel = 7 AND User.idChurch IN (SELECT id FROM Church WHERE id = ${id} OR idChurch = ${id});`);

  const teachersMatrixAndBranch = await sequelize.query(`SELECT COUNT(DISTINCT User.id) AS total FROM User INNER JOIN User_PermissionLevel ON User.id = User_PermissionLevel.idUser WHERE (User_PermissionLevel.idPermissionLevel = 4 OR User_PermissionLevel.idPermissionLevel = 5) AND User.idChurch IN (SELECT id FROM Church WHERE id =${id} OR idChurch = ${id});`);

  const totalUsersExceptStudents = await sequelize.query(`SELECT COUNT(DISTINCT User.id) AS total FROM User LEFT JOIN User_PermissionLevel ON User.id = User_PermissionLevel.idUser WHERE (User_PermissionLevel.idPermissionLevel != 7 OR User_PermissionLevel.idPermissionLevel IS NULL) AND User.idChurch IN (SELECT id FROM Church WHERE id = ${id} OR idChurch = ${id})`);
  const totalUsers = await sequelize.query(`SELECT COUNT(DISTINCT User.id) AS total FROM User WHERE User.idChurch IN (SELECT id FROM Church WHERE id =  ${id} OR idChurch =  ${id});`);

  const totalTeamsMatrixAndBranches = await sequelize.query(`SELECT COUNT(*) AS total FROM Team WHERE idChurch IN (SELECT id FROM Church WHERE id = ${id} OR idChurch = ${id});`);
  const lastLesson = await sequelize.query(`SELECT MAX(dateClass) AS ultimaAula FROM Classroom WHERE idChurch = ${id};`);
  const totalMatrixUsersExceptStudents = await sequelize.query(`SELECT COUNT(DISTINCT User.id) AS total FROM User LEFT JOIN User_PermissionLevel ON User.id = User_PermissionLevel.idUser WHERE (User_PermissionLevel.idPermissionLevel != 7 OR User_PermissionLevel.idPermissionLevel IS NULL) AND User.idChurch = ${id};`);
  const totalMatrizUsers = await sequelize.query(`SELECT COUNT(*) AS total FROM User WHERE idChurch = ${id};`);



  return NextResponse.json({
    churchData: churchData[0],
    branchesTotal: branchesTotal[0],
    totalStudents: totalStudents[0],
    totalTeachers: totalTeachers[0],
    matrixTeams: matrixTeams[0],
    matrizClasses: matrizClasses[0],
    studentsMatrixAndBranch: studentsMatrixAndBranch[0],
    teachersMatrixAndBranch: teachersMatrixAndBranch[0],
    totalUsersExceptStudents: totalUsersExceptStudents[0],
    totalUsers: totalUsers[0],
    totalTeamsMatrixAndBranches: totalTeamsMatrixAndBranches[0],
    lastLesson: lastLesson[0],
    totalMatrixUsersExceptStudents: totalMatrixUsersExceptStudents[0],
    totalMatrizUsers: totalMatrizUsers[0],
  });
}
