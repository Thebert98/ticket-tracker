import React, { useState } from "react";
import API from "../api";
import loadingImg from "../imgs/loading.gif";
import "../App.css"; 

const SupportRequest = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
  });

  const [ticketNumber, setTicketNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNameChange = (e) => {
    
    setFormData({ ...formData, name: e.target.value });
  }

  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  }

  const handleDescriptionChange = (e) => {
    setFormData({ ...formData, description: e.target.value });
  }

  const handleNewRequest = () => {
    setFormData({
        name: "",
        email: "",
        description: "",
      })
    setTicketNumber(null);
  }
  const handleClearError = () =>{
    setError(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedDescription = formData.description.trim();

    if (!trimmedName || !trimmedEmail || !trimmedDescription) {
      alert("All fields are required");
      return
    }

    setLoading(true);
    API.post("/tickets", {
      name: formData.name,
      email: formData.email,
      description: formData.description,
    })
      .then((res) => {
        setTicketNumber(res.data.ticket[0].id);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error retrieving tickets: " + err)
        setError("Error retrieving tickets")
        setLoading(false);
      });
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
        <button className="clearErrorButton" onClick={handleClearError}>Clear Error</button>
        </div>
        
      </div>
    );
  }

  if (ticketNumber) {
    return (
      <div className="ticketCreated">
        <h2>Your Service Request Ticket Has Been Created!</h2>
        <h3><span>Service Request Ticket #{ticketNumber}</span></h3>
        <h4>
          We will review your request as soon as possible.
        </h4>
        <button onClick={handleNewRequest} className="newRequestButton">Start New Request</button>
      </div>
    );
  }

  return (
    <div className="createTicket">
      <h2>Please fill out the following fields so that we may better assist you</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          onChange={handleNameChange}
          value={formData.name}
          name="name"
          type="text"
          id="name"
        />
        <label htmlFor="email">Email:</label>
        <input
          onChange={handleEmailChange}
          value={formData.email}
          name="email"
          type="email"
          id="email"
        />
        <label htmlFor="description">Description of Issue:</label>
        <textarea
          onChange={handleDescriptionChange}
          value={formData.description}
          name="description"
          id="description"
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default SupportRequest;
