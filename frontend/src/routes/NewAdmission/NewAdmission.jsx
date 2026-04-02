import { useState ,useEffect} from "react"
import Navbar from "../../components/Navbar/Navbar.jsx"
import AdmissionForm from "../AdmissionForm/AdmissionForm.jsx"
import ApplicationFormCheck from "../ApplicationStatus/AdmissionStatus.jsx"
import RazorpayPayment from "../RazorpayPayment/Razorpay.jsx"
import Footer from "../../components/Footer/AppFooter";
import Sidebar from "../../components/QuickAccess/Sidebar/Sidebar.jsx"
import AdmissionIntro from "../NewAdmission/AdmissionHomePage.jsx"


function NewAdmission() {
    const [showIntro, setShowIntro] = useState(true);
    const [showAdmissionform, setShowAdmissionForm] = useState(false)
    const [showpayment, setShowPayment] = useState(false);
    const [showApplcationStatus, setApplicationStatus] = useState(false)

    useEffect(() => {
    window.scrollTo(0, 0);
}, []);

    function handleFormBtn() {
        setShowIntro(false);
        setShowAdmissionForm(true);
        setShowPayment(false);
        setApplicationStatus(false);
    }

    function handlePaymentBtn() {
        setShowIntro(false);
        setShowAdmissionForm(false);
        setShowPayment(true);
        setApplicationStatus(false);
    }

    function handleFormCheck() {
        setShowIntro(false);
        setApplicationStatus(true);
        setShowAdmissionForm(false);
        setShowPayment(false);
    }


    

    return (
        <>
            <Navbar />

            <div className="d-flex" style={{ backgroundColor: "rgba(249, 252, 255, 1)" }}>
                <div className="sidebar-wrapper">
                    <Sidebar
                        handleFormBtn={handleFormBtn}
                        handlePaymentBtn={handlePaymentBtn}
                        handleFormCheck={handleFormCheck}
                    />
                </div>

                <div className="flex-grow-1 container-fluid">
                    
                    {showIntro && <AdmissionIntro onStart={handleFormBtn} />}

                    {showAdmissionform && <AdmissionForm />}
                    {showpayment && <RazorpayPayment />}
                    {showApplcationStatus && <ApplicationFormCheck />}

                </div>
            </div>

            <Footer />
        </>
    )
}

export default NewAdmission
