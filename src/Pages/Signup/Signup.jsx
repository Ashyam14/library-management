import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Signup.css'
import API from '../../Api/api'
import Navbar from '../../Component/Navbar/Navbar'
import Footer from '../../Component/Footer/Footer'
import LoginBackground from '../../assets/loginbackground.jpg'


export default function Signup() {

  const navigate = useNavigate()

  const [Name, setUsername] = useState('')
  const [Email, setEmail] = useState('')
  const [UserId, setUserid] = useState('')  
  const [Password, setPassword] = useState('')
  const [Role, setRole] = useState('user')
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showError, setShowError] = useState(false)

  const handleSignup = async (e) => {

  e.preventDefault()


  const userData = {
  
    Name: Name,
    UserId: UserId,
    Email: Email,
    Password: Password,
    Role: Role
  }

  try {

    const response = await API.post(
      '/users/',
      userData
    )

    console.log(response.data)

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      navigate('/login')
    }, 2000)

  }

  catch (error) {

    console.log(error)

    const parseError = (data) => {
      if (typeof data === 'string') return data
      if (Array.isArray(data)) {
        return data
          .map((item) => {
            if (item?.msg) return item.msg
            if (item?.detail) return item.detail
            return JSON.stringify(item)
          })
          .join('\n')
      }
      if (data?.detail) {
        if (Array.isArray(data.detail)) {
          return data.detail
            .map((item) => item?.msg || JSON.stringify(item))
            .join('\n')
        }
        return String(data.detail)
      }
      if (data?.message) return String(data.message)
      return JSON.stringify(data)
    }

    let message = 'Server Error'

    if (error.response && error.response.data) {
      message = parseError(error.response.data)
    }

    setErrorMessage(message)
    setShowError(true)
    setTimeout(() => setShowError(false), 2000)
  }
}
  return (
    <>
    
    <Navbar />  
    <div className="signup-container">

      <img src={LoginBackground} alt="Signup Background" className="signup-background" />

      <form
        className="signup-form"
        onSubmit={handleSignup}
      >

        <h1>Create Account</h1>

        <input
          type="text"
          placeholder="Enter Username"
          value={Name}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={Email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Enter User ID"
          value={UserId}
          onChange={(e) =>
            setUserid(e.target.value)
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

        <select
        className='select-option'
          value={Role}
          onChange={(e) =>
            setRole(e.target.value)
          }
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">
          Signup
        </button>

      </form>

      {showSuccess && (
        <div className="success-modal">
          <div className="success-modal-content">
            <div className="success-icon">✓</div>
            <h2>Account Created Successfully!</h2>
            <p>Redirecting to login page...</p>
          </div>
        </div>
      )}

      {showError && (
        <div className="error-toast">
          {errorMessage}
        </div>
      )}

    </div>
    <Footer />
    </>
  )

}