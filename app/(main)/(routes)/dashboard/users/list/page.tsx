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
import { getServerSession } from "next-auth";
import { Globals } from "@/app/utils/globals";
// import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
// import { log } from "console";
import { signOut } from "next-auth/react";

type Plan = {
  id: number;
  name: string;
  duration: number;
  price: number;
  description: string;
};
type User = {
  id: number;
  name: string;
  email: string;
};
const planList: Plan[] = [];
const userList: User[] = [];

let toDeleteId = 0;
let toDeleteEmail = "";

// let editusername = "";
let editPlanDescription = "";
let editPlanDuration = "";
let editUserID = "";
let editUserEmail = "";

const Page = ({ user }: any) => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openEditPassModal, setOpenEditPassModal] = useState(false);
  const [editUserName, setEditUserName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [editPassword, setEditPassword] = useState("");

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
  const fetchUsers = async () => {
    const response = await fetch(`/api/app/users/list`, {
      headers: {
        authorization: config.api_key as string,
      },
    })
      .then((res) => res.json())
      .then((data) => data);

    response.data.map((user: User) => userList.push(user));
    setUsers(response.data);
  };
  const createUser = async () => {
    const username = document.getElementById("username") as HTMLInputElement;
    const userEmail = document.getElementById("userEmail") as HTMLInputElement;
    const userPassword = document.getElementById(
      "userPassword",
    ) as HTMLInputElement;

    if (!username.value || !userEmail.value || !userPassword.value) {
      toast.error("Preencha todos os campos");
      return;
    }
    const data = {
      name: username.value,
      email: userEmail.value,
      password: userPassword.value,
    };
    // console.log("DATA: ", data);
    const response = await fetch("/api/app/users/new", {
      method: "POST",
      headers: {
        Authorization: config.api_key,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => data);
    // console.log(response.message);
    if (response.status == 400) {
      toast.error(response.message);
      // console.log(response.error);
      return;
    } else if (response.status == 200) {
      fetchUsers();
      toast.success(response.message);
      setOpenModal(false);
    } else {
      toast.error("Erro Interno");
      // console.log(response);
    }
  };
  const changeUsername = async () => {
    const userID = editUserID;
    const username = document.getElementById(
      "usernameEdit",
    ) as HTMLInputElement;

    if (!username.value) {
      toast.error("Preencha todos os campos");
      return;
    }

    const data = {
      id: userID,
      name: username.value,
    };
    // console.log("DATA: ", data);
    const response = await fetch("/api/app/users/edit", {
      method: "POST",
      headers: {
        Authorization: config.api_key,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => data);

    if (response.status == 400) {
      toast.error("Erro ao atualizar o nome do usuário");
      fetchUsers();
      setOpenEditModal(false);
      // console.log(response.error);
      return;
    } else if (response.status == 200) {
      toast.success("usuário Atualizado com sucesso");
      fetchUsers();
      if (
        editUserEmail ==
        (document.querySelector("#loggedEmail") as HTMLInputElement).value
      ) {
        toast.info("Nome de usuário atualizado deslogando para aplicar alterações");
        return signOut();
      }

      setOpenEditModal(false);
    } else {
      toast.error("Erro Interno");
      fetchUsers();

      // console.log(response);
      setOpenEditModal(false);
    }
    // alert("kkk");

    // toast.success("Plano cadastrado com sucesso");
  };
  const changeUserPassword = async () => {
    const userID = editUserID;

    const password = document.getElementById(
      "passwordEdit",
    ) as HTMLInputElement;

    if (!password.value) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (password.value.length < 5) {
      return toast.error("A senha deve ter pelo menos 6 caracteres");
    }
    const data = {
      id: editUserID,
      password: password.value,
    };
    // console.log("DATA: ", data);
    const response = await fetch("/api/app/users/changePassword", {
      method: "POST",
      headers: {
        Authorization: config.api_key,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => data);

    if (response.status == 400) {
      toast.error("Erro ao alterar senha");
      fetchUsers();
      setOpenEditModal(false);
      // console.log(response.error);
      return;
    } else if (response.status == 200) {
      toast.success("Senha Atualizada com sucesso");
      fetchUsers();

      if (
        editUserEmail ==
        (document.querySelector("#loggedEmail") as HTMLInputElement).value
      ) {
        toast.info("Senha Atualizada deslogando para aplicar alterações");
        return signOut();
      }

      setOpenEditModal(false);
    } else {
      toast.error("Erro Interno");
      fetchUsers();

      // console.log(response);
      setOpenEditModal(false);
    }
    // alert("kkk");

    // toast.success("Plano cadastrado com sucesso");
  };

  const deleteUser = async (id: string) => {
    // console.log("To delete" + toDeleteEmail);

    if (
      toDeleteEmail ==
      (document.querySelector("#loggedEmail") as HTMLInputElement).value
    ) {
      toast.error("Você não pode deletar a si mesmo");
      return;
    }

    const response = await fetch(`/api/app/users/delete?id=${id}`, {
      headers: {
        Authorization: config.api_key,
      },
    });

    fetchUsers();

    if (response.status == 400) {
      toast.error("Erro ao deletar usuário");
      return;
    } else if (response.status == 200) {
      toast.success("Usuário deletado com sucesso");
    } else {
      toast.error("Erro Interno");
      // console.log(response);
    }
  };

  useEffect(() => {
    // console.log("O componente foi montado");

    // console.log("Mail", toDeleteEmail);
    // alert(config.api_key);
    fetchUsers();
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
              Atenção, Tem certeza que deseja excluir esse usuário ?
              <div className="m-2 rounded-xl bg-yellow-100 p-2 text-sm text-yellow-800">
                Esta alteração não pode ser desfeita
              </div>
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  // handleUpdate(updaterId.toString(), updaterPlan);
                  deleteUser(toDeleteId.toString());
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
              Adicionar novo usuário
            </h3>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Nome do usuário" />
              </div>
              <TextInput
                id="username"
                placeholder="Nome do usuário"
                required={true}
                type="text"
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="userEmail" value="Email do usuário" />
              </div>
              <TextInput
                id="userEmail"
                placeholder="Email do usuário"
                required={true}
                type="email"
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="userPassword" value="Senha do usuário" />
              </div>
              <TextInput
                id="userPassword"
                placeholder="Deve ser maior que 6 caracteres"
                type="password"
                required={true}
              />
            </div>

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
                onClick={createUser}
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
            <h3 className="text-xl font-medium text-gray-900 ">
              Alterar nome de usuário
            </h3>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="usernameEdit" value="Nome do usuário" />
              </div>
              <TextInput
                id="usernameEdit"
                placeholder="Nome do usuário"
                value={editUserName.toString()}
                onChange={(e) => {
                  setEditUserName(e.target.value);
                  // alert("kk")
                }}
                required
              />
            </div>

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
                onClick={changeUsername}
              >
                Salvar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={openEditPassModal}
        size="md"
        onClose={() => {
          setOpenEditPassModal(false);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 ">
              Alterar senha do usuário
            </h3>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="passwordEdit" value="Nova Senha" />
              </div>
              <TextInput
                id="passwordEdit"
                placeholder="Nova Senha"
                onChange={(e) => {
                  setEditPassword(e.target.value);
                  // alert("kk")
                }}
                required
              />
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => {
                  setOpenEditPassModal(false);
                }}
                color="gray"
                className="bg-gray-200 text-gray-900 hover:bg-gray-300"
              >
                Cancelar
              </Button>
              <Button
                className="bg-cyan-600 text-white hover:bg-cyan-700"
                onClick={changeUserPassword}
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
            Lista de usuários
          </h2>
          <Button
            onClick={() => setOpenModal(true)}
            className="bg-cyan-600 text-white hover:bg-cyan-700"
          >
            Novo usuário
          </Button>
        </div>
      </div>
      <div className="min-h-64 w-full overflow-x-auto">
        <Table>
          <TableHead>
            <TableHeadCell>Nome do usuário</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Actions</span>
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {users.length > 0 ? (
              users.map((user: User, index) => (
                <>
                  <TableRow
                    className="bg-white "
                    id={user.id.toString()}
                    key={index}
                  >
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 ">
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
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
                            editUserID = user.id.toString();
                            editUserEmail = user.email;
                            setEditUserName(user.name);
                            setOpenEditModal(true);
                          }}
                        >
                          Editar Nome
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            editUserID = user.id.toString();
                            editUserEmail = user.email;
                            setOpenEditPassModal(true);
                          }}
                        >
                          Editar Senha
                        </Dropdown.Item>

                        <Dropdown.Item
                          className="text-red-500 hover:bg-red-200  hover:text-red-600"
                          onClick={() => {
                            toDeleteId = user.id;
                            toDeleteEmail = user.email;
                            setOpenDeleteModal(true);
                          }}
                        >
                          Excluir
                        </Dropdown.Item>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                </>
              ))
            ) : (
              <TableRow className="bg-white ">
                <TableCell className="text-center" colSpan={5}>
                  Nenhum Usuário Cadastrado
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
