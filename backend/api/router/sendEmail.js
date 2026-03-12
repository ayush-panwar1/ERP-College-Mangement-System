
import express from "express"
import sgMail from "@sendgrid/mail"
import dotenv from "dotenv";

import verifyLogin from "../middleware/authenticate.js";

dotenv.config();
const router = express.Router()
sgMail.setApiKey(process.env.SENDGRID_KEY)



router.post("/sendmail",verifyLogin, async (req, res) => {
    
    
    
    const { emailSub = null, emailBody = null,  recipients= []} = req.body || null;
    
    try {

        const msg = {
            to:  recipients || ['ayushpanwar3134@gmail.com'], 
            from: {
                name: "SMS",
                email: 'serversmart.info@gmail.com'
            },
            
            subject: emailSub || 'No subject',
            text: emailBody || '',
            html: emailBody
                ? `<strong>${emailBody}</strong>`
                : '<strong>This is an auto generated email from Student Management System</strong>'

        }

        const response = await sgMail.send(msg)
        console.log(response);
        res.send({message: "Email sent."})
    }
    catch (e) {
        console.log(e.message)
        res.send({alert: e.message});
    }
})

export default router
