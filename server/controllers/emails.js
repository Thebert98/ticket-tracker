async function sendStatusUpdateEmail(id,email,name, oldStatus, newStatus){
    let emailBody = "Hello " + name + ", \n Your service request ticket with the ID of " + id + " status has changed from " + oldStatus + " to " + newStatus + ". Have a nice day."
    console.log("Would normally send email to " + email + " with body: " + emailBody);
    return emailBody
}

async function sendAdminMessageEmail(id,email,name, message){
    let emailBody =  "Hello " + name + ", \n One of our admins has responded to your service request ticket with the ID of " + id + ": " + message
    console.log("Would normally send email to " + email + " with body: " + emailBody);
    return emailBody

}

module.exports = {sendStatusUpdateEmail,sendAdminMessageEmail};