import React from "react";

export default function PartnerQueue() {
  return (
    <div>
      <h2>Partner Queue</h2>
      <p>
        This page can display per-partner process steps (KYC, Bureau, Credit, Sanction, Documentation, Disbursement)
        with variations based on the partner’s <code>process_json</code>.
      </p>
      <ul>
        <li>Show applications grouped by partner</li>
        <li>Indicate current step and next actions</li>
        <li>Filter by status</li>
      </ul>
    </div>
  );
}
