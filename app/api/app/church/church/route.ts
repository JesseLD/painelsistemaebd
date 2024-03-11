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

  const [
    churchData,
    branchesTotal,
    totalStudents,
    totalTeachers,
    matrixTeams,
    matrizClasses,
    studentsMatrixAndBranch,
    teachersMatrixAndBranch,
    totalUsersExceptStudents,
    totalUsers,
    totalTeamsMatrixAndBranches,
    lastLesson,
    totalMatrixUsersExceptStudents,
    totalMatrizUsers,
    dateplan
  ] = await Promise.all([
    sequelize.query(`
      SELECT 
        name, 
        emailAdmin, 
        CPF_CNPJ, 
        city, 
        state, 
        contact, 
        creationDate, 
        isActiveted 
      FROM Church 
      WHERE id = ${id};
    `),
    sequelize.query(`
      SELECT COUNT(*) AS total 
      FROM Church 
      WHERE idChurch = ${id};
    `),
    sequelize.query(`
      SELECT 
        COUNT(DISTINCT U.id) AS total_students
      FROM 
        User U
        INNER JOIN User_PermissionLevel UP ON U.id = UP.idUser
      WHERE 
        UP.idPermissionLevel = 7 
        AND U.idChurch = ${id};
    `),
    sequelize.query(`
      SELECT 
        COUNT(DISTINCT U.id) AS total_teachers
      FROM 
        User U
        INNER JOIN User_PermissionLevel UP ON U.id = UP.idUser
      WHERE 
        (UP.idPermissionLevel = 4 OR UP.idPermissionLevel = 5) 
        AND U.idChurch = ${id};
    `),
    sequelize.query(`
      SELECT COUNT(*) AS total 
      FROM Team 
      WHERE idChurch = ${id};
    `),
    sequelize.query(`
      SELECT COUNT(*) AS total 
      FROM Classroom 
      WHERE idChurch = ${id};
    `),
    sequelize.query(`
      SELECT 
        COUNT(DISTINCT U.id) AS total_students
      FROM 
        User U
        INNER JOIN User_PermissionLevel UP ON U.id = UP.idUser
      WHERE 
        UP.idPermissionLevel = 7 
        AND U.idChurch IN (SELECT id FROM Church WHERE id = ${id} OR idChurch = ${id});
    `),
    sequelize.query(`
      SELECT 
        COUNT(DISTINCT U.id) AS total_teachers
      FROM 
        User U
        INNER JOIN User_PermissionLevel UP ON U.id = UP.idUser
      WHERE 
        (UP.idPermissionLevel = 4 OR UP.idPermissionLevel = 5) 
        AND U.idChurch IN (SELECT id FROM Church WHERE id =${id} OR idChurch = ${id});
    `),
    sequelize.query(`
      SELECT 
        COUNT(DISTINCT U.id) AS total_users_except_students
      FROM 
        User U
        LEFT JOIN User_PermissionLevel UP ON U.id = UP.idUser
      WHERE 
        (UP.idPermissionLevel != 7 OR UP.idPermissionLevel IS NULL) 
        AND U.idChurch IN (SELECT id FROM Church WHERE id = ${id} OR idChurch = ${id})
    `),
    sequelize.query(`
      SELECT COUNT(DISTINCT U.id) AS total_users
      FROM User U
      WHERE U.idChurch IN (SELECT id FROM Church WHERE id =  ${id} OR idChurch =  ${id});
    `),
    sequelize.query(`
      SELECT COUNT(*) AS total 
      FROM Team 
      WHERE idChurch IN (SELECT id FROM Church WHERE id = ${id} OR idChurch = ${id});
    `),
    sequelize.query(`
      SELECT MAX(dateClass) AS last_lesson 
      FROM Classroom 
      WHERE idChurch = ${id};
    `),
    sequelize.query(`
      SELECT 
        COUNT(DISTINCT U.id) AS total_users_except_students
      FROM 
        User U
        LEFT JOIN User_PermissionLevel UP ON U.id = UP.idUser
      WHERE 
        (UP.idPermissionLevel != 7 OR UP.idPermissionLevel IS NULL) 
        AND U.idChurch = ${id};
    `),
    sequelize.query(`
      SELECT COUNT(*) AS total 
      FROM User 
      WHERE idChurch = ${id};
    `),
    sequelize.query(`
      SELECT datePlan 
      FROM Church 
      WHERE id = ${id} AND idChurch IS NULL
    `)
  ]);
  
  return NextResponse.json({
    churchData: churchData[0][0],
    branchesTotal: branchesTotal[0][0],
    totalStudents: totalStudents[0][0],
    totalTeachers: totalTeachers[0][0],
    matrixTeams: matrixTeams[0][0],
    matrizClasses: matrizClasses[0][0],
    studentsMatrixAndBranch: studentsMatrixAndBranch[0][0],
    teachersMatrixAndBranch: teachersMatrixAndBranch[0][0],
    totalUsersExceptStudents: totalUsersExceptStudents[0][0],
    totalUsers: totalUsers[0][0],
    totalTeamsMatrixAndBranches: totalTeamsMatrixAndBranches[0][0],
    lastLesson: lastLesson[0][0],
    totalMatrixUsersExceptStudents: totalMatrixUsersExceptStudents[0][0],
    totalMatrizUsers: totalMatrizUsers[0][0],
    dateplan: dateplan[0][0]
  });
  
}
