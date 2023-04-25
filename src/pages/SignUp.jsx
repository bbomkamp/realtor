// This imports necessary modules from various packages and components
import React, { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// This exports the SignUp component as the default export
export default function SignUp() {

// This defines the initial state for the formData object using useState hook
const [formData, setFormData] = useState({
name: "",
email: "",
password: "",
})

// This defines the initial state for the showPassword boolean using useState hook
const [showPassword, setShowPassword] = useState(false)

// This destructures the values from the formData object
const { name, email, password } = formData;

// This defines a navigate variable using the useNavigate hook from react-router-dom package
const navigate = useNavigate();

// This function updates the state of the formData object whenever an input field changes
function onChange(e) {
setFormData((prevState) => ({
...prevState,
[e.target.id]: e.target.value,
}))
}

// This function handles the submit event when the form is submitted
async function onSubmit(e) {
e.preventDefault()

    try {
      // This gets the authentication instance from Firebase
      const auth = getAuth()
    
      // This creates a new user with the provided email and password
      const userCredentail = await createUserWithEmailAndPassword(auth, email, password);
    
      // This updates the user's display name
      updateProfile(auth.currentUser, {
        displayName: name
      });
    
      // This gets the newly created user from the user credential object
      const user = userCredentail.user;
    
      // This creates a copy of the formData object and removes the password field for security reasons
      const formDataCopy = {...formData};
      delete formDataCopy.password;
    
      // This adds a timestamp field to the formDataCopy object
      formDataCopy.timestamp = serverTimestamp();
    
      // This sets the user's data in the "users" collection of the Firestore database
      await setDoc(doc(db, "users", user.uid), formDataCopy)
    
      // This navigates to the home page after successful registration
      navigate("/");
    } catch (error) {
      // This displays an error toast message if there is an error during registration
      toast.error("Something went wrong with registration.")
    }

  }

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto '>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1546&q=80" alt="key" className='w-full rounded-2xl' />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
            <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6' type="text" id="name" value={name} onChange={onChange} placeholder='Full name' />
            <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6' type="email" id="email" value={email} onChange={onChange} placeholder='Email address' />
            <div className='relative mb-6'>
              <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' type={showPassword ? "text" : "password"} id="password" value={password} onChange={onChange} placeholder='Password' />
              {showPassword ? (<AiFillEyeInvisible className='absolute right-3 top-3 text-xl cursor-pointer' onClick={() => setShowPassword((prevState) => !prevState)} />) : (<AiFillEye className='absolute right-3 top-3 text-xl cursor-pointer' onClick={() => setShowPassword((prevState) => !prevState)} />)}
            </div>
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className='mb-6 '>Have an account?
                <Link to="/sign-in" className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1'>Sign in</Link>
              </p>
              <p>
                <Link to="/forgot-password" className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out' >Forgot Password?</Link>
              </p>
            </div>
            <button className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800' type="submit">Sign up</button>
            <div className='flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
              <p className='text-center font-semibold mx-4'>OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  )
}
