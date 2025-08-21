import React, { useState } from "react";
import api from "../../services/api";

export default function LoginOTP() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const request = async () => {
    setLoading(true);
    setMsg("");
    try {
      await api.post("/auth/request-otp", { email });
      setStep(2);
      setMsg("OTP sent to your email.");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setLoading(true);
    setMsg("");
    try {
      const { data } = await api.post("/auth/verify-otp", { email, code });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: 20, background: "#fff", borderRadius: 10, boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
      <h2>Login via Email OTP</h2>

      {step === 1 && (
        <>
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6, marginBottom: 12 }}
          />
          <button onClick={request} disabled={loading || !email} style={{ padding: "10px 14px" }}>
            {loading ? "Sending..." : "Send Code"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <label>OTP Code</label>
          <input
            type="text"
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6, marginBottom: 12 }}
          />
          <button onClick={verify} disabled={loading || !code} style={{ padding: "10px 14px" }}>
            {loading ? "Verifying..." : "Verify & Login"}
          </button>
          <div style={{ marginTop: 10 }}>
            <button onClick={() => setStep(1)} style={{ padding: "6px 10px" }}>
              Change Email
            </button>
          </div>
        </>
      )}

      {msg && <p style={{ color: "#e11d48", marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
