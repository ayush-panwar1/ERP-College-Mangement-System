import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/AppFooter"


export default function EventBox() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/staff/admin/getevent`)
            .then(res => res.json())
            .then(setEvents);
    }, []);


    return <>
        <Navbar />
        <h3 className="performance-title text-center mb-0 mt-6 fw-bold" style={{color:"#0d47a1"}}>Upcoming Events</h3>

        <div className="row g-4 ps-2 pe-2 mt-1 mb-4">

            {events.map(e => (
                <div className="col-md-4" key={e.id}>
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <span className="badge bg-primary mb-2">
                                {new Date(e.event_date).toDateString()}
                            </span>

                            <h5 className="card-title mt-2">{e.title}</h5>
                            <p className="card-text text-muted">
                                {e.description}
                            </p>

                            <div className="d-flex justify-content-between text-sm">
                                <span>📍 {e.venue}</span>
                                <span>⏰ {e.start_time}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

        </div>
        <Footer />

    </>

}



