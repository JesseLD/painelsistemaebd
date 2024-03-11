"use client";
import { config } from "@/app/utils/config";
import { Status } from "@/components/ui/status";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { formatDate } from "../../page";

type ChurchStatus = {
  id: number;
  name: string;
};

const churchStatus: ChurchStatus[] = [
  {
    id: 1,
    name: "Ativo",
  },
  {
    id: 2,
    name: "Inativo",
  },
  {
    id: 3,
    name: "Bloqueado",
  },
];

type ChurchData = {
  name: string;
  emailAdmin: string;
  CPF_CNPJ: string;
  city: string;
  state: string;
  contact: string;
  creationDate: string;
  isActiveted: number;
};

type ChurchStatistics = {
  total: number;
};

type ChurchJSON = {
  churchData: ChurchData[];
  branchesTotal: ChurchStatistics[];
  totalStudents: ChurchStatistics[];
  totalTeachers: ChurchStatistics[];
  matrixTeams: ChurchStatistics[];
  matrizClasses: ChurchStatistics[];
  studentsMatrixAndBranch: ChurchStatistics[];
  teachersMatrixAndBranch: ChurchStatistics[];
  totalUsersExceptStudents: ChurchStatistics[];
  totalUsers: ChurchStatistics[];
  totalTeamsMatrixAndBranches: ChurchStatistics[];
  lastLesson: { ultimaAula: string }[];
  totalMatrixUsersExceptStudents: ChurchStatistics[];
  totalMatrizUsers: ChurchStatistics[];
  datePlan: { datePlan: string }[];
};

let status = "inactive";

export default function Page({ params }: any) {
  const [data, setData] = useState<ChurchJSON>();

  const fetchChurch = async () => {
    toast.info("Carregando dados, Aguarde..");

    const response = await fetch(`/api/app/church/church?id=${params.id}`, {
      headers: {
        authorization: config.api_key as string,
      },
    })
      .then((res) => res.json())
      .then((data) => data);

    setData(response);
    // console.log(response.dateplan[0].datePlan);

    if (
      new Date(response.dateplan[0].datePlan) <= new Date() &&
      response.churchData[0].isActiveted == 1
    ) {
      status = "blocked";
    } else if (response.churchData[0].isActiveted == 0) {
      status = "inactive";
    } else {
      status = "active";
    }
  };

  useEffect(() => {
    // alert(params.id);
    fetchChurch();
    return () => {};
  });

  return (
    <>
      <div className="container mx-auto py-8">
        <h1 className="mb-4 rounded-lg bg-white px-6 py-12 text-3xl font-bold">
          Igreja: {data?.churchData[0].name}
        </h1>

        <div className="mb-6 rounded-lg bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Informações da Matriz</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
            <div>
              <p>
                <span className="font-semibold">CNPJ: </span>{" "}
                {data?.churchData[0].CPF_CNPJ}
              </p>
              <p>
                <span className="font-semibold">E-mail do Administrador: </span>{" "}
                {data?.churchData[0].emailAdmin}
              </p>
              <p>
                <span className="font-semibold">Contato: </span>
                {data?.churchData[0].contact}
              </p>
              <p>
                <span className="font-semibold">Cidade: </span>
                {data?.churchData[0].city}
              </p>
              <p>
                <span className="font-semibold">Estado: </span>{" "}
                {data?.churchData[0].state}
              </p>
              <p>
                <span className="font-semibold">Data de Criação:</span>{" "}
                {data?.churchData[0].creationDate}
              </p>
              <p>
                <span className="font-semibold">Data de Vencimento:</span>{" "}
                {formatDate(new Date(data?.datePlan[0].datePlan as string))}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {<Status status={status} />}
                {/* {data?.churchData[0].isActiveted == 1 ? "Ativa" : "Inativa"} */}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Total de Alunos:</span>{" "}
                {data?.totalStudents[0].total}
              </p>
              <p>
                <span className="font-semibold">Total de Professores:</span>{" "}
                {data?.totalTeachers[0].total}
              </p>
              <p>
                <span className="font-semibold">
                  Total de Usuários (exceto alunos):
                </span>{" "}
                {data?.totalMatrixUsersExceptStudents[0].total}
              </p>
              <p>
                <span className="font-semibold">Total de Usuários:</span>{" "}
                {data?.totalMatrizUsers[0].total}
              </p>
              <p>
                <span className="font-semibold">Total de Turmas: </span>
                {data?.matrixTeams[0].total}
              </p>
              <p>
                <span className="font-semibold">Total de Aulas:</span>{" "}
                {data?.matrizClasses[0].total}
              </p>
              <p>
                <span className="font-semibold">Data da Última Aula:</span>{" "}
                {data?.lastLesson[0].ultimaAula}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Informações da Matriz e Filiais
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p>
                <span className="font-semibold">Total de Filiais: </span>
                {data?.branchesTotal[0].total}
              </p>
              <p>
                <span className="font-semibold">
                  Total de Alunos (Matriz e Filiais):
                </span>{" "}
                {data?.studentsMatrixAndBranch[0].total}
              </p>
              <p>
                <span className="font-semibold">
                  Total de Professores (Matriz e Filiais):
                </span>{" "}
                {data?.teachersMatrixAndBranch[0].total}
              </p>
              <p>
                <span className="font-semibold">
                  Total de Usuários (exceto alunos):
                </span>{" "}
                {data?.totalUsersExceptStudents[0].total}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Total de Usuários:</span>{" "}
                {data?.totalUsers[0].total}
              </p>
              <p>
                <span className="font-semibold">
                  Total de Turmas (Matriz e Filiais):
                </span>{" "}
                {data?.totalTeamsMatrixAndBranches[0].total}
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
