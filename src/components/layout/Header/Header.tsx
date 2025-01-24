import React, { useState } from "react";
import { Home, MessageCircle, Bell } from "lucide-react";
import tedooLogo from "../../../assets/tedooLogo.png";

type NavItem = "home" | "messaging" | "notifications";

interface HeaderProps {
  avatar?: string;
}

const Header: React.FC<HeaderProps> = ({ avatar }) => {
  const [activeItem, setActiveItem] = useState<NavItem>("home");

  const getNavItemClasses = (itemName: NavItem) => {
    const baseClasses = "flex items-center relative py-5";
    const textClasses =
      activeItem === itemName ? "text-emerald-500" : "text-gray-500";
    return `${baseClasses} ${textClasses} hover:text-emerald-500`;
  };

  const ActiveIndicator = () => (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
  );

  return (
    <header className="h-16 sticky top-0 bg-white border-b border-gray-100 z-50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <img src={tedooLogo} alt="Tedoo Logo" className="w-10 h-10" />

        <div className="relative w-[480px] max-w-full hidden sm:block">
          <input
            type="text"
            placeholder="Search"
            className="w-full max-w-[216px] h-10 pl-10 pr-4 bg-gray-50 rounded-xl text-gray-600 text-sm focus:outline-none"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
              stroke="currentColor"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <nav className="hidden md:flex h-full ml-auto">
          <button
            onClick={() => setActiveItem("home")}
            className={getNavItemClasses("home")}
          >
            <Home className="w-4.5 h-4.5" />
            <span className="ml-2 text-sm font-medium">Home</span>
            {activeItem === "home" && <ActiveIndicator />}
          </button>

          <button
            onClick={() => setActiveItem("messaging")}
            className={`${getNavItemClasses("messaging")} ml-8`}
          >
            <MessageCircle className="w-4.5 h-4.5" />
            <span className="ml-2 text-sm font-medium">Messaging</span>
            {activeItem === "messaging" && <ActiveIndicator />}
          </button>

          <button
            onClick={() => setActiveItem("notifications")}
            className={`${getNavItemClasses("notifications")} ml-8`}
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="ml-2 text-sm font-medium">Notifications</span>
            {activeItem === "notifications" && <ActiveIndicator />}
          </button>
        </nav>

        <div className="ml-4">
          <img
            src={avatar}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
