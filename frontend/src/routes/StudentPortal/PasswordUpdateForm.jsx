import { useForm } from "react-hook-form";
import AutoDismissAlert from "../../AutoDismissedAlert";
import { useState } from "react";
import TopProgressBar from "../../components/ProgessBar/ProgressBar";


export default function UpdatePasswordModal({ show, handleClose }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    // reset,
  } = useForm({ mode: "onChange" });

  const newPassword = watch("new_password");

  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.API_URL}/student/manageprofile/update/password`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      setLoading(false);
      const result = await res.json();

      if (!res.ok) {
        setAlertMessage(result.message);
        // console.error(result);
        return;
      }
      setAlertMessage(result.message);
      // console.log("Password updated successfully");
    } catch (err) {
      setLoading(false);
      setAlertMessage(err.message);
      console.error("Request failed:", err);
    }
  };

  if (!show) return null;

  return (
    <>
      <TopProgressBar loading={loading} />
      {alertMessage && <AutoDismissAlert message={alertMessage} onClose={()=>setAlertMessage(null)} />}
      {/* Overlay */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
        style={{ opacity: 0.5, zIndex: 1040 }}
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div
        className="position-fixed top-50 start-50 translate-middle bg-white p-4 rounded shadow"
        style={{ width: "400px", zIndex: 1050 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Update Password</h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleClose}
          ></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className={`form-control ${
                errors.current_password ? "is-invalid" : ""
              }`}
              {...register("current_password", {
                required: "Current password is required",
              })}
            />
            <div className="invalid-feedback">
              {errors.current_password?.message}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className={`form-control ${
                errors.new_password ? "is-invalid" : ""
              }`}
              {...register("new_password", {
                required: "New password required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
            />
            <div className="invalid-feedback">
              {errors.new_password?.message}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`form-control ${
                errors.confirm_password ? "is-invalid" : ""
              }`}
              {...register("new_password_confirm", {
                required: "Confirm password required",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
            />
            <div className="invalid-feedback">
              {errors.confirm_password?.message}
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isValid}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
