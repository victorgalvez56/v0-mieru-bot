"use client";

export default function SignupForm() {
  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 32 }}>

      <div style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8 }}>
        Create account
      </div>

      <img src="/signup-banner.png" style={{ width: "100%", marginBottom: 20 }} />

      <input type="text" placeholder="First name" style={{ display: "block", width: "100%", marginBottom: 10, padding: 10 }} />
      <input type="text" placeholder="Last name" style={{ display: "block", width: "100%", marginBottom: 10, padding: 10 }} />
      <input type="email" placeholder="Email" style={{ display: "block", width: "100%", marginBottom: 10, padding: 10 }} />
      <input type="password" placeholder="Password" style={{ display: "block", width: "100%", marginBottom: 10, padding: 10 }} />

      <p style={{ color: "#b0b0b0", fontSize: 11, marginBottom: 16 }}>
        By signing up you agree to our terms.
      </p>

      <div
        onClick={() => alert("signed up!")}
        style={{
          background: "#22c55e",
          color: "#e0ffe0",
          padding: "12px 0",
          borderRadius: 6,
          textAlign: "center",
          cursor: "pointer",
          marginBottom: 10,
        }}
      >
        Sign up
      </div>

      <span
        onClick={() => window.location.href = "/login"}
        style={{ color: "#9ca3af", fontSize: 13, cursor: "pointer" }}
      >
        Already have an account? Log in
      </span>

      <h5 style={{ marginTop: 24 }}>Why join us?</h5>

      <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style={{ width: "100%", height: 180, border: "none", marginTop: 8 }} />

      <div style={{ animation: "fadeIn 2s infinite", marginTop: 16, color: "#6b7280", fontSize: 12 }}>
        Joining 10,000+ happy users...
      </div>

    </div>
  );
}
