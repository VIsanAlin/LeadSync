"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import Navbar from "../../components/Navbar";

interface Task {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: Date;
  due_date: Date;
  assigned_to: string;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>("all");
  const tasksPerPage = 5;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase.from("tasks").select();
      if (error) throw error;

      // Parse due_date as Date object
      const tasksWithParsedDates = data.map((task) => ({
        ...task,
        due_date: new Date(task.due_date),
      }));

      setTasks(tasksWithParsedDates);
      setFilteredTasks(tasksWithParsedDates);
    } catch (error: any) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const filterTasks = (filter: string) => {
    const today = new Date();
    if (filter === "all") {
      setFilteredTasks(tasks);
    } else if (filter === "today") {
      setFilteredTasks(
        tasks.filter(
          (task) =>
            task.due_date &&
            task.due_date.getDate() === today.getDate() &&
            task.due_date.getMonth() === today.getMonth() &&
            task.due_date.getFullYear() === today.getFullYear()
        )
      );
    } else if (filter === "due") {
      setFilteredTasks(
        tasks.filter((task) => task.due_date && task.due_date < today)
      );
    }
    setFilter(filter);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const formatDate = (date: any) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 p-5 bg-firstColor text-eightColor">
        <div className="mb-5">
          <h1 className="text-3xl font-bold">Your Tasks</h1>
        </div>
        <div className="flex mb-3 space-x-3">
          <button
            className={`px-3 py-1 rounded-md ${
              filter === "all"
                ? "bg-forthColor text-white"
                : "bg-eightColor text-gray-800"
            }`}
            onClick={() => filterTasks("all")}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-md ${
              filter === "today"
                ? "bg-forthColor text-white"
                : "bg-eightColor text-gray-800"
            }`}
            onClick={() => filterTasks("today")}
          >
            Today
          </button>
          <button
            className={`px-3 py-1 rounded-md ${
              filter === "due"
                ? "bg-forthColor text-white"
                : "bg-eightColor text-gray-800"
            }`}
            onClick={() => filterTasks("due")}
          >
            Due
          </button>
        </div>
        <div>
          <ul className="space-y-4">
            {currentTasks.map((task) => (
              <li
                key={task.id}
                className="tasks-list bg-forthColor p-4 rounded-md shadow-md"
              >
                <Link href={`/tasks/${task.id}`}>
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
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-4">
            {Array.from({
              length: Math.ceil(filteredTasks.length / tasksPerPage),
            }).map((_, index) => (
              <button
                key={index}
                className={`mx-1 px-3 py-1 rounded-md ${
                  currentPage === index + 1
                    ? "bg-forthColor text-white"
                    : "bg-eightColor text-gray-800"
                }`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
