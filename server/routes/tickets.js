const express = require("express");
const xss = require("xss");
const ticketData = require("../data/tickets")

const router = express.Router();

router.get("/",async (req,res)=>{
    try{
        let data = await ticketData.getAllTickets();

        if(!data){
            res.status(500).json({error:"Internal Server Error: Error fetching all tickets!"});
            return
        }
        
        res.status(200).json({tickets:data})
        return
    }catch(e){
        res.status(500).json({error:"Internal Server Error: " + e});
        return
    }
})

router.get("/:id", async (req,res) =>{
    try{
        let id = req.params.id;
        if(!id){
            res.status(400).json({error:"Invalid request! An id must be provided!"});
            return
        }
        if(!/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(id)){
            res.status(400).json({error:"Invalid request! Not a valid id!"});
            return
        }
        let data = await ticketData.getTicketFromId(id);

        if(!data){
            res.status(500).json({error:"Internal Server Error: Error fetching ticket by id!"});
            return
        }

        res.status(200).json({ticket:data})
        return
        
    }catch(e){
        res.status(500).json({error:"Internal Server Error: " + e});
        return
    }

})

router.post("/",async (req,res)=>{
    try{
        let name = xss(req.body.name);
        let email = xss(req.body.email);
        let description = xss(req.body.description);
        
        if(!name || !email || !description){
            res.status(400).json({error:"Invalid request! A name, email, and description of the problem must be provided!"});
            return
        }
        if(!typeof(name) == "string" || !typeof(email) == "string" || !typeof(description) == "string"){
            res.status(400).json({error:"Invalid request! Invalid input types!"});
            return
        }
        if(name.trim().length == 0 || email.trim().length == 0 || description.trim().length == 0){
            res.status(400).json({error:"Invalid request! Inputs cannot be all white space!"});
            return
        }
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        .test(email)){
            res.status(400).json({error:"Invalid request! Not a valid email!"});
            return
        }
        let data = await ticketData.createTicket(name,email,description);

        if(!data){
            res.status(500).json({error:"Internal Server Error: Error creating ticket!"});
            return
        }

        res.status(200).json({ticket:data})
        return
    }catch(e){
        res.status(500).json({error:"Internal Server Error: " + e});
        return
    }
})

router.post("/:id/message",async(req,res)=>{
    try{
        let id = req.params.id;
        let message = xss(req.body.message);
        console.log(req.body)
        if(!id || !message){
            res.status(400).json({error:"Invalid request! An id and message must be provided!"});
            return
        }
        if(typeof(message) !== "string"){
            res.status(400).json({error:"Invalid request! Invalid input type!"});
            return
        }
        if(id.trim().length == 0 || message.trim().length == 0){
            res.status(400).json({error:"Invalid request! Inputs cannot be all white space!"});
            return
        }
        if(!/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(id)){
            res.status(400).json({error:"Invalid request! Not a valid id!"});
            return
        }

        let data = await ticketData.adminResponse(id,message)

        if(!data){
            res.status(500).json({error:"Internal Server Error: Error sending admin message!"});
            return
        }

        res.status(200).json({data:data})
    }catch(e){
        res.status(500).json({error:"Internal Server Error: " + e});
        return
    }
})

router.patch("/:id/updateStatus",async(req,res)=>{
    try{
        let id = req.params.id;
        let newStatus = xss(req.body.newStatus);

        if(!id | !newStatus){
            res.status(400).json({error:"Invalid request! An id and new status must be provided!"});
            return
        }
        if(typeof(newStatus) !== "string"){
            res.status(400).json({error:"Invalid request! Invalid input type!"});
            return
        }
        if(id.trim().length == 0 || newStatus.trim().length == 0){
            res.status(400).json({error:"Invalid request! Inputs cannot be all white space!"});
            return
        }
        if(!/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(id)){
            res.status(400).json({error:"Invalid request! Not a valid id!"});
            return
        }
        if(newStatus !== "new" && newStatus !== "in progress" && newStatus !== "resolved"){
            res.status(400).json({error:"Invalid ticket status"});
            return
        }

        let data = await ticketData.updateTicketStatus(id,newStatus)
        

        if(!data){
            res.status(500).json({error:"Internal Server Error: Error updating ticket status!"});
            return
        }

        res.status(200).json({data:data})
        return
    }catch(e){
        res.status(500).json({error:"Internal Server Error: " + e});
        return
    }
})

module.exports = router