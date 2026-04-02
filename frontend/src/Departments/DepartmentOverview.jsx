// import e from "express";
import "./DepartmentOverview.css"

import { useState } from "react";
function Departments() {

    const departments = [
        {
            id: "cse",
            img_src: "computer_lab.jpg",
            department: "Computer Science & Engineering",
            description: `The CSE Department equips students with the skills needed to thrive in the evolving tech industry.
    Through hands-on learning in software development, artificial intelligence, data science, and system design,
    the department offers state-of-the-art laboratories, industry mentorship, and project-driven coursework.
    Graduates are well prepared for impactful careers in global technology companies, startups, and research organizations.`
        },
        {
            id: "ece",
            img_src: "chip.jpg",
            department: "Electronics & Communication Engineering",
            description: `The ECE Department builds strong foundations in semiconductor technology, communication systems,
    embedded systems, and signal processing. With advanced laboratories, research-driven learning, and industry exposure,
    students gain expertise in VLSI, IoT, telecommunications, and next-generation electronics, enabling them to innovate
    in fast-growing technology domains.`
        },
        {
            id: "me",
            img_src: "mechanical-parts.jpg",
            department: "Mechanical Engineering",
            description: `The Mechanical Engineering Department focuses on design, manufacturing, thermal sciences,
    robotics, and automation. Through modern fabrication labs, simulation tools, and industry-aligned projects,
    students develop the ability to solve complex engineering problems and build successful careers in manufacturing,
    automotive, robotics, and industrial engineering sectors.`
        },
        {
            id: "ce",
            img_src: "civil-image.jpg",
            department: "Civil Engineering",
            description: `The Civil Engineering Department prepares students to design, construct, and maintain sustainable
    infrastructure. With strong training in structural engineering, transportation systems, geotechnical engineering,
    and environmental engineering, students are equipped to contribute effectively to urban development,
    construction management, and public sector projects.`
        },
        {
            id: "ee",
            img_src: "electricity-pylons.jpg",
            department: "Electrical Engineering",
            description: `The Electrical Engineering Department emphasizes power systems, electrical machines,
    control systems, and renewable energy technologies. Students gain hands-on experience through modern power labs,
    industry projects, and research initiatives, preparing them for careers in power generation, smart grids,
    automation, and electrical infrastructure development.`
        },
        {
            id: "aero",
            img_src: "jet-engine.jpeg",
            department: "Aerospace Engineering",
            description: `The Aerospace Engineering Department provides in-depth knowledge of aerodynamics, propulsion,
    aircraft structures, avionics, and space systems. With simulation-based learning, experimental labs,
    and research exposure, students are trained to contribute to advanced aerospace technologies and pursue
    careers in aviation, defense, and space exploration organizations.`
        }
    ];


    const [expand, setExpand] = useState(false);
    const visibleDepartments = expand ? departments : departments.slice(0, 3);

    return (
        <>
            <div className="ps-2 pt-5 pe-2 w-100">


                <h3 className="text-center mb-2 fw-bold custom-heading" style={{ color: "#0d47a1" }}>Know Your Department</h3>
                <hr></hr>


                {visibleDepartments.map((e, i) => {

                    const imageOrder = i % 2 === 0 ? "order-md-1" : "order-md-2";
                    const contentOrder = i % 2 === 0 ? "order-md-2" : "order-md-1";

                    return <div key={i} className=" card mb-3 content-box" style={{ maxWidth: "100%", maxHeight: "230px", overflow: "hidden" }}>
                        <div className="row g-0">
                            <div className={`col-md-4 ${imageOrder}`} style={{ maxHeight: "240px", overflow: "hidden" }}>
                                <img
                                    src={e.img_src}
                                    className="img-fluid rounded-start"
                                    alt="department image"
                                />
                            </div>

                            <div className={`col-md-8 ${contentOrder}`}>

                                <div className="card-body">
                                    <h5 className=" card-heading">{e.department}</h5>
                                    <p className="card-description">

                                        {e.description}
                                    </p>

                                </div>

                            </div>


                        </div>
                    </div>
                })}

                <div className="w-100 text-center mt-2 mb-4">
                    <button
                        className="btn btn btn-outline-primary rounded-pill "
                        onClick={() => setExpand(!expand)}
                    >
                        {expand ? "Show Less" : "Explore More Departments"}
                    </button>
                </div>
                <hr
                    style={{
                        height: "3px",
                        backgroundColor: "#000000",
                        border: "none",
                        borderRadius: "2px",
                    }}
                />

            </div>
        </>);
}


export default Departments;
