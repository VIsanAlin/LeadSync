import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

const AddProjectForm = ({ onCancel }) => {
  const [lastId, setLastId] = useState<number | null>(null);
  const [newProjectData, setNewProjectData] = useState({
    id: 0,
    name: "",
    email: "",
    phone: "",
    uniquecode: "",
    budget: "",
    project_type: "",
    info_from: "",
    send_ad: false,
    created_at: new Date(),
    status: "Nou",
    notes: "",
  });

  useEffect(() => {
    fetchLastId();
  }, []);

  const fetchLastId = async () => {
    try {
      const { data, error } = await supabase.from("projects").select("id");

      if (error) {
        throw error;
      }

      console.log("Data:", data);

      if (data && data.length > 0) {
        // Extract IDs from the data array
        const ids = data.map((item) => item.id);

        // Get the maximum ID from the array
        const lastIdFromData = Math.max(...ids);

        setLastId(lastIdFromData);
        console.log("Last ID from data:", lastIdFromData);

        // Set the new project's ID to the last ID + 1
        setNewProjectData((prevState) => ({
          ...prevState,
          id: lastIdFromData + 1,
        }));
        console.log("New project ID:", lastIdFromData + 1);
      }
    } catch (error: any) {
      console.error("Error fetching last project ID:", error.message);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // Send new project data to the backend for creation
      const { data, error } = await supabase
        .from("projects")
        .insert([newProjectData]);

      if (error) {
        throw error;
      }

      // Reset form data after successful submission
      setNewProjectData({
        id: lastId ? lastId + 1 : 0,
        name: "",
        email: "",
        phone: "",
        uniquecode: "",
        budget: "",
        project_type: "",
        info_from: "",
        send_ad: false,
        status: "Nou",
        created_at: new Date(),
        notes: "",
      });

      // Optionally, you can close the modal or perform any other actions
    } catch (error: any) {
      console.error("Error adding new project:", error.message);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setNewProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="bg-firstColor p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-eightColor">Add Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4 flex items-center">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-eightColor w-1/4"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter name"
            value={newProjectData.name}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md flex-grow text-eightColor"
          />
        </div>
        <div className="mb-4 flex items-center">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-eightColor w-1/4"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            value={newProjectData.email}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md flex-grow text-eightColor"
          />
        </div>
        <div className="mb-4 flex items-center">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-eightColor w-1/4"
          >
            Phone:
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="Enter phone"
            value={newProjectData.phone}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md flex-grow text-eightColor"
          />
        </div>
        <div className="mb-4 flex items-center">
          <label
            htmlFor="uniquecode"
            className="block text-sm font-medium text-eightColor w-1/4"
          >
            Unique Code:
          </label>
          <input
            type="text"
            id="uniquecode"
            name="uniquecode"
            placeholder="Enter unique code"
            value={newProjectData.uniquecode}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md flex-grow text-eightColor"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-eightColor w-1/4"
          >
            Budget:
          </label>
          <input
            type="text"
            id="budget"
            name="budget"
            placeholder="Enter budget"
            value={newProjectData.budget}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md flex-grow text-eightColor"
          />
        </div>
        <div className="mb-4 flex items-center">
          <label
            htmlFor="project_type"
            className="block text-sm font-medium text-eightColor w-1/4"
          >
            Project Type:
          </label>
          <input
            type="text"
            id="project_type"
            name="project_type"
            placeholder="Enter project type"
            value={newProjectData.project_type}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md flex-grow text-eightColor"
          />
        </div>
        <div className="mb-4 flex items-center">
          <label
            htmlFor="info_from"
            className="block text-sm font-medium text-eightColor w-1/4"
          >
            Info Form:
          </label>
          <input
            type="text"
            id="info_from"
            name="info_from"
            placeholder="Enter info form"
            value={newProjectData.info_from}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md flex-grow text-eightColor"
          />
        </div>

        <div className="flex justify-between">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium  text-red-500 rounded-md  hover:text-red-800"
            >
              Cancel
            </button>
          </div>
          <button
            type="submit"
            onClick={onCancel}
            className="ml-4 px-4 py-2 text-sm font-medium bg-forthColor text-eightColor rounded-md hover:text-forthColor hover:bg-eightColor"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProjectForm;
