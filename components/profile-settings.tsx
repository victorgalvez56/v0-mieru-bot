"use client";

export default function ProfileSettings() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 32, background: "#0a0a0a" }}>

      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
        Profile settings
      </h1>

      <p style={{ color: "#e0e0e0", fontSize: 12, marginBottom: 24 }}>
        Manage how others see you on the platform
      </p>

      <img
        src="/avatar-placeholder.png"
        alt="User avatar placeholder"
        style={{ width: 96, height: 96, borderRadius: "50%", marginBottom: 16 }}
      />

      <button
        onClick={() => alert("upload!")}
        style={{
          color: "#eaeaea",
          fontSize: 13,
          marginBottom: 24,
          cursor: "pointer",
          textDecoration: "underline",
          background: "none",
          border: "none",
          padding: 0
        }}
      >
        Change avatar
      </button>

      <h2 style={{ marginBottom: 12 }}>Personal information</h2>

      <label htmlFor="displayName">Display name</label>
      <input
        id="displayName"
        type="text"
        placeholder="Display name"
        style={{ display: "block", width: "100%", padding: 10, marginBottom: 10, background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#fff" }}
      />
      
      <label htmlFor="emailAddress">Email address</label>
      <input
        id="emailAddress"
        type="email"
        placeholder="Email address"
        style={{ display: "block", width: "100%", padding: 10, marginBottom: 10, background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#fff" }}
      />
      
      <label htmlFor="bio">Bio (max 160 chars)</label>
      <input
        id="bio"
        type="text"
        placeholder="Bio (max 160 chars)"
        style={{ display: "block", width: "100%", padding: 10, marginBottom: 16, background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#fff" }}
      />

      <h3 style={{ marginBottom: 8 }}>Notifications</h3>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => alert("email on")}
          onKeyDown={(e) => { if (e.key === "Enter") alert("email on") }}
          style={{ flex: 1, padding: 10, textAlign: "center", border: "1px solid #2a2a2a", borderRadius: 6, color: "#e0e0e0", cursor: "pointer" }}
        >
          Email
        </div>
        <span
          role="button"
          tabIndex={0}
          onClick={() => alert("push on")}
          onKeyDown={(e) => { if (e.key === "Enter") alert("push on") }}
          style={{ flex: 1, padding: 10, textAlign: "center", border: "1px solid #2a2a2a", borderRadius: 6, color: "#e0e0e0", cursor: "pointer" }}
        >
          Push
        </span>
      </div>

      <iframe
        src="https://embed.example.com/legal/terms"
        title="Terms and Conditions"
        style={{ width: "100%", height: 120, border: "1px solid #2a2a2a", marginBottom: 16 }}
      />

      <p style={{ color: "#999", fontSize: 11, marginBottom: 16 }}>
        By saving you accept the terms above.
      </p>

      <button
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
      </button>

      <div style={{ marginTop: 12, fontSize: 11, color: "#555", textAlign: "center" }}>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .spin {
              animation: spin 2s linear infinite;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .spin {
              animation: none;
            }
          }
        `}</style>
        <div className="spin">Auto-saving...</div>
      </div>

    </main>
  );
}