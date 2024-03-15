"use client";
import { config } from "@/app/utils/config";
import { Status } from "@/components/ui/status";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
// import { formatDate } from "../../page";
import {
  Button,
  Dropdown,
  Modal,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
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
  branchesTotal: number;
  totalStudents: number;
  totalTeachers: number;
  matrixTeams: number;
  matrizClasses: number;
  studentsMatrixAndBranch: number;
  teachersMatrixAndBranch: number;
  totalUsersExceptStudents: number;
  totalUsers: number;
  totalTeamsMatrixAndBranches: number;
  lastLesson: string;
  totalMatrixUsersExceptStudents: number;
  totalMatrizUsers: number;
  dateplan: string;
  churchAdmins: any;
};

type Member = {
  id: number;
  name: string;
  email: string;
  contact: string;
  city: string;
  state: string;
  address: string;
  isActiveted: number;
};

let status = "inactive";

export default function Page({ params }: any) {
  const [data, setData] = useState<Member>();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const fetchMember = async () => {
    toast.info("Carregando dados, Aguarde..");
    console.log(config.api_url);
    try {
      const response = await fetch(
        config.api_url + `v0/Church/Member/${params.id}`,
        {
          headers: {
            authorization: config.api_key as string,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => data);

      setData(response.data[0]);
      console.log(response.data[0]);
      // console.log(response.dateplan.datePlan);
      //
      if (
        new Date(response.data.dateplan) <= new Date() &&
        response.data.isActiveted === 1
      ) {
        status = "blocked";
      } else if (response.data.isActiveted === 0) {
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
    fetchMember();

    return () => {};
  }, []);

  return (
    <>
      {loading == true ? (
        <Spinner />
      ) : data?.name ? (
        <>
          <div className="container mx-auto py-8">
            <h1 className="mb-4 flex justify-between rounded-lg bg-white px-6 py-12 text-3xl font-bold">
              Nome: {data?.name}
              <a
                href={'#'}
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
                Informações Pessoais
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
                <div>
                  <p>
                    <span className="font-semibold">E-mail: </span>{" "}
                    {data?.email}
                  </p>
                  <p>
                    <span className="font-semibold">Contato: </span>{" "}
                    {data?.contact}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {<Status status={status} />}
                    {/* {data?.churchData[0].isActiveted == 1 ? "Ativa" : "Inativa"} */}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Endereço:</span>{" "}
                    {data?.address}
                  </p>
                  <p>
                    <span className="font-semibold">Cidade:</span> {data?.city}
                  </p>
                  <p>
                    <span className="font-semibold">Estado:</span> {data?.state}
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
