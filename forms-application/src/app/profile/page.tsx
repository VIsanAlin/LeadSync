"use client";
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import Navbar from "@/src/components/Navbar";

interface User {
  id: string;
  aud: string;
  role?: string;
  email?: string;
  email_confirmed_at?: string;
  // Add other properties as needed
}

interface UserData {
  user_id: string;
  name: string; // Assuming you have a 'name' field in your users_ext table
  email: string; // Assuming you have an 'email' field in your users_ext table
  phoneNumber: string; // Assuming you have a 'phonenumber' field in your users_ext table
  // Add other properties as needed
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [newEmail, setNewEmail] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          throw new Error("User not found");
        }
        setUser(data.user);
        fetchAdditionalUserData(data.user.id);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  const fetchAdditionalUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users_ext")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        throw new Error("Error fetching additional user data");
      }
      if (data.length > 0) {
        setUserData(data[0]);
      } else {
        setUserData(null); // No additional user data found
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("users_ext")
        .update({
          name: newName,
          email: newEmail,
          phoneNumber: newPhoneNumber,
        })
        .eq("user_id", userData?.user_id);

      if (error) {
        throw new Error("Error updating user data");
      }

      setUserData(data);
      setShowEditModal(false); // Close the edit modal after successful update
    } catch (error: any) {
      setError(error.message);
    }
  };

  const openEditModal = () => {
    setShowEditModal(true);
    setNewName(userData?.name || "");
    setNewEmail(userData?.email || "");
    setNewPhoneNumber(userData?.phoneNumber || "");
  };

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 p-5 bg-firstColor">
        <div className="container mx-auto p-6 bg-firstColor shadow-md rounded-md">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="bg-forthColor p-4 rounded-md">
              <div className="flex mb-2">
                <div className="bg-coloreight rounded-md p-2">
                  <p className="text-lg text-eightColor">Name:</p>
                </div>
                <p className="text-lg rounded-md p-2">
                  {userData ? userData.name : "No name"}
                </p>
              </div>
              <div className="flex mb-2">
                <div className="bg-coloreight rounded-md p-2">
                  <p className="text-lg text-eightColor">Email:</p>
                </div>
                <p className="text-lg rounded-md p-2">
                  {userData ? userData.email : "No email"}
                </p>
              </div>
              <div className="flex mb-2">
                <div className="bg-coloreight rounded-md p-2">
                  <p className="text-lg text-eightColor">Phone Number:</p>
                </div>
                <p className="text-lg rounded-md p-2">
                  {userData ? userData.phoneNumber : "No phone number"}
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={openEditModal}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-firstColor p-6 rounded-md shadow-md">
            <button
              className="absolute top-0 right-0 m-4 text-lg text-gray-500"
              onClick={() => setShowEditModal(false)}
            >
              &#x2715;
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 text-eightColor"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                type="email"
                className="border border-gray-300 rounded-md px-3 py-2 text-eightColor"
                placeholder="Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 text-eightColor"
                placeholder="Phone Number"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleEditProfile}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
