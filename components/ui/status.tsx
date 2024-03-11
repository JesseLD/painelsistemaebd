type StatusProps = {

  status: string ;

}

export const Status = ({status}:StatusProps) =>{

  return(
    <span>
      {status === "active" && <span className="text-green-500 bg-green-100 p-1 px-4 rounded-full text-[12px]">Ativo</span>}
      {status === "inactive" && <span className="text-red-500 bg-red-100 p-1 px-2 rounded-full text-[12px]">Inativo</span>}
      {status === "blocked" && <span className="text-yellow-500 bg-yellow-100 p-1 px-2 rounded-full text-[12px]">Bloqueado</span>}
    </span>
  )
}