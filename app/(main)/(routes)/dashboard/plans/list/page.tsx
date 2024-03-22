"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  ButtonGroup,
  Checkbox,
  Label,
  Modal,
  TextInput,
  Dropdown,
} from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import MoneyInput from "@/components/ui/moneyInput";
import { config } from "@/app/utils/config";
import { addLog } from "@/app/utils/logs";
import CurrencyInput from "react-currency-input-field";
import Link from "next/link";

type Plan = {
  id: number;
  name: string;
  duration: number;
  price: number;
  description: string;
  maxStudents: number;
  maxBranches: number;
};

const planList: Plan[] = [];

let toDeleteId = 0;

// let editPlanName = "";
let editPlanValue = "";
let editPlanDescription = "";
let editPlanDuration = "";
let editPlanId = "";
const Page = () => {
  const loggedUser = document.querySelector("#loggedEmail") as HTMLInputElement;

  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [email, setEmail] = useState("");
  const [plans, setPlans] = useState([]);
  const [editPlanName, setEditPlanName] = useState("");
  const [editPlanDescription, setEditPlanDescription] = useState("");
  const [editPlanDuration, setEditPlanDuration] = useState("");
  const [editMaxStudents, setEditMaxStudents] = useState("");
  const [editMaxBranches, setEditMaxBranches] = useState("");
  const [editPlanValue, setEditPlanValue] = useState("");

  function onCloseModal() {
    setOpenModal(false);
    setEmail("");
  }
  const [amount, setAmount] = useState("");
  const [amountEdit, setAmountEdit] = useState("");

  const handleAmountChange = (value: any) => {
    setAmount(value);
  };
  const handleAmountChangeEdit = (value: any) => {
    setAmount(value);
    setAmountEdit(value);
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
  const createPlan = async () => {
    const planName = document.getElementById("planName") as HTMLInputElement;
    const planValue = document.getElementById("planValue") as HTMLInputElement;
    const planDescription = document.getElementById(
      "planDescription",
    ) as HTMLInputElement;
    const planDuration = document.getElementById(
      "planDuration",
    ) as HTMLInputElement;
    const maxStudents = document.getElementById(
      "maxStudents",
    ) as HTMLInputElement;
    const maxBranches = document.getElementById(
      "maxBranches",
    ) as HTMLInputElement;

    if (!planName.value || !planValue.value || !planDescription.value) {
      toast.error("Preencha todos os campos");
      return;
    }
    console.log("Value", planValue.value);
    const data = {
      name: planName.value,
      value: planValue.value.replace("R$", "").replace(",", "."),
      description: planDescription.value,
      duration: planDuration.value,
      maxStudents: maxStudents.value,
      maxBranches: maxBranches.value,
    };
    // console.log("DATA: ", data);
    const response = await fetch("/api/app/plans/new", {
      method: "POST",
      headers: {
        Authorization: config.api_key,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => data);

    if (response.status == 400) {
      toast.error("Erro ao cadastrar plano");
      toast.error(response.error);
      // console.log(response.error);
      fetchPlans();
      setOpenModal(false);

      return;
    } else if (response.status == 200) {
      addLog(
        "Usuario " + loggedUser + " cadastrou um novo plano: " + planName.value,
      );
      toast.success("Plano cadastrado com sucesso");
      fetchPlans();

      setOpenModal(false);
    } else {
      toast.error("Erro Interno");
      fetchPlans();

      setOpenModal(false);

      // console.log(response);
    }
    // alert("kkk");

    // toast.success("Plano cadastrado com sucesso");
  };
  const editPlan = async () => {
    const planId = editPlanId;
    const planName = document.getElementById(
      "planNameEdit",
    ) as HTMLInputElement;
    const planValue = document.getElementById(
      "planValueEdit",
    ) as HTMLInputElement;
    const planDescription = document.getElementById(
      "planDescriptionEdit",
    ) as HTMLInputElement;
    const planDuration = document.getElementById(
      "planDurationEdit",
    ) as HTMLInputElement;
    const maxStudents = document.getElementById(
      "maxStudentsEdit",
    ) as HTMLInputElement;
    const maxBranches = document.getElementById(
      "maxBranchesEdit",
    ) as HTMLInputElement;

    if (
      !planName.value ||
      !planValue.value ||
      !planDescription.value ||
      !maxStudents ||
      !maxStudents
    ) {
      toast.error("Preencha todos os campos");
      return;
    }
    const data = {
      id: planId,
      name: planName.value,
      value: planValue.value,
      description: planDescription.value,
      duration: planDuration.value,
      maxStudents: maxStudents.value,
      maxBranches: maxBranches.value,
    };
    // console.log("DATA: ", data);
    const response = await fetch("/api/app/plans/edit", {
      method: "POST",
      headers: {
        Authorization: config.api_key,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => data);

    if (response.status == 400) {
      addLog(
        "Usuario " + loggedUser + " Tentou editar o plano: " + planName.value,
      );

      toast.error("Erro ao cadastrar plano");
      fetchPlans();
      setOpenEditModal(false);
      // console.log(response.error);
      return;
    } else if (response.status == 200) {
      addLog("Usuario " + loggedUser + " editou o plano: " + planName.value);
      toast.success("Plano Atualizado com sucesso");
      fetchPlans();

      setOpenEditModal(false);
    } else {
      addLog(
        "Usuario " + loggedUser + " Tentou editar o plano: " + planName.value,
      );

      toast.error("Erro Interno");
      fetchPlans();

      // console.log(response);
      setOpenEditModal(false);
    }
    // alert("kkk");

    // toast.success("Plano cadastrado com sucesso");
  };

  const deletePlan = async (id: string) => {
    // const id = document.getElementById(id));

    const response = await fetch(`/api/app/plans/delete?id=${id}`, {
      headers: {
        Authorization: config.api_key,
      },
    });

    fetchPlans();

    if (response.status == 400) {
      toast.error("Erro ao deletar plano");
      addLog(
        "Usuario " +
          loggedUser +
          " Tentou deletar o plano: " +
          planList.find((plan) => plan.id === Number.parseInt(id)),
      );

      return;
    } else if (response.status == 200) {
      toast.success("Plano deletado com sucesso");
      addLog(
        "Usuario " +
          loggedUser +
          " Deletou o plano: " +
          planList.find((plan) => plan.id === Number.parseInt(id)),
      );
    } else {
      addLog(
        "Usuario " +
          loggedUser +
          " Tentou deletar o plano: " +
          planList.find((plan) => plan.id === Number.parseInt(id)),
      );

      toast.error("Erro Interno");
      // console.log(response);
    }
  };

  useEffect(() => {
    // console.log("O componente foi montado");
    // alert(config.api_key);
    fetchPlans();

    // Retorne uma função de limpeza se for necessário
    return () => {};
  }, []);
  return (
    <>
      <Modal
        show={openDeleteModal}
        size="md"
        onClose={() => setOpenDeleteModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Atenção, Tem certeza que deseja excluir esse plano ?
              <div className="m-2 rounded-xl bg-yellow-100 p-2 text-sm text-yellow-800">
                Esta alteração não pode ser desfeita
              </div>
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  // handleUpdate(updaterId.toString(), updaterPlan);
                  deletePlan(toDeleteId.toString());
                  setOpenDeleteModal(false);
                }}
              >
                {"Sim, Deletar"}
              </Button>
              <Button
                color="light"
                onClick={() => {
                  setOpenDeleteModal(false);
                }}
              >
                Não, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Criar Novo Plano
            </h3>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="planName" value="Nome do plano" />
              </div>
              <TextInput
                id="planName"
                placeholder="Nome do plano"
                required
                color={"default"}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="planValue" value="Valor do Plano" />
              </div>
              {/* <MoneyInput
                id="planValue"
                value={amount}
                onChange={handleAmountChange}
              /> */}
              <CurrencyInput
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 "
                id="planValue"
                // value={amount}
                decimalsLimit={2}
                prefix="R$"
                decimalSeparator=","
                groupSeparator="."
                onValueChange={(value, name, values) =>
                  console.log(value, name, values)
                }
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="planDescription" value="Descrição do plano" />
              </div>
              <TextInput
                id="planDescription"
                placeholder="Descrição do plano"
                color={"default"}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="planDuration" value="Duração do plano" />
              </div>
              <TextInput
                id="planDuration"
                placeholder="Duração em dias"
                type="number"
                required
                color={"default"}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="planDuration" value="Detalhes do plano" />
              </div>
              <div className="flex gap-2">
                <TextInput
                  id="maxStudents"
                  placeholder="Quantidade de alunos"
                  type="number"
                  required
                  color={"default"}
                />
                <TextInput
                  id="maxBranches"
                  placeholder="Quantidade de filiais"
                  type="number"
                  required
                  color={"default"}
                />
              </div>
            </div>
            {/* <div>
              <div className="mb-2 block">
                <Label htmlFor="planDuration" value="Duração plano (Dias)" />
              </div>
              
            </div> */}

            <div className="flex justify-between">
              <Button
                onClick={onCloseModal}
                className="bg-gray-200 text-gray-900"
                color="gray"
              >
                Cancelar
              </Button>
              <Button
                className="bg-cyan-600 text-white hover:bg-cyan-700 hover:text-white"
                onClick={createPlan}
              >
                Cadastrar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={openEditModal}
        size="md"
        onClose={() => {
          setOpenEditModal(false);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 ">Editar Plano</h3>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="planNameEdit" value="Nome do plano" />
              </div>
              <TextInput
                id="planNameEdit"
                placeholder="Nome do plano"
                value={editPlanName.toString()}
                onChange={(e) => {
                  setEditPlanName(e.target.value);
                  // alert("kk")
                }}
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="planValueEdit" value="Valor do Plano" />
              </div>
              <CurrencyInput
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 "
                id="planValueEdit"
                // value={amount}
                value={editPlanValue}
                decimalsLimit={2}
                prefix="R$"
                decimalSeparator=","
                groupSeparator="."
                onValueChange={(value, name, values) =>
                  console.log(value, name, values)
                }
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="planDescriptionEdit"
                  value="Descrição do plano"
                />
              </div>
              <TextInput
                id="planDescriptionEdit"
                placeholder="Descrição do plano"
                value={editPlanDescription}
                onChange={(e) => {
                  setEditPlanDescription(e.target.value);
                }}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="planDurationEdit"
                  value="Duração plano (Dias)"
                />
              </div>
              <TextInput
                id="planDurationEdit"
                placeholder="Duração em dias"
                type="number"
                value={editPlanDuration}
                onChange={(e) => {
                  setEditPlanDuration(e.target.value);
                }}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="maxStudentsEdit" value="Detalhes do plano" />
              </div>
              <div className="flex gap-2">
                <TextInput
                  id="maxStudentsEdit"
                  placeholder="Quantidade de alunos"
                  type="number"
                  value={editMaxStudents}
                  onChange={(e) => {
                    setEditMaxStudents(e.target.value);
                  }}
                  required
                />
                <TextInput
                  id="maxBranchesEdit"
                  placeholder="Quantidade de filiais"
                  type="number"
                  value={editMaxBranches}
                  onChange={(e) => {
                    setEditMaxBranches(e.target.value);
                  }}
                  required
                />
              </div>
            </div>
            {/* <div>
              <div className="mb-2 block">
                <Label htmlFor="maxBranchesEdit" value="Duração plano (Dias)" />
              </div>
              
            </div> */}

            <div className="flex justify-between">
              <Button
                onClick={() => {
                  setOpenEditModal(false);
                }}
                color="gray"
                className="bg-gray-200 text-gray-900 hover:bg-gray-300"
              >
                Cancelar
              </Button>
              <Button
                className="bg-cyan-600 text-white hover:bg-cyan-700"
                onClick={editPlan}
              >
                Salvar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <div>
        <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900 ">
            Lista de planos
          </h2>
          <Button
            onClick={() => setOpenModal(true)}
            className="bg-cyan-600 text-white hover:bg-cyan-700"
          >
            Novo plano
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableHeadCell>Nome do plano</TableHeadCell>
            <TableHeadCell className="hidden md:table-cell">
              Valor
            </TableHeadCell>
            <TableHeadCell className="hidden md:table-cell">
              Duração (Dias)
            </TableHeadCell>
            <TableHeadCell className="hidden md:table-cell">
              Descrição
            </TableHeadCell>
            <TableHeadCell className="hidden md:table-cell">
              <span className="sr-only">Actions</span>
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y" key={"main"}>
            {plans.length > 0 ? (
              plans.map((plan: Plan, index) => (
                <TableRow
                  className="bg-white "
                  id={plan.id.toString()}
                  key={index + plan.id.toString()}
                >
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 ">
                    <Link href={`/dashboard/plans/plan/${plan.id}`}>{plan.name}</Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(plan.price)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {plan.duration} (Dias)
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {plan.description}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {/* <BsThreeDotsVertical />
                     */}
                    <Dropdown
                      label=""
                      dismissOnClick={false}
                      renderTrigger={() => (
                        <span className="flex items-center gap-1 font-medium  hover:cursor-pointer hover:underline">
                          <BsThreeDotsVertical size={18} />
                        </span>
                      )}
                    >
                      <Dropdown.Item
                        onClick={() => {
                          editPlanId = plan.id.toString();
                          setEditPlanName(plan.name);
                          setEditPlanValue(plan.price.toString());
                          setEditPlanDescription(plan.description);
                          setEditPlanDuration(plan.duration.toString());
                          setEditMaxStudents(plan.maxStudents.toString());
                          setEditMaxBranches(plan.maxBranches.toString());
                          setOpenEditModal(true);
                        }}
                      >
                        Editar Plano
                      </Dropdown.Item>

                      <Dropdown.Item
                        className="text-red-500 hover:bg-red-200  hover:text-red-600"
                        onClick={() => {
                          toDeleteId = plan.id;
                          setOpenDeleteModal(true);
                        }}
                      >
                        Excluir
                      </Dropdown.Item>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-white ">
                <TableCell className="text-center" colSpan={5}>
                  Nenhum Plano Cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ToastContainer />
    </>
  );
};

export default Page;
