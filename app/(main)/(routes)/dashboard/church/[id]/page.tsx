"use client";
import { config } from "@/app/utils/config";
import { Status } from "@/components/ui/status";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { formatDate } from "../../page";
import { Spinner } from "flowbite-react";
import { resolve } from "path";
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
  churchData: ChurchData;
  branchesTotal: ChurchStatistics;
  totalStudents: ChurchStatistics;
  totalTeachers: ChurchStatistics;
  matrixTeams: ChurchStatistics;
  matrizClasses: ChurchStatistics;
  studentsMatrixAndBranch: ChurchStatistics;
  teachersMatrixAndBranch: ChurchStatistics;
  totalUsersExceptStudents: ChurchStatistics;
  totalUsers: ChurchStatistics;
  totalTeamsMatrixAndBranches: ChurchStatistics;
  lastLesson: { ultimaAula: string };
  totalMatrixUsersExceptStudents: ChurchStatistics;
  totalMatrizUsers: ChurchStatistics;
  dateplan: { datePlan: string };
};

let status = "inactive";

export default function Page({ params }: any) {
  const [data, setData] = useState<ChurchJSON>();
  const [loading, setLoading] = useState(true);
  const fetchChurch = async () => {
    toast.info("Carregando dados, Aguarde..");

    try {
      const response = await fetch(`/api/app/church/church?id=${params.id}`, {
        headers: {
          authorization: config.api_key as string,
        },
      })
        .then((response) => response.json())
        .then((data) => data);

      setData(response);
      // console.log(response);
      // console.log(response.dateplan.datePlan);
// 
      if (
        new Date(response.dateplan.datePlan) <= new Date() &&
        response.churchData.isActiveted === 1
      ) {
        status = "blocked";
      } else if (response.churchData.isActiveted === 0) {
        status = "inactive";
      } else {
        status = "active";
      }
    } catch (error) {
      console.error("Erro ao buscar dados da igreja:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // alert(params.id);
    fetchChurch();

    return () => {};
  }, []);

  return (
    <>
      {loading == true ? (
        <Spinner />
      ) : data?.churchData ? (
        <>
          <div className="container mx-auto py-8">
            <h1 className="mb-4 rounded-lg bg-white px-6 py-12 text-3xl font-bold">
              Igreja: {data?.churchData.name}
            </h1>

            <div className="mb-6 rounded-lg bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold">
                Informações da Matriz
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
                <div>
                  <p>
                    <span className="font-semibold">CNPJ: </span>{" "}
                    {data?.churchData.CPF_CNPJ}
                  </p>
                  <p>
                    <span className="font-semibold">
                      E-mail do Administrador:{" "}
                    </span>{" "}
                    {data?.churchData.emailAdmin}
                  </p>
                  <p>
                    <span className="font-semibold">Contato: </span>
                    {data?.churchData.contact}
                  </p>
                  <p>
                    <span className="font-semibold">Cidade: </span>
                    {data?.churchData.city}
                  </p>
                  <p>
                    <span className="font-semibold">Estado: </span>{" "}
                    {data?.churchData.state}
                  </p>
                  <p>
                    <span className="font-semibold">Data de Criação:</span>{" "}
                    {data?.churchData.creationDate}
                  </p>
                  <p>
                    <span className="font-semibold">Data de Vencimento:</span>{" "}
                    {formatDate(new Date(data?.dateplan.datePlan as string))}
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
                    {data?.totalStudents.total}
                  </p>
                  <p>
                    <span className="font-semibold">Total de Professores:</span>{" "}
                    {data?.totalTeachers.total}
                  </p>
                  <p>
                    <span className="font-semibold">
                      Total de Usuários (exceto alunos):
                    </span>{" "}
                    {data?.totalMatrixUsersExceptStudents.total}
                  </p>
                  <p>
                    <span className="font-semibold">Total de Usuários:</span>{" "}
                    {data?.totalMatrizUsers.total}
                  </p>
                  <p>
                    <span className="font-semibold">Total de Turmas: </span>
                    {data?.matrixTeams.total}
                  </p>
                  <p>
                    <span className="font-semibold">Total de Aulas:</span>{" "}
                    {data?.matrizClasses.total}
                  </p>
                  <p>
                    <span className="font-semibold">Data da Última Aula:</span>{" "}
                    {data?.lastLesson.ultimaAula}
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
                    {data?.branchesTotal.total}
                  </p>
                  <p>
                    <span className="font-semibold">
                      Total de Alunos (Matriz e Filiais):
                    </span>{" "}
                    {data?.studentsMatrixAndBranch.total}
                  </p>
                  <p>
                    <span className="font-semibold">
                      Total de Professores (Matriz e Filiais):
                    </span>{" "}
                    {data?.teachersMatrixAndBranch.total}
                  </p>
                  <p>
                    <span className="font-semibold">
                      Total de Usuários (exceto alunos):
                    </span>{" "}
                    {data?.totalUsersExceptStudents.total}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Total de Usuários:</span>{" "}
                    {data?.totalUsers.total}
                  </p>
                  <p>
                    <span className="font-semibold">
                      Total de Turmas (Matriz e Filiais):
                    </span>{" "}
                    {data?.totalTeamsMatrixAndBranches.total}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <h1>Nenhum dado encontrado</h1>
      )}
      <ToastContainer />
    </>
  );
}
