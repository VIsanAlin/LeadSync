"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import Navbar from "../../components/Navbar";

interface Form {
  id: string;
  name: string;
  email: string;
  phone: string;
  uniquecode: string;
  status: string;
  budget: string;
  project_type: string;
  info_form: string;
  assigned_to: string;
  created_at: Date;
  end_date: Date;
  send_ad: boolean;
  notes: string;
}

const DashboardPage = () => {
  const [activeForms, setActiveForms] = useState(0);
  const [formsList, setFormsList] = useState<Form[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadID, setLeadID] = useState<string | null>(null);
  const formsPerPage = 10;

  const formatDate = (date: any) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleFormClick = (id: string) => {
    setLeadID(id); // Set the clicked form ID to the state variable
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const { data, error } = await supabase.from("projects").select();

      if (error) {
        throw error;
      }

      setFormsList(data);
      setActiveForms(data.length);
    } catch (error: any) {
      console.error("Error fetching forms:", error.message);
    }
  };

  // Calculate the index of the first and last forms to display on the current page
  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = formsList.slice(indexOfFirstForm, indexOfLastForm);

  // Function to handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 p-5 bg-firstColor text-eightColor">
        <div className="mb-5">
          <h1 className="text-3xl font-bold">Welcome to your Dashboard!</h1>
        </div>
        <div className="flex mb-5 space-x-5">
          <div className="bg-firstColor p-5 rounded-md shadow-md shadow-forthColor">
            <h2 className="text-lg font-semibold">Active Forms</h2>
            <p className="text-2xl font-bold">{activeForms}</p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">Forms</h2>
          <ul>
            {currentForms.map((form) => (
              <li
                key={form.id}
                className="rounded-lg shadow-md shadow-forthColor p-4"
                onClick={() => handleFormClick(form.id)}
              >
                <Link href={`/dashboard/${form.id}`}>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-semibold">{form.name}</p>
                      <p className="text-sm text-gray-300">{form.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">
                        Created at: {formatDate(form.created_at)}
                      </p>
                      <p className="text-sm text-gray-300">
                        Assigned to: {form.assigned_to}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {/* Pagination controls */}
          <div className="flex justify-center mt-4">
            {Array.from({
              length: Math.ceil(formsList.length / formsPerPage),
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

export default DashboardPage;
