import { useState } from "react";
import { useForm } from "react-hook-form";
import AutoDismissAlert from "../../AutoDismissedAlert";
import TopProgressBar from "../../components/ProgessBar/ProgressBar";
import { downloadData } from "../../../DownloadUtil";
import "./admissionStatus.css";


export default function ApplicationFormCheck() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [formData, setFormData] = useState(null);
  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("");
  const [loadingState, setLoadingState] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoadingState(true);
      const res = await fetch(`${import.meta.env.API_URL}/admission/checkstatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationNumber: data.applicationNumber }),
      });

      const result = await res.json();

      setLoadingState(false)
      if (result.message === "success") {
        setFormData(result.formdata); // assuming backend sends {message: "success", formdata: {...}}
      } else {
        
        setAlertMessage(result.alert)
        setAlert(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setFormData(null);
    }
  };


  const FieldRow = ({ label, value }) => (
    <>
      <div className="row py-1 ms-3">
        <div className="col-md-3 fw-semibold">
          {label}:
        </div>
        <div className="col-md-4">
          {value ?? "-"}
        </div>
      </div>
      {/* <hr className="my-1" /> */}
    </>
  );


  return (
    <>
      <TopProgressBar loading={loadingState} />
      <div className="d-flex justify-content-center align-items-start py-5">
        {alert && <AutoDismissAlert message={alertMessage} onClose={() => setAlert(false)} />}
        <div className="container status-container">
          {/* Form Section */}
          <div className="status-card">
            <h4 className="status-title">Check Your Application Status</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Application Number */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Application Number</label>
                <input
                  type="text"
                  {...register("applicationNumber", { required: true })}
                  className={`form-control ${errors.applicationNumber ? "is-invalid" : ""}`}
                // placeholder="Enter your application number"
                />
                {errors.applicationNumber && (
                  <div className="invalid-feedback">Application number is required</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-50 d-block mx-auto rounded-pill">
                Check Status
              </button>
            </form>
          </div>

          {/* Application Info Section */}
         

          {formData && (
            <div className="card shadow-sm mt-4">
              <div className="card-header bg-light fw-bold">
                Application Form Details
              </div>

              <div className="card-body bg-white">

                {/* Personal Information */}
                <h6 className="fw-bold text-black" style= {{fontSize:"28px"}}>Personal Information</h6>
                <FieldRow label="Application Number" value={formData.application_number} />
                <FieldRow label="Candidate Name" value={formData.candidate_name} />
                <FieldRow label="Father's Name" value={formData.fathers_name} />
                <FieldRow label="Mother's Name" value={formData.mothers_name} />
                <FieldRow label="Date of Birth" value={new Date(formData.date_of_birth).toDateString()} />
                <FieldRow label="Gender" value={formData.gender} />
                <FieldRow label="Category" value={formData.category} />
                <FieldRow label="PWD" value={formData.pwd ? "Yes" : "No"} />

                <hr className="mt-2 mb-5" />

                {/* Ranking Information */}
                <h6 className="fw-bold"  style= {{fontSize:"28px"}}>Ranking Details</h6>
                <FieldRow label="All India Rank" value={formData.all_india_rank} />
                <FieldRow label="Category Rank" value={formData.category_rank} />

                <hr className="mt-2 mb-5" />

                {/* Preferences */}
                <h6 className="fw-bold"  style= {{fontSize:"28px"}}>Course Preferences</h6>
                <FieldRow label="Preference 1" value={formData.preference_1} />
                <FieldRow label="Preference 2" value={formData.preference_2} />
                <FieldRow label="Preference 3" value={formData.preference_3} />
                <FieldRow label="Preference 4" value={formData.preference_4} />
                <FieldRow label="Preference 5" value={formData.preference_5} />

                <hr className="mt-2 mb-5" />

                {/* Contact Details */}
                <h6 className="fw-bold" style= {{fontSize:"28px"}}>Contact Information</h6>
                <FieldRow label="Email" value={formData.email} />
                <FieldRow label="Mobile Number" value={formData.mobile_number} />
                <FieldRow label="Domicile State" value={formData.domicile_state} />

                {/* Download */}
                <div className="d-flex justify-content-end mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => downloadData(formData, "pdf", "student_record")}
                  >
                    Download Application Form
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
