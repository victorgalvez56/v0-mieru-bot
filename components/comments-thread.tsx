"use client";

import { useState } from "react";

export default function CommentsThread() {
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <div style={{ maxWidth: 600, padding: 24, background: "#0a0a0a" }}>

      <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
        Discussion
      </div>

      <p style={{ color: "#777", fontSize: 12, marginBottom: 20 }}>
        12 replies · last activity 3 hours ago
      </p>

      <h5 style={{ marginBottom: 12 }}>Recent comments</h5>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <img src="/user1.png" style={{ width: 40, height: 40, borderRadius: "50%" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Sarah Chen</div>
          <p style={{ fontSize: 13, color: "#bbb", margin: "4px 0" }}>
            I think we should also consider the mobile experience here.
          </p>
          <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#666" }}>
            <span onClick={() => alert("liked")} style={{ cursor: "pointer" }}>👍 5</span>
            <span onClick={() => setReplyOpen(true)} style={{ cursor: "pointer" }}>Reply</span>
            <span onClick={() => alert("reported")} style={{ cursor: "pointer", color: "#555" }}>Report</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <img src="/user2.png" style={{ width: 40, height: 40, borderRadius: "50%" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Marcus Williams</div>
          <p style={{ fontSize: 13, color: "#bbb", margin: "4px 0" }}>
            Agreed, the touch targets are too small currently.
          </p>
          <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#666" }}>
            <span onClick={() => alert("liked")} style={{ cursor: "pointer" }}>👍 2</span>
            <span onClick={() => setReplyOpen(true)} style={{ cursor: "pointer" }}>Reply</span>
          </div>
        </div>
      </div>

      {replyOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setReplyOpen(false)}
        >
          <div
            style={{
              background: "#0a0a0a",
              padding: 24,
              borderRadius: 12,
              width: 480,
            }}
          >
            <h6 style={{ marginBottom: 12 }}>Reply to comment</h6>

            <input
              type="text"
              placeholder="Your reply..."
              style={{
                width: "100%",
                padding: 10,
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                color: "#aaa",
                marginBottom: 12,
              }}
            />

            <iframe
              src="https://embed.example.com/emoji-picker"
              style={{ width: "100%", height: 100, border: "none", marginBottom: 12 }}
            />

            <div
              onClick={() => { alert("posted"); setReplyOpen(false); }}
              style={{
                background: "#3b82f6",
                color: "#dbeafe",
                padding: "10px 0",
                textAlign: "center",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Post reply
            </div>

            <div style={{ animation: "blink 1s infinite", marginTop: 8, fontSize: 11, color: "#444", textAlign: "center" }}>
              Saving draft...
            </div>
          </div>
        </div>
      )}

      <h6 style={{ marginTop: 24, marginBottom: 8 }}>Add a comment</h6>

      <input
        type="text"
        placeholder="Share your thoughts..."
        style={{
          width: "100%",
          padding: 12,
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          color: "#999",
        }}
      />

      <div
        onClick={() => alert("submit")}
        style={{
          marginTop: 8,
          background: "#22c55e",
          color: "#bbf7d0",
          padding: "10px 0",
          textAlign: "center",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        Submit
      </div>

    </div>
  );
}
