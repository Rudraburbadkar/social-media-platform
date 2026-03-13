import React from 'react'
import {
  Home,
  Search,
  Compass,
  Video,
  MessageCircle,
  Heart,
  User,
  PlusSquare,
  Menu,
} from "lucide-react";
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: "Home", icon: Home , link: "/" },
  {label: "Search", icon: Search , link: "/search" },
  {label: "Explore", icon: Compass , link: "/explore" },
  {label: "Reels", icon: Video , link: "/reels" },
  {label: "Messages", icon: MessageCircle , link: "/messages" },
  {label: "Notifications", icon: Heart , link: "/notifications" },
  {label: "Create", icon: PlusSquare , link: "/create-post" },
  {label: "Profile", icon: User , link: "/profile" },
]
const LeftSidebar = () => {
  
  return(
     <aside className="h-screen w-64 bg-white dark:bg-zinc-900 dark:text-white border-r dark:border-zinc-800 p-4 flex-col justify-between hidden md:flex sticky top-0">
      <div>
        <h1 className="text-3xl font-bold mb-8 px-2">solo</h1>
        <nav className="flex flex-col gap-2">
          {navItems.map(({ label, icon: Icon, link }) => (
            <NavLink
              key={label}
              to={link}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-gray-200 dark:bg-zinc-700 font-semibold"
                    : "hover:bg-gray-100 dark:hover:bg-zinc-800"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-base">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-4 py-2 border-t dark:border-zinc-700">
        <button className="flex items-center gap-3 w-full text-left hover:bg-gray-100 dark:hover:bg-zinc-800 px-2 py-2 rounded-lg transition-all">
          <Menu className="w-5 h-5" />
          <span className="text-base">More</span>
        </button>
      </div>
    </aside>
  )
}

export default LeftSidebar