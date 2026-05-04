"use client";

export default function CheckoutForm() {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 32 }}>

      {/* Missing page heading structure */}
      <div style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>
        Complete your order
      </div>

      {/* Product image without alt text */}
      <img
        src="/product.png"
        style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
      />

      {/* Inputs without labels */}
      <input
        type="text"
        placeholder="Full name"
        style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }}
      />
      <input
        type="email"
        placeholder="Email address"
        style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }}
      />
      <input
        type="text"
        placeholder="Card number"
        style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }}
      />

      {/* Low contrast text */}
      <p style={{ color: "#aaaaaa", fontSize: 12, marginBottom: 16 }}>
        Your payment is secured by our provider.
      </p>

      {/* div acting as button — no keyboard support */}
      <div
        onClick={() => alert("Order placed!")}
        style={{
          background: "#4f46e5",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: 6,
          cursor: "pointer",
          textAlign: "center",
          marginBottom: 12,
          userSelect: "none",
        }}
      >
        Place order
      </div>

      {/* Invisible focus — button with outline:none */}
      <button
        style={{
          background: "transparent",
          border: "1px solid #ccc",
          color: "#888888",
          padding: "10px 24px",
          borderRadius: 6,
          cursor: "pointer",
          width: "100%",
          outline: "none",
        }}
        onClick={() => window.history.back()}
      >
        Go back
      </button>

      {/* Heading hierarchy broken: jumps to h4 */}
      <h4 style={{ marginTop: 24 }}>Order summary</h4>

      {/* iframe without title */}
      <iframe
        src="https://payments.example.com/3ds"
        style={{ width: "100%", height: 0, border: "none" }}
      />

      {/* Animation without prefers-reduced-motion */}
      <div
        style={{
          marginTop: 16,
          fontSize: 12,
          color: "#666",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      >
        Processing your order...
      </div>
    </div>
  );
}
