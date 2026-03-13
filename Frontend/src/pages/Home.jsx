import React from 'react'
import PostCard from '../components/PostCard'
import SuggestedUserCard from '../components/SuggestedUserCard'

const Home = () => {
  return (
    <div className='flex w-full gap-4 p-4 '>
   
    <div className='w-[60%] bg-zinc-800 rounded-lg flex flex-col justify-center items-center m-auto '>
        <PostCard/>
        <PostCard/>
        <PostCard/>
    </div>

  
    <div className='w-[40%] h-full bg-zinc-900 rounded-lg p-6  space-y-4 overflow-y-auto max-h-screen' >
           <span className='text-white text-4xl font-extrabold mb-6 font-inter'>Suggested users</span>
         <SuggestedUserCard/>
          <SuggestedUserCard/>
           <SuggestedUserCard/>
            <SuggestedUserCard/>
             <SuggestedUserCard/>
              <SuggestedUserCard/>
    </div>
     </div>
  )
}

export default Home