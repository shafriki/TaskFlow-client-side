import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Login from "../Pages/Authentication/Login/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";

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
        }
    ]
}
])