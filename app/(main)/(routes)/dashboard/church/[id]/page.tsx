"use client";
import { config } from "@/app/utils/config";
import { Status } from "@/components/ui/status";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { formatDate } from "../../page";
import { Button, Modal, Spinner, TextInput } from "flowbite-react";
import { resolve } from "path";
import { FaWhatsapp } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useRouter } from "next/navigation";
// import { config } from "../../../../../utils/config"

import Link from "next/link";
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
  totalStudents: {
    total_students: number;
  };
  totalTeachers: {
    total_teachers: number;
  };
  matrixTeams: ChurchStatistics;
  matrizClasses: ChurchStatistics;
  studentsMatrixAndBranch: {
    total_students: number;
  };
  teachersMatrixAndBranch: {
    total_teachers: number;
  };
  totalUsersExceptStudents: {
    total_users_except_students: number;
  };
  totalUsers: {
    total_users: number;
  };
  totalTeamsMatrixAndBranches: ChurchStatistics;
  lastLesson: { last_lesson: string };
  totalMatrixUsersExceptStudents: {
    total_users_except_students: number;
  };
  totalMatrizUsers: ChurchStatistics;
  dateplan: { datePlan: string };
};

let status = "inactive";

export default function Page({ params }: any) {
  const [data, setData] = useState<ChurchJSON>();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
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

  const deleteChurch = async () => {
    const pass = document.querySelector(
      "#deleteModalInput",
    ) as HTMLInputElement;

    if (pass.value == config.delete_password) {
      toast.info("Aguarde, Essa operação pode demorar um pouco...");
      try {
        const response = await fetch(`/api/app/church/delete?id=${params.id}`, {
          headers: {
            authorization: config.api_key as string,
          },
        });
        toast.success("Igreja deletada com sucesso");
        router.push("/dashboard");
      } catch (error) {
        console.error("Erro ao buscar dados da igreja:", error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Senha inválida, Log salvo!");
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
          <Modal
            show={openModal}
            size="md"
            onClose={() => setOpenModal(false)}
            popup
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h3 className="text-md mb-5 font-normal text-gray-500 dark:text-gray-400 ">
                  Tem certeza de que deseja deletar esta igreja? Essa ação será
                  irreversível e resultará na remoção permanente de todos os
                  dados relacionados. Por favor, confirme sua decisão 
                </h3>
                <h3 className="text-md mb-5 font-normal text-gray-500 dark:text-gray-400 ">
                  Digite 'Excluir' para confirmar
                </h3>
                <div className="py-2">
                  <TextInput
                    name="pass"
                    placeholder="Digite 'Excluir'"
                    id="deleteModalInput"
                    className="p-2"
                    required
                  />
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    color="failure"
                    onClick={() => {
                      deleteChurch();
                      setOpenModal(false);
                    }}
                  >
                    {"Sim, Excluir"}
                  </Button>
                  <Button
                    color="gray"
                    onClick={() => {
                      setOpenModal(false);
                    }}
                  >
                    Não, cancelar
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          <div className="container mx-auto py-8">
            <h1 className="mb-4 flex justify-between rounded-lg bg-white px-6 py-12 text-3xl font-bold">
              Igreja: {data?.churchData.name}
              <a
                href={`https://api.whatsapp.com/send?phone=${data?.churchData.contact.replace(/[()-]/g, "").replace(" ", "")}`}
                target="_blank"
              >
                <FaWhatsapp
                  color="green"
                  className="hover:cursor-pointer"
                  size={36}
                />
              </a>
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
                    {data?.totalStudents.total_students}
                  </p>
                  <p>
                    <span className="font-semibold">Total de Professores:</span>{" "}
                    {data?.totalTeachers.total_teachers}
                  </p>
                  <p>
                    <span className="font-semibold">
                      Total de Usuários (exceto alunos):
                    </span>{" "}
                    {
                      data?.totalMatrixUsersExceptStudents
                        .total_users_except_students
                    }
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
                    {data?.lastLesson.last_lesson}
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
                    {data?.studentsMatrixAndBranch.total_students}
                  </p>
                  <p>
                    <span className="font-semibold">
                      Total de Professores (Matriz e Filiais):
                    </span>{" "}
                    {data?.teachersMatrixAndBranch.total_teachers}
                  </p>
                  <p>
                    <span className="font-semibold">
                      Total de Usuários (exceto alunos):
                    </span>{" "}
                    {data?.totalUsersExceptStudents.total_users_except_students}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Total de Usuários:</span>{" "}
                    {data?.totalUsers.total_users}
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
            <div className="mt-6 rounded-lg border-2 border-red-500 bg-red-100 p-6">
              <h1 className="font-bold">Zona de perigo</h1>
              <span className="my-4 flex w-full rounded-md bg-red-400 p-2 text-sm text-black">
                Uma vez que você deleta uma igreja, não há volta. Tenha absoluta
                certeza dessa decisão. Todos os dados serão permanentemente
                perdidos. Confirme somente se estiver completamente certo.
              </span>
              <div className="rounded-lg py-4">
                <Button
                  color="failure"
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  Excluir Igreja
                </Button>
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
