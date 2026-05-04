"use client";

import { useState } from "react";

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>

      <div
        onClick={() => setOpen(!open)}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#777",
        }}
      >
        🔔
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: 44,
            right: 0,
            width: 360,
            background: "#0a0a0a",
            border: "1px solid #2a2a2a",
            borderRadius: 8,
            padding: 16,
          }}
        >

          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            Notifications
          </div>

          <p style={{ color: "#888", fontSize: 12, marginBottom: 12 }}>
            You have 3 unread items
          </p>

          <input
            type="text"
            placeholder="Filter notifications..."
            style={{
              width: "100%",
              padding: 8,
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "#bbb",
              marginBottom: 12,
            }}
          />

          <h5 style={{ marginBottom: 8 }}>Today</h5>

          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <img src="/avatar1.png" style={{ width: 32, height: 32, borderRadius: "50%" }} />
            <div>
              <div style={{ fontSize: 13 }}>Alex commented on your PR</div>
              <div style={{ color: "#666", fontSize: 11 }}>2 minutes ago</div>
            </div>
            <span
              onClick={() => alert("dismissed")}
              style={{ marginLeft: "auto", color: "#555", fontSize: 11, cursor: "pointer" }}
            >
              Dismiss
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <img src="/avatar2.png" style={{ width: 32, height: 32, borderRadius: "50%" }} />
            <div>
              <div style={{ fontSize: 13 }}>Build passed for main</div>
              <div style={{ color: "#666", fontSize: 11 }}>10 minutes ago</div>
            </div>
            <span
              onClick={() => alert("dismissed")}
              style={{ marginLeft: "auto", color: "#555", fontSize: 11, cursor: "pointer" }}
            >
              Dismiss
            </span>
          </div>

          <iframe
            src="https://embed.example.com/activity"
            style={{ width: "100%", height: 80, border: "none", marginBottom: 12 }}
          />

          <div
            onClick={() => alert("marked all read")}
            style={{
              background: "#3b82f6",
              color: "#bfdbfe",
              padding: "8px 0",
              textAlign: "center",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Mark all as read
          </div>

          <div style={{ animation: "pulse 1.5s infinite", marginTop: 8, fontSize: 10, color: "#444", textAlign: "center" }}>
            ● Live
          </div>
        </div>
      )}
    </div>
  );
}
