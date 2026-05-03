"use client";

export default function PricingCard() {
  return (
    <section style={{ display: "flex", gap: 16, padding: 24, background: "#0a0a0a" }}>

      {/* Card 1: Starter */}
      <div style={{ flex: 1, padding: 24, border: "1px solid #2a2a2a", borderRadius: 8 }}>
        <div style={{ fontSize: 14, color: "#ffffff", marginBottom: 4 }}>STARTER</div>
        <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>$9</div>
        <p style={{ color: "#888", fontSize: 12, marginBottom: 16 }}>Per month, billed annually</p>

        <img src="/starter-icon.png" alt="Starter package icon" style={{ width: 48, marginBottom: 16 }} />

        <ul>
          <li>10 projects</li>
          <li>5GB storage</li>
          <li>Email support</li>
        </ul>

        <button
          onClick={() => alert("subscribed!")}
          style={{
            background: "#3b82f6",
            color: "#dbeafe",
            padding: "10px 0",
            textAlign: "center",
            borderRadius: 6,
            cursor: "pointer",
            marginTop: 16,
          }}
        >
          Subscribe
        </button>
      </div>

      {/* Card 2: Pro */}
      <div style={{ flex: 1, padding: 24, border: "1px solid #2a2a2a", borderRadius: 8 }}>
        <div style={{ fontSize: 14, color: "#ffffff", marginBottom: 4 }}>PRO</div>
        <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>$29</div>
        <p style={{ color: "#888", fontSize: 12, marginBottom: 16 }}>Per month, billed annually</p>

        <img src="/pro-icon.png" alt="Pro package icon" style={{ width: 48, marginBottom: 16 }} />

        <ul>
          <li>Unlimited projects</li>
          <li>50GB storage</li>
          <li>Priority support</li>
        </ul>

        <button
          onClick={() => window.location.href = "/checkout/pro"}
          style={{
            background: "#22c55e",
            color: "#bbf7d0",
            padding: "10px 0",
            textAlign: "center",
            borderRadius: 6,
            cursor: "pointer",
            marginTop: 16,
          }}
        >
          Get Pro
        </button>
      </div>

      <div className="shimmer" style={{ position: "absolute", top: 8, right: 8, fontSize: 11, color: "#666" }}>
        ✨ Limited offer
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          .shimmer {
            animation: shimmer 1.5s infinite;
          }
        }
      `}</style>

    </section>
  );
}