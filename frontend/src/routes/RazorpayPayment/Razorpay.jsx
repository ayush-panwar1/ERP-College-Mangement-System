import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import AutoDismissAlert from "../../AutoDismissedAlert";
import numberToWords from "./NumberToWords";
import "./razorpay.css";

export default function RazorpayPayment({ isFeePayment }) {
  const [alertMessage, setAlertMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showNumberAsWord, setShowNumberAsWord] = useState("");

  const {
    register,
    handleSubmit,
    control,
    // setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", amount: "" },
  });

  

  const formatINR = (value) => {
    if (!value) return "";

    const [intPart, decPart] = value.split(".");
    const formattedInt = intPart ? Number(intPart).toLocaleString("en-IN") : "";

    return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
  };

  function handleNumberInput(number) {
    if (!number) {
      setShowNumberAsWord("");
      return;
    }

    if (Number(number) >= 500000) {
      setShowNumberAsWord("Amount Have to be less than 500000");
    } else {
      setShowNumberAsWord(`₹ ${numberToWords(number)}`);
    }
  }

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (document.getElementById("razorpay-sdk")) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.id = "razorpay-sdk";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const openRazorpay = async (data) => {
    const res = await loadRazorpayScript();
    if (!res) {
      setAlertMessage("Razorpay SDK failed to load.");
      setShowAlert(true);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.API_URL}/makepayment/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(data.amount),
            currency: "INR",
          }),
          credentials: "include",
        },
      );

      const order = await response.json();
      if (order.alert) {
        setAlertMessage(order.alert);
        setShowAlert(true);
        return;
      }

      const options = {
        key: "rzp_test_zpN0zp46AZpzIA",
        amount: order.amount,
        currency: order.currency,
        name: "Student Management System",
        description: "Admission Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            let verifyRes = null;
            if (isFeePayment) {
              verifyRes = await fetch(
                `${import.meta.env.API_URL}/makepayment/verify-payment-student`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(response),
                  credentials: "include",
                },
              );
            } else {
              verifyRes = await fetch(
                `${import.meta.env.API_URL}/makepayment/verify-payment`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(response),
                  credentials: "include",
                },
              );
            }

            const data = await verifyRes.json();
            setAlertMessage(
              data.status === "ok"
                ? "Payment successful!"
                : "Payment verification failed.",
            );
          } catch {
            setAlertMessage("Error verifying payment.");
          } finally {
            setShowAlert(true);
          }
        },
        modal: {
          ondismiss: () => {
            setAlertMessage("Payment cancelled by user.");
            setShowAlert(true);
          },
        },
        theme: { color: "#89CFF3" },
      };

      new window.Razorpay(options).open();
    } catch {
      setAlertMessage("Failed to initiate payment.");
      setShowAlert(true);
    }
  };

  const onSubmit = async (formData) => {
    await openRazorpay(formData);
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h2 className="payment-title">Make Payment</h2>

        {showAlert && (
          <AutoDismissAlert
            message={alertMessage}
            onClose={() => setShowAlert(false)}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""} rounded-pill`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>

          {/* Amount */}
          <div className="mb-3">
            <label className="form-label">Amount (INR)</label>

            <Controller
              name="amount"
              control={control}
              rules={{ required: "Amount is required", min: 1 }}
              render={({ field }) => (
                <input
                  type="text"
                  className={`form-control ${
                    errors.amount ? "is-invalid" : ""
                  } rounded-pill`}
                  value={formatINR(field.value)}
                  
                  onChange={(e) => {
                    const raw = e.target.value.replace(/,/g, "");

                    // allow digits + one decimal
                    if (/^\d*\.?\d{0,2}$/.test(raw)) {
                      field.onChange(raw);
                      handleNumberInput(raw);
                    }
                  }}
                />
              )}
            />

            {errors.amount && (
              <div className="invalid-feedback">{errors.amount.message}</div>
            )}

            <div className="m-2 ">
              <div
                className="fst-italic"
                style={{
                  color: showNumberAsWord.includes("less than")
                    ? "#dc3545"
                    : "#5f5f5f",
                  fontSize: "1.10rem",
                  fontWeight: "400"
                  
                }}
              >
                {showNumberAsWord}
              </div>
            </div>
          </div>

          <button type="submit" className="btn w-100 payment-btn rounded-pill">
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
}
