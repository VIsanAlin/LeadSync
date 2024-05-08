"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NotesComponent from "../../../components/FormsNotes";
import { supabase } from "@/utils/supabase";
import Navbar from "@/src/components/Navbar";
import { FiMessageSquare, FiCopy } from "react-icons/fi";

interface Task {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: Date;
  due_date: Date;
  assigned_to: string;
}
interface Note {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: Date;
}

const TaskPage = () => {
  const path = usePathname();
  const parts = path.split("/");
  const id = parts[parts.length - 1];

  const [task, setTask] = useState<Task | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (id) {
      fetchTask(id);
      fetchNotes(id);
    }
  }, [id]);

  const fetchTask = async (taskId: string) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select()
        .eq("id", taskId)
        .single();

      if (error) throw error;
      setTask(data);
    } catch (error: any) {
      console.error("Error fetching task:", error.message);
    }
  };

  const fetchNotes = async (taskId: string) => {
    try {
      const { data, error } = await supabase
        .from("task_notes")
        .select()
        .eq("task_id", taskId);
      if (error) throw error;
      setNotes(data);
    } catch (error: any) {
      console.error("Error fetching notes:", error.message);
    }
  };

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(
      `Task Details:\nName: ${task?.name || "No information"}\nDescription: ${
        task?.description || "No information"
      }\nCreated At: ${
        task?.created_at?.toLocaleString() || "No information"
      }\nDue Date: ${
        task?.due_date?.toLocaleString() || "No information"
      }\nAssigned To: ${task?.assigned_to || "No information"}\nStatus: ${
        task?.status || "No information"
      }`
    );
    window.open(
      `https://api.whatsapp.com/send/?phone=PHONE_NUMBER&text=${encodedMessage}`,
      "_blank"
    );
  };

  const handleCopyClick = () => {
    const textToCopy = `Task Details:\nName: ${
      task?.name || "No information"
    }\nDescription: ${task?.description || "No information"}\nCreated At: ${
      task?.created_at?.toLocaleString() || "No information"
    }\nDue Date: ${
      task?.due_date?.toLocaleString() || "No information"
    }\nAssigned To: ${task?.assigned_to || "No information"}\nStatus: ${
      task?.status || "No information"
    }`;
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <Navbar />
      <div className="flex-1 p-5 bg-firstColor">
        <div className="container mx-auto p-6 bg-firstColor shadow-md rounded-md">
          <div className="grid grid-cols-2 gap-6">
            {/* Left side: Task Details */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Task Details</h2>
              {task ? (
                <div className="bg-forthColor p-4 rounded-md mb-6">
                  <div className="flex mb-2">
                    <div className="bg-coloreight rounded-md p-2">
                      <p className="text-lg text-eightColor">Name:</p>
                    </div>
                    <p className="text-lg rounded-md p-2 ">
                      {task.name || "No information"}
                    </p>
                  </div>
                  <div className="flex mb-2">
                    <div className="bg-coloreight rounded-md p-2">
                      <p className="text-lg text-eightColor">Description:</p>
                    </div>
                    <p className="text-lg rounded-md p-2 ">
                      {task.description || "No information"}
                    </p>
                  </div>
                  <div className="flex mb-2">
                    <div className="bg-coloreight rounded-md p-2">
                      <p className="text-lg text-eightColor">Created At:</p>
                    </div>
                    <p className="text-lg rounded-md p-2 ">
                      {task.created_at
                        ? new Date(task.created_at).toLocaleString()
                        : "No information"}
                    </p>
                  </div>
                  <div className="flex mb-2">
                    <div className="bg-coloreight rounded-md p-2">
                      <p className="text-lg text-eightColor">Due Date:</p>
                    </div>
                    <p className="text-lg rounded-md p-2 ">
                      {task.due_date
                        ? new Date(task.due_date).toLocaleString()
                        : "No information"}
                    </p>
                  </div>
                  <div className="flex mb-2">
                    <div className="bg-coloreight rounded-md p-2">
                      <p className="text-lg text-eightColor">Assigned To:</p>
                    </div>
                    <p className="text-lg rounded-md p-2 ">
                      {task.assigned_to || "No information"}
                    </p>
                  </div>
                  <div className="flex mb-2">
                    <div className="bg-coloreight rounded-md p-2">
                      <p className="text-lg text-eightColor">Status:</p>
                    </div>
                    <p className="text-lg rounded-md p-2 ">
                      {task.status || "No information"}
                    </p>
                  </div>
                  {/* WhatsApp and Copy buttons with icons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={handleWhatsAppClick}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                    >
                      <FiMessageSquare /> {/* WhatsApp icon */}
                      <span className="ml-2">WhatsApp</span>
                    </button>
                    <button
                      onClick={handleCopyClick}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                    >
                      <FiCopy /> {/* Copy icon */}
                      <span className="ml-2">Copy</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p>No task information available</p>
              )}
            </div>
            {/* Right side: Notes */}
            <div>
              <div className="bg-forthColor p-4 rounded-md shadow-md">
                <h2 className="text-lg font-semibold mb-4">Notes</h2>
                <NotesComponent notes={notes} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
