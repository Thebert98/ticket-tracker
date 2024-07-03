import React, { useState, useEffect } from "react";
import API from "../api";
import loadingImg from "../imgs/loading.gif";
import '../AdminPanel.css';
import { supabase } from '../config/supabase';
import { Snackbar, Alert } from '@mui/material';
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6";

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [expandedTicketId, setExpandedTicketId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inlineErrorMessage, setInlineErrorMessage] = useState(false);
    const [adminMessage, setAdminMessage] = useState("");
    const [updatedStatus, setUpdatedStatus] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const ticketsPerPage = 5;

    useEffect(() => {
        getTickets();
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        const ticketUpdateSubscription = getTicketUpdateSubscription();
        const ticketInsertSubscription = getTicketInsertSubscription();

        return () => {
            window.removeEventListener('resize', handleResize);
            supabase.removeChannel(ticketUpdateSubscription);
            supabase.removeChannel(ticketInsertSubscription);
        };
    }, [tickets]);

    const getTickets = () => {
        API.get('/tickets').then(res => {
            const tickets = res.data.tickets;
            setTickets(tickets);
            setLoading(false);
        }).catch(err => {
            console.log("Error retrieving tickets: " + err);
            setError("Error retrieving tickets");
            setLoading(false);
        });
    };

    const getTicketUpdateSubscription = () => {
        // Listens for updates on tickets table in supabase
        const statusUpdate = supabase
            .channel('public:tickets')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tickets' }, 
            // When it receives an update, it then finds the updated ticket by id and updates the status and updated_at fields
            // and updates the tickets state to include the updated ticket
            (payload) => {
                setTickets(tickets =>
                    tickets.map(ticket =>
                        ticket.id === payload.new.id ? { ...ticket, status: payload.new.status, updated_at: payload.new.updated_at } : ticket
                    )
                );
            })
            .subscribe();

        return statusUpdate;
    };

    const getTicketInsertSubscription = () => {
        // Listens for inserts to tickets table in supabase
        const newTicket = supabase
            .channel('public:tickets')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tickets' },
            // When it receives a new ticket, it then calls the getTickets function and returns all tickets
            (payload) => {
                console.log('New Ticket Received!', payload.new);
                setSnackbarMessage("New Ticket Received!");
                setSnackbarOpen(true);
                getTickets();
            })
            .subscribe();

        return newTicket;
    };

    const toggleTicket = (id) => {
        if(isMobile){
            setAdminMessage("");
            setUpdatedStatus(null);
            setInlineErrorMessage(false);
            if (id === expandedTicketId) {
                setExpandedTicketId(null);
            }
            else{
                setExpandedTicketId(id);
            }
        }
        else{
            if (id !== expandedTicketId) {
                setExpandedTicketId(id);
                setAdminMessage("");
                setUpdatedStatus(null);
                setInlineErrorMessage(false);
            }
    }
    };

    const handleStatusChange = (newStatus) => {
        setUpdatedStatus(newStatus);
    };

    const updateStatus = (id) => {
        let newStatus = updatedStatus;
        API.patch(`tickets/${id}/updateStatus`, { newStatus: newStatus }).then(res => {
            setTickets(tickets.map(ticket => ticket.id === id ? { ...ticket, status: newStatus } : ticket));
            setSnackbarMessage("Status changed successfully, check logs for details");
            setSnackbarOpen(true);
            console.log(res.data.data)
           
        }).catch(err => {
            console.log("Error changing ticket status: " + err);
            setError("Error changing ticket status");
            setLoading(false);
        });
    };

    const handleAdminMessageChange = (e) => {
        setAdminMessage(e.target.value);
    };

    const handleSendAdminMessage = () => {
        const trimmedMessage = adminMessage.trim();

        if (!trimmedMessage) {
            setInlineErrorMessage(true);
            return;
        }
        API.post(`tickets/${expandedTicketId}/message`, { message: adminMessage }).then(res => {
            console.log(res.data.data);
            setSnackbarMessage("Message sent successfully, check logs for details");
            setSnackbarOpen(true);
            setAdminMessage("");
        }).catch(err => {
            console.log("Error sending admin message: " + err);
            setError("Error sending admin message");
            setLoading(false);
        });

        if (inlineErrorMessage) setInlineErrorMessage(false);
    };

    const handleClearError = () => {
        setError(null);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const isMobile = windowWidth < 768;
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
    if(tickets.length == 0){
        return(
        
        <div className="ticketListMobile">
            <h2>No Tickets!</h2>      
        </div>
        );
    }

    if (!isMobile) {
        return (
            <div className="ticketListContainer">
                <div className="ticketList">
                    <h2>Service Request Tickets</h2>
                    <ul>
                        {currentTickets.map(ticket => (
                            <li key={ticket.id} onClick={() => toggleTicket(ticket.id)} className={expandedTicketId === ticket.id ? "expanded" : ""}>
                                <div className="ticketSummary">
                                    <div className="ticketSummaryDetails">
                                        <p className="ticketName">{ticket.name}</p>
                                        <p className="ticketEmail">{ticket.email}</p>
                                        <p className="ticketStatus">
                                            {ticket.status === "new" ? (
                                                <span style={{ color: "green" }}>New</span>
                                            ) : ticket.status === "in progress" ? (
                                                <span style={{ color: "#8B8000" }}>In Progress</span>
                                            ) : ticket.status === "resolved" ? (
                                                <span style={{ color: "red" }}>Resolved</span>
                                            ) : (
                                                <span style={{ color: "green" }}>New</span>
                                            )}
                                        </p>
                                        <p className="ticketCreated">{ticket.created_at.split("T")[0].split("-")[1]}-{ticket.created_at.split("T")[0].split("-")[2]}-{ticket.created_at.split("T")[0].split("-")[0]}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="pagination">
                        <button onClick={prevPage} hidden={currentPage === 1} disabled={currentPage === 1}>Previous</button>
                        <button onClick={nextPage} hidden={currentPage === Math.ceil(tickets.length / ticketsPerPage)} disabled={currentPage === Math.ceil(tickets.length / ticketsPerPage)}>Next</button>
                    </div>
                </div>
                <div className="ticketDetailsContainer">
                    {expandedTicketId && (
                        <div className="expandedTicket">
                            <>
                                <div className="expandedTicketDetails">
                                    <p className="expandedId"><span>Ticket ID:</span> {tickets.find(ticket => ticket.id === expandedTicketId).id}</p>
                                    <p className="expandedName"><span>Requestor's Name:</span> {tickets.find(ticket => ticket.id === expandedTicketId).name}</p>
                                    <p className="expandedEmail"><span>Requestor's Email:</span> {tickets.find(ticket => ticket.id === expandedTicketId).email}</p>
                                    </div>
                                    <div className="timestamps">
                                        <p className="expandedCreateDate"><span>Created On:</span> {tickets.find(ticket => ticket.id === expandedTicketId).created_at.split("T")[0].split("-")[1]}-{tickets.find(ticket => ticket.id === expandedTicketId).created_at.split("T")[0].split("-")[2]}-{tickets.find(ticket => ticket.id === expandedTicketId).created_at.split("T")[0].split("-")[0]}</p>
                                        {tickets.find(ticket => ticket.id === expandedTicketId).updated_at && (
                                            <p className="expandedUpdateDate"><span>Last Updated On:</span> {tickets.find(ticket => ticket.id === expandedTicketId).updated_at.split("T")[0].split("-")[1]}-{tickets.find(ticket => ticket.id === expandedTicketId).updated_at.split("T")[0].split("-")[2]}-{tickets.find(ticket => ticket.id === expandedTicketId).updated_at.split("T")[0].split("-")[0]}</p>
                                        )}
                                    </div>
                               
                                <p className="expandedDescription"><span>Description of Issue:</span> {tickets.find(ticket => ticket.id === expandedTicketId).description}</p>
                                <div className="adminMessageField">
                                    <label>Respond to Request:</label>
                                    {inlineErrorMessage && (
                                        <p className="inlineErrorMessage">Message cannot be blank</p>
                                    )}
                                    <textarea
                                        placeholder="Respond to the user's request. This will send an email to the user."
                                        value={adminMessage}
                                        onChange={handleAdminMessageChange}
                                    ></textarea>
                                    <button onClick={handleSendAdminMessage}>Send Response</button>
                                </div>
                                <div className="ticketStatus">
                                    <label>Change Ticket Status:</label>
                                    <select value={updatedStatus || tickets.find(ticket => ticket.id === expandedTicketId).status} onChange={(e) => handleStatusChange(e.target.value)}>
                                        <option value="new">New</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                    {updatedStatus && updatedStatus !== tickets.find(ticket => ticket.id === expandedTicketId).status && (
                                        <button onClick={() => updateStatus(tickets.find(ticket => ticket.id === expandedTicketId).id)}>Update Status</button>
                                    )}
                                </div>
                            </>
                        </div>
                    )}
                </div>
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
    } else {
        return (
            <div className="ticketListMobile">
                <h2>Service Request Tickets</h2>
                <ul>
                    {currentTickets.map(ticket => (
                        <li key={ticket.id}>
                            <div>
                                <div className="ticketDetailsMobile">
                                    <p><span>{ticket.name}</span> </p>
                                    <p><span>{ticket.email}</span></p>
                                    <p>
                                        <span>Status:</span>
                                        {ticket.status === "new" ? (
                                            <span style={{ color: "green" }}>New</span>
                                        ) : ticket.status === "in progress" ? (
                                            <span style={{ color: "#8B8000" }}>In Progress</span>
                                        ) : ticket.status === "resolved" ? (
                                            <span style={{ color: "red" }}>Resolved</span>
                                        ) : (
                                            <span style={{ color: "green" }}>New</span>
                                        )}
                                    </p>
                                </div>
                                {expandedTicketId !== ticket.id && (
                                    <FaAnglesDown className="fa" onClick={() => toggleTicket(ticket.id)} />
                                )}
                            </div>
                            {expandedTicketId === ticket.id && (
                                <div className="expandedTicketMobile">
                                    <p className="expandedId"><span>Ticket ID:</span> {ticket.id}</p>
                                    <p className="expandedName"><span>Requestor's Name:</span> {ticket.name}</p>
                                    <p className="expandedEmail"><span>Requestor's Email:</span> {ticket.email}</p>
                                    <p className="expandedCreateDate"><span>Created On:</span> {ticket.created_at.split("T")[0]}</p>
                                    {ticket.updated_at &&
                                        <p className="expandedUpdateDate"><span>Last Updated On:</span> {ticket.updated_at.split("T")[0]}</p>
                                    }
                                    <div className="expandedTicketDescriptionMobile">
                                        <p><span>Description of Issue:</span> {ticket.description}</p>
                                    </div>
                                    <div className="adminMessageFieldMobile">
                                        <label>Respond to Request:</label>
                                        {inlineErrorMessage && (
                                            <p className="inlineErrorMessageMobile">Message cannot be blank</p>
                                        )}
                                        <textarea
                                            placeholder="Respond to the user's request. This will send an email to the user."
                                            value={adminMessage}
                                            onChange={handleAdminMessageChange}
                                        ></textarea>
                                        <button onClick={handleSendAdminMessage}>Send Response</button>
                                    </div>
                                    <div className="ticketStatusMobile">
                                        <label>Change Ticket Status:</label>
                                        <select value={updatedStatus || ticket.status} onChange={(e) => handleStatusChange(e.target.value)}>
                                            <option value="new">New</option>
                                            <option value="in progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                        {updatedStatus && updatedStatus !== ticket.status && (
                                            <button onClick={() => updateStatus(ticket.id)}>Update Status</button>
                                        )}
                                    </div>
                                    <div className="faUp">
                                        <FaAnglesUp className="faMobile" onClick={() => toggleTicket(ticket.id)} />
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="paginationMobile">
                    <button onClick={prevPage} hidden={currentPage === 1} disabled={currentPage === 1}>Previous</button>
                    <button onClick={nextPage} hidden={currentPage === Math.ceil(tickets.length / ticketsPerPage)} disabled={currentPage === Math.ceil(tickets.length / ticketsPerPage)}>Next</button>
                </div>
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
    }
};

export default TicketList;
