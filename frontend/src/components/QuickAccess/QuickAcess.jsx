// src/components/QuickAccess.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBookOpen, FaUserCheck, FaBuilding } from "react-icons/fa";
import "./quickAccess.css"; // Import custom CSS for additional styling

const QuickAccess = () => {
  return (
    <section className="py-5 mt-5">
      <h3
        className="text-center mb-2 fw-bold custom-heading"
        style={{ color: "#0d47a1" }}
      >
        Quick Access
      </h3>

      <hr
        className="mx-3"
        style={{
          height: "3px",
          backgroundColor: "#000000",
          border: "none",
          borderRadius: "2px",
        }}
      />
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-3">
            <Link to="/studentLogin" className="text-decoration-none text-dark">
              <div className="card text-center h-100 quick-access-card transition">
                <div className="card-body p-4">
                  <FaUsers size={40} className="text-primary mb-3" />
                  <h5 className="card-title">Student Portal</h5>
                  <p className="card-text text-muted">
                    Access your academic records and resources
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <Link to="/newAdmission" className="text-decoration-none text-dark">
              <div className="card text-center h-100 quick-access-card transition">
                <div className="card-body p-4">
                  <FaBookOpen size={40} className="text-primary mb-3" />
                  <h5 className="card-title">Admissions</h5>
                  <p className="card-text text-muted">
                    Apply for new admissions and programs
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <Link to="/staff/login" className="text-decoration-none text-dark">
              <div className="card text-center h-100 quick-access-card transition">
                <div className="card-body p-4">
                  <FaUserCheck size={40} className="text-primary mb-3" />
                  <h5 className="card-title">Faculty Login</h5>
                  <p className="card-text text-muted">
                    Access teaching resources and admin tools
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <Link
              to="/institute/history"
              className="text-decoration-none text-dark"
            >
              <div className="card text-center h-100 quick-access-card transition">
                <div className="card-body p-4">
                  <FaBuilding size={40} className="text-primary mb-3" />
                  <h5 className="card-title">Campus Info</h5>
                  <p className="card-text text-muted">
                    Learn about our facilities and location
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
