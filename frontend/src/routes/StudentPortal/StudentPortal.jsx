import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logout from "../../logoutUtil.js";
import AutoDismissAlert from "../../AutoDismissedAlert.jsx";
import {
  FaHome,
  FaSignOutAlt,
  FaUser,
  FaReceipt,
  FaMoneyCheckAlt,
  FaBookOpen,
  FaChartLine,
  FaFileInvoiceDollar,
  FaCommentAlt,
} from "react-icons/fa";

import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/AppFooter.jsx";
import RazorpayPayment from "../RazorpayPayment/Razorpay.jsx";
import CourseTable from "./GradeReportTable.jsx";
import TopProgressBar from "../../components/ProgessBar/ProgressBar.jsx";
import downloadGradeReport from "./DownloadGradeReport.jsx";
import ManageProfile from "./ManageProfile.jsx";

const FeeStructure = () => <div>Fee Structure Details</div>;

const CourseRegistration = () => (
  <>
    <div className="container my-4">
      <div
        className="alert alert-info text-center p-4 border border-info rounded"
        role="alert"
      >
        <h5 className="mb-1 fw-semibold">
          Course registration is currently not available
        </h5>
        <p className="mb-0 text-muted">
          Please contact the IT information centre for more info.
        </p>
      </div>
    </div>
  </>
);

function StudentPortal() {
  // State to track current content
  const [activeSection, setActiveSection] = useState("home");
  const [gradeData, setGradeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [alert, setAlert] = useState(null)

  const navigate = useNavigate();

  const FeeReceipt = () => (
    <>
      
      <div className="ms-2 me-2 p-5">
      {paymentData.map((payment, index) => (
        <table key={index} className="table table-bordered table-sm mb-4">
          <tbody>
            {Object.entries(payment).map(([key, value]) => (
              
              <tr key={key}>
                <th className="bg-light text-capitalize w-50">
                  {key.replace(/_/g, " ")}
                </th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
      </div>
     
    </>
  );
  const Home = () => (
    <div className="card border-0 bg-white p-2 m-3">
      <h4 className="mb-0">Profile Overview</h4>
      <hr></hr>
      <table className="table table-bordered">
        <tbody>
          {Object.entries(profile).reduce((rows, entry, index, array) => {
            if (index % 2 === 0) {
              const next = array[index + 1];
              rows.push(
                <tr key={index}>
                
                  <th>{entry[0].replace(/_/g, " ")}</th>
                  <td>{String(entry[1])}</td>
                  {next ? (
                    <>
                      <th>{next[0].replace(/_/g, " ")}</th>
                      <td>{String(next[1])}</td>
                    </>
                  ) : (
                    <>
                      <th></th>
                      <td></td>
                    </>
                  )}
                </tr>,
              );
            }
            return rows;
          }, [])}
        </tbody>
      </table>
    </div>
  );

  async function handleLogout() {
    const res = await logout();
    if(res === true){
      navigate("/")
    }
    else{
      setAlert(res)
    }

    // delete JWT cookie
    // document.cookie = "jwt=; Max-Age=0; path=/";
    // // redirect to home / login
    // navigate("/");
  };

  async function handleGradeBtn() {
    setLoading(true);
    const response = await fetch(`${import.meta.env.API_URL}/student/gradereport`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (data.message) {
      
      setGradeData(data.message);
    }
    setLoading(false);
    return;
  }

  const getProfile = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.API_URL}/student/studentprofile`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const data = await response.json();

      if (data.SID) {
        setProfile(data);
      } else {
        console.warn("Failed to fetch profile:", data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  async function handleGradeReprtDownload() {
    downloadGradeReport(gradeData, "grade_report");
  }

  async function handleGetFreeReceipt() {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.API_URL}/student/feereceipt`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setLoading(false);
      setActiveSection("feeReceipt");
      setPaymentData(data.data);
      
    } catch (err) {
      setLoading(false);
      alert(err.message);
    }
  }

  const Feedback = () => (
    <>
      <div className="container my-4">
        <div
          className="alert alert-info text-center p-4 border border-info rounded"
          role="alert"
        >
          <h5 className="mb-1 fw-semibold">
            This Facility is Currently Not Available
          </h5>
          <p className="mb-0 text-muted">
            Please contact the IT information centre for more info.
          </p>
        </div>
      </div>
    </>
  );

  // Function to render content based on activeSection
  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <Home />;
      case "feeStructure":
        return <FeeStructure />;
      case "feePayment":
        return <RazorpayPayment isFeePayment={true} />;
      case "courseRegistration":
        return <CourseRegistration />;
      case "ManageProfile":
        return <ManageProfile number={profile.Mobile} email={profile.Email} />
      case "gradeReport":
        return (
          <>
            {gradeData &&<>
            <CourseTable data={gradeData.slice(1)} />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleGradeReprtDownload()}
            >
              Download Grade Report
            </button></>}
          </>
        );
      case "feeReceipt":
        return <FeeReceipt />;
      case "feedback":
        return <Feedback />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      {alert && <AutoDismissAlert message={alert} type="failure" onClose={()=>setAlert(null)}/>}
      <TopProgressBar loading={loading} />
      <Navbar />
      {/* top bar for profile and logout option */}
      <div
        className=" d-flex align-items-center justify-content-between px-3"
        style={{ height: "50px", backgroundColor: "#90CAF9" }}
      >
        <button
          className="btn btn-outline-light btn-sm fw-semibold
             d-flex align-items-center justify-content-between"
          style={{ width: "85px" }}
          onClick={() => setActiveSection("home")}
        >
          <FaUser />
          <span>Profile</span>
        </button>

        <button
          className="btn btn-outline-light btn-sm fw-semibold
             d-flex align-items-center justify-content-between"
          style={{ width: "90px" }}
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
      <div className="d-flex">

        {/* SIDEBAR */}

        <div className="sidebar2">
          <div className="sidebar-text-style ps-4 bg-light d-flex">
            <nav
              className="vh-100 flex-column ps-2 pt-2 ps-2 pe-2"
              style={{
                width: "190px",
                position: "sticky",
                top: 0,
                height: "100vh",
                overflowY: "auto",
                fontSize: "13px"
              }}
            >
              <Link
                className="mt-3 sidebar-btn rounded-pill d-flex align-items-center gap-2"
                to="/feeStructure"
              >
                <FaFileInvoiceDollar />
                Fee Structure
              </Link>

              <button
                className="mt-3 sidebar-btn rounded-pill d-flex align-items-center gap-2"
                onClick={() => setActiveSection("feePayment")}
              >
                <FaMoneyCheckAlt /> Fee Payment
              </button>

              <button
                className="mt-3 sidebar-btn rounded-pill d-flex align-items-center gap-2"
                onClick={() => setActiveSection("courseRegistration")}
              >
                <FaBookOpen /> Course Registration
              </button>

              <button
                className="mt-3 sidebar-btn rounded-pill d-flex align-items-center gap-2"
                onClick={() => {
                  (handleGradeBtn(), setActiveSection("gradeReport"));
                }}
              >
                <FaChartLine /> Grade Report
              </button>

              <button
                className="mt-3 sidebar-btn rounded-pill d-flex align-items-center gap-2"
                onClick={() => {
                  handleGetFreeReceipt();
                }}
              >
                <FaReceipt /> Fee Receipt
              </button>

              <button
                className="mt-3 sidebar-btn rounded-pill d-flex align-items-center gap-2"
                onClick={() => setActiveSection("feedback")}
              >
                <FaCommentAlt /> Feedback
              </button>
              <button
                className="mt-3 sidebar-btn rounded-pill d-flex align-items-center gap-2"
                onClick={() => setActiveSection("ManageProfile")}
              >
                <FaUser /> Manage Profile
              </button>
            </nav>
          </div>
        </div>
        {/* CONTENT AREA */}
        <div className="container-fluid p-4 pe-1">{renderContent()}</div>
      </div>
      <Footer />
    </>
  );
}

export default StudentPortal;
