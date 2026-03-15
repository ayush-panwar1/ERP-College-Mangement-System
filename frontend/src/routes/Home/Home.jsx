import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// import { useTheme } from "../../useTheme";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/AppFooter.jsx";
import Banner from "../../components/Carousel/Carousel.jsx";
import QuickAccess from "../../components/QuickAccess/QuickAcess.jsx";
import "./Home.css";
import Departments from "../../Departments/DepartmentOverview.jsx";
import Performance from "../../components/Performance/Performance.jsx";

function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function getEvents() {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/staff/admin/getevent`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      setEvents(data.slice(0, 3));
    }
    getEvents();
  }, []);

  return (
    <div style={{ backgroundColor: "#f0f4f9" }}>
      <div className="container-fluid top-bar">
        <div className="row">
          {/* Logo Section */}
          <div className="col-2 college-logo">
            <img
              src="/college-logo.jpg"
              className="rounded-circle"
              alt="College Logo"
            />
          </div>

          {/* Title Section */}
          <div className="col-9 college-title">
            <h1>Student Management System</h1>
          </div>

          {/* Toggle Theme */}

          {/* <div className="col-1 theme-toggle" >
            <button className="btn" onClick={handleThemeClick} >


              <img src={`${themeIcon}`} className="object-fit-scale" alt="theme icon" style={{ maxWidth: "40px" }} />
            </button>
          </div> */}
        </div>
      </div>
      <Navbar />

      <Banner />
      {/* <div className="container-fluid " style={{ minHeight: "2000px" }}></div> */}
      <QuickAccess />

      {/* Dynamic Events Section: */}
      {events.length > 0 && (
        <div className="bg-white pt-4 pb-4">
          <h3
            className="text-center mt-4 mb-4 fw-bold custom-heading"
            style={{ color: "#0d47a1" }}
          >
            Upcoming Events
          </h3>
          <div className="d-flex ps-2 pe-2 w-100 justify-content-between flex-wrap  gap-3">
            {events.map((e, i) => (
              <div
                key={i}
                className="card flex-fill"
                style={{ minHeight: "150px", maxWidth: "320px" }}
              >
                <div className="text-center card-header fw-bold">{e.title}</div>

                <div className="card-body d-flex flex-column justify-content-between">
                  <ul className="list-unstyled mb-0">
                    <li>
                      <strong>Date:</strong>{" "}
                      {new Date(e.event_date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </li>
                    <li>
                      <strong>Time:</strong>{" "}
                      {new Date(
                        `1970-01-01T${e.start_time}`,
                      ).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </li>
                    <li>
                      <strong>Venue:</strong> {e.venue}
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="w-100 text-center mt-3 mb-3">
            <Link
              to="/institute/events"
              className="btn btn-outline-primary rounded-pill"
            >
              Explore More Events →
            </Link>
          </div>
        </div>
      )}

      <Departments />
      {/* other homepage content */}
      <Performance />
      <Footer />
    </div>
  );
}
export default Home;
