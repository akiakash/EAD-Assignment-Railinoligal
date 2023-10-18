import { Route, Routes } from "react-router-dom";
import Dashboard from "../../Pages/Dashbaord";
import UserManagement from "../../Pages/User/UserManagement";
import TrainManagement from "../../Pages/Train/TrainManagement";
import ReservationManagement from "../../Pages/ReservationManagement";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TrainManagement />}></Route>
      <Route path="/user" element={<UserManagement />}></Route>
      <Route path="/reservation" element={<ReservationManagement />}></Route>
    </Routes>
  );
}
export default AppRoutes;
