"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import Navbar from "@/src/components/Navbar";

interface Notification {
  id: string;
  title: string;
  description: string;
  end_date: Date;
}

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>("all");
  const notificationsPerPage = 10;

  const formatDate = (date: any) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [notifications, filter]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase.from("notification").select();

      if (error) {
        throw error;
      }

      setNotifications(
        data.map((notification) => ({
          ...notification,
          end_date: new Date(notification.end_date), // Parse end_date as Date object
        }))
      );
    } catch (error: any) {
      console.error("Error fetching notifications:", error.message);
      setError("Error fetching notifications");
    }
  };

  const applyFilter = () => {
    let filteredData = [...notifications];

    if (filter === "today") {
      filteredData = filteredData.filter((notification) => {
        const today = new Date();
        const notificationDate = new Date(notification.end_date);
        return (
          notificationDate.getDate() === today.getDate() &&
          notificationDate.getMonth() === today.getMonth() &&
          notificationDate.getFullYear() === today.getFullYear()
        );
      });
    } else if (filter === "due") {
      filteredData = filteredData.filter((notification) => {
        const today = new Date();
        const notificationDate = new Date(notification.end_date);
        return notificationDate < today;
      });
    }

    setFilteredNotifications(filteredData);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  // Calculate the index of the first and last notifications to display on the current page
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification =
    indexOfLastNotification - notificationsPerPage;
  const currentNotifications = filteredNotifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  );

  // Function to handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 p-5 bg-firstColor text-eightColor">
        <div className="mb-5">
          <h1 className="text-3xl font-bold">Notifications</h1>
        </div>
        <div className="flex mb-3 space-x-3">
          <button
            className={`px-3 py-1 rounded-md ${
              filter === "all"
                ? "bg-forthColor text-white"
                : "bg-eightColor text-gray-800"
            }`}
            onClick={() => handleFilterChange("all")}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-md ${
              filter === "today"
                ? "bg-forthColor text-white"
                : "bg-eightColor text-gray-800"
            }`}
            onClick={() => handleFilterChange("today")}
          >
            Today
          </button>
          <button
            className={`px-3 py-1 rounded-md ${
              filter === "due"
                ? "bg-forthColor text-white"
                : "bg-eightColor text-gray-800"
            }`}
            onClick={() => handleFilterChange("due")}
          >
            Due
          </button>
        </div>
        <div>
          <ul>
            {currentNotifications.map((notification) => (
              <li
                key={notification.id}
                className="rounded-lg shadow-md shadow-forthColor p-4"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-lg font-semibold">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-300">
                      {notification.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">
                      End Date: {formatDate(notification.end_date)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {/* Pagination controls */}
          <div className="flex justify-center mt-4">
            {Array.from({
              length: Math.ceil(
                filteredNotifications.length / notificationsPerPage
              ),
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

export default NotificationPage;
