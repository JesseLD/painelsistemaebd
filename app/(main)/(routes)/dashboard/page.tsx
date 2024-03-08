"use client";

import React, { useState, useEffect } from "react";
import { sequelize } from "@/app/utils/sequelize";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Select,
  Dropdown,
  Button,
  Checkbox,
  Label,
  Modal,
  TextInput,
  Datepicker,
} from "flowbite-react";

import { Status } from "@/components/ui/status";
import { addPlanDays } from "@/app/utils/plans";
import { LuChevronLast } from "react-icons/lu";
import { LuChevronFirst } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import { config } from "@/app/utils/config";
import { stat } from "fs";

type Plan = {
  id: number;
  name: string;
  duration: number;
  price: number;
  description: string;
};

const planList: Plan[] = [];

type Church = {
  id: number;
  name: string;
  CPF_CNPJ: string;
  isActiveted: number;
  dateplan: string;
  creationDate: string;
  TypePlan: string;
};
const Churches: Church[] = [];

function formatDateY(dateString: string) {
  const date = new Date(dateString);
  // Ajustar o fuso horário para o fuso horário local
  const adjustedDate = new Date(
    date.getTime() + date.getTimezoneOffset() * 60 * 1000,
  );
  const year = adjustedDate.getFullYear();
  const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
  const day = String(adjustedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(date: Date) {
  // Obtém o dia, mês e ano da data
  const day = String(date.getDate() + 1).padStart(2, "0"); // Garante que tenha dois dígitos, adicionando um zero à esquerda, se necessário
  const month = String(date.getMonth() + 1).padStart(2, "0"); // O mês é baseado em zero, então é necessário adicionar 1
  const year = date.getFullYear();

  // Retorna a data formatada no formato DD/MM/YYYY
  return `${day}/${month}/${year}`;
}

let actualPageNumber = 1;
let incrementPage = 0;

let updaterId = 0;
let updaterPlan = "";
let updaterSelectID = "";
let updaterSelectValue = "";

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

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [plans, setPlans] = useState([]);
  const [select, setSelect] = useState("Trial");
  const [showAlert, setShowAlert] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [results, showResults] = useState(false);
  const pageSize = 25;

  const fetchData = async () => {
    const response = await fetch(
      `/api/app/church/list?offset=${incrementPage}`,
      {
        headers: {
          authorization: config.api_key as string,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => data);

    // console.log(response.data);
    response.data.map((church: Church) => Churches.push(church));
    setData(response.data);
  };
  const fetchPlans = async () => {
    const response = await fetch(`/api/app/plans/list`, {
      headers: {
        authorization: config.api_key as string,
      },
    })
      .then((res) => res.json())
      .then((data) => data);

    response.data.map((plan: Plan) => planList.push(plan));
    setPlans(response.data);
  };

  const handleSelect = async (e: any) => {
    const id = e.target.id;
    const plan = e.target.value;
    // console.log("ID", id);
    // console.log("PLAN", plan);
  };

  const handleUpdate = async (id: string, plan: string) => {
    const response = await fetch(
      `/api/app/church/update?id=${id}&plan=${plan}`,
      {
        headers: {
          authorization: config.api_key as string,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => data);

    await fetchData();
    await fetchPlans();
  };

  const handleActivate = async (id: string, activate: number) => {
    const response = await fetch(
      `/api/app/church/activate?id=${id}&activate=${activate}`,
      {
        headers: {
          authorization: config.api_key as string,
        },
      },
    );

    await fetchData();
    await fetchPlans();

    if (response.status == 200) {
      activate == 1
        ? toast.success("Igreja ativada com sucesso")
        : toast.success("Igreja desativada com sucesso");
    } else {
      activate == 1
        ? toast.error("Erro ao ativar Igreja")
        : toast.error("Erro ao desativar Igreja");
    }
  };

  const fetchFilters = async () => {
    let statusQuery = "";

    const churchName = (
      document.getElementById("churchName") as HTMLInputElement
    ).value;
    const churchCNPJ = (
      document.getElementById("churchCNPJ") as HTMLInputElement
    ).value;
    const planSelect = (
      document.getElementById("planSelect") as HTMLSelectElement
    ).value;
    const status = (
      document.getElementById("statusSelect") as HTMLSelectElement
    ).value;

    // console.log(status);

    let url = `/api/app/church/filter?churchName=${churchName}&churchCNPJ=${churchCNPJ}&plan=${planSelect}`;

    if (status == "Ativo") {
      url += `&status=1`;
    } else if (status == "Inativo") {
      url += `&status=2`;
    } else if (status == "Bloqueado") {
      url += `&status=3`;
    }

    // url+=statusQuery;
    // alert(url);
    setTimeout(async () => {
      await fetch(url, {
        headers: {
          authorization: config.api_key as string,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setData(data.data);
        });
    }, 500);
    toast.info("Filtrado com sucesso");
    showResults(true);
    // se
  };

  useEffect(() => {
    // console.log("O componente foi montado");
    // alert(config.api_key);
    fetchData();
    fetchPlans();

    // Retorne uma função de limpeza se for necessário
    return () => {};
  }, []); // Atualize quando o número da página mudar

  const editItem = (id: number) => {
    router.push(`/dashboard/edit/${id}`);
  };

  const renewPlan = async (id: number, time: string) => {
    // alert("Atualizado com sucesso")
    const response = await fetch(
      `/api/app/church/updatePlan?id=${id}&time=${time}`,
      {
        headers: {
          authorization: config.api_key as string,
        },
      },
    );

    if (response.status == 200) {
      await fetchData();
      await fetchPlans();
      toast.success("Plano renovado com sucesso");
    } else {
      toast.error("Erro ao renovar plano");
    }
  };

  const blockPlan = async (id: number) => {
    // alert("Atualizado com sucesso")
    const response = await fetch(
      `/api/app/church/updatePlan?id=${id}&time=${addPlanDays(new Date().toISOString(), -1)}`,
      {
        headers: {
          authorization: config.api_key as string,
        },
      },
    );

    if (response.status == 200) {
      await fetchData();
      await fetchPlans();
      toast.success("Plano bloqueado com sucesso");
    } else {
      toast.error("Erro ao bloquear plano");
    }
  };

  return (
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
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Tem certeza que deseja alterar o plano desse cliente ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  handleUpdate(updaterId.toString(), updaterPlan);

                  setOpenModal(false);
                  toast.success("Plano alterado com sucesso");
                }}
              >
                {"Sim, alterar"}
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  const select = document.getElementById(
                    updaterSelectID,
                  ) as HTMLSelectElement;
                  select.value = Churches.find((item) => item.id == updaterId)
                    ?.TypePlan as string;

                  setOpenModal(false);
                }}
              >
                Não, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="overflow-x-auto">
        <div className="mb-6 flex w-full flex-col gap-2 rounded-lg bg-white p-6">
          <h1 className="text-xl font-bold">Filtros</h1>
          <div className="mt-4 flex gap-4">
            <TextInput
              placeholder="Nome da Igreja"
              id="churchName"
              type="text"
            />
            <TextInput placeholder="CPF/CNPJ" id="churchCNPJ" type="text" />
            <Select id="planSelect">
              <option value="">Plano</option>
              {plans.map((plan: any, index) => {
                return (
                  <option
                    value={plan.name}
                    key={index}
                    id={index.toString() + "p"}
                  >
                    {plan.name}
                  </option>
                );
              })}
            </Select>

            <Select id="statusSelect">
              <option value="">Status</option>

              {churchStatus.map((status: any, index) => {
                return (
                  <option
                    value={status.name}
                    key={index}
                    id={index.toString() + "s"}
                  >
                    {status.name}
                  </option>
                );
              })}
            </Select>
          </div>
          {results == true ? (
            <div className="w-full py-4">
              <h1 className="text-neutral-500">
                ({data.length}) Resultados Encontrados
              </h1>
            </div>
          ) : null}
          <div>
            <Button
              onClick={() => {
                fetchFilters();
              }}
            >
              Filtrar
            </Button>
          </div>
        </div>

        <Table>
          <TableHead>
            <TableHeadCell>Nome da Igreja</TableHeadCell>
            <TableHeadCell>CPF/CNPJ</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell className="hidden md:table-cell">
              Data Início
            </TableHeadCell>
            <TableHeadCell className="hidden md:table-cell">
              Data Vencimento
            </TableHeadCell>
            <TableHeadCell className="hidden md:table-cell">
              Plano
            </TableHeadCell>
            <TableHeadCell className="hidden md:table-cell">
              <span className="sr-only">Actions</span>
            </TableHeadCell>
          </TableHead>

          <TableBody className="divide-y">
            {data.length == 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
              data.map((item: Church, index) => {
                let status = "inactive";

                if (
                  new Date(item.dateplan) <= new Date() &&
                  item.isActiveted == 1
                ) {
                  status = "blocked";
                } else if (item.isActiveted == 0) {
                  status = "inactive";
                } else {
                  status = "active";
                }

                const link = `/dashboard/edit/${item.id}`;
                // const datePlan = new Date(item.dateplan);

                return (
                  <TableRow
                    key={index}
                    className="bg-white hover:cursor-pointer hover:bg-slate-100 hover:opacity-90"
                  >
                    <TableCell
                      className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                      onClick={() => {
                        router.push("/dashboard/church/" + item.id.toString());
                      }}
                    >
                      <span className="hidden">
                        {item.name.length > 30
                          ? `${item.name.slice(0, 30)}... `
                          : item.name}
                      </span>
                      <span className="md:inline">
                        {item.name.length > 15
                          ? `${item.name.slice(0, 15)}... `
                          : item.name}
                      </span>
                    </TableCell>
                    <TableCell>{item.CPF_CNPJ.replace(/[./-]/g, "")}</TableCell>
                    <TableCell>{<Status status={status} />}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(new Date(item.creationDate))}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <input
                        type="date"
                        name=""
                        id={(item.id + 2).toString()}
                        value={formatDateY(item.dateplan)}
                        className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 hover:cursor-pointer focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Select date"
                        onChange={() => {
                          const selected = document.getElementById(
                            (item.id + 2).toString(),
                          ) as HTMLInputElement;
                          renewPlan(item.id, selected.value);
                        }}
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Select
                        id={(item.id + 10).toString()}
                        onChange={() => {
                          const selected = document.getElementById(
                            (item.id + 10).toString(),
                          ) as HTMLSelectElement;

                          updaterId = item.id;
                          updaterPlan = selected.value;
                          updaterSelectID = (item.id + 10).toString();

                          setOpenModal(true);
                        }}
                      >
                        {plans.map((plan: any, index) => {
                          if (plan.name == item.TypePlan) {
                            return (
                              <option selected value={plan.name} key={index}>
                                {plan.name}
                              </option>
                            );
                          } else {
                            return (
                              <option value={plan.name} key={index}>
                                {plan.name}
                              </option>
                            );
                          }
                        })}
                      </Select>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Dropdown
                        label=""
                        dismissOnClick={false}
                        renderTrigger={() => (
                          <span className="flex items-center gap-1 font-medium text-cyan-600 hover:underline">
                            Ações
                          </span>
                        )}
                      >
                        <Dropdown.Item
                          onClick={() => {
                            // handleUpdatePlan();
                            // alert(select)
                            let duration = 0;
                            const selected = document.getElementById(
                              (item.id + 10).toString(),
                            ) as HTMLSelectElement;

                            planList.forEach((plan: Plan) => {
                              if (plan.name == selected.value) {
                                duration = Number(plan.duration);
                                // alert(`ID ${item.id} Duracao ${plan.duration} Dias - Nome: ${plan.name}`)
                              }
                            });

                            renewPlan(
                              item.id,
                              addPlanDays(new Date().toISOString(), duration),
                            );

                            // toast.success("Plano renovado com sucesso")
                          }}
                        >
                          Renovar Plano
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() => {
                            // handleUpdatePlan();
                            // alert(select)
                            blockPlan(item.id);

                            // toast.success("Plano renovado com sucesso")
                          }}
                        >
                          Bloquear Plano
                        </Dropdown.Item>
                        {item.isActiveted == 1 ? (
                          <Dropdown.Item
                            onClick={() => {
                              handleActivate(item.id.toString(), 0);
                            }}
                          >
                            Desativar
                          </Dropdown.Item>
                        ) : (
                          <Dropdown.Item
                            onClick={() => {
                              handleActivate(item.id.toString(), 1);
                            }}
                          >
                            Ativar
                          </Dropdown.Item>
                        )}
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <div className="m-2 flex items-center justify-center gap-2 rounded-xl bg-white p-2">
          <button
            onClick={() => {
              if (actualPageNumber <= 1) {
                return;
              }

              actualPageNumber--;
              // print("cLick")
              incrementPage -= pageSize;
              // console.log("click");
              fetchData();
              fetchPlans();
            }}
            className="rounded  px-4 py-2 font-bold text-slate-900 hover:cursor-pointer"
          >
            <LuChevronFirst />
          </button>
          <h1>{actualPageNumber}</h1>
          <button
            onClick={() => {
              actualPageNumber++;
              incrementPage += pageSize;
              fetchData();
              fetchPlans();
            }}
            className="rounded  px-4 py-2 font-bold text-slate-900 hover:cursor-pointer"
          >
            <LuChevronLast />
          </button>
        </div>

        <ToastContainer />
      </div>
    </>
  );
}
