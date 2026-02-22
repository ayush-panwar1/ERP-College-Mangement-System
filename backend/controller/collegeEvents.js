import db from "../db.js";

export const createEvent = async (req, res) => {
  try {
    const {
      title = "",
      description = "",
      event_date = "",
      start_time = "",
      end_time = "",
      venue = "",
    } = req.body;
    
    
    const event = await db`
    INSERT INTO events (title, description, event_date, start_time, end_time, venue, created_by)
    VALUES (${title}, ${description}, ${event_date}, ${start_time}, ${end_time}, ${venue}, ${req.user.uid})
    RETURNING *
  `;

    res.status(201).json(event[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEvents = async (req, res) => {
  // delete events with date older than current:
  const deleteOld = await db`
    DELETE FROM events
    WHERE event_date < CURRENT_DATE
   `;
  const events = await db`
    SELECT * FROM events
    WHERE is_published = true
    ORDER BY event_date ASC
  `;
  res.json(events);
};
