import React from 'react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { GoogleGenAI } from "@google/genai"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import api from '../api/api'

const ai = new GoogleGenAI({
  apiKey: " AIzaSyABTSBIWAfAku1CF7G0etMrupX5LYzNlqU"
})
const SignUp = () => {
  const {
    register, // used to register the input
    handleSubmit, // used to handle the form submission
    setValue, // used to set the value of the input
    watch, // used to watch the value of the input
    formState: { errors },
  } = useForm();

  const email = watch("email") // watch input value
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestedUsernames, setSuggestedUsernames] = useState([]);
  const [step,setStep] = useState("signup"); // signup or verify
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [loading , setLoading] = useState(false);
  const [code, setCode] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSuggestedUsernames = async () => {
      if (!email || !email.includes("@")) return;
      setLoadingSuggestions(true);

      try {
        const prompt = `Suggest 5 unique usernames for the email: ${email}`;
        const respone = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: prompt
        })
        console.log(respone.text);

        const text = respone.text;

        const usernames = text
          .split("\n")
          .filter(line => line.match(/^\d+\./))
          .map(line => line.replace(/^\d+\.\s*\*\*(.*?)\*\*.*/, '$1')
            .replace(/[:*]+/g, '')
            .trim()
          )


        console.log(usernames);
        setSuggestedUsernames(usernames);
        
      } catch (error) {
        console.log(error);
        setSuggestedUsernames([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }
    fetchSuggestedUsernames();
  }, [email, setValue])

  const handleUsernameClick = (username) => {
    setValue("username", username)
  };

  const onSubmit = async(data, e) => {
    setLoading(true);
    try {
      const res = await api.post("/api/v1/user/register",
          { 
            name: data.name,
            username: data.username,
            email: data.email,
            password: data.password
          },{
            withCredentials: true
          }
      );

      if(res.status === 201){
        setRegisteredEmail(data.email);
        setStep("verify");
      }
    } catch (error) {
      console.error(error)
      console.log(error.response?.data?.message || "Registration failed");
      
    } finally {
      setLoading(false)  
    }
    
  }

  //onVerify
  const onVerify = async(e) =>{
   e.preventDefault();

    if(!code || code.length !== 6){
      return alert("Enter a 6-digit OTP code !!");   
  } 
  console.log(code);
  
  try {
    const res = await api.post("/api/v1/user/verify-email",
      {
        email: registeredEmail,
        code
      }
    )
    console.log(res);
   
    if(res.data.success){
      alert(res.data.message);
    }
     navigate("/");
    
  } catch (error) {
    console.log(error);
    
  }
}

//resend code
const resendCode = async() => {
  try {
    await api.post("/api/v1/user/resend-verification-code",
      {
        email: registeredEmail
      })
      alert("Verification code resent successfully")
    

  }catch (error) {
    
  }
}

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-indigo-100 px-4">
      {step === "signup" ?(
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-extrabold text-center text-gray-800">Create Your Account</h2>
        {/* Name Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "name must be at least 3 characters"
              }
            })}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        {/* Email Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Username Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters"
              }
            })}
          />
          {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>}
        </div>

        {/* Suggested Usernames */}
        {loadingSuggestions && <p className="text-blue-500 text-sm">Generating suggestions...</p>}
        {suggestedUsernames.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {suggestedUsernames.map((username, idx) => (
              <span
                key={idx}
                onClick={() => handleUsernameClick(username)}
                className="cursor-pointer px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition"
              >
                {username}
              </span>
            ))}
          </div>
        )}

        {/* Password Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                message: "Password must contain uppercase, lowercase, number, special character and be 8+ chars"
              },
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Sign Up
        </button>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition">
            Sign In
          </Link>
        </p>

      </form>
      ):(
       <form onSubmit={onVerify} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">Verify Email</h2>
          <p className="text-sm text-gray-600 text-center">
            We've sent a 6-digit OTP to <strong>{registeredEmail}</strong>
          </p>
          <input
            type="text"
            name="code"
            maxLength={6}
            placeholder="Enter OTP"
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit"  className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
            Verify Email
          </button>
          <p className="text-sm text-center">
            Didn't get the code?{" "}
            <button type="button" onClick={resendCode} className="text-blue-600 font-semibold hover:underline">
              Resend OTP
            </button>
          </p>
        </form>
      )}
    </div>

  )
}

export default SignUp;