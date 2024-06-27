# Ticket Tracker

Ticket Tracker is a full-stack web application designed to streamline the process of managing helpdesk tickets. Built using React.js, Node.js, and Supabase, this application facilitates efficient ticket management in an office environment. Users can submit tickets detailing their issues, and admins can manage these tickets through a detailed admin panel.

## Features

- **User Interface**: Simple forms for users to submit their issues, including fields for name, email, and a description of the problem.
- **Admin Panel**: Admins can view all tickets with details such as ticket ID, status, requestor's name, and email. They can update the status of tickets, view more detailed information, and contact the requestor directly.
- **No Authentication**: As this is a mock-up, there is no authentication mechanism in place.

### Features I Would Add

- **Additional Fields for Tickets**:
  - Title for each ticket in the general list view.
  - Category/Type of the issue (e.g., equipment rentals, software installation, troubleshooting, logins, other).
  - Assigned Admin tracking the ticket.
  - An Event log to record all ticket events like creation, admin messages, and status changes, all timestamped.
- **Filtering Options**:
  - Ability to sort tickets by any field.
  - Filters to view tickets by selected statuses.
  - Sort tickets by the most recently updated or by creation date.
- **Search Functionality**: Enhanced search capabilities to find tickets based on various fields.
- **Authentication System**: To secure access to the admin panel.
- **User Dashboard**: Allows users to view the status of their tickets and respond to messages from the admin.
- **Delete Ticket**: Option to delete tickets when necessary.
- **Manual Ticket Creation**: Admins can create tickets on behalf of users directly from the admin panel.

## Getting Started

### Prerequisites

Ensure you have Node.js and npm installed on your system to run the application locally. You can check your installation by running:

```bash
node --version
npm --version
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ticket-tracker.git
cd ticket-tracker
```

2. Install dependencies for both the frontend and backend:

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Start the backend server:

```bash
npm start
```

4. In a new terminal, navigate to the client directory and start the React application:

```bash
cd client
npm start
```


## Usage

- **Submit a Ticket**: Navigate to the main page, fill out the form, and submit your issue.
- **Admin Panel**: Click on the "Admin Panel" button on the navbar to view all tickets. You can interact with each ticket to view more details or perform actions like sending emails or changing the ticket status.


