import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Ref from "./pages/Ref";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import ErrorCom from "./Components/ErrorCom";
import GoldHunters from "./pages/GoldHunters";
import Leaderboard from "./pages/Leaderboard";
import DailyCheckIn from "./pages/Checkin";
import CryptoFarming from "./pages/Farm";
import Airdrop from "./pages/Airdrop";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import Statistics from "./pages/admin/Statistics";
import { AuthProvider } from "./context/AuthContext";
import { AdvertTasks, ManualTasks, RegularTasks, YoutubeTasks } from "./pages/admin/TaskPage";
import Register from "./Components/adminComponents/Register";
import { PrivateRoute } from "./Components/adminComponents/PrivateRoute";
import NotAdmin236 from "./pages/admin/NotAdmin236";
import Search from "./pages/admin/Search";
import SpinEarn from "./pages/SpinEarn";
import Earns from "./pages/Earns";
import Broadcast from "./pages/admin/Broadcast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorCom />,
    children:[
      {
        path:"/",
        element: <GoldHunters />,
      },
      {
        path:"/ref",
        element: <Ref />,
      },
      {
        path:"/airdrop",
        element: <Airdrop />,
      },
      {
        path:"/leaderboard",
        element: <Leaderboard />,
      },
      {
        path:"/checkin",
        element: <DailyCheckIn />,
      },
      {
        path:"/earn",
        element: <Earns/>,
      },
      {
        path:"/farm",
        element: <CryptoFarming/>,
      },
      {
        path:"/spinearn",
        element: <SpinEarn/>,
      },
      {
        path:"/dashboardlogin",
        element: <NotAdmin236 />,
      },
      // Remove this route after creating admin user for security
      {
        path:"/adminregister",
        element: <Register />,
      },
    ]

  },
  {
    path: "/dashboardAdx",
    element:   <PrivateRoute><Dashboard /></PrivateRoute>,
    errorElement: <ErrorCom />,
    children:[
      {
        path:"/dashboardAdx/settings",
        element: <Settings />,
      },
      {
        path:"/dashboardAdx/managetasks",
        element: <RegularTasks />,
      },
      {
        path:"/dashboardAdx/broadcast",
        element: <Broadcast />,
      },
      {
        path:"/dashboardAdx/externaltasks",
        element: <ManualTasks />,
      },
      {
        path:"/dashboardAdx/promo",
        element: <AdvertTasks />,
      },
      {
        path:"/dashboardAdx/search",
        element: <Search />,
      },
      {
        path:"/dashboardAdx/youtube",
        element: <YoutubeTasks />,
      },
      {
        path:"/dashboardAdx/stats",
        element: <Statistics />,
      },
    ]
  }
]);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
  </AuthProvider>
);
