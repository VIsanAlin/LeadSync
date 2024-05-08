import React from "react";
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

interface TasksListProps {
  tasks: Task[] | Task; // Accept either an array of tasks or a single task
}

const TasksList: React.FC<TasksListProps> = ({ tasks }) => {
  const handleWhatsAppClick = (phoneNumber: string, taskName: string) => {
    const encodedMessage = encodeURIComponent(
      `Buna ziua, v-am trimis pe email informațiile necesare pentru a putea accesa fonduri pentru proiectul dumneavoastra.`
    );
    window.open(
      `https://api.whatsapp.com/send/?phone=40727819985&text=${encodedMessage}&type=phone_number&app_absent=0`,
      "_blank"
    );
  };

  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Check if tasks is an array
  // Check if tasks is an array
  if (Array.isArray(tasks)) {
    return (
      <div className="bg-firstColor shadow-lg text-forthColor p-4">
        <div>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-secondColor text-eightColor rounded-xl mb-4 p-4 shadow-md"
            >
              <h3 className="text-lg font-semibold">{task.name}</h3>
              <p className="text-eightColor">{task.description}</p>
              <p className="text-eightColor">
                <strong>Due Date:</strong>{" "}
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-eightColor">
                <strong>Status:</strong> {task.status}
              </p>
              {/* WhatsApp and Copy buttons with icons */}
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleWhatsAppClick(task.phoneNumber, task.name)
                  }
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                >
                  <FiMessageSquare /> {/* WhatsApp icon */}
                  <span className="ml-2">WhatsApp</span>
                </button>
                <button
                  onClick={() => handleCopyClick(task.description)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                >
                  <FiCopy /> {/* Copy icon */}
                  <span className="ml-2">Copy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (tasks) {
    // If tasks is a single task object
    return (
      <div className="bg-firstColor shadow-lg text-forthColor p-4">
        <h2 className="text-lg font-semibold mb-4">Tasks</h2>
        <div className="bg-secondColor shadow-lg text-thirdColor p-4">
          <div
            className="bg-thirdColor text-secondColor rounded-xl mb-4 p-4"
            key={tasks.id}
          >
            <h3 className="text-lg font-semibold">{tasks.name}</h3>
            <p className="text-thirdColor">{tasks.description}</p>
            <p className="text-thirdColor">
              <strong>Due Date:</strong>{" "}
              {tasks.due_date
                ? new Date(tasks.due_date).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-thirdColor">
              <strong>Status:</strong> {tasks.status}
            </p>
            {/* WhatsApp and Copy buttons with icons */}
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  handleWhatsAppClick(tasks.phoneNumber, tasks.name)
                }
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
              >
                <FiMessageSquare /> {/* WhatsApp icon */}
                <span className="ml-2">WhatsApp</span>
              </button>
              <button
                onClick={() => handleCopyClick(tasks.description)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
              >
                <FiCopy /> {/* Copy icon */}
                <span className="ml-2">Copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-firstColor shadow-lg text-forthColor p-4">
        No tasks available
      </div>
    ); // Handle case where tasks is null or undefined
  }
};

export default TasksList;
