export default function BadForm() {
  return (
    <div>
      <img src="/logo.png" />

      <div onClick={() => alert("clicked")} style={{ cursor: "pointer" }}>
        Click me to continue
      </div>

      <input type="text" placeholder="Your email" />

      <button style={{ background: "#cccccc", color: "#dddddd" }}>
        Submit
      </button>

      <span onClick={() => window.history.back()}>Go back</span>

      <h1>Welcome</h1>
      <h4>Subtitle that skips h2 and h3</h4>

      <iframe src="https://example.com" />

      <div style={{ animation: "spin 1s infinite" }}>Loading...</div>
    </div>
  );
}
// test
