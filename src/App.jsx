import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './page/LoginPage';
import RegisterForm from './component/RegisterForm';
import { ToastContainer } from 'react-toastify';
import ChatPage from './page/ChatPage';

function App() {
  const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/login",
    element: <div><LoginPage/></div>,
  },
  {
    path: "/register",
    element: <div><RegisterForm/></div>,
  },
  {
    path: "/chatpage",
    element: <div><ChatPage/></div>,
  },
]);
  return <>
  <RouterProvider router={router} />
  <ToastContainer />
  </>
    
    
 
}

export default App
