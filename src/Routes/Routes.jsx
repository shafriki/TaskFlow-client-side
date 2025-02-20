import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Login from "../Pages/Authentication/Login/Login";

export const router = createBrowserRouter([

{
    path: '/',
    element: <MainLayout></MainLayout>,
    errorElement:<h1>this is error</h1>,
    children: [
        {
            path: '/login',
            element: <Login></Login>,
        }
    ]
}
])