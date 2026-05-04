"use client";

export default function ContactForm() {
  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 24 }}>

      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Contact us</h1>

      <p style={{ color: '#555', fontSize: 12, marginBottom: 16 }}>
        We usually reply within a day.
      </p>

      <img src="/contact-illustration.png" alt="Contact illustration" style={{ width: "100%", marginBottom: 16 }} />

      <label htmlFor="email">Email address</label>
      <input
        id="email"
        type="email"
        placeholder="Email address"
        style={{ display: "block", width: "100%", padding: 10, marginBottom: 10 }}
      />

      <label htmlFor="subject">Subject</label>
      <input
        id="subject"
        type="text"
        placeholder="Subject"
        style={{ display: "block", width: "100%", padding: 10, marginBottom: 10 }}
      />

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && alert('sent!')}
        onClick={() => alert('sent!')}
        style={{
          background: '#1e293b',
          color: '#ffffff',
          padding: '10px 0',
          textAlign: 'center',
          borderRadius: 6,
          cursor: 'pointer',
          marginTop: 8,
          outline: 'none',
          boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.6)',
        }}
      >
        Send message
      </div>

    </div>
  );
}