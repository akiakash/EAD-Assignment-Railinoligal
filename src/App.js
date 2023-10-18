import { useState } from "react";
import "./App.css";
import AppFooter from "./Components/AppFooter";
import AppHeader from "./Components/AppHeader";
import PageContent from "./Components/PageContent";
import SideMenu from "./Components/SideMenu";
import { useUser } from "./Components/commonData";
import Login from "./Pages/Login/Login";

function App() {
  const { user, setUser } = useUser();
  const userData = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="App">
      <AppHeader />
      {userData ? (
        <div className="SideMenuAndPageContent">
          <SideMenu />
          <PageContent />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}
export default App;
