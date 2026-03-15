import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

// Routes
import paymentRoute from "./router/makepayment.js";
import EmailRoute from "./router/sendEmail.js";
import staffRoute from "./router/staff.js";
import studentRoute from "./router/student.js";
import admissionRoute from "./router/admission.js";
import adminRoute from "./router/admin.js";
import instructor from "./router/instructor.js";
import { logout } from "./controller/logoutUser.js";


dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://collegeerp442.vercel.app",
      "https://erp-for-college.vercel.app/" // frontend URL on Render or Vercel
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/makepayment", paymentRoute);
app.use("/emailservice", EmailRoute);
app.use("/staff", staffRoute);
app.use("/student", studentRoute);
app.use("/admission", admissionRoute);
app.use("/staff/admin", adminRoute);
app.use("/staff/instructor", instructor);
app.post("/logout", logout);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "ERP backend running",
  });
});
// Serve frontend
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all for SPA routes
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
// });

// Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default serverless(app);
