"use client";

import { Button, Dropdown, Label, Modal, TextInput } from "flowbite-react";
import { FaCaretDown } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { config } from "@/app/utils/config";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { addLog } from "@/app/utils/logs";
type User = {
  name: string;
  email: string;
  id: number;
};

let editUserEmail = "";
let editUserID = 0;
let editUserName2 = "";
const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openEditPassModal, setOpenEditPassModal] = useState(false);
  const [editUserName, setEditUserName] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const loggedUser = (document.querySelector("#loggedEmail") as HTMLInputElement)


  const fetchProfile = async () => {
    const email = (document.querySelector("#loggedEmail") as HTMLInputElement)
      .value;
    const response = await fetch(`/api/app/users/profile?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: config.api_key,
      },
    })
      .then((res) => res.json())
      .then((data) => data);

    setUser(response.user);

    editUserEmail = response.user.email;
    editUserID = response.user.id;
    editUserName2 = response.user.name;
    setEditUserName(response.user.name);

    // console.log(response);
  };

  const changeUsername = async () => {
    addLog("Usuario " + loggedUser + " alterou seu nome");
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
      fetchProfile();
      setOpenEditModal(false);
      // console.log(response.error);
      return;
    } else if (response.status == 200) {
      toast.success("Nome de usuário atualizado com sucesso");
      fetchProfile();

      setOpenEditModal(false);
    } else {
      toast.error("Erro Interno");
      fetchProfile();

      // console.log(response);
      setOpenEditModal(false);
    }
    // alert("kkk");

    // toast.success("Plano cadastrado com sucesso");
  };

  const changeUserPassword = async () => {
    const userID = editUserID;

    addLog("Usuario " + loggedUser + " alterou sua senha");


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
      fetchProfile();
      setOpenEditModal(false);
      // console.log(response.error);
      return;
    } else if (response.status == 200) {
      toast.success("Senha Atualizada com sucesso");
      fetchProfile();

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
      fetchProfile();

      // console.log(response);
      setOpenEditModal(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    return () => {};
  }, []);

  return (
    <>
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

            <div className="flex justify-between  bg-red-50">
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
              Alterar senha
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
      <div className="flex w-full flex-col justify-center rounded-lg bg-white p-6">
        <h1 className="w-full text-left text-xl font-bold">Perfil</h1>
      </div>
      <div className="my-6 flex items-start gap-4 ">

        <div className="w-full rounded-lg bg-white">
          <div className="flex flex-col items-start justify-center gap-4 p-6">
            <h1 className="text-2xl font-bold ">{user?.name}</h1>
            <p className="text-lg text-cyan-600">{user?.email}</p>
          </div>
          <div>
            <div className="flex flex-col md:flex-row gap-4 p-6">
              <button
                onClick={() => {
                  setOpenEditModal(true);
                }}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-white"
              >
                Trocar Nome
              </button>
              <button
                onClick={() => {
                  setOpenEditPassModal(true);
                }}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-white"
              >
                Trocar Senha
              </button>
              <button
                onClick={() => {
                  signOut();
                }}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white text-center"
              >
                Sair
                <IoLogOutOutline color="#fff" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Page;
