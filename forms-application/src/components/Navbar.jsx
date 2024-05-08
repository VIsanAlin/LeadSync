import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import {
  FiHome,
  FiCheckSquare,
  FiBell,
  FiUser,
  FiLogOut,
  FiMenu,
} from "react-icons/fi"; // Import icons from react-icons library

export default function Navbar() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchNotificationCount();
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const { data, error } = await supabase
        .from("notification")
        .select("id", { count: "exact" });

      if (error) {
        throw error;
      }

      setNotificationCount(data.length);
    } catch (error) {
      console.error("Error fetching notification count:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      console.log(error);
      // Redirect user to dashboard or another page
    } catch (error) {
      console.error("Error sign out:", error.message);
      setError(error.message);
    }
  };

  return (
    <nav className="bg-thirdColor sticky top-0 z-10 rounded-tr-2xl rounded-br-2xl">
      <div className="flex justify-between py-2  px-6">
        <div className="hidden md:flex flex-col md:pt-20 md:space-y-10">
          <div className="flex space-x-4 pt-4 items-center">
            <Link
              href="/dashboard"
              className="flex items-center text-eightColor"
            >
              <FiHome />
              <span className="ml-2">Dashboard</span>
            </Link>
          </div>
          <div className="flex space-x-4 pt-4 items-center">
            <Link href="/tasks" className="flex items-center text-eightColor">
              <FiCheckSquare />
              <span className="ml-2">Tasks</span>
            </Link>
          </div>
          <div className="flex space-x-4 pt-4 items-center">
            <Link
              href="/notifications"
              className="flex items-center text-eightColor"
            >
              <FiBell />
              <span className="ml-2">Notifications</span>
              {notificationCount > 0 && (
                <span className="bg-eightColor text-forthColor rounded-full px-2 py-1 ml-2">
                  {notificationCount}
                </span>
              )}
            </Link>
          </div>
          <div className="flex space-x-4 pt-4 items-center">
            <Link href="/profile" className="flex items-center text-eightColor">
              <FiUser />
              <span className="ml-2">Profile</span>
            </Link>
          </div>
          <div className="flex space-x-4 pt-4 items-center">
            <Link
              onClick={handleLogout}
              href="/"
              className="flex items-center text-eightColor"
            >
              <FiLogOut />
              <span className="ml-2">Log-out</span>
            </Link>
          </div>
        </div>
        {/* Burger menu for mobile */}
        <div className="md:hidden">
          <button onClick={() => setShowMenu(!showMenu)}>
            <FiMenu />
          </button>
          {showMenu && (
            <div className="flex flex-col space-y-4">
              <Link href="/dashboard" className="text-eightColor">
                Dashboard
              </Link>
              <Link href="/tasks" className="text-eightColor">
                Tasks
              </Link>
              <Link href="/notifications" className="text-eightColor">
                Notifications
                {notificationCount > 0 && (
                  <span className="bg-eightColor text-forthColor rounded-full px-2 py-1 ml-2">
                    {notificationCount}
                  </span>
                )}
              </Link>
              <Link href="/profile" className="text-eightColor">
                Profile
              </Link>
              <Link onClick={handleLogout} href="/" className="text-eightColor">
                Log-out
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
