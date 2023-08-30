import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'


const LoginPage = () => {
  const { setAuthenticated } = useContext(AuthContext)
  const [enableRegistraionForm, setEnableRegistrationForm] = useState(false);
  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' })
  const [registerDetails, setRegisterDetails] = useState({ fname: '', lname: '', email: '', mobile: '', password: '', confirmpassword: '' })
  const [passwordMatch, setPasswordMatch] = useState(false)
  const [showPasswordMatch, setShowPasswordMatch] = useState(false)

  const navigate = useNavigate();

  const handleLogin = () => {
    setAuthenticated(true)
    navigate('/preference')
  }

  const handleRegisterLinkClick = () => {
    setEnableRegistrationForm(!enableRegistraionForm)
  }

  const handleUserRegister = () => {
    navigate('/preference')
  }

  const handleLoginInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginDetails({ ...loginDetails, [event.target.name]: event.target.value })
  }

  const handleRegistrationInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRegisterDetails({ ...registerDetails, [event.target.name]: event.target.value })
  }

  useEffect(() => {
    if(registerDetails.confirmpassword != '' ){
      setShowPasswordMatch(true)
      if (registerDetails.password == registerDetails.confirmpassword) {
        setPasswordMatch(false)
      } else {
        setPasswordMatch(true)
      }
    }else{
      setShowPasswordMatch(false)
    }
  }, [registerDetails.confirmpassword])


  return (
    <div className='login-page'>
      <h1 className='header'>{enableRegistraionForm ? 'Register' : 'Login'}</h1>
      <p className='subtext'>{enableRegistraionForm ? 'Please enter your details to register Flick Finder.' : 'Please enter your credentials to access Flick Finder.'}</p>
      <div className='login-form-container'>
        {
          enableRegistraionForm ?
            <form className='form-control' onSubmit={handleUserRegister}>
              <div className="form-group">
                <input className='form-input' onChange={handleRegistrationInputChange} name='fname' type='text' placeholder='Firstname' />
                <input className='form-input' onChange={handleRegistrationInputChange} name='lname' type='text' placeholder='Lastname' />
              </div>
              <input className='form-input' required onChange={handleRegistrationInputChange} name='email' type='email' placeholder='Email'></input>
              <input className='form-input' onChange={handleRegistrationInputChange} name='mobile' type='text' placeholder='Mobile'></input>
              <input className='form-input' onChange={handleRegistrationInputChange} name='password' type='password' placeholder='Password'></input>
              <input className='form-input' onChange={handleRegistrationInputChange} name='confirmpassword' type='text' placeholder='Confirm Password'></input>
              {showPasswordMatch && <p>{passwordMatch ? "Password doesn't match" : "Password match"}</p>}

              <button type='submit' className='button-outline' onClick={() => handleUserRegister()}>Register</button>
            </form>
            :
            <form noValidate className='form-control' onSubmit={handleLogin}>
              <input className='form-input' value={loginDetails.email} required onChange={handleLoginInputChange} name='email' type='email' placeholder='Email'></input>
              <input className='form-input' value={loginDetails.password} onChange={handleLoginInputChange} name='password' type='password' placeholder='Password'></input>
              <button type='submit' className='button-outline' onClick={() => handleLogin()}>Login</button>
            </form>
        }
        <p className='new-user-link'> {enableRegistraionForm ? 'Already a user?' : 'New user?'} <span onClick={handleRegisterLinkClick}>{enableRegistraionForm ? 'Login' : 'Register'}</span></p>
      </div>
    </div>
  )
}

export default LoginPage