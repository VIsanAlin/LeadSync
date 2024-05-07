# <span style="color:#0B7285;">LeadSync </span>

LeadSync is a web application built with Next.js and React, powered by Tailwind CSS for styling and Supabase for database management. It serves as a comprehensive platform for managing leads, projects, tasks, and notifications efficiently.

## Features

- **User Authentication:** Users can log in as agents or admins, granting access to different levels of functionality within the system.
- **Project Management:** Admins have the capability to create, assign, edit, and delete projects manually, ensuring seamless organization and tracking of leads.

- **Dynamic Status Tracking:** Each project's status can be updated by agents, triggering automated generation of notes, tasks, and notifications based on predefined criteria.

- **Task and Notification Management:** The application includes dedicated pages for viewing tasks and notifications, with filtering options based on various criteria such as status and urgency (e.g., all, today, delayed).

- **Profile Settings:** Users can access their profile page to input personal details such as name and phone number, with the option to change their password for enhanced security.

## Technologies Used

- **Next.js:** A React framework for building server-side rendered applications.
- **React:** A JavaScript library for building user interfaces.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Supabase:** An open-source alternative to Firebase, offering real-time database capabilities and authentication services.

## Getting Started

1. **Clone the Repository:** `git clone <repository_url>`
2. **Install Dependencies:** `npm install`
3. **Set Up Supabase:** Create an account on Supabase and configure your database settings. Update the environment variables accordingly.

4. **Run the Application:** `npm run dev`

5. **Access the Application:** Open your web browser and navigate to `http://localhost:3000`.

## Contributing

Contributions are welcome! If you'd like to contribute to LeadSync Pro, please follow our [Contribution Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).
