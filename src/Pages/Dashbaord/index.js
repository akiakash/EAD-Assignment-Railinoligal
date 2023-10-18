import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Space, Statistic, Table, Typography } from "antd";
import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [trains, setTrains] = useState(0);
  const [reservations, setReservations] = useState(0);
  const [users, setUsers] = useState(0);

  useEffect(() => {
    axios
      .get("/user")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log("Error", err);
      });

    axios
      .get("/trains")
      .then((res) => {
        setTrains(res.data);
      })
      .catch((err) => {
        console.log("Error", err);
      });

    axios
      .get("/reservation")
      .then((res) => {
        setReservations(res.data);
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }, []);

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Dashboard</Typography.Title>
      <Space direction="horizontal">
        <DashboardCard
          icon={
            <ShoppingCartOutlined
              style={{
                color: "green",
                backgroundColor: "rgba(0,255,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Trains"}
          value={trains.length}
        />
        <DashboardCard
          icon={
            <ShoppingOutlined
              style={{
                color: "blue",
                backgroundColor: "rgba(0,0,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Reservations"}
          value={reservations.length}
        />
        <DashboardCard
          icon={
            <UserOutlined
              style={{
                color: "purple",
                backgroundColor: "rgba(0,255,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Users"}
          value={users.length}
        />
      </Space>
      <Space>
        <RecentOrders />
        <DashboardChart />
      </Space>
    </Space>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <Card>
      <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}
function RecentOrders() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get("/reservation").then((res) => {
      setDataSource(res.data.slice(-3));
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Typography.Text>Last Three Reservations</Typography.Text>
      <Table
        columns={[
          {
            title: "NIC",
            dataIndex: "nic",
          },
          {
            title: "TrainName",
            dataIndex: "trainName",
          },
          {
            title: "ReservationDate",
            dataIndex: "reservationDate",
          },
        ]}
        loading={loading}
        dataSource={dataSource}
        pagination={false}
      ></Table>
    </>
  );
}

function DashboardChart() {
  const [reveneuData, setReveneuData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    axios.get("/reservation").then((res) => {
      const labels = res.data.map((reservation) => {
        return `User-NIC:${reservation.nic}`;
      });
      const data = res.data.map((reservation) => {
        return reservation.noOfSeates;
      });

      const dataSource = {
        labels,
        datasets: [
          {
            label: "Reservation",
            data: data,
            backgroundColor: "rgba(255, 0, 0, 1)",
          },
        ],
      };

      setReveneuData(dataSource);
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "The count of reserved seats based on NIC.",
      },
    },
  };

  return (
    <Card style={{ width: 500, height: 250 }}>
      <Bar options={options} data={reveneuData} />
    </Card>
  );
}
export default Dashboard;
