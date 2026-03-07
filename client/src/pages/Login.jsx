import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState("login"); // login | reset-request | reset-confirm
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch(`${backendUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setError(data.message || "Unable to sign in");
      }
    } catch (err) {
      setError("Something went wrong while signing in. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setMode("reset-request");
    setMessage("");
    setError("");
    setResetCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch(`${backendUrl}/users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to send reset code");
      }

      setMessage(
        data.message ||
          "If an account exists for this email, a reset code has been sent."
      );
      setMode("reset-confirm");
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while sending the reset code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!resetCode.trim() || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch(`${backendUrl}/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: resetCode.trim(),
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to reset password");
      }

      setMessage(
        data.message ||
          "Your password has been reset successfully. You can now sign in."
      );
      setMode("login");
      setPassword("");
      setResetCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while resetting your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{width:"100vw",display:"flex",justifyContent:"center",alignItems:"center",padding:"100px 0px"
    }}>
      <form
        className="form"
        onSubmit={
          mode === "login"
            ? handleLoginSubmit
            : mode === "reset-request"
            ? handleSendResetCode
            : handleResetPassword
        }
      >
        <div className="flex-column">
          <label>Email</label>
        </div>

        <div className="inputForm">
          <input
            type="email"
            className="input"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {mode === "login" && (
          <>
            <div className="flex-column">
              <label>Password</label>
            </div>

            <div className="inputForm password-field">
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i
                  className={
                    showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
                  }
                ></i>
              </button>
            </div>

            <div className="flex-row">
              <button
                type="button"
                className="link-button span"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>
          </>
        )}

        {mode === "reset-request" && (
          <>
            <div className="flex-column" style={{ marginTop: "12px" }}>
              <label>Reset password</label>
            </div>
            <p className="span" style={{ marginBottom: "8px" }}>
              We will send a 6-digit code to your email to reset your password.
            </p>
          </>
        )}

        {mode === "reset-confirm" && (
          <>
            <div className="flex-column" style={{ marginTop: "12px" }}>
              <label>Verification code</label>
            </div>
            <div className="inputForm">
              <input
                type="text"
                className="input"
                placeholder="Enter 6-digit code"
                value={resetCode}
                maxLength={6}
                onChange={(e) =>
                  setResetCode(e.target.value.replace(/\D/g, ""))
                }
                required
              />
            </div>

            <div className="flex-column">
              <label>New password</label>
            </div>
            <div className="inputForm">
              <input
                type="password"
                className="input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex-column">
              <label>Confirm new password</label>
            </div>
            <div className="inputForm">
              <input
                type="password"
                className="input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {error && <p className="account-message error">{error}</p>}
        {message && <p className="account-message success">{message}</p>}

        <button type="submit" className="button-submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Sign In"
            : mode === "reset-request"
            ? "Send reset code"
            : "Reset password"}
        </button>

        {mode !== "login" && (
          <div className="flex-row" style={{ marginTop: "8px" }}>
            <button
              type="button"
              className="link-button span"
              onClick={() => {
                setMode("login");
                setMessage("");
                setError("");
              }}
            >
              Back to sign in
            </button>
          </div>
        )}
        <div className="flex-row">
          <p className="span">Don't have an account?</p>
          <Link to="/signup">
            <button type="button" className="button-submit">
              Sign Up
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;