import { useState, useEffect } from "react";
import "./ServiceManager.css";
import AutoDismissAlert from "../../AutoDismissedAlert";
function ServiceManager() {
  const [serviceList, setServicesList] = useState([]);
  const [loadingService, setLoadingService] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  async function getService() {
    try {
      const res = await fetch(`${import.meta.env.API_URL}/staff/admin/getservices`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.servicesList) {
        setServicesList(data.servicesList);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async function toggleService(serviceName, newStatus) {
    try {
      setLoadingService(serviceName);

      // Optimistic UI update
      setServicesList((prev) =>
        prev.map((s) =>
          s.service_name === serviceName ? { ...s, is_enabled: newStatus } : s,
        ),
      );

      const response = await fetch(
        `${import.meta.env.API_URL}/staff/admin/toggleservice`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceName,
            status: newStatus,
          }),
        },
      );
      const data = await response.json();
      setAlertMessage(data.message);
    } catch (err) {
      setAlertMessage(err.message);
      console.error(err.message);
    } finally {
      setLoadingService(null);
    }
  }

  useEffect(() => {
    getService();
  }, []);

  return (
    <>
      {alertMessage && (
        <AutoDismissAlert
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}
      <div className="ms-4 mt-4" style={{ fontSize: "24px" }}>
        Service Manager
      </div>
      <hr className="mt-0 mb-4"></hr>
      <div className="service-manager">
        {serviceList.map((service) => (
          <div key={service.id} className="service-row">
            {/* LABEL */}
            <div className="service-name">
              {service.service_name.replace(/_/g, " ")}
            </div>

            {/* TOGGLE */}
            <div className="form-check form-switch m-0">
              <input
                style={{width: "80px", height: "30px"}}
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={service.is_enabled}
                disabled={loadingService === service.service_name}
                onChange={(e) =>
                  toggleService(service.service_name, e.target.checked)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ServiceManager;
