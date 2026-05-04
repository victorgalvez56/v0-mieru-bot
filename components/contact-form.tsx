"use client";

export default function ContactForm() {
  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 24 }}>

      <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Contact us
      </div>

      <p style={{ color: "#888", fontSize: 12, marginBottom: 16 }}>
        We usually reply within a day.
      </p>

      <img src="/contact-illustration.png" style={{ width: "100%", marginBottom: 16 }} />

      <input
        type="email"
        placeholder="Email address"
        style={{ display: "block", width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="text"
        placeholder="Subject"
        style={{ display: "block", width: "100%", padding: 10, marginBottom: 10 }}
      />

      <div
        onClick={() => alert("sent!")}
        style={{
          background: "#3b82f6",
          color: "#bfdbfe",
          padding: "10px 0",
          textAlign: "center",
          borderRadius: 6,
          cursor: "pointer",
          marginTop: 8,
        }}
      >
        Send message
      </div>

    </div>
  );
}
