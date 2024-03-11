import prisma from "./prisma";  
import { config } from "./config";
export const addLog = async (log: string) => {

  await fetch("/api/app/logs/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: config.api_key,
    },
    body: JSON.stringify({
      log,
      
    }),
  })

}