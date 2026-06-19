import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Navbar from './Component/Navbar/Navbar'
import Footer from './Component/Footer/Footer'
import Home from './Pages/Home/Home'
import Login from './Pages/Login/Login'
import UserHome from './Pages/Userpage/Home/Userhome'
import Adminhome from './Pages/Adminpage/Home/Adminhome'
import Mydashboard from './Pages/Userpage/Mydashboard/Mydashboard'
import Books from './Pages/Userpage/Books/Books'
import BorrowedBooks from './Pages/Userpage/BorrowedBooks/BorrowedBooks'
import ReturnBooks from './Pages/Userpage/ReturnBooks/ReturnBooks'
import Signup from './Pages/Signup/Signup'  

function App() {
  const [count, setCount] = useState(0)
  const [username, setUsername] = useState('')

  return (
    <>
     <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

       
        <Route
          path="/login"
          element={<Login setUsername = {setUsername}/>}
        />

       
        <Route
          path="/user-home"
          element={<UserHome username={username} />}
        />

        <Route
          path="/mydashboard"
          element={<Mydashboard />}
        />

       
        <Route 
          path="/books"
          element={<Books/>}
        />
        <Route
          path="/borrowed"
          element={<BorrowedBooks />}
        />
        <Route
          path="/return-books"
          element={<ReturnBooks />}
        />

        <Route 
          path="/signup"
          element={<Signup/>}
        />

        <Route
          path="/admin-home"
          element={<Adminhome />}
        />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
