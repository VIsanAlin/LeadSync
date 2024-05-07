"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import AddProjectForm from "@/src/components/addProject";

interface Form {
  id: string;
  name: string;
  email: string;
  phone: string;
  uniquecode: string;
  status: string;
  budget: string;
  project_type: string;
  info_from: string;
  assigned_to: string;
  created_at: Date;
  end_date: Date;
  send_ad: boolean;
  notes: string;
}
interface User {
  id: string;
  role: string;
  name: string;
  phone: string;
  email: string;
}

const DashboardPage = () => {
  const [activeForms, setActiveForms] = useState(0);
  const [activeTasks, setActiveTasks] = useState(0);
  const [formsList, setFormsList] = useState<Form[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadID, setLeadID] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const formsPerPage = 10;
  const [assignPersonId, setAssignPersonId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [showAddProject, setShowAddProject] = useState(false);
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);
  const [statuses, setStatuses] = useState<string[]>([]);

  const [usersRole, setUsersRole] = useState<User[]>([]);
  const [checkedProjects, setCheckedProjects] = useState<string[]>([]);

  const formatDate = (date: any) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    fetchForms();
    fetchTasks();
    fetchStatuses();
    fetchUserRole();
  }, []);

  const fetchForms = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select()
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setFormsList(data);
      setActiveForms(data.length);
    } catch (error: any) {
      console.error("Error fetching forms:", error.message);
    }
  };
  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase.from("tasks").select();

      if (error) {
        throw error;
      }

      setActiveTasks(data.length);
    } catch (error: any) {
      console.error("Error fetching forms:", error.message);
    }
  };
  const fetchStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("status")
        .order("status", { ascending: true });

      if (error) {
        throw error;
      }

      const uniqueStatuses = Array.from(
        new Set(data.map((item: any) => item.status))
      ); // Extract unique statuses
      setStatuses(uniqueStatuses);
    } catch (error: any) {
      console.error("Error fetching statuses:", error.message);
    }
  };
  const fetchUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles_view")
        .select("*")
        .eq("role_name", "Member");

      if (error) {
        throw error;
      }

      setUsersRole(data || []);
      console.log(data);
    } catch (error: any) {
      console.error("Error fetching users with role 3:", error.message);
    }
  };
  const handleCheckboxChange = async (formId: string) => {
    const isChecked = checkedProjects.includes(formId);
    if (isChecked) {
      setCheckedProjects(checkedProjects.filter((id) => id !== formId));
    } else {
      setCheckedProjects([...checkedProjects, formId]);
    }
  };

  const handleFormClick = (id: string) => {
    setLeadID(id); // Set the clicked form ID to the state variable
  };
  const handleAssignClick = (form: Form) => {
    setSelectedForm(form);
  };
  const handleAssignPersonChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const userId = e.target.value;
    const selected = usersRole.find((user) => user.email === userId);
    if (selected) {
      console.log(selected);
      console.log(userId);
      setAssignPersonId(selected.user_id); // Save only the user_id into assignPersonId
    } else {
      console.error("User not found");
    }
  };

  const handleFilterStatusChange = (status: string | null) => {
    if (status === "") {
      // If "All" is selected, fetch all data
      fetchForms();
      setStatusFilter(null); // Reset status filter
    } else {
      // Otherwise, filter projects based on selected status
      setStatusFilter(status);
      filterProjects(status);
    }
  };

  // Filter projects based on assigned status
  const filterProjects = async (status: string) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select()
        .eq("status", status)
        .or(`assigned_to.is.null`);

      if (error) {
        throw error;
      }

      setFormsList(data || []);
      console.log(status);
      console.log(data);
      setCurrentPage(1); // Reset pagination to the first page
    } catch (error: any) {
      console.error("Error filtering projects:", error.message);
    }
  };

  // Assign person to project
  const handleAssignPerson = async () => {
    try {
      await Promise.all(
        checkedProjects.map(async (projectId) => {
          console.log(projectId);
          const { error } = await supabase
            .from("projects")
            .update({ assigned_to: assignPersonId }) // Change this to assignPersonId
            .eq("id", projectId);
          if (error) {
            throw error;
          }
        })
      );

      fetchForms();
      setCheckedProjects([]);
    } catch (error: any) {
      console.error("Error assigning person to project:", error.message);
    }
  };

  const filteredForms = formsList.filter((form) => {
    if (statusFilter) {
      return form.status === statusFilter;
    }
    return true;
  });

  //JSX Dropdown
  // JSX for the dropdown with status options
  const statusOptions = [
    ...statuses.map((status, index) => (
      <option key={index} value={status}>
        {status}
      </option>
    )),
  ];

  // JSX for the "Add" button
  const addButton = (
    <button
      className="ml-3 bg-forthColor text-eightColor hover:text-forthColor hover:bg-eightColor py-2 px-4 rounded"
      onClick={() => setShowAddProject(true)} // Toggle the modal display
    >
      Add Project
    </button>
  );

  // JSX for the checkbox to filter unassigned projects
  const unassignedCheckbox = (
    <label className="inline-flex items-center ml-3">
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 text-blue-600"
        checked={showUnassignedOnly}
        onChange={handleCheckboxChange}
      />
      <span className="ml-2 text-gray-700">Unassigned Only</span>
    </label>
  );

  // Render Users dropdown
  const renderUsersDropdown = () => {
    return (
      <select
        className="text-forthColor w-auto"
        onChange={handleAssignPersonChange}
      >
        <option value="">Select User</option>
        {usersRole.map((user) => (
          <option key={user.id} value={user.id}>
            {user.email}
          </option>
        ))}
      </select>
    );
  };

  // Calculate the index of the first and last forms to display on the current page
  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = formsList
    .filter((form) => (showUnassignedOnly ? !form.assigned_to : true))
    .slice(indexOfFirstForm, indexOfLastForm);

  // Function to handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 p-5 bg-firstColor text-eightColor">
        <div className="mb-5 flex ">
          <div className="bg-firstColor p-5 rounded-md shadow-md shadow-forthColor mr-5">
            <h2 className="text-lg font-semibold">Active Forms</h2>
            <p className="text-2xl font-bold">{activeForms}</p>
          </div>
          <div className="bg-firstColor p-5 rounded-md shadow-md shadow-forthColor">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <p className="text-2xl font-bold">{activeTasks}</p>
          </div>
        </div>
        <div className="mb-5">
          {/* Filters */}
          <div className="flex flex-col justify-between mb-3">
            <div className="flex p-3 items-center">
              <div className="bg-forthColor  rounded-md shadow-md mr-3 relative ">
                <select
                  className="outline-none border-none bg-forthColor text-white py-2 px-4 pr-8 rounded-md appearance-none"
                  onChange={(e) => {
                    handleFilterStatusChange(e.target.value);
                    filterProjects(e.target.value); // Filter projects based on selected status
                  }}
                >
                  <option value="">All</option>
                  {statusOptions}
                </select>
              </div>
              {addButton}
            </div>
            {unassignedCheckbox}
            {renderUsersDropdown()}
            <button onClick={handleAssignPerson}>Assign User</button>
          </div>
        </div>
        {/* Project list */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Projects</h2>
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
                {form.assigned_to === null && (
                  <input
                    type="checkbox"
                    checked={checkedProjects.includes(form.id)}
                    onChange={() => handleCheckboxChange(form.id)}
                  />
                )}
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
      {showAddProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className=" p-6 rounded-md shadow-md">
            <button
              className="absolute top-0 right-0 m-4 text-lg text-gray-500"
              onClick={() => setShowAddProject(false)}
            >
              &#x2715;
            </button>
            <AddProjectForm onCancel={() => setShowAddProject(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
