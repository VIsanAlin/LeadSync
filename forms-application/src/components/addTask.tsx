import { useState, useRef, useEffect } from "react";
import { supabase } from "@/utils/supabase";

interface AddTaskPageProps {
  leadID: string;
  onClose: () => void;
}

const AddTaskPage = ({ leadID, onClose }: AddTaskPageProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState(""); // Assuming this is a user ID or name

  const formRef = useRef(null);
  useEffect(() => {
    // Function to close the modal when clicking outside the form
    const handleOutsideClick = (event: any) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose(); // Close the modal
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleOutsideClick);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(name, description, status, leadID);
    try {
      // Send task data to backend
      await supabase.from("tasks").insert([
        {
          name: name, // Set to NULL if empty
          description: description, // Set to NULL if empty
          due_date: new Date(dueDate), // Convert dueDate to Date object or NULL if empty
          status: status, // Set to NULL if empty
          created_at: new Date(), // Use current date and time
          project_id: leadID,
          assigned_to: assignedTo || null, // Set to NULL if empty
        },
      ]);
      // Redirect or handle success
    } catch (error: any) {
      console.error("Error adding task:", error.message);
    }
  };

  return (
    <div ref={formRef} className="bg-firstColor p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-eightColor">Add Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg text-eightColor">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 text-eightColor"
          />
        </div>
        <div>
          <label className="block text-lg text-eightColor">Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 text-eightColor"
          />
        </div>
        <div>
          <label className="block text-lg text-eightColor">Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 text-eightColor"
          />
        </div>
        <div>
          <label className="block text-lg text-eightColor">Status:</label>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 text-eightColor"
          />
        </div>
        <div>
          <label className="block text-lg text-eightColor">Assigned To:</label>
          <input
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 text-eightColor"
          />
        </div>
        <button
          type="submit"
          className="bg-forthColor hover:bg-sixColor text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddTaskPage;
