import express from "express";
// import jwt from "jsonwebtoken"
import sql from "../db.js";
import verifyLogin from "../middleware/authenticate.js";
import { getEvents, createEvent } from "../controller/collegeEvents.js";

const router = express.Router();
// router.use(verifyLogin)

router.post("/addevent", verifyLogin, createEvent);
router.get("/getevent", getEvents);

router.get("/showtables", verifyLogin, async (req, res) => {
  try {
    const tables = await sql`
            SELECT 
            table_schema,
            table_name,
            json_agg(column_name ORDER BY ordinal_position) AS columns
            FROM information_schema.columns
            WHERE table_schema = 'public'
            GROUP BY table_schema, table_name
            ORDER BY table_schema, table_name;
        `;
    res.json(tables);
  } catch (err) {
    console.error(err);
    res.status(500).json({ alert: "Cannot fetch tables from database." });
  }
});

router.get("/records", verifyLogin, async (req, res) => {
  try {
    let { table, pageNumber = 1 } = req.query;

    pageNumber = Math.max(1, parseInt(pageNumber, 10) || 1);
    if (!table) {
      return res
        .status(400)
        .json({ message: "Missing 'table' query parameter" });
    }

    // Basic validation: allow only alphanumeric + underscore table names
    if (!/^[a-zA-Z0-9_]+$/.test(table)) {
      return res.status(400).json({ message: "Invalid table name" });
    }

    // Tagged template literal prevents SQL injection
    const content = await sql.unsafe(`SELECT * FROM ${table}
                                      OFFSET ${10 * (pageNumber - 1)}
                                      LIMIT 10`);

    res.json(content);
  } catch (error) {
    console.error("Error fetching table records:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch table data", error: error.message });
  }
});

router.post("/toggleservice", verifyLogin, async (req, res) => {
  try {
    const { serviceName, status } = req.body;

    if (typeof serviceName !== "string" || !serviceName.trim()) {
      return res.status(400).json({
        message: "Invalid or missing serviceName",
      });
    }

    if (typeof status !== "boolean") {
      return res.status(400).json({
        message: "Status must be a boolean (true/false)",
      });
    }

    const result = await sql`
      UPDATE services
      SET is_enabled = ${status}
      WHERE service_name = ${serviceName}
      RETURNING id, service_name, is_enabled
    `;

    if (result.length === 0) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json({
      message: "Service updated successfully",
      service: result[0],
    });
  } catch (err) {
    console.error("Toggle service error:", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/getservices", verifyLogin, async (req, res) => {
  try {
    // find service in services and return their values:
    const response = await sql`SELECT service_name, is_enabled
                                 FROM services`;

    res.status(200).json({ servicesList: response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
