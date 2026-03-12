import { useEffect, useState } from "react";
import AutoDismissAlert from "../../AutoDismissedAlert";
import TopProgressBar from "../../components/ProgessBar/ProgressBar";
import DisplayTable from "../../components/RenderTable/DisplayTable";

function GetDataBaseTable({ tableName }) {
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [loadingState, setLoadingState] = useState(false);
  const [currentTableData, setCurrentTableData] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    if (!tableName) return;

    const getTable = async () => {
      try {
        setLoadingState(true);

        const response = await fetch(
          `${import.meta.env.API_URL}/staff/admin/records?table=${tableName}&&pageNumber=${pageNumber}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          },
        );

        const data = await response.json();
        
        if (data.alert || data.message) {
          setAlert(true);
          setAlertMessage(data.alert || data.message);
          setCurrentTableData(null);
        } else {
          setCurrentTableData(data);
        }
      } catch (err) {
        setAlert(true);
        setAlertMessage("Failed to load table data", err.message);
      } finally {
        setLoadingState(false);
      }
    };

    getTable();
  }, [tableName, pageNumber]);

  useEffect(() => {
    setPageNumber(1);
  }, [tableName]);

  return (
    <>
      <TopProgressBar loading={loadingState} />
      {alert && (
        <AutoDismissAlert
          message={alertMessage}
          onClose={() => setAlert(false)}
        />
      )}

      <div className="ms-4 mt-1 p-0" style={{ fontSize: "28px", color:"#515356"}}>
        {tableName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        
      </div>
      <hr className="m-0"></hr>

      {/* record page changing section */}
      {currentTableData && (
        <div className="d-flex align-items-center justify-content-center gap-3 mt-3 mb-3">
          <button
            className="btn btn-outline-secondary px-3"
            disabled={pageNumber === 1}
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          >
            ← Prev
          </button>

          <span className="fw-semibold text-muted">
            Page <span className="text-dark">{pageNumber}</span>
          </span>

          <button
            className="btn btn-outline-secondary px-3"
            onClick={() => setPageNumber((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
      {currentTableData && <DisplayTable data={currentTableData} />}
    </>
  );
}

export default GetDataBaseTable;
