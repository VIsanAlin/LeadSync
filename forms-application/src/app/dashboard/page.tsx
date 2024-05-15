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
  user_id: string;
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
  const handleUnasignedChange = async () => {
    setShowUnassignedOnly(!showUnassignedOnly); // Toggle the state

    try {
      let { data, error } = await supabase
        .from("projects")
        .select()
        .is("assigned_to", null); // Fetch projects where assigned_to is null

      if (error) {
        throw error;
      }

      if (!showUnassignedOnly) {
        // If checkbox is checked, filter unassigned projects
        setFormsList(data || []);
      } else {
        // If checkbox is unchecked, fetch all projects
        fetchForms();
      }
    } catch (error: any) {
      console.error("Error fetching unassigned projects:", error.message);
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
      setAssignPersonId(selected.user_id); // Save only the user_id into assignPersonId
    } else {
      console.error("User not found");
    }
  };
  const getUserEmailById = (userId: string) => {
    const user = usersRole.find((user) => user.user_id === userId);

    // Return the user's email if found, otherwise return an empty string
    return user ? user.email : "";
  };

  const handleFilterStatusChange = (status: string | null) => {
    if (status === "") {
      // If "All" is selected, fetch all data
      fetchForms();
      setStatusFilter(null); // Reset status filter
    } else {
      // Otherwise, filter projects based on selected status
      setStatusFilter(status);
      filterProjects(status ?? "");
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

  const getStatusCircleSizeClass = (status: string) => {
    if (status.length <= 4) {
      return "h-8 w-12";
    } else if (status.length <= 8) {
      return "h-6 w-20";
    } else {
      return "h-8 w-36";
    }
  };

  const filteredForms = formsList.filter((form) => {
    if (statusFilter) {
      return form.status === statusFilter;
    }
    return true;
  });

  const statusOptions = statuses.map((status, index) => (
    <option key={index} value={status}>
      {status}
    </option>
  ));

  // JSX for the "Add" button
  const addButton = (
    <button
      className="text-xs ml-3 bg-forthColor text-white hover:bg-eightColor hover:text-forthColor py-2 px-4 rounded border-none transition-colors "
      onClick={() => setShowAddProject(true)} // Toggle the modal display
      style={{ height: "2.5rem" }} // Set height to match dropdown
    >
      Add Form
    </button>
  );

  // JSX for the checkbox to filter unassigned projects
  const unassignedCheckbox = (
    <label
      className="inline-flex items-center ml-3"
      style={{ height: "2.5rem" }}
    >
      <input
        type="checkbox"
        className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        checked={showUnassignedOnly}
        onChange={handleUnasignedChange}
      />
      <span className="ml-2 text-eightColor">Unassigned Only</span>
    </label>
  );

  // Render Users dropdown
  const renderUsersDropdown = () => (
    <select
      className="outline-none border-none bg-forthColor text-white py-2 px-4 pr-8 rounded-md appearance-none mb-3"
      onChange={handleAssignPersonChange}
      style={{ height: "2.5rem" }} // Set height to match dropdown
    >
      <option value="">Select User</option>
      {usersRole.map((user) => (
        <option key={user.id} value={user.id}>
          {user.email}
        </option>
      ))}
    </select>
  );

  // JSX for the status dropdown
  const statusDropdown = (
    <select
      className="outline-none border-none bg-forthColor text-white py-2 px-4 pr-8 rounded-md appearance-none mb-3"
      onChange={(e) => {
        handleFilterStatusChange(e.target.value);
        filterProjects(e.target.value); // Filter projects based on selected status
      }}
      style={{ height: "2.5rem" }} // Set height to match other dropdowns
    >
      <option value="">All</option>
      {statusOptions}
    </select>
  );

  // Calculate the index of the first and last forms to display on the current page
  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = formsList
    .filter((form) => (showUnassignedOnly ? !form.assigned_to : true))
    .slice(indexOfFirstForm, indexOfLastForm);

  // Function to handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <Navbar />
      <div className="flex-1 p-4 bg-firstColor text-eightColor">
        <div className="mb-5 flex justify-between">
          <div className="mb-5">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <h2 className="text-lg font-semibold">Here Are Your Forms</h2>
          </div>
          <div className="flex flex-col">
            <div className="mb-2 text-right">
              <h3 className="text-xl font-bold">Agent</h3>
              <p className="text-lg">
                {getUserEmailById(localStorage.getItem("userId") ?? "")}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-5 flex ">
          <div className="bg-firstColor p-2 rounded-md shadow-md shadow-forthColor mr-5">
            <h2 className="text-lg font-semibold">Active Forms</h2>
            <p className="text-2xl font-bold text-center">{activeForms}</p>
          </div>
          <div className="bg-firstColor p-2 rounded-md shadow-md shadow-forthColor">
            <h2 className="text-lg font-semibold">Active Tasks</h2>
            <p className="text-2xl font-bold text-center">{activeTasks}</p>
          </div>
        </div>
        {/* Filters and Action Buttons */}
        <div className="flex flex-col justify-between items-start  mb-5 mr-5">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row">
              {statusDropdown}
              {addButton}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center">
                {renderUsersDropdown()}
                <button
                  className="text-xs bg-forthColor text-white hover:bg-eightColor hover:text-forthColor py-2 px-4  mb-3 ml-3 rounded border-none transition-colors"
                  onClick={handleAssignPerson}
                  style={{ height: "2.5rem" }} // Set height to match other buttons
                >
                  Assign User
                </button>
              </div>
            </div>
          </div>
          <div className="py-4">{unassignedCheckbox}</div>
        </div>

        {/* Project list */}
        <div>
          <h2 className="text-lg font-semibold mb-3">List with all Forms</h2>
          <ul>
            {currentForms.map((form) => (
              <li
                key={form.id}
                className="flex items-center rounded-lg shadow-md shadow-forthColor p-4 mb-4 cursor-pointer"
                onClick={() => handleFormClick(form.id)}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={checkedProjects.includes(form.id)}
                  onChange={() => handleCheckboxChange(form.id)}
                />
                {/* Information */}
                <Link href={`/dashboard/${form.id}`}>
                  <div className="flex items-center">
                    {/* Status */}
                    <div
                      className={`rounded-full mr-3 bg-forthColor flex items-center justify-center ${getStatusCircleSizeClass(
                        form.status
                      )}`}
                    >
                      <p className="text-white text-sm font-semibold">
                        {form.status}
                      </p>
                    </div>
                    {/* Name */}
                    <div>
                      <p className="text-lg font-semibold">{form.name}</p>
                      {/* Adjusted Assigned To */}
                      <p className="text-sm text-eightColor">
                        Assigned to: {getUserEmailById(form.assigned_to)}
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
      {showAddProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="md:w-1/2 lg:w-1/3 xl:w-1/4  rounded-md shadow-md shadow-white">
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
