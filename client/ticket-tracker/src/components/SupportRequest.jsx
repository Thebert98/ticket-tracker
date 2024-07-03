import React, { useState } from "react";
import API from "../api";
import loadingImg from "../imgs/loading.gif";
import "../App.css";
import { Snackbar, Alert } from '@mui/material';

const SupportRequest = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
  });

  const [inlineErrors, setInlineErrors] = useState({
    name: false,
    email: false,
    description: false,
  });

  const [ticketNumber, setTicketNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInlineErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNewRequest = () => {
    setFormData({
      name: "",
      email: "",
      description: "",
    });
    setTicketNumber(null);
  };

  const handleClearError = () => {
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      description: formData.description.trim(),
    };

    const newErrors = {
      name: !trimmedData.name,
      email: !trimmedData.email,
      description: !trimmedData.description,
    };

    setInlineErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    setLoading(true);
    API.post("/tickets", trimmedData)
      .then((res) => {
        setTicketNumber(res.data.ticket[0].id);
        setLoading(false);
        setSnackbarMessage("Ticket created successfully!");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.log("Error retrieving tickets: " + err);
        setError("Error retrieving tickets");
        setLoading(false);
      });
     
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
};

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
        <img src={loadingImg} alt="Loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <div className="createTicket">
          <p>Error: {error}</p>
          <button className="clearErrorButton" onClick={handleClearError}>
            Clear Error
          </button>
        </div>
      </div>
    );
  }

  if (ticketNumber) {
    return (
      <div className="ticketCreated">
        <div className="centeredContainer">
        <h2>Your Service Request Ticket Has Been Created!</h2>
        <h3>
          <span>Service Request Ticket ID: {ticketNumber}</span>
        </h3>
        <h4>We will review your request as soon as possible.</h4>
        <button onClick={handleNewRequest} className="newRequestButton">
          Start New Request
        </button>
        </div>
      </div>
    );
  }

  return (
    <div className="createTicket">
      <h2>Please fill out the following fields so that we may better assist you</h2>
      {(inlineErrors.name || inlineErrors.email || inlineErrors.description) && (
        <p className="inlineErrorMessage">All fields are required</p>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          onChange={handleInputChange}
          value={formData.name}
          name="name"
          type="text"
          id="name"
          style={{ borderColor: inlineErrors.name ? "red" : "initial" }}
        />
        <label htmlFor="email">Email:</label>
        <input
          onChange={handleInputChange}
          value={formData.email}
          name="email"
          type="email"
          id="email"
          style={{ borderColor: inlineErrors.email ? "red" : "initial" }}
        />
        <label htmlFor="description">Description of Issue:</label>
        <textarea
          onChange={handleInputChange}
          value={formData.description}
          name="description"
          id="description"
          style={{ borderColor: inlineErrors.description ? "red" : "initial" }}
        />
        <input type="submit" value="Submit" />
      </form>
      <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                >
                    <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
    </div>
  );
};

export default SupportRequest;
