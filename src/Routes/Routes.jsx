import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Login from "../Pages/Authentication/Login/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Task from "../Pages/Task/Task";
import AllTask from "../Pages/Task/AllTask";

export const router = createBrowserRouter([

{
    path: '/',
    element: <MainLayout></MainLayout>,
    errorElement:<h1>this is error</h1>,
    children: [
        {
            path: '/login',
            element: <Login></Login>,
        },
        {
            path: '/',
            element: <Dashboard></Dashboard>
        },
        {
            path: '/task',
            element: <PrivateRoute><Task></Task></PrivateRoute>
        },
        {
            path: '/alltasks',
            element: <PrivateRoute><AllTask></AllTask></PrivateRoute>
        }
    ]
}
])