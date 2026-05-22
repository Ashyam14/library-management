import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import Navbar from '../../Component/Navbar/Navbar'
import Footer from '../../Component/Footer/Footer'
import API from '../../Api/api'

export default function Login({ setUsername }) {

  const navigate = useNavigate()

  const [UserId, setUser] = useState('')
  const [Password, setPassword] = useState('')

  const handleLogin = async (e) => {

  e.preventDefault()

  try {

    const response = await API.post(
      '/login/',
      {
        UserId: UserId,
        Password: Password
      }
    )

    console.log(response.data)

    // Admin Login
    if (response.data.Role === 'admin') {
      // persist role so protected pages can enforce auth
      localStorage.setItem('role', 'admin')
      localStorage.setItem('isAuthenticated', 'true')
      navigate('/admin-home')
    }

    // User Login
    else if (response.data.Role === 'user') {
      // persist username and role for session
      setUsername(response.data.UserId)
      localStorage.setItem('username', response.data.UserId)
      localStorage.setItem('role', 'user')
      localStorage.setItem('isAuthenticated', 'true')
      navigate('/user-home')
    }

    else {

      alert(response.data.message)
    }

  }

  catch (error) {

    console.log(error)

    if (error.response) {

      alert(
        JSON.stringify(error.response.data)
      )

    }

    else {

      alert('Server Error')
    }
  }
}
  return (
    <>
      <Navbar />

      <div className="login-container">

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <h1>Login</h1>

          <input
            type="text"
            placeholder="Enter Username or User ID"
            value={UserId}
            onChange={(e) =>
              setUser(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={Password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login
          </button>
         <div>
          <p>
            New Registration?
            <a href="/signup">
            Register Here
            </a>
          </p>
          </div>

          


        </form>

      </div>

      <Footer />
    </>
  )
}