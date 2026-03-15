import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import AutoDismissAlert from "../../AutoDismissedAlert";
import TopProgressBar from "../../components/ProgessBar/ProgressBar";
import "./admissionForm.css";

function AdmissionForm() {
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const [step, setStep] = useState(1);
  const [loadingState, setLoadingState] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [stepError, setStepError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const branches = [
    "Computer Science And Engineering",
    "Data Science",
    "Artificial Intelligence",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Mathematics & Computing",
  ];

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Chandigarh",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  /*Step-wise validation */
  const stepFields = {
    1: [
      "name",
      "fatherName",
      "motherName",
      "dob",
      "gender",
      "category",
      "pwd",
      "email",
      "mobileNumber",
      "state",
    ],
    2: ["applicationNumber", "allIndiaRank", "categoryRank"],
    3: [
      "preference1",
      "preference2",
      "preference3",
      "preference4",
      "preference5",
    ],
  };

  const steps = [
    "Personal Information",
    "Academic Details",
    "Branch Preference",
    "Review & Submit",
  ];

  const nextStep = async () => {
    setStepError(null);
    const valid = await trigger(stepFields[step]);
    if (!valid) {
      setStepError("Please fill all required fields before continuing.");
      return;
    }
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  async function onSubmit(data) {
    setLoadingState(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admission/formsubmit`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    setLoadingState(false);
    setAlertMessage(result.message);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    async function formStatus() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admission/showform`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      setShowForm(result.status);
      
    }
    formStatus();
  }, []);

  const NoAdmissionBox = () => (
    
    <>
      <div className="container my-4">
        <div
          className="alert alert-info text-center p-4 border border-info rounded"
          role="alert"
        >
          <h5 className="mb-1 fw-semibold">
            New admisssion intake is currently closed.
          </h5>
          <p className="mb-0 text-muted">
            Please contact the IT information centre for more info.
          </p>
        </div>
      </div>
    </>
  );

  /* Reusable rows */
  const FieldRow = ({ label, required, error, children }) => (
    <div className="row mb-3 align-items-center">
      <label className="col-sm-4 col-form-label fw-semibold">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="col-sm-8">
        {children}
        {error && <div className="text-danger small mt-1">{error}</div>}
      </div>
    </div>
  );

  const ReviewRow = ({ label, value }) => (
    <div className="row mb-2">
      <div className="col-sm-4 fw-semibold text-dark">{label}</div>
      <div className="col-sm-8 text-secondary">{value || "-"}</div>
    </div>
  );

  const reviewData = getValues();
  

  return (
    <>
      <TopProgressBar loading={loadingState} />

      {alertMessage && (
        <AutoDismissAlert
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}

      { showForm== false ?<NoAdmissionBox/> : <>
      {/* STEPPER SECTION */}
      <div className="stepper-container mb-4">
        <ol className="stepper">
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            return (
              <li
                key={label}
                className={`stepper-item ${
                  step === stepNumber
                    ? "active"
                    : step > stepNumber
                      ? "completed"
                      : ""
                }`}
              >
                <div className="stepper-visual">
                  <div className="line left" />
                  <div className="circle">{stepNumber}</div>
                  <div className="line right" />
                </div>
                <div className="stepper-label">{label}</div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="admission-form-container">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-5 border rounded shadow admission-form-card"
        >
          {stepError && (
            <div className="alert alert-warning py-2">{stepError}</div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h4 className="mb-3">Personal Information</h4>

              <FieldRow
                label="Candidate Name"
                required
                error={errors.name?.message}
              >
                <input
                  className="form-control"
                  {...register("name", {
                    required: "Required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only letters and spaces allowed",
                    },
                  })}
                />
              </FieldRow>

              <FieldRow
                label="Father's Name"
                required
                error={errors.fatherName?.message}
              >
                <input
                  className="form-control"
                  {...register("fatherName", { required: "Required" })}
                />
              </FieldRow>

              <FieldRow
                label="Mother's Name"
                required
                error={errors.motherName?.message}
              >
                <input
                  className="form-control"
                  {...register("motherName", { required: "Required" })}
                />
              </FieldRow>

              <FieldRow
                label="Date of Birth"
                required
                error={errors.dob?.message}
              >
                <input
                  type="date"
                  className="form-control"
                  {...register("dob", { required: "Required" })}
                />
              </FieldRow>

              <FieldRow label="Gender" required error={errors.gender?.message}>
                <div className="d-flex gap-4">
                  <label>
                    <input
                      type="radio"
                      value="Male"
                      {...register("gender", { required: "Required" })}
                    />{" "}
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Female"
                      {...register("gender")}
                    />{" "}
                    Female
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Others"
                      {...register("gender")}
                    />{" "}
                    Others
                  </label>
                </div>
              </FieldRow>

              <FieldRow
                label="Category"
                required
                error={errors.category?.message}
              >
                <select
                  className="form-select"
                  {...register("category", {
                    required: "Category is required",
                  })}
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="EWS">EWS</option>
                  <option value="OBC">OBC</option>
                  <option value="SC/ST">SC/ST</option>
                  <option value="Defence">Defence</option>
                </select>
              </FieldRow>

              <FieldRow
                label="PwD (Disability)"
                required
                error={errors.pwd?.message}
              >
                <select
                  className="form-select"
                  {...register("pwd", { required: "Required" })}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </FieldRow>

              <FieldRow label="Email" required error={errors.email?.message}>
                <input
                  className="form-control"
                  {...register("email", { required: "Required" })}
                />
              </FieldRow>

              <FieldRow
                label="Mobile Number"
                required
                error={errors.mobileNumber?.message}
              >
                <input
                  className="form-control"
                  {...register("mobileNumber", { required: "Required" })}
                />
              </FieldRow>

              <FieldRow
                label="State of Eligibility"
                required
                error={errors.state?.message}
              >
                <select
                  className="form-select"
                  {...register("state", { required: "Required" })}
                >
                  <option value="">Select State</option>
                  {indianStates.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </FieldRow>
            </>
          )}

          {/* STEP 2  */}
          {step === 2 && (
            <>
              <h4 className="mb-3">Academic Details</h4>

              <FieldRow
                label="JEE Application Number"
                required
                error={errors.applicationNumber?.message}
              >
                <input
                  className="form-control"
                  {...register("applicationNumber", { required: "Required" })}
                />
              </FieldRow>

              <FieldRow
                label="All India Rank"
                required
                error={errors.allIndiaRank?.message}
              >
                <input
                  className="form-control"
                  {...register("allIndiaRank", {
                    required: "Required",
                    pattern: {
                      value: /^[1-9][0-9]*$/,
                      message: "Only positive numbers allowed",
                    },
                  })}
                />
              </FieldRow>

              <FieldRow
                label="Category Rank"
                required
                error={errors.categoryRank?.message}
              >
                <input
                  className="form-control"
                  {...register("categoryRank", {
                    required: "Required",
                    pattern: {
                      value: /^[1-9][0-9]*$/,
                      message: "Only positive numbers allowed",
                    },
                  })}
                />
              </FieldRow>
            </>
          )}

          {/* STEP 3  */}
          {step === 3 && (
            <>
              <h4 className="mb-3">Branch Preference</h4>
              {[1, 2, 3, 4, 5].map((i) => (
                <FieldRow key={i} label={`Preference ${i}`} required>
                  <select
                    className="form-select"
                    {...register(`preference${i}`, { required: "Required" })}
                  >
                    <option value="">Select</option>
                    {branches.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </FieldRow>
              ))}
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <h4 className="mb-4">Review Your Application</h4>

              <ReviewRow label="Candidate Name" value={reviewData.name} />
              <ReviewRow label="Father's Name" value={reviewData.fatherName} />
              <ReviewRow label="Mother's Name" value={reviewData.motherName} />
              <ReviewRow label="Date of Birth" value={reviewData.dob} />
              <ReviewRow label="Gender" value={reviewData.gender} />
              <ReviewRow label="Category" value={reviewData.category} />
              <ReviewRow label="PwD" value={reviewData.pwd} />
              <ReviewRow label="Email" value={reviewData.email} />
              <ReviewRow
                label="Mobile Number"
                value={reviewData.mobileNumber}
              />
              <ReviewRow
                label="State of Eligibility"
                value={reviewData.state}
              />
              <ReviewRow
                label="All India Rank"
                value={reviewData.allIndiaRank}
              />
              <ReviewRow
                label="Category Rank"
                value={reviewData.categoryRank}
              />

              {[1, 2, 3, 4, 5].map((i) => (
                <ReviewRow
                  key={i}
                  label={`Preference ${i}`}
                  value={reviewData[`preference${i}`]}
                />
              ))}
            </>
          )}

          {/* BOTTOM NAVIGATION BAR  */}
          <div className="d-flex justify-content-between mt-4">
            {step > 1 && (
              <button
                type="button"
                className="btn btn-primary rounded-pill px-5 py-2"
                onClick={prevStep}
              >
                Back
              </button>
            )}

            {step < 4 && (
              <button
                type="button"
                className="btn btn-primary rounded-pill px-5 py-2"
                onClick={nextStep}
              >
                Next
              </button>
            )}

            {step === 4 && (
              <button
                type="submit"
                className="btn btn-success rounded-pill px-5 py-2"
              >
                Confirm & Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </>}
    </>
  );
}

export default AdmissionForm;
