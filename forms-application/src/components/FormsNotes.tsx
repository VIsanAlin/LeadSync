import React from "react";
import { supabase } from "@/utils/supabase";
import { useState, useEffect } from "react";

interface Note {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: Date;
}
interface User {
  id: string;
  role: string;
  name: string;
  phone: string;
  email: string;
}
interface NotesComponentProps {
  notes: Note[] | Note; // Accept either an array of notes or a single note
}

const formatDate = (date: Date): string => {
  // Convert the date to a string without timezone offset
  const dateString = date.toLocaleString("en-US", {
    timeZone: "UTC", // Use UTC timezone
    hour12: false, // Use 24-hour clock format
  });

  // Format options for the date
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
  };

  // Format the date without the timezone offset
  return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
};

const NotesComponent: React.FC<NotesComponentProps> = ({ notes }) => {
  const [usersRole, setUsersRole] = useState<User[]>([]);

  useEffect(() => {
    fetchUserRole();
  }, [notes]);
  const fetchUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles_view")
        .select("*");

      if (error) {
        throw error;
      }

      setUsersRole(data || []);
      console.log(data);
    } catch (error: any) {
      console.error("Error fetching users with role 3:", error.message);
    }
  };
  const getUserEmailById = (userId: string) => {
    const user = usersRole.find((user) => user.user_id === userId);
    console.log(user);
    console.log(usersRole);
    // Return the user's email if found, otherwise return an empty string
    return user ? user.email : "";
  };
  // Check if notes is an array
  if (Array.isArray(notes)) {
    return (
      <div className="bg-firstColor shadow-lg text-forthColor p-4">
        <div>
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-forthColor text-eightColor rounded-xl mb-4 p-4" // Added padding here
            >
              <div className="flex justify-between items-center mb-2">
                <div>{getUserEmailById(note.created_by)}</div>
                <div>{formatDate(note.created_at)}</div>
              </div>
              <p className="text-lg">{note.title}</p>
              <p className="text-sm">{note.description}</p>
            </div>
          ))}
        </div>
        {/* Add input field for adding new notes */}
      </div>
    );
  } else if (notes) {
    // If notes is a single note object
    return (
      <div className=" bg-firstColor shadow-lg text-forthColor p-4">
        <div className="bg-forthColor text-eightColor rounded-xl mb-4 p-4">
          <div className="flex justify-between items-center mb-2">
            <div>{notes.created_by}</div>
            <div>{formatDate(notes.created_at)}</div>
          </div>
          <p>{notes.title}</p>
          <p>{notes.description}</p>
        </div>
        {/* Add input field for adding new notes */}
      </div>
    );
  } else {
    return <div>No notes available</div>; // Handle case where notes is null or undefined
  }
};
export default NotesComponent;
