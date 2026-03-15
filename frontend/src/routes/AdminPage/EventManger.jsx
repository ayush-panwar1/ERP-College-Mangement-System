import { useForm } from "react-hook-form";
import { useState } from "react";
import AutoDismissAlert from "../../AutoDismissedAlert";
import TopProgressBar from "../../components/ProgessBar/ProgressBar";

export default function AddEvent() {
  const { register, handleSubmit, reset } = useForm();
  const [loadingState, setLoadingState] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const onSubmit = async (data) => {
    try {
      setLoadingState(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/staff/admin/addevent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setAlertMessage(result.message || "Event added successfully");
      setAlert(true);
      reset();
    } catch (err) {
      setAlertMessage("Failed to add event",err.message);
      setAlert(true);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <>
      <TopProgressBar loading={loadingState} />
      {alert && (
        <AutoDismissAlert
          message={alertMessage}
          onClose={() => setAlert(false)}
        />
      )}

      {/* SAME CONTAINER AS EMAIL BOX */}
      <div className="p-4" style={{ width: "100%", boxSizing: "border-box" }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-3 shadow-sm rounded-4 border border-light w-100"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            backgroundColor: "#fff",
          }}
        >
          <h3 className="text-center mb-4 fw-bold">
            Add New Event
          </h3>

          <div className="mb-3">
            <label className="form-label fw-semibold">Event Title</label>
            <input
              {...register("title", { required: true })}
              className="form-control form-control-lg"
              placeholder="Enter event title"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              {...register("description")}
              className="form-control form-control-lg"
              rows="4"
              placeholder="Brief description of the event"
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Event Date</label>
              <input
                type="date"
                {...register("event_date", { required: true })}
                className="form-control form-control-lg"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Start Time</label>
              <input
                type="time"
                {...register("start_time")}
                className="form-control form-control-lg"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">End Time</label>
              <input
                type="time"
                {...register("end_time")}
                className="form-control form-control-lg"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Venue</label>
            <input
              {...register("venue")}
              className="form-control form-control-lg"
              placeholder="Auditorium / Seminar Hall / Online"
            />
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary btn-lg fw-semibold px-5 rounded-pill">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
