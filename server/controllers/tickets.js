const supabase = require("../config/supabase");
const emailData = require("./emails");

async function createTicket(name,email,description){
    try{
        if(!name || !email || !description){
            throw new ("name, email, and description of the problem must be provided!");
        }
        if(!typeof(name) == "string" || !typeof(email) == "string" || !typeof(description) == "string"){
            throw ("Invalid input types!");
        }
        if(name.trim().length == 0 || email.trim().length == 0 || description.trim().length == 0){
            throw ("Inputs cannot be all white space");
        }
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        .test(email)){
            throw new Error("Not a valid email");
        }

        let {data,error} = await supabase.
        from("tickets").insert({
            name: name,
            email: email,
            description: description,
            status: "new"
        }).select("*");

        if(error) throw (error);

        return data;
    }catch(e){
        console.error("Error creating new ticket: ", e);
        throw e;
    }
}

async function getAllTickets(){
    try{
        let {data,error} = await supabase.
        from("tickets").
        select("*").
        order('created_at', { ascending: false });

        if(error) throw (error);
        
        return data;
    }catch(e){
        console.error("Error getting all tickets: ", e);
        throw e;
    }
}

async function getTicketFromId(id){
    try{
        console.log(id)
        if(!id){
            throw ("id must be provided!");
        }
        if(id.trim().length == 0){
            throw ("Input cannot be all white space");
        }
        let {data,error} = await supabase.
        from("tickets").
        select("*").eq("id",id);

        if(error) throw (error);
        if(data.length == 0) throw("No ticket with the id " + id + " exists")
        return data;
    }catch(e){
        console.error("Error getting ticket from id: ", e);
        throw e;
    }
}



async function updateTicketStatus(id,newStatus){
    try{
        
        if(!id || !newStatus){
            throw  ("id and newStatus must be provided!");
        }
        if(!typeof(id) == "string" || !typeof(newStatus) == "string"){
            throw  ("Invalid input types!");
        }
        if(id.trim().length == 0 || newStatus.trim().length == 0){
            throw  ("Inputs cannot be all white space");
        }
        if(newStatus !== "new" && newStatus !== "in progress" && newStatus !== "resolved"){
            throw  ("Invalid ticket status");
        }
        
        let oldTicket = await getTicketFromId(id)
        oldTicket = oldTicket[0]
        let email = oldTicket.email;
        let name = oldTicket.name;
        if(oldTicket.status == newStatus) throw("Cannot update the ticket status to the current status")
        let oldStatus = oldTicket.status;


        let {data,error} = await supabase.
        from("tickets").
        update({
            status:newStatus,
            updated_at: ((new Date()).toISOString()).toLocaleString('zh-TW')
        }).eq("id",id).select();

        if(error) throw  (error);
        console.log("Sending ticket status update email...")
        let emailBody = await emailData.sendStatusUpdateEmail(id,email,name,oldStatus,newStatus);
        console.log("Ticket status update email sent successfully.")
       
        return "Message sent sucessfully: " +  emailBody;
    }catch(e){
        console.error("Error updating ticket stauts: ", e);
        throw e;
    }
}

async function adminResponse(id, message){
    try{
        if(!id || !message){
            throw  ("id and newStatus must be provided!");
        }
        if(!typeof(id) == "string" || !typeof(message) == "string"){
            throw  ("Invalid input types!");
        }
        if(id.trim().length == 0 || message.trim().length == 0){
            throw  ("Inputs cannot be all white space");
        }

        let {data,error} = await supabase.
        from("tickets").
        select("name,email").eq("id",id);

        if(error) throw  (error);
        if(data.length == 0) throw("No ticket with the id " + id + " exists")
        console.log("Sending admin response email...")
       let emailBody = await emailData.sendAdminMessageEmail(id,data[0].email,data[0].name,message);
        console.log("Admin response email sent successfully.")

        return "Message sent sucessfully: " +  emailBody;

    }catch(e){
        console.error("Error sending admin message: ", e);
        throw e;
    }
}

module.exports = {
    createTicket,
    getAllTickets,
    getTicketFromId,
    updateTicketStatus,
    adminResponse
}