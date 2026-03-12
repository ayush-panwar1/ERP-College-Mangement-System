import express from "express"
import verifyLogin from "../middleware/authenticate.js"

const router = express.Router()

router.get("currentcourse",verifyLogin,async (req,res)=>{
    // fetch all the students enrolled in the course in current semester offered by the current professor
    res.json({message: "will get data after database is finalized."})

})

export default router;