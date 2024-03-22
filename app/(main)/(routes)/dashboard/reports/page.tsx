"use client";
import {
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  Chart,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Decimation,
  Filler,
  Legend,
  SubTitle,
  Title,
  Tooltip,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
} from "chart.js";
// import { Bar } from "react-chartjs-2";
import { Bar, Pie } from "react-chartjs-2";
Chart.register(
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Decimation,
  Filler,
  Legend,
  SubTitle,
  Title,
  Tooltip,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
);
import { FiPlus, FiMinus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { config } from "@/app/utils/config";
import { toast, ToastContainer } from "react-toastify";

let year = new Date().getFullYear();
export default function Page() {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [statePrefix, setStatePrefix] = useState<any>([]);
  const [stateData, setStateData] = useState<any>([]);
  const [activation, setActivation] = useState<any>([]);
  const [actives, setActives] = useState<any>([]);
  const [blocked, setBlocked] = useState<any>([]);
  const [inactive, setInactive] = useState<any>([]);

  const fetchChurchByYear = async () => {
    console.log("ANO", year);
    try {
      const response = await fetch(
        `${config.api_url}v0/Reports/Church?year=${year}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: config.api_key,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => data);
      const totals: number[] = [];

      response.forEach((item: any) => {
        totals.push(item.Total);
        // console.log(item);
      });
      setData(totals);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao buscar relatórios");
    }
  };

  const fetchStates = async () => {
    try {
      const response = await fetch(
        `${config.api_url}v0/Reports/Church/States`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: config.api_key,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => data);

      const users: number[] = [];
      const states: string[] = [];
      response.forEach((item: any) => {
        states.push(item.state);
        users.push(item.users);
        // setStatePrefix(item.State);
        console.log(item);
      });
      // setData(totals);
      setStateData(users);
      setStatePrefix(states);
      // setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao buscar relatórios");
    }
  };
  const fetchActivation = async () => {
    try {
      const response = await fetch(
        `${config.api_url}v0/Reports/Church/Activation`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: config.api_key,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => data);

      // const users: number[] = [];
      // const states: string[] = [];
      // response.forEach((item: any) => {
      //   states.push(item.state);
      //   users.push(item.users);
      //   // setStatePrefix(item.State);
      //   console.log(item);
      // });
      const totals = [];

      const totalPercent =
        Number(response[0].active) +
        Number(response[0].blocked) +
        Number(response[0].inactive);
      const percentAtivo = ((response[0].active / totalPercent) * 100).toFixed(
        2,
      );
      const percentBloqueado = (
        (response[0].blocked / totalPercent) *
        100
      ).toFixed(2);
      const percentInativo = (
        (response[0].inactive / totalPercent) *
        100
      ).toFixed(2);

      totals.push(Number(response[0].active));
      totals.push(Number(response[0].blocked));
      totals.push(Number(response[0].inactive));

      setActives(response[0].active);
      setBlocked(response[0].blocked);
      setInactive(response[0].inactive);

      setActivation(totals);
      console.log("sasssssss", activation);
      // setStateData(users);
      // setStatePrefix(states);
      // setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao buscar relatórios");
    }
  };

  useEffect(() => {
    fetchChurchByYear();
    fetchStates();
    fetchActivation();
  }, []);
  const estadosData = {
    labels: statePrefix,
    datasets: [
      {
        data: stateData, // Substitua pelos seus dados
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF5733",
          "#33FF57",
          "#3366FF", // Cor para o slice "Outros"
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF5733",
          "#33FF57",
          "#3366FF",
        ],
      },
    ],
  };
  const activationData = {
    labels: ["Ativo", "Bloqueado", "Inativo"],
    datasets: [
      {
        data: activation, // Substitua pelos seus dados
        backgroundColor: ["#33FF57", "#FFCE56", "#FF5733"],
        hoverBackgroundColor: ["#33FF57", "#FFCE56", "#FF5733"],
      },
    ],
  };
  return (
    <>
      <div className="w-full rounded-lg bg-white p-8">
        <h1 className="text-xl font-semibold">Relatórios</h1>
      </div>
      <div className="mt-4 w-full rounded-lg bg-white p-8">
        <div className="flex items-center justify-center ">
          <div className="flex items-center gap-2">
            <FiPlus
              className="hover:cursor-pointer"
              onClick={async () => {
                const newYear = year + 1;
                year = newYear;

                await fetchChurchByYear();
              }}
            />
            <h2 className="my-2 text-center text-xl font-bold">{year}</h2>
            <FiMinus
              className="hover:cursor-pointer"
              onClick={async () => {
                const newYear = year - 1;

                year = newYear;

                await fetchChurchByYear();
              }}
            />
          </div>
        </div>
        <h2 className="my-2 text-center text-xl font-semibold">
          Usuários cadastrados por mês
        </h2>
        <div>
          <Bar
            data={{
              labels: [
                "Janeiro",
                "Fevereiro",
                "Março",
                "Abril",
                "Maio",
                "Junho",
                "Julho",
                "Agosto",
                "Setembro",
                "Outubro",
                "Novembro",
                "Dezembro",
              ],
              datasets: [
                {
                  label: "Quantidade de usuários",
                  data: data,
                  backgroundColor: "rgba(255, 148, 99, 0.2)",
                  borderColor: "#ffa463",
                  borderWidth: 1,
                },
              ],
            }}
            height={400}
            width={600}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
      <div className="mt-4 flex w-full flex-col items-center rounded-lg bg-white p-8">
        <h2 className="my-2 text-center text-xl font-semibold">
          Distribuição de Clientes por Estado
        </h2>
        <span>5 Estados com mais usuários</span>
        <div className="w-[300px]">
          <Pie data={estadosData} />
        </div>
      </div>
      <div className="mt-4 w-full rounded-lg bg-white p-8">
        <h2 className="my-2 text-center text-xl font-semibold">
          Ativação dos Usuários
        </h2>
        <div className="flex justify-center items-center gap-6 mt-4">
          <div className="w-[300px]">
            <Pie data={activationData} />
          </div>
          <div>
            <ul>
              <li>Ativos: {actives}</li>
              <li>Bloqueados: {blocked}</li>
              <li>Inativos: {inactive}</li>
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
