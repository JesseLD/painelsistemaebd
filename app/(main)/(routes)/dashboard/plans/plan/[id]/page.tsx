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

type Plan = {
  
    id: number;
    name: string;
    price: number;
    description: string;
    duration: number;
    createdAt: string;
    updatedAt: string;
    maxStudents: number;
    maxBranches: number;
  
}

let status = "inactive";

export default function Page({ params }: any) {
  const [data, setData] = useState<Plan>();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const fetchPlan = async () => {
    toast.info("Carregando dados, Aguarde..");
    console.log(config.api_url);
    try {
      const response = await fetch(
        `${config.api_url}v0/Plans/Plan/${params.id}`,
        {
          headers: {
            authorization: config.api_key as string,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => data);

      setData(response);
      console.log(response);
      // console.log(response.dateplan.datePlan);
      //
     
    } catch (error) {
      console.error("Erro ao buscar dados da igreja:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // alert(params.id);
    fetchPlan();

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
              Nome do plano: {data?.name}
            </h1>

            <div className="mb-6 rounded-lg bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold">
                Detalhes do plano
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
                <div>
                  <p>
                    <span className="font-semibold">Valor </span>{" "}
                    {data?.price}
                  </p>
                  <p>
                    <span className="font-semibold">Descrição </span>{" "}
                    {data?.description}
                  </p>
                  <p>
                    <span className="font-semibold">Duração</span>{" "}
                    {data?.duration} Dias
                    {/* {data?.churchData[0].isActiveted == 1 ? "Ativa" : "Inativa"} */}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Máximo de Alunos</span>{" "}
                    {data?.maxStudents}
                  </p>
                  <p>
                    <span className="font-semibold">Máximo de Filiais:</span> {data?.maxBranches}
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
