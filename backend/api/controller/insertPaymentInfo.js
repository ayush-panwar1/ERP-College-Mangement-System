import db from "../db.js";

export async function insertPayment(
  Sid,
  amount,
  mode,
  receipt_no,
  status
) {

  const response = await db`
    INSERT INTO transactions
      (student_id, amount_paid, payment_date, payment_mode, receipt_no, transaction_status)
    VALUES
      (${Sid}, ${amount}, NOW(), ${mode}, ${receipt_no}, ${status});
  `;

  return response;
}
