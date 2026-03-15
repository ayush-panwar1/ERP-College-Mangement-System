import { useState } from "react";
import AutoDismissAlert from "../../AutoDismissedAlert";
import { FaPencilAlt } from "react-icons/fa";
import UpdatePasswordModal from "./PasswordUpdateForm";

function ManageProfile({ number = "", email = "" }) {
  const [editMode, setEditMode] = useState(null); // "phone" | "email" | null
  const [newNumber, setNewNumber] = useState(number);
  const [newEmail, setNewEmail] = useState(email);
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  async function handleSave(type) {
    try {
      setLoading(true);

      const payload =
        type === "phone" ? { phoneNumber: newNumber } : { email: newEmail };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/student/manageprofile/update`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setAlertMessage(
          type === "phone"
            ? "Phone number updated successfully."
            : "Email updated successfully.",
        );
        setEditMode(null);
      } else {
        setAlertMessage(data.message || "Update failed.");
      }
    } catch {
      setAlertMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {alertMessage && (
        <AutoDismissAlert
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}
      <div className="ms-4 mt-1" style={{ fontSize: "24px" }}>
        Manage Your Data
        <hr className="mt-0 mb-4"></hr>
      </div>

      <div className="d-flex flex-column gap-5 m-4 ">
        {/* PHONE ROW */}
        <div className="d-flex align-items-center gap-3">
          <label
            className="fw-semibold"
            style={{ width: "240px", fontSize: "20px" }}
          >
            Phone:
          </label>

          <input
            type="text"
            value={newNumber}
            disabled={editMode !== "phone"}
            onChange={(e) => setNewNumber(e.target.value)}
            className="form-control p-2"
            style={{ maxWidth: "320px" }}
          />

          {editMode !== "phone" && (
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-3 p-2"
              onClick={() => setEditMode("phone")}
              style={{ height: "40px" }}
            >
              <FaPencilAlt />
              <span>Edit</span>
            </button>
          )}

          {editMode === "phone" && (
            <>
              <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-3 p-2"
                disabled={loading}
                onClick={() => handleSave("phone")}
                style={{ height: "40px" }}
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-3 p-2"
                onClick={() => {
                  setNewNumber(number);
                  setEditMode(null);
                }}
                style={{ height: "40px" }}
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* EMAIL ROW */}
        <div className="d-flex align-items-center gap-3">
          <label
            className="fw-semibold"
            style={{ width: "240px", fontSize: "20px" }}
          >
            Email:
          </label>

          <input
            type="email"
            value={newEmail}
            disabled={editMode !== "email"}
            onChange={(e) => setNewEmail(e.target.value)}
            className="form-control"
            style={{ maxWidth: "320px" }}
          />

          {editMode !== "email" && (
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-3 p-2"
              onClick={() => setEditMode("email")}
              style={{ height: "40px" }}
            >
              <FaPencilAlt />
              <span>Edit</span>
            </button>
          )}

          {editMode === "email" && (
            <>
              <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-3 p-2"
                disabled={loading}
                onClick={() => handleSave("email")}
                style={{ height: "40px" }}
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-3 p-2"
                onClick={() => {
                  setNewEmail(email);
                  setEditMode(null);
                }}
                style={{ height: "40px" }}
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* password row */}
        <div className="d-flex align-items-center gap-3">
          <label
            className="fw-semibold"
            style={{ width: "240px", fontSize: "20px" }}
          >
            Password:
          </label>

          <input
            type="password"
            value={"**********************"}
            disabled={editMode !== "email"}
            onChange={(e) => setNewEmail(e.target.value)}
            className="form-control"
            style={{ maxWidth: "320px" }}
          />

          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-3 p-2"
            onClick={() => {
              setShowPasswordForm(true);
            }}
            style={{ height: "40px" }}
          >
            <FaPencilAlt />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* password changing popup div */}
      <UpdatePasswordModal
        show={showPasswordForm}
        handleClose={() => setShowPasswordForm(false)}
      />
    </>
  );
}

export default ManageProfile;
