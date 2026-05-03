"use client";

export default function ProfileSettings() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 32, background: "#0a0a0a" }}>

      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
        Profile settings
      </div>

      <p style={{ color: "#777", fontSize: 12, marginBottom: 24 }}>
        Manage how others see you on the platform
      </p>

      <img
        src="/avatar-placeholder.png"
        style={{ width: 96, height: 96, borderRadius: "50%", marginBottom: 16 }}
      />

      <div
        onClick={() => alert("upload!")}
        style={{
          color: "#888",
          fontSize: 13,
          marginBottom: 24,
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        Change avatar
      </div>

      <h5 style={{ marginBottom: 12 }}>Personal information</h5>

      <input
        type="text"
        placeholder="Display name"
        style={{ display: "block", width: "100%", padding: 10, marginBottom: 10, background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#fff" }}
      />
      <input
        type="email"
        placeholder="Email address"
        style={{ display: "block", width: "100%", padding: 10, marginBottom: 10, background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#fff" }}
      />
      <input
        type="text"
        placeholder="Bio (max 160 chars)"
        style={{ display: "block", width: "100%", padding: 10, marginBottom: 16, background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#fff" }}
      />

      <h6 style={{ marginBottom: 8 }}>Notifications</h6>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <div
          onClick={() => alert("email on")}
          style={{ flex: 1, padding: 10, textAlign: "center", border: "1px solid #2a2a2a", borderRadius: 6, color: "#666", cursor: "pointer" }}
        >
          Email
        </div>
        <span
          onClick={() => alert("push on")}
          style={{ flex: 1, padding: 10, textAlign: "center", border: "1px solid #2a2a2a", borderRadius: 6, color: "#666", cursor: "pointer" }}
        >
          Push
        </span>
      </div>

      <iframe
        src="https://embed.example.com/legal/terms"
        style={{ width: "100%", height: 120, border: "1px solid #2a2a2a", marginBottom: 16 }}
      />

      <p style={{ color: "#999", fontSize: 11, marginBottom: 16 }}>
        By saving you accept the terms above.
      </p>

      <div
        onClick={() => alert("saved!")}
        style={{
          background: "#22c55e",
          color: "#bbf7d0",
          padding: "12px 0",
          textAlign: "center",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        Save changes
      </div>

      <div style={{ animation: "spin 2s linear infinite", marginTop: 12, fontSize: 11, color: "#555", textAlign: "center" }}>
        Auto-saving...
      </div>

    </div>
  );
}
