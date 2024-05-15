"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import TasksList from "../../../components/Tasks";
import NotesComponent from "../../../components/FormsNotes";
import { supabase } from "@/utils/supabase";
import Navbar from "@/src/components/Navbar";
import AddTaskPage from "@/src/components/addTask";

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
interface Task {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: Date;
  created_by: string;
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
interface User {
  id: string;
  user_id: string;
  role: string;
  name: string;
  phone: string;
  email: string;
}
const FormDetailsPage = () => {
  const path = usePathname();
  const parts = path.split("/");
  const id = parts[parts.length - 1];

  const [formDetails, setFormDetails] = useState<Form | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [description, setDescription] = useState("");
  const [usersRole, setUsersRole] = useState<User[]>([]);
  const modalRef = useRef(null);
  let whatsappMessage;

  useEffect(() => {
    if (id) {
      fetchFormDetails(id);
      fetchTasks(id);
      fetchNotes(id);
      fetchUserRole();
    }
  }, [id]);

  useEffect(() => {
    // Function to close the modal when clicking outside
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && event.target !== modalRef.current) {
        setShowStatusModal(false);
      }
    };

    // Add event listener when modal is shown
    if (showStatusModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    // Remove event listener when modal is hidden
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showStatusModal]);

  console.log(selectedStatus);
  const fetchFormDetails = async (formId: string) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select()
        .eq("id", formId)
        .single();
      if (error) throw error;
      setFormDetails(data);
    } catch (error: any) {
      console.error("Error fetching form details:", error.message);
    }
  };

  const fetchTasks = async (formId: string) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select()
        .eq("project_id", formId); // Use 'project_id' instead of 'id'

      if (error) throw error;
      setTasks(data);
    } catch (error: any) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const fetchNotes = async (formId: string) => {
    try {
      const { data, error } = await supabase
        .from("project_notes")
        .select()
        .eq("project_id", formId); // Use 'project_id' instead of 'id'

      if (error) throw error;
      setNotes(data);
    } catch (error: any) {
      console.error("Error fetching notes:", error.message);
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

  const handleAddTaskClick = () => {
    setShowAddTaskModal(true);
  };
  const closeAddTaskModal = () => {
    setShowAddTaskModal(false);
  };
  const handleStatusClick = async (status: string) => {
    try {
      // Update status in 'projects' table
      await supabase.from("projects").update({ status: status }).eq("id", id);

      // Add a new task without specifying the 'id' field
      let taskDescription = "";
      let taskEndDate;

      switch (status) {
        case "Does not respond":
          taskDescription =
            "Follow up with a friendly reminder via WhatsApp in the next hour. Hey [Lead's Name], just wanted to check in to see if you had any questions or needed further assistance. Let me know if there's anything I can help you with!";
          taskEndDate = calculateEndDate("Does not respond");
          whatsappMessage =
            "Hey [Lead's Name], just wanted to check in to see if you had any questions or needed further assistance. Let me know if there's anything I can help you with!";
          break;
        case "Accessing funds":
          taskDescription =
            "Provide necessary documentation and information to facilitate accessing funds.Hi [Lead's Name], hope you're doing well! I'm reaching out to provide you with the information you need to access the funds. Please let me know if you have any questions or if there's anything else I can assist you with.";
          taskEndDate = calculateEndDate("Accessing funds");
          whatsappMessage =
            "Hi [Lead's Name], hope you're doing well! I'm reaching out to provide you with the information you need to access the funds. Please let me know if you have any questions or if there's anything else I can assist you with.";
          break;
        case "Spam":
          taskDescription =
            "Remove this lead from the system to maintain data integrity.";
          taskEndDate = calculateEndDate("Spam");
          break;
        case "Is not interested":
          taskDescription =
            "Engage the lead in a conversation to understand their concerns and objections.Hi [Lead's Name], I noticed that you're not interested in our services/products at the moment. I'd love to understand more about your needs and concerns to see if there's anything we can do to assist you better. Could we schedule a quick call to discuss further?";
          taskEndDate = calculateEndDate("Not interested");
          whatsappMessage =
            "Hi [Lead's Name], I noticed that you're not interested in our services/products at the moment. I'd love to understand more about your needs and concerns to see if there's anything we can do to assist you better. Could we schedule a quick call to discuss further?";
          break;
        case "Waiting funds":
          taskDescription =
            "Check in with the lead to see if they have received the necessary funds.Hello [Lead's Name], just wanted to touch base regarding the funds. Have you received them yet? Please let me know if there's anything I can assist you with!";
          taskEndDate = calculateEndDate("Waiting funds");
          whatsappMessage =
            "Hello [Lead's Name], just wanted to touch base regarding the funds. Have you received them yet? Please let me know if there's anything I can assist you with!";
          break;
        default:
          break;
      }

      if (taskDescription && taskEndDate) {
        await supabase.from("tasks").insert({
          name: status,
          description: taskDescription,
          due_date: new Date(taskEndDate),
          status: "Nou",
          created_at: new Date(),
          project_id: id,
          assigned_to: formDetails?.assigned_to || null,
        });
      }

      // Add a new notification without specifying the 'id' field
      await supabase.from("notification").insert({
        project_id: id,
        title: status,
        description: taskDescription,
        created_at: new Date(),
        end_date: taskEndDate || new Date(), // Use taskEndDate if available
        assigned_to: formDetails?.assigned_to || null,
      });

      await supabase.from("project_notes").insert({
        project_id: id,
        title: "Status change",
        description: `SYSTEM: Status change to ${status}`,
        created_by: localStorage.getItem("userId"),
        created_at: new Date(),
      });

      // Close the status modal
      setShowStatusModal(false);
    } catch (error: any) {
      console.error("Error updating status:", error.message);
    }
  };

  const handleAddNote = async () => {
    if (!description) return; // Don't add empty notes

    await supabase.from("project_notes").insert({
      project_id: id,
      description: description,
      created_by: localStorage.getItem("userId"),
      created_at: new Date(),
    });

    // Clear the description field after adding the note
    setDescription("");
  };

  const getUserEmailById = (userId: string) => {
    const user = usersRole.find((user) => user.user_id === userId);

    // Return the user's email if found, otherwise return an empty string
    return user ? user.email : "";
  };

  const calculateEndDate = (status: string): Date => {
    // Logic to calculate end date based on status
    const currentDate = new Date();
    switch (status) {
      case "Does not respond":
        return new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days later
      case "Accessing funds":
        return new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days later
      case "Spam":
        return new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days later
      case "Not interested":
        return new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000); // 1 days later
      case "Waiting funds":
        return new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days later
      default:
        return currentDate;
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <Navbar />
      <div className="flex-1 p-4 bg-firstColor">
        <div className="container mx-auto p-6 bg-firstColor shadow-md rounded-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side: Form and Tasks */}
            <div>
              {/* Form Details */}
              <div className="bg-firstColor p-4 rounded-md  mb-6">
                <h1 className="text-2xl font-bold mb-4">Form Details</h1>
                {formDetails && (
                  <div className="mt-4">
                    <div className="flex mb-2">
                      <div className="bg-coloreight rounded-md p-2">
                        <p className="text-lg text-eightColor">Name:</p>
                      </div>
                      <p className="text-lg  rounded-md p-2 ">
                        {formDetails.name || "No information"}
                      </p>
                    </div>
                    <div
                      className="flex mb-2"
                      onClick={() => {
                        // Update status here
                        setShowStatusModal(true);
                      }}
                    >
                      <div className="bg-coloreight rounded-md p-2">
                        <p className="text-lg text-eightColor">Status:</p>
                      </div>
                      <p className="bg-forthColor p-2 px-8 rounded-md text-lg  cursor-pointer">
                        {formDetails.status || "No information"}
                      </p>
                    </div>
                    <div className="flex mb-2">
                      <div className="bg-coloreight rounded-md p-2">
                        <p className="text-lg text-eightColor">Email:</p>
                      </div>
                      <p className="text-lg  rounded-md p-2 ">
                        {formDetails.email || "No information"}
                      </p>
                    </div>
                    <div className="flex  mb-2">
                      <div className="bg-coloreight rounded-md p-2">
                        <p className="text-lg text-eightColor">Phone:</p>
                      </div>
                      <p className="text-lg  rounded-md p-2 ">
                        {formDetails.phone || "No information"}
                      </p>
                    </div>
                    <div className="flex mb-2">
                      <div className="bg-coloreight rounded-md p-2">
                        <p className="text-lg text-eightColor">Unique Code:</p>
                      </div>
                      <p className="text-lg  rounded-md p-2 ">
                        {formDetails.uniquecode || "No information"}
                      </p>
                    </div>
                    <div className="flex mb-2">
                      <div className="bg-coloreight rounded-md p-2 ">
                        <p className="text-lg text-eightColor">Budget:</p>
                      </div>
                      <p className="text-lg  rounded-md p-2 ">
                        {formDetails.budget || "No information"}
                      </p>
                    </div>
                    <div className="flex mb-2">
                      <div className="bg-coloreight rounded-md p-2 ">
                        <p className="text-lg text-eightColor">Project Type:</p>
                      </div>
                      <p className="text-lg  rounded-md p-2 ">
                        {formDetails.project_type || "No information"}
                      </p>
                    </div>

                    <div className="flex mb-2">
                      <div className="bg-coloreight rounded-md p-2 ">
                        <p className="text-lg text-eightColor">Created At:</p>
                      </div>
                      <p className="text-lg rounded-md p-2 ">
                        {formDetails.created_at
                          ? new Date(
                              formDetails.created_at
                            ).toLocaleDateString()
                          : "No information"}
                      </p>
                    </div>
                    <div className="flex mb-2">
                      <div className="bg-coloreight rounded-md p-2 ">
                        <p className="text-lg text-eightColor">Assigned To:</p>
                      </div>
                      <p className="text-lg  rounded-md p-2 ">
                        {getUserEmailById(formDetails.assigned_to)}
                      </p>
                    </div>
                    <div className="mb-2">
                      <button
                        className="bg-forthColor hover:bg-eightColor text-white font-bold py-2 px-4 rounded w-full"
                        onClick={handleAddTaskClick}
                      >
                        Add Task
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tasks */}
              <div className="bg-firstColor p-4 rounded-md shadow-lg shadow-forthColor">
                <h2 className="text-lg font-semibold mb-4">Tasks</h2>
                <TasksList tasks={tasks} />
              </div>
            </div>
            {/* Right side: Notes */}
            <div>
              <div className="p-4 rounded-md shadow-xl shadow-forthColor">
                <h2 className="text-lg font-semibold mb-4 ml-2">Notes</h2>
                <NotesComponent notes={notes} />
                <div className="flex p-4 max-h-24">
                  {/* Input field for description */}
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter note description..."
                    className="w-full p-2  rounded-md shadow-inner shadow-forthColor bg-secondColor text-eightColor mr-4"
                  />
                  {/* Button to add new note */}
                  <button
                    onClick={handleAddNote}
                    className="bg-forthColor text-white  px-4 rounded hover:bg-eightColor hover:text-forthColor"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Task modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-md shadow-md shadow-white">
            <button
              className="absolute top-0 right-0 m-4 text-lg text-gray-500"
              onClick={() => setShowAddTaskModal(false)}
            >
              &#x2715;
            </button>
            <AddTaskPage leadID={id} onClose={closeAddTaskModal} />
          </div>
        </div>
      )}
      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-firstColor p-6 rounded-md shadow-md"
            ref={modalRef}
          >
            <h2 className="text-lg font-semibold mb-4">Select New Status</h2>
            {/* List of status options */}
            <div className="flex flex-col gap-2">
              {[
                "Does not respond",
                "Accessing funds",
                "Spam",
                "Is not interested",
                "Waiting funds",
                "Finalized",
              ].map((status) => (
                <button
                  key={status}
                  className="bg-forthColor hover:bg-eightColor text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setSelectedStatus(status); // Update selectedStatus first
                    handleStatusClick(status); // Call handleStatusClick with the selected status
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormDetailsPage;
