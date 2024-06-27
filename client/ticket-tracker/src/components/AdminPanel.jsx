import React from 'react';
import TicketList from './TicketList';
import '../AdminPanel.css';

const AdminPanel = () =>{
    return(
        <div className='adminPanel'>
            <h1>Admin Panel</h1>
            <TicketList />

        </div>
    )
}

export default AdminPanel