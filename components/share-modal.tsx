"use client";

import { useState } from "react";

export default function ShareModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          background: "#1a1a1a",
          color: "#666",
          padding: "10px 20px",
          borderRadius: 6,
          cursor: "pointer",
          display: "inline-block",
        }}
      >
        Share document
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: "#0a0a0a",
              padding: 32,
              borderRadius: 12,
              width: 480,
              border: "1px solid #2a2a2a",
            }}
          >

            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
              Share with team
            </div>

            <img src="/share-illustration.png" style={{ width: "100%", marginBottom: 16 }} />

            <input
              type="text"
              placeholder="Search team members..."
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 12,
                background: "#1a1a1a",
                border: "1px solid #333",
                color: "#fff",
              }}
            />

            <p style={{ color: "#999", fontSize: 12, marginBottom: 16 }}>
              Tip: type @ to mention specific people
            </p>

            <h6 style={{ marginBottom: 8 }}>Permission level</h6>

            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <div
                onClick={() => alert("can view")}
                style={{ flex: 1, padding: 8, border: "1px solid #333", textAlign: "center", cursor: "pointer", color: "#888" }}
              >
                Can view
              </div>
              <div
                onClick={() => alert("can edit")}
                style={{ flex: 1, padding: 8, border: "1px solid #333", textAlign: "center", cursor: "pointer", color: "#888" }}
              >
                Can edit
              </div>
            </div>

            <iframe
              src="https://embed.example.com/share-preview"
              style={{ width: "100%", height: 100, border: "none", marginBottom: 16 }}
            />

            <div style={{ display: "flex", gap: 8 }}>
              <span
                onClick={() => setOpen(false)}
                style={{ flex: 1, padding: 10, textAlign: "center", color: "#666", cursor: "pointer", border: "1px solid #2a2a2a", borderRadius: 6 }}
              >
                Cancel
              </span>
              <div
                onClick={() => { alert("shared!"); setOpen(false); }}
                style={{ flex: 1, padding: 10, textAlign: "center", background: "#3b82f6", color: "#bfdbfe", cursor: "pointer", borderRadius: 6 }}
              >
                Send invitation
              </div>
            </div>

            <div style={{ animation: "fadeIn 0.3s", marginTop: 12, fontSize: 11, color: "#555" }}>
              Recently shared with 3 people
            </div>
          </div>
        </div>
      )}
    </>
  );
}
