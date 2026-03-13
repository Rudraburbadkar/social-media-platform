
import React from 'react'
import {RouterProvider,createBrowserRouter} from "react-router-dom"
import MainLayout from './components/MainLayout'
import Search from './pages/Search'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import CreatePost from './pages/CreatePost'
const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout/>,
      children: [
      { path: "/", element: <Home /> },
      { path: "search", element: <Search /> },
      {path:"create-post", element: <CreatePost/>}
      ]

    },
    {
      path: "/sign-up",
      element: <SignUp/>
    },
     {
      path: "/sign-in",
      element: <SignIn/>
    }
])
function App() {
  

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
