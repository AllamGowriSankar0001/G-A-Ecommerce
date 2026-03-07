import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";
import { COUNTRIES } from "../config/currencyConfig";

const defaultPreferences = { newsletter: false, currency: "INR", language: "en" };

const MyAccount = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sendingVerification, setSendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState("idle"); // idle | codeSent | verified
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const navigate = useNavigate();

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }, []);

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${backendUrl}/users/me`, {
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load account details");
      }

      const u = data.user;
      setUser(u);
      setName(u?.name ?? "");
      setPhone(u?.phone ?? "");
      setAvatar(u?.avatar ?? "");
      setDateOfBirth(u?.dateOfBirth ? u.dateOfBirth.slice(0, 10) : "");
      setGender(u?.gender ?? "");
      setPreferences({
        newsletter: u?.preferences?.newsletter ?? false,
        currency: u?.preferences?.currency ?? "INR",
        language: u?.preferences?.language ?? "en",
      });
      if (u?.isVerified) {
        setVerificationStep("verified");
      } else {
        setVerificationStep("idle");
      }
      setVerificationMessage("");
      setVerificationError("");
      setVerificationCode("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [navigate, getAuthHeaders]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchMe();
  }, [navigate, fetchMe]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [success]);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await fetch(`${backendUrl}/users/me`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          avatar: avatar.trim(),
          dateOfBirth: dateOfBirth || null,
          gender: gender || null,
          addresses: [address],
          preferences: {
            newsletter: preferences.newsletter,
            currency: preferences.currency,
            language: preferences.language,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      const u = data.user;
      setUser(u);
      setName(u?.name ?? "");
      setPhone(u?.phone ?? "");
      setAvatar(u?.avatar ?? "");
      setDateOfBirth(u?.dateOfBirth ? u.dateOfBirth.slice(0, 10) : "");
      setGender(u?.gender ?? "");
      setPreferences({
        newsletter: u?.preferences?.newsletter ?? false,
        currency: u?.preferences?.currency ?? "INR",
        language: u?.preferences?.language ?? "en",
      });
      // update address state again from returned user
      const first = (u?.addresses && u.addresses.length ? u.addresses[0] : {});
      setAddress({
        fullName: first.fullName || "",
        phone: first.phone || "",
        street: first.street || "",
        city: first.city || "",
        state: first.state || "",
        postalCode: first.postalCode || "",
        country: first.country || "India",
      });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      setSendingVerification(true);
      setError("");
      setSuccess("");
      setVerificationError("");
      setVerificationMessage("");

      const res = await fetch(`${backendUrl}/users/sendverificationcode`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to send verification code");
      }

      setVerificationStep("codeSent");
      setVerificationMessage(
        data.message || "Verification code sent to your email."
      );
    } catch (err) {
      setVerificationError(
        err.message ||
          "Something went wrong while sending the verification code"
      );
    } finally {
      setSendingVerification(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const trimmed = verificationCode.trim();
    if (!trimmed) {
      setVerificationError("Please enter the 6-digit verification code.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      setVerifying(true);
      setVerificationError("");
      setVerificationMessage("");

      const res = await fetch(`${backendUrl}/users/verify-email`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ otp: trimmed }),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to verify email");
      }

      const updatedUser = data.user || user;
      setUser(updatedUser);
      setVerificationStep("verified");
      setVerificationCode("");
      setVerificationMessage(
        data.message || "Your email has been verified successfully."
      );
    } catch (err) {
      setVerificationError(
        err.message || "Something went wrong while verifying your email"
      );
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <main className="about-page">
        <section className="about-section account-section">
          <div className="about-container my-account">
            <header className="account-header">
              <div className="account-skeleton title" />
              <div className="account-skeleton text" />
            </header>
            <div className="account-layout">
              <div className="account-card account-summary">
                <div className="account-skeleton title" />
                <div className="account-skeleton line" />
                <div className="account-skeleton line" />
                <div className="account-skeleton line short" />
              </div>
              <div className="account-card account-form-skeleton">
                <div className="account-skeleton title" />
                <div className="account-skeleton input" />
                <div className="account-skeleton input" />
                <div className="account-skeleton btn" />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error && !user) {
    return (
      <main className="about-page">
        <section className="about-section account-section">
          <div className="about-container my-account">
            <div className="account-error-state">
              <p className="account-message error">{error}</p>
              <div className="account-error-actions">
                <button
                  type="button"
                  className="account-btn secondary"
                  onClick={() => fetchMe()}
                >
                  Try again
                </button>
                <Link to="/" className="account-btn primary">
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="about-page">
      <section className="about-section account-section">
        <div className="about-container my-account">
          <header className="account-header">
            <h1 className="account-title">My Account</h1>
            <p className="account-subtitle">
              Welcome back, <strong>{user?.name}</strong>. Manage your profile and preferences below.
            </p>
          </header>

          {user && !user.isVerified && (
            <div className="account-card account-verification-card">
              <div className="account-verification-header">
                <h3 className="account-card-heading">Email verification</h3>
                <span className="account-status-pill account-status-pill--warning">
                  Not verified
                </span>
              </div>
              <p className="account-verification-text">
                {verificationStep === "codeSent"
                  ? `We've sent a 6-digit verification code to ${user.email}. Enter it below to verify your account.`
                  : `Verify your email address (${user.email}) to secure your account and unlock all features.`}
              </p>
              {verificationError && (
                <p className="account-message error">{verificationError}</p>
              )}
              {verificationMessage && (
                <p className="account-message success">{verificationMessage}</p>
              )}

              {verificationStep === "codeSent" ? (
                <form
                  className="account-verification-form"
                  onSubmit={handleVerifyCode}
                >
                  <label>
                    <span>Verification code</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      className="account-verification-code-input"
                      value={verificationCode}
                      onChange={(e) =>
                        setVerificationCode(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="123456"
                    />
                  </label>
                  <p className="account-verification-hint">
                    Enter the 6-digit code we emailed you. This code expires in 5 minutes.
                  </p>
                  <div className="account-verification-actions">
                    <button
                      type="submit"
                      className="account-btn primary"
                      disabled={verifying || !verificationCode}
                    >
                      {verifying ? "Verifying…" : "Verify email"}
                    </button>
                    <button
                      type="button"
                      className="account-btn secondary"
                      onClick={handleSendVerificationEmail}
                      disabled={sendingVerification}
                    >
                      {sendingVerification ? "Resending…" : "Resend code"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="account-verification-actions">
                  <button
                    type="button"
                    className="account-btn primary"
                    onClick={handleSendVerificationEmail}
                    disabled={sendingVerification}
                  >
                    {sendingVerification
                      ? "Sending…"
                      : "Send verification code"}
                  </button>
                </div>
              )}
            </div>
          )}

          <nav className="account-quick-links" aria-label="Account shortcuts">
            <Link to="/orderhistory" className="account-quick-link">
              <i className="fa-solid fa-box" aria-hidden />
              <span>Order history</span>
              <i className="fa-solid fa-chevron-right account-quick-link-arrow" aria-hidden />
            </Link>
            <Link to="/contact" className="account-quick-link">
              <i className="fa-solid fa-envelope" aria-hidden />
              <span>Contact us</span>
              <i className="fa-solid fa-chevron-right account-quick-link-arrow" aria-hidden />
            </Link>
          </nav>

          <div className="account-layout">
            <aside className="account-card account-summary">
              <div className="account-summary-profile">
                {user?.avatar ? (
                  <div className="account-avatar-wrap">
                    <img src={user.avatar} alt="" className="account-avatar" />
                  </div>
                ) : (
                  <div className="account-avatar-placeholder">
                    <i className="fa-solid fa-user" aria-hidden />
                  </div>
                )}
                <p className="account-summary-name">{user?.name}</p>
                <p className="account-summary-email">{user?.email}</p>
              </div>
              <div className="account-summary-details">
                <h3 className="account-card-heading">Details</h3>
                <dl className="account-dl">
                  <dt>Phone</dt>
                  <dd>{user?.phone || "—"}</dd>
                  <dt>Email status</dt>
                  <dd>
                    {user?.isVerified ? (
                      <span style={{ color: "#15803d" }}>Verified</span>
                    ) : (
                      <span style={{ color: "#92400e" }}>Not verified</span>
                    )}
                  </dd>
                  <dt>Role</dt>
                  <dd className="account-dd-cap">{user?.role || "user"}</dd>
                  {user?.dateOfBirth && (
                    <>
                      <dt>Date of birth</dt>
                      <dd>{new Date(user.dateOfBirth).toLocaleDateString()}</dd>
                    </>
                  )}
                  {user?.addresses && user.addresses.length > 0 && (
                    <>
                      <dt>Address</dt>
                      <dd className="account-address">
                        {user.addresses[0].street && <>{user.addresses[0].street}<br /></>}
                        {user.addresses[0].city && <>{user.addresses[0].city}, </>}
                        {user.addresses[0].state && <>{user.addresses[0].state} </>}
                        {user.addresses[0].postalCode && <>{user.addresses[0].postalCode}<br /></>}
                        {user.addresses[0].country}
                      </dd>
                    </>
                  )}
                  {user?.gender && (
                    <>
                      <dt>Gender</dt>
                      <dd>{user.gender}</dd>
                    </>
                  )}
                  {user?.lastLoginAt && (
                    <>
                      <dt>Last login</dt>
                      <dd>{new Date(user.lastLoginAt).toLocaleString()}</dd>
                    </>
                  )}
                  {user?.createdAt && (
                    <>
                      <dt>Member since</dt>
                      <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
                    </>
                  )}
                  <dt>Newsletter</dt>
                  <dd>{user?.preferences?.newsletter ? "Yes" : "No"}</dd>
                  <dt>Currency</dt>
                  <dd>{user?.preferences?.currency || "INR"}</dd>
                  <dt>Language</dt>
                  <dd>{user?.preferences?.language || "en"}</dd>
                </dl>
              </div>
            </aside>

            <div className="account-card account-form-card">
              <form className="account-form" onSubmit={handleSave}>
                <h3 className="account-card-heading">Edit profile</h3>
                <div className="account-form-block">
                  <label>
                    <span>Full name</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      minLength={1}
                    />
                  </label>
                  <label>
                    <span>Phone</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </label>
                  <label>
                    <span>Avatar URL</span>
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </label>
                  <label>
                    <span>Date of birth</span>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Gender</span>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">—</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </div>

                <div className="account-form-block">
                  <h4 className="account-form-block-title">Primary Address</h4>
                  <label>
                    <span>Full name</span>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </label>
                  <label>
                    <span>Phone</span>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
                      placeholder="Contact number"
                    />
                  </label>
                  <label>
                    <span>Street</span>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
                      placeholder="123 Main St"
                    />
                  </label>
                  <label>
                    <span>City</span>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                      placeholder="City"
                    />
                  </label>
                  <label>
                    <span>State/Province</span>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                      placeholder="State"
                    />
                  </label>
                  <label>
                    <span>Postal code</span>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value }))}
                      placeholder="Postal code"
                    />
                  </label>
                  <label>
                    <span>Country</span>
                    <select
                      value={address.country}
                      onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
                      required
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name} ({country.symbol})
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="account-form-block account-form-block-preferences">
                  <h4 className="account-form-block-title">Preferences</h4>
                  <label className="account-checkbox-label">
                    <input
                      type="checkbox"
                      checked={preferences.newsletter}
                      onChange={(e) =>
                        setPreferences((p) => ({ ...p, newsletter: e.target.checked }))
                      }
                    />
                    <span>Subscribe to newsletter</span>
                  </label>
                  <label>
                    <span>Currency</span>
                    <select
                      value={preferences.currency}
                      onChange={(e) =>
                        setPreferences((p) => ({ ...p, currency: e.target.value }))
                      }
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </label>
                  <label>
                    <span>Language</span>
                    <select
                      value={preferences.language}
                      onChange={(e) =>
                        setPreferences((p) => ({ ...p, language: e.target.value }))
                      }
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                    </select>
                  </label>
                </div>

                {error && <p className="account-message error">{error}</p>}
                {success && <p className="account-message success">{success}</p>}

                <button type="submit" disabled={saving} className="account-btn primary">
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MyAccount;
