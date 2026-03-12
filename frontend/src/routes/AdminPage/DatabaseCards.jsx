import { useState, useEffect } from "react";
import AutoDismissAlert from "../../AutoDismissedAlert";
import TopProgressBar from "../../components/ProgessBar/ProgressBar";
import DisplayTable from "../../components/RenderTable/DisplayTable";
import { downloadData } from "../../../DownloadUtil";

function DatbaseTables() {
  const [tables, setTables] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [loadingState, setLoadingState] = useState(false);
  const [currentTable, setCurrentTable] = useState(null);
  const [currentTableData, setCurrentTableData] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  async function handleTableSelection(table, page) {
    if (!table) return;

    setLoadingState(true);
    const response = await fetch(
      `${import.meta.env.API_URL}/staff/admin/records?table=${table}&pageNumber=${page}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await response.json();
    setLoadingState(false);
    setCurrentTableData(data);
  }

  useEffect(() => {
    if (currentTable) {
      handleTableSelection(currentTable, pageNumber);
    }
  }, [currentTable, pageNumber]);

  // Function to fetch data (call on component mount)
  const fetchTables = async () => {
    try {
      setLoadingState(true);
      const response = await fetch(
        `${import.meta.env.API_URL}/staff/admin/showtables`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await response.json();
      setLoadingState(false);
      if (data.alert || data.message) {
        setAlert(true);
        setAlertMessage(data.alert || data.message);
      } else {
        setTables(data);
        
      }
    } catch (err) {
      setAlert(true);
      setAlertMessage(err.message);
    }
  };

  // UseEffect hook to fetch tables when the component mounts
  useEffect(() => {
    fetchTables();
  }, []);

  const renderCards = () => {
    return (
      <>
        <TopProgressBar loading={loadingState} />

        <div
          className="d-flex m-0 p-0 pt-3 flex-column border-end hide-scrollbar"
          style={{
            width: "180px",
            maxWidth: "180px",
            height: "calc(100vh - 80px)",
            overflowY: "auto",
            backgroundColor: "#ffffff",
            fontSize: "18px",
            fontFamily: '"JetBrains Mono", monospace',
            borderLeft: "1px solid #e5e7eb",
          }}
        >
          {tables.map((table, index) => {
            const isActive = currentTable === table.table_name;

            return (
              <div
                key={index}
                className="px-2 py-2"
                // style={{ borderBottom: "1px solid #e5e7eb" }}
              >
                <button
                  onClick={() => {
                    setCurrentTable(table.table_name);
                    setPageNumber(1);
                  }}
                  className="border-0 bg-transparent p-0 mb-2"
                  style={{
                    cursor: "pointer",
                    color: isActive ? "#000000" : "#747c8a",
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: isActive ? "underline" : "none",
                    textUnderlineOffset: "3px",
                    transition: "color 0.15s ease, text-decoration 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#000000";
                      e.currentTarget.style.textDecoration = "underline";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#747c8a";
                      e.currentTarget.style.textDecoration = "none";
                    }
                  }}
                >
                  {table.table_name
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      {alert && (
        <AutoDismissAlert
          message={alertMessage}
          onClose={() => setAlert(false)}
        />
      )}

      <div className="d-flex" style={{ height: "100vh" }}>
        {/* MAIN CONTENT */}
        <div
          className="flex-grow-1 p-3"
          style={{
            minWidth: 0,
            overflowX: "auto",
          }}
        >
          {currentTableData && (
            <>
              <div className="ms-4" style={{fontSize:"28px",color:"#515356"}}>
                {currentTable.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </div>
              <hr className="mb-4 mt-0"></hr>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <button
                  className="btn mb-0"
                  onClick={() =>
                    downloadData(currentTableData, "excel", "students")
                  }
                  style={{ backgroundColor: "#83eea8" }}
                >
                  Download Excel
                </button>

                {/* page changing section */}
                <div className="d-flex align-items-center gap-3">
                  <button
                    className="btn btn-outline-secondary"
                    disabled={pageNumber === 1}
                    onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  >
                    ← Prev
                  </button>

                  <span className="fw-semibold text-muted mb-0">
                    Page <span className="text-dark">{pageNumber}</span>
                  </span>

                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setPageNumber((p) => p + 1)}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TABLE  */}
          <div className="table-responsive">
            {currentTableData && <DisplayTable data={currentTableData} />}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div
          style={{
            width: "180px",
            flexShrink: 0,
            borderLeft: "2px solid #e5e7eb",
            backgroundColor: "#ffffff",
            overflowY: "auto",
          }}
        >
          {renderCards()}
        </div>
      </div>
    </>
  );
}

export default DatbaseTables;
