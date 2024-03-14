import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
import { sequelize } from "@/app/utils/sequelize";
import { Sequelize, QueryTypes } from 'sequelize';

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
  }else{
    
  }
  
  const deleteAllBranches = async () =>{
    const branches = await sequelize.query(`SELECT * FROM Church WHERE idChurch = ${id}`, { type: QueryTypes.SELECT });
    branches.map(async (branch:any) => {
      Promise.all([
        deleteUserData(),
        deleteTeams(),
        deleteClassroom(),
        deleteCodePromocion(),
        deleteDepartment(),
        deleteSector(),
        deleteBranch(),
        deleteSingleChurch()
      ])
    });
  }

  const deleteUserData = async () =>{
    const users = await sequelize.query(`SELECT * FROM User WHERE idChurch = ${id}`, { type: QueryTypes.SELECT });
    users.map(async (user:any) => {
      await sequelize.query(`DELETE FROM User_PermissionLevel WHERE idUser = ${user.id}`, { type: QueryTypes.DELETE });
    });
    users.map(async (user:any) => {
      await sequelize.query(`DELETE FROM Teams_User WHERE idUser = ${user.id}`, { type: QueryTypes.DELETE });
    });
    users.map(async (user:any) => {
      await sequelize.query(`DELETE FROM PresenceTeacher WHERE idTeacher = ${user.id}`, { type: QueryTypes.DELETE });
    });
    users.map(async (user:any) => {
      await sequelize.query(`DELETE FROM PresenceStudent WHERE idStudent = ${user.id}`, { type: QueryTypes.DELETE });
    });
    users.map(async (user:any) => {
      await sequelize.query(`DELETE FROM User WHERE idChurch = ${user.id}`, { type: QueryTypes.DELETE });
    });
  }


  

  const deleteTeams = async () =>{
    const teams = await sequelize.query(`SELECT * FROM Team WHERE idChurch = ${id}`, { type: QueryTypes.SELECT });
    teams.map(async (team:any) => {
      await sequelize.query(`DELETE FROM TeamsClassroom WHERE idTeams = ${team.id}`, { type: QueryTypes.DELETE });
    });

    await sequelize.query(`DELETE FROM Team WHERE idChurch = ${id}`, { type: QueryTypes.DELETE });
  }


  const deleteClassroom = async ()=>{
    await sequelize.query(`DELETE FROM Classroom WHERE idChurch = ${id}`, { type: QueryTypes.DELETE });
  }

  const deleteCodePromocion = async ()=>{
    await sequelize.query(`DELETE FROM CodePromocion_Church WHERE idChurch = ${id}`, { type: QueryTypes.DELETE });

  }


  const deleteDepartment = async ()=>{
    await sequelize.query(`DELETE FROM Department WHERE idChurch = ${id}`, { type: QueryTypes.DELETE });
  }


  const deleteSector = async ()=>{
    await sequelize.query(`DELETE FROM Sector WHERE idChurchMatrix = ${id}`, { type: QueryTypes.DELETE });
  }

  const deleteBranch = async()=>{
    await sequelize.query(`DELETE FROM Church WHERE idChurch = ${id}`, { type: QueryTypes.DELETE });
  }

  const deleteSingleChurch = async () => {
    await sequelize.query(`DELETE FROM Church WHERE id = ${id}`, { type: QueryTypes.DELETE });
  }


  async function deleteChurch() {
    try {
      await Promise.all([
        deleteAllBranches(),
        deleteTeams(),
        deleteClassroom(),
        deleteCodePromocion(),
        deleteDepartment(),
        deleteSector(),
        deleteBranch(),
        deleteSingleChurch()
      ])
  
      console.log("Igreja deletada com sucesso.");
    } catch (error) {
      console.error("Erro ao deletar igreja", error);
    } 
  }
  deleteChurch()


  return NextResponse.json({
    message: "Deleted"
  });
  
}
