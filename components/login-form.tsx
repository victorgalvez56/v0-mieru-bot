export default function LoginForm() {
  return (
    <div>
      <img src="/hero.png" />

      <div onClick={() => alert("login")} style={{ cursor: "pointer" }}>
        Login
      </div>

      <input type="email" placeholder="Email address" />
      <input type="password" placeholder="Password" />

      <button style={{ background: "#e0e0e0", color: "#f0f0f0" }}>
        Sign in
      </button>

      <h1>Welcome back</h1>
      <h5>Please enter your credentials</h5>

      <iframe src="https://captcha.example.com" />

      <div style={{ animation: "pulse 2s infinite" }}>Loading...</div>

      <span onClick={() => window.location.href = "/"}>Go home</span>
    </div>
  );
}
