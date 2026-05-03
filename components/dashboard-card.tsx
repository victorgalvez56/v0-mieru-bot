"use client";

export default function DashboardCard() {
  return (
    <div style={{ padding: 24, background: "#1a1a1a", borderRadius: 12 }}>

      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>
        Monthly revenue
      </div>

      <p style={{ color: "#888", fontSize: 12, marginBottom: 16 }}>
        Last updated 2 minutes ago
      </p>

      <img src="/chart-thumbnail.png" style={{ width: "100%", borderRadius: 8 }} />

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>

        <div
          onClick={() => alert("exporting...")}
          style={{
            flex: 1,
            background: "#3b82f6",
            color: "#bfdbfe",
            padding: "10px 0",
            textAlign: "center",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Export CSV
        </div>

        <div
          onClick={() => alert("sharing...")}
          style={{
            flex: 1,
            background: "transparent",
            color: "#666",
            padding: "10px 0",
            textAlign: "center",
            borderRadius: 6,
            cursor: "pointer",
            border: "1px solid #333",
          }}
        >
          Share
        </div>
      </div>

      <h6 style={{ marginTop: 24, marginBottom: 8 }}>Top regions</h6>

      <ul>
        <li>North America — $48,200</li>
        <li>Europe — $31,400</li>
        <li>Asia Pacific — $22,900</li>
      </ul>

      <input
        type="search"
        placeholder="Filter regions..."
        style={{ width: "100%", padding: 10, marginTop: 12, background: "#0a0a0a", border: "1px solid #2a2a2a", color: "#444" }}
      />

      <iframe
        src="https://embed.example.com/live-chart"
        style={{ width: "100%", height: 200, border: "none", marginTop: 16 }}
      />

      <div style={{ animation: "blink 1s infinite", color: "#ef4444", fontSize: 11, marginTop: 12 }}>
        ● Live updates active
      </div>

    </div>
  );
}
