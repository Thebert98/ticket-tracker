import React, { useState, useEffect } from "react";
import API from "../api";
import loadingImg from "../imgs/loading.gif";
import '../AdminPanel.css';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [expandedTicketId, setExpandedTicketId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adminMessage, setAdminMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 5;

    useEffect(() => {
        API.get('/tickets').then(res => {
            const tickets = res.data.tickets;
            setTickets(tickets);
            setLoading(false);
        }).catch(err => {
            console.log("Error retrieving tickets: " + err);
            setError("Error retrieving tickets");
            setLoading(false);
        })
    }, []);

    const toggleTicket = (id) => {
        setAdminMessage("")
        if (id === expandedTicketId) {
            setExpandedTicketId(null);
        } else {
            setExpandedTicketId(id);
        }
    };

    const handleStatusChange = (id, newStatus) => {
        API.patch(`tickets/${id}/updateStatus`, { newStatus: newStatus }).then(res => {
            setTickets(tickets.map(ticket => ticket.id === id ? { ...ticket, status: newStatus } : ticket));
            alert("Status changed Successfully, check logs for details");
            console.log(res.data.data);
        }).catch(err => {
            console.log("Error changing ticket status: " + err);
            setError("Error changing ticket status");
            setLoading(false);
        })
    }

    const handleAdminMessageChange = (e) => {
        setAdminMessage(e.target.value);
    };

    const handleSendAdminMessage = () => {
        const trimmedMessage = adminMessage.trim();

        if (!trimmedMessage) {
            alert('Message cannot be blank');
            return;
        }
        API.post(`tickets/${expandedTicketId}/message`, { message: adminMessage }).then(res => {
            console.log(res.data.data);
            alert("Message Sent Successfully, check logs for details");
            setAdminMessage("");
        }).catch(err => {
            console.log("Error sending admin message: " + err);
            setError("Error sending admin message");
            setLoading(false);
        })
    };
    const handleClearError = () =>{
        setError(null)
      }
    
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

    const nextPage = () => {
        if (currentPage < Math.ceil(tickets.length / ticketsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <p>Loading...</p>
                <img src={loadingImg} alt="Loading" />
            </div>
        );
    }

    if (error) {
        return (
          <div className="error">
            <div className="ticketList">
                <p>Error: {error}</p>
            <button onClick={handleClearError}>Clear Error</button>
            </div>
          </div>
        );
      }

    return (
        <div className="ticketList">
            <h2>Service Request Tickets</h2>
            <ul>
                {currentTickets.map(ticket => (
                    <li key={ticket.id}>
                        <div onClick={() => toggleTicket(ticket.id)}>
                            <div className="ticketDetails">
                                <p><span>Ticket #:</span> {ticket.id}</p>
                                <p><span>Description:</span> {ticket.description.length <= 100 ? ticket.description: ticket.description.slice(0,100) + "..."}</p>
                                <p>
                                    <span>Status:</span> 
                                    {ticket.status === "new" ? (
                                        <span style={{color: "green"}}>New</span>
                                    ) : ticket.status === "in progress" ? (
                                        <span style={{color: "#8B8000"}}>In Progress</span>
                                    ) : ticket.status === "resolved" ? (
                                        <span style={{color: "red"}}>Resolved</span>
                                    ) : (
                                        <span style={{color: "green"}}>New</span>
                                    )} 
                                </p>
                                <p><span>Created On:</span> {ticket.created_at.split("T")[0]}.</p>
                                {ticket.updated_at && 
                                <p><span>Updated On:</span> {ticket.updated_at.split("T")[0]}.</p>
                                }
                            </div>
                        </div>
                        {expandedTicketId === ticket.id && (
                            <div className="expandedTicket">
                                <h3>More Information:</h3>
                                <p><span>Ticket #:</span> {ticket.id}</p>
                                <p><span>Requestor's Name:</span> {ticket.name}</p>
                                <p><span>Requestor's Email:</span> {ticket.email}</p>
                                <p><span>Description of Issue:</span> {ticket.description}</p>
                                <div className="adminMessageField">
                                    <h4>Respond to Request</h4>
                                    <textarea
                                        placeholder="Respond to the user's request. This will send an email to the user."
                                        value={adminMessage}
                                        onChange={handleAdminMessageChange}
                                    ></textarea>
                                    <button onClick={handleSendAdminMessage}>Send Response</button>
                                </div>
                                <div className="ticketStatus">
                                    <label>Change Ticket Status:</label>
                                    <select value={ticket.status} onChange={(e) => handleStatusChange(ticket.id, e.target.value)}>
                                        <option value="new">New</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <div className="pagination">
                <button onClick={prevPage} hidden={currentPage === 1} disabled={currentPage === 1}>Previous</button>
                <button onClick={nextPage} hidden={currentPage === Math.ceil(tickets.length / ticketsPerPage)} disabled={currentPage === Math.ceil(tickets.length / ticketsPerPage)}>Next</button>
            </div>
        </div>
    );
};

export default TicketList;
