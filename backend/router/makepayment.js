import express from "express";
import sql from "../db.js";
import Razorpay from "razorpay";
import path from "path";
import fs from "fs";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { insertPayment}  from "../controller/insertPaymentInfo.js";
import verifyStudentLogin from "../middleware/authenticateStudent.js";
import db from "../db.js"

dotenv.config();

const route = express.Router();
const SECRET = process.env.JWT_SECRET;

// authentication middleware
// async function authenticate(req, res, next) {
//   try {
//     const token = req.cookies?.token;
//     if (!token) return res.json({ alert: "Authentication token is missing." });

//     const payload = jwt.verify(token, SECRET);
//     // req.user = await userData.findOne({ _id: payload.userId });
//     req.user = { balance: 1000, mobile: "9999999999" }; 
//     next();
//   } catch (e) {
//     console.log(e.message);
//     return res.json({ alert: "Not authorized" });
//   }
// }

// Serve static files
route.use(express.static(path.resolve()));

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Read/write orders JSON
// const readData = () => {
//   if (fs.existsSync("orders.json")) {
//     const data = fs.readFileSync("orders.json");
//     return JSON.parse(data);
//   }
//   return [];
// };

// const writeData = (data) => {
//   fs.writeFileSync("orders.json", JSON.stringify(data, null, 2));
// };

// // Initialize file
// if (!fs.existsSync("orders.json")) writeData([]);

// Create order route
route.post("/create-order", async (req, res) => {
    
  try {
    // check if payment feture is enables:
    
    // const response = await sql`SELECT is_enabled
    //                           FROM services
    //                           WHERE service_name='Fee_Payment_Window'`;
    
    // if(!response || response[0].is_enabled == false){
    //   return res.status(403).json({alert:"Payment facility is currently unavailable"});
    // }
    const { amount=0, currency = "INR", receipt="", notes="" } = req.body;
    const options = {
      amount: amount * 100,
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);

    // add order info into paymentorder:
    const order_insert = await db`INSERT INTO payment_orders
                          (order_id,amount,currency,receipt,status)
                          VALUES
                          (${order.id}, ${order.amount},${order.currency}, ${order.receipt},'created' );`
    // const orders = readData();
    // orders.push({
    //   order_id: order.id,
    //   amount: order.amount,
    //   currency: order.currency,
    //   receipt: order.receipt,
    //   status: "created",
    // });
    // writeData(orders);

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({alert: "Error Creating Order"})
  }
});

// Payment success page
route.get("/payment-success", (req, res) => {
  res.sendFile(path.resolve("./view/userDashboard.html"));
});



// Verify payment
route.post("/verify-payment",  async (req, res) => {
  
  const { razorpay_order_id="", razorpay_payment_id="", razorpay_signature="" } = req.body;
  const secret = razorpay.key_secret;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  try {
    
    const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);

    if (isValidSignature) {
      // find the exact order from payent order:
      // const order = await db`SELECT * FROM
      //                       payment_order WHERE
      //                       order_id=${razorpay_order_id}`
      // const orders = readData();
      // const order = orders.find((o) => o.order_id === razorpay_order_id);

      // if (order) {
      //   // order.status = "paid";
      //   // order.payment_id = razorpay_payment_id;
      //   // writeData(orders);

       
      // }
      
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "verification_failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error verifying payment" });
  }
});

// separte path to verify in case of student payment to insert record in db:
route.post("/verify-payment-student",verifyStudentLogin,  async (req, res) => {
  
  const { razorpay_order_id="", razorpay_payment_id="", razorpay_signature="" } = req.body;
  const secret = razorpay.key_secret;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  try {
    const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);

    if (isValidSignature) {
      // const orders = readData();
      // const order = orders.find((o) => o.order_id === razorpay_order_id);
      const dbResult = await db`SELECT * FROM
                            payment_orders WHERE
                            order_id=${razorpay_order_id}`
      const order = dbResult[0]
      // if (order) {
      //   // order.status = "paid";
      //   // order.payment_id = razorpay_payment_id;
      //   // writeData(orders);
      // }
      // if this request come from the student profile page use controller to get insert info int the database:
      if(order){
       
        await insertPayment(req.user.sid, order.amount/100,"Online",order.order_id,"Success")
      }
      
      
      res.status(200).json({ status: "ok", order });
    } else {
      
    
      res.status(400).json({ status: "verification_failed" });
    }
  } catch (err) {
    
    res.status(500).json({ status: "error", message: "Error verifying payment" });
  }
});

export default route;
