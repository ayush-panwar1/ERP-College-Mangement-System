import express from "express";
import sql from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import verifyStudentLogin from "../middleware/authenticateStudent.js";
import route from "./makepayment.js";

dotenv.config()

const router = express.Router()



router.post("/portallogin", async (req, res) => {
    const { email = "", password = "" } = req.body;
    

    try {
        const response = await sql`
            SELECT 
            uid, college_email, password_hash
            FROM student
            WHERE college_email = ${email}`;

        if (!response.length) {
            return res.json({ alert: "Email ID is incorrect." });
        }

        const user = response[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.json({ alert: "Password is incorrect. Please try again." });
        }

        const token = jwt.sign(
            { id: user.uid, username: email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60,
            sameSite: "none",
        });
        

        res.json({
            status: "success",
        });
    } catch (err) {

        res.status(500).json({ alert: err.message });
      
    }
});


router.post("/manageprofile/update", verifyStudentLogin, async (req, res) => {
    try {
      const { phoneNumber, email } = req.body;

     
      if (!phoneNumber && !email) {
        return res
          .status(400)
          .json({ message: "No fields provided for update." });
      }


      if (phoneNumber) {
        if (!/^\d{10}$/.test(phoneNumber)) {
          return res
            .status(400)
            .json({ message: "Invalid phone number format." });
        }
      }

      if (email) {
        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
          return res
            .status(400)
            .json({ message: "Invalid email format." });
        }
      }


      const updates = {};
      if (phoneNumber) updates.contact_no = phoneNumber;
      if (email) updates.personal_email = email;

      await sql`
        UPDATE student
        SET ${sql(updates)}
        WHERE sid = ${req.user.sid}
      `;

      res.status(200).json({
        message: "Profile updated successfully.",
        updatedFields: Object.keys(updates),
      });
    } catch (err) {
      console.error("Profile update error:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);


router.get("/studentprofile", verifyStudentLogin,  async (req, res) => {

    try {
        const response = await sql`
                SELECT sid, first_name, last_name, dob, gender, contact_no,
                personal_email,admission_date, branch_id, uid, college_email, password_hash,
                father_name, mother_name
                FROM student
                WHERE college_email = ${req.user.college_email}`;
        const user = response[0];

        const branchResult = await sql`
            SELECT department_name
            FROM department
            WHERE department_id = ${user.branch_id}`;

        const branchName = branchResult[0]?.department_name || "N/A";

        const d = new Date(user.dob);
        res.json({

            SID: user.sid,
            Name: `${user.first_name} ${user.last_name}`,
            Father_Name: user.father_name,
            Mother_Name: user.mother_name,
            DOB:  d.toISOString().split("T")[0],
            Gender: user.gender,
            Mobile: user.contact_no,
            Email: user.personal_email,
            Batch: new Date(user.admission_date).getFullYear(),
            Branch: branchName,
        });


    }
    catch (err) {
        console.log(err.message)
        res.json({ alert: err.message })
    }
})





router.get("/gradereport", verifyStudentLogin, async (req, res) => {


    const result = await sql`
        SELECT
            c.courseid,
            c.coursetitle,
            c.credits,
            e.grade,
            co.semester,
            co.year
        FROM
            enrollment e
        JOIN
            courseoffering co ON e.offeringid = co.offeringid
        JOIN
            course c ON co.courseid = c.courseid
        WHERE
            e."SID" = ${req.user.sid}
        ORDER BY
            co.year ASC,
            co.semester ASC;`;



    const response = await sql`
                SELECT sid, first_name, last_name, dob, gender, contact_no,
                personal_email, branch_id, uid, college_email, password_hash
                FROM student
                WHERE college_email = ${req.user.college_email}`;
    const user = response[0];

    const branchResult = await sql`
            SELECT department_name
            FROM department
            WHERE department_id = ${user.branch_id}`;

    const branchName = branchResult[0]?.department_name || "N/A";
    const d = new Date(user.dob);
    const finalReport = [{

        SID: user.sid,
        Name: `${user.first_name} ${user.last_name}`,
        DOB: d.toISOString().split("T")[0],
        Gender: user.gender,
        Mobile: user.contact_no,
        Email: user.personal_email,
        Branch: branchName,
    }, ...result]

    
    res.json({ message: finalReport })
})

const formatTransactions = (rows) =>
  rows.map((t) => ({
    Student_id: t.student_id,

    Amount: `₹ ${Number(t.amount_paid).toLocaleString("en-IN")}`,

    Transaction_Time: new Date(t.payment_date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),

    Order_Id: t.receipt_no,

    Payment_Mode: t.payment_mode,
    Transaction_Status: t.transaction_status,
  }));

router.get("/feereceipt", verifyStudentLogin, async (req, res) => {
    try{
        const response = await sql`
             SELECT student_id, amount_paid, payment_date,payment_mode,
             receipt_no,transaction_status
             FROM transactions
             WHERE student_id=${req.user.sid}
             ORDER BY payment_date DESC`

        res.status(200).json({data:formatTransactions(response) })
    }
    catch(err){
        res.status(500).json({alert: err.message})
    }

}
)





router.post(
  "/manageprofile/update/password",
  verifyStudentLogin,
  async (req, res) => {
    
    try {
      const {
        current_password,
        new_password,
        new_password_confirm,
      } = req.body;

     
      if (!current_password || !new_password || !new_password_confirm) {
        return res.status(400).json({
          message: "All fields are required.",
        });
      }

      
      if (new_password !== new_password_confirm) {
        return res.status(400).json({
          message: "New passwords do not match.",
        });
      }
      if(new_password.length <6){
        return res.status(400).json({
          message: "Password must contain atleast six character.",
        });
      }
   
      const response = await sql`
        SELECT password_hash
        FROM student
        WHERE college_email = ${req.user.college_email}
      `;

      if (!response.length) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      const user = response[0];

     
      const match = await bcrypt.compare(
        current_password,
        user.password_hash
      );

      if (!match) {
        return res.status(401).json({
          message: "Current password is incorrect.",
        });
      }

    
      const samePassword = await bcrypt.compare(
        new_password,
        user.password_hash
      );

      if (samePassword) {
        return res.status(400).json({
          message: "New password cannot be same as old password.",
        });
      }

      
      const hashedPassword = await bcrypt.hash(new_password, 12);

      await sql`
        UPDATE student
        SET password_hash = ${hashedPassword}
        WHERE college_email = ${req.user.college_email}
      `;

      return res.status(200).json({
        message: "Password updated successfully.",
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
  }
);
export default router;