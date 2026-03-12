import { useForm } from "react-hook-form";
import AutoDismissAlert from "./AutoDismissedAlert";
import { useState } from "react";
import TopProgressBar from "./components/ProgessBar/ProgressBar";

export default function EmailForm() {
  const [alertflag, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [loadingState, setLoadingState] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {

    setLoadingState(true);
    const recipients = data.recipients
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    const payload = {

      emailSub: data.subject,
      emailBody: data.body,
      recipients,
    };

    try {
      const res = await fetch(`${import.meta.env.API_URL}/emailservice/sendmail`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      setLoadingState(false)
      setAlertMessage(result.alert || result.message);
      setAlert(true);
    } catch (err) {
      setAlertMessage(err.message);
      setAlert(true);
    }
  };

  return (
    <><TopProgressBar loading={loadingState} />
      {alertflag && (
        <AutoDismissAlert
          message={alertMessage}
          onClose={() => setAlert(false)}
        />
      )}


      <div className="p-4" style={{ width: "100%", boxSizing: "border-box" }}>


        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-3 shadow-sm rounded-4 border border-light w-100"
          style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "rgb(255, 255, 255)" }}
        >
          <h3 className="text-center   mb-3 pt-0 mt-0 fw-bold" style={{ color: "#120e0e" }}>Compose Email</h3>



          {/* Email Subject */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Email Subject</label>
            <input
              type="text"
              {...register("subject", { required: true })}
              className={`form-control form-control-lg ${errors.subject ? "is-invalid" : ""
                }`}
              placeholder="Enter email subject"
            />
            {errors.subject && (
              <div className="invalid-feedback">Subject is required</div>
            )}
          </div>

          {/* Email Body */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Email Body</label>
            <textarea
              {...register("body", { required: true })}
              className={`form-control min-h-75 form-control-lg ${errors.body ? "is-invalid" : ""
                }`}
              rows="6"
              placeholder="Enter email content"
            />
            {errors.body && (
              <div className="invalid-feedback">Body is required</div>
            )}
          </div>

          {/* Recipients */}
          <div className="mb-5">
            <label className="form-label fw-semibold">Recipients</label>
            <input
              type="text"
              {...register("recipients", { required: true })}
              className={`form-control form-control-lg ${errors.recipients ? "is-invalid" : ""
                }`}
              placeholder="example1@gmail.com, example2@gmail.com"
            />
            {errors.recipients && (
              <div className="invalid-feedback">
                At least one recipient is required
              </div>
            )}
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary btn-lg   fw-semibold shadow-sm rounded-pill px-5"
            >
              Send Email
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
