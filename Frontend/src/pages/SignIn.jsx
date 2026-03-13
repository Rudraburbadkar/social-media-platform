import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import api from "../api/api"
const SignIn = () => {
  const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleSignIn = async (data) => {
      
        const res = await api.post("/api/v1/user/login",
          {
            email: data.email,
            password: data.password
          }
        );
        console.log(res);
        
        if(res.success){
          alert(res.message)
        }
        navigate("/");
    };
  return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-indigo-100 px-4">
           <form 
           onSubmit={handleSubmit(handleSignIn)} // react-hook-form function to validate and trigger onSubmit
            className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
          >
             <h2 className="text-2xl font-extrabold text-center text-gray-800">Sign In</h2>

             <div>
                <label className='block text-sm text-gray-700 font-medium'>Email</label>
                <input
                  type='email'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300'

                  {...register('email',{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  
                  })
                    
                  }
                />
               {errors.email && <span className='text-red-500'>{errors.email.message}</span>}
             </div>

             {/* Password */}
             <div>
                <label className='block text-sm text-gray-700 font-medium'>Password</label>
                <input
                  type='password'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300'

                  {...register('password',{
                   required: "Password is required",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                message: "Password must contain uppercase, lowercase, number, special character and be 8+ chars"
              },
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
                  })
                    
                  }
                />
               {errors.password && <span className='text-red-500'>{errors.password.message}</span>}
             </div>
              
              {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Sign In
        </button>
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition">
            Sign Up
          </Link>
        </p>
           </form>
    </div>
  )
}

export default SignIn