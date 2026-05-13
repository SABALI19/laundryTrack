import {
  Apple,
  BriefcaseBusiness,
  Camera,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import laundry3Image from "../../assets/images/laundry3.jpg";
import laundry8Image from "../../assets/images/laundry8.jpg";
import logoBlue from "../../assets/logo/washa-logo-blue.png";
import useAuthSession from "../../hooks/useAuthSession.js";
import {
  apiRequest,
  customerTypeLabelMap,
  getDashboardPathForRole,
  isSuperAdminEmail,
  saveAuthSession,
} from "../../utils/auth.js";

const customerTypes = ["Personal Customer", "Business Customer"];

const trustHighlights = [
  "Photo-based Item Tracking",
  "Real-time Status Updates",
  "Convenient Pickup Scheduling",
  "Dispute Prevention",
];

const Signup = () => {
  const navigate = useNavigate();
  const session = useAuthSession();
  const [selectedCustomerType, setSelectedCustomerType] = useState(
    customerTypes[0],
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user?.role) {
      navigate(getDashboardPathForRole(session.user.role), { replace: true });
    }
  }, [navigate, session]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setErrorMessage("Complete all required fields to create your account.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage("You need to agree to the terms before signing up.");
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim();
      const data = await apiRequest(isSuperAdminEmail(normalizedEmail) ? "/auth/superadmin" : "/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: fullName.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          password,
          role: isSuperAdminEmail(normalizedEmail) ? "superadmin" : "customer",
          customerType: customerTypeLabelMap[selectedCustomerType],
          rememberMe: true,
        }),
      });

      saveAuthSession(data, { rememberMe: true });
      navigate(getDashboardPathForRole(data.user?.role), { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-white px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto mb-6 flex w-full max-w-[420px] items-center justify-between lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoBlue} alt="LaundryTrack" className="h-8 w-8 object-contain" />
            <span className="text-sm font-semibold text-slate-900">LaundryTrack</span>
          </Link>
          <Link
            to="/"
            aria-label="Close sign up page"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#2c4a7d] shadow-sm transition-colors hover:border-[#2c4a7d]"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid min-h-[calc(100vh-2rem)] w-full gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-10">
        <div className="hidden px-8 py-6 lg:block">
          <div className="flex items-center gap-2">
            <img src={logoBlue} alt="LaundryTrack" className="h-6 w-6 object-contain" />
            <span className="text-base font-medium text-slate-800">LaundryTrack</span>
          </div>

          <div className="mt-10 max-w-[420px]">
            <div className="overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.14)]">
              <img
                src={laundry3Image}
                alt="LaundryTrack app and washing machines"
                className="h-[180px] w-full object-cover"
              />
            </div>

            <div className="mt-8">
              <h2 className="text-[1.35rem] font-medium text-slate-900">
                Experience Complete Peace of Mind
              </h2>

              <div className="mt-4 space-y-3">
                {trustHighlights.map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    {index === 0 && <Camera className="h-4 w-4 text-[var(--color-primary)]" />}
                    {index === 1 && <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" />}
                    {index === 2 && (
                      <CalendarDays className="h-4 w-4 text-[var(--color-primary)]" />
                    )}
                    {index === 3 && (
                      <ShieldCheck className="h-4 w-4 text-[var(--color-primary)]" />
                    )}
                    <span className="text-[0.92rem] text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                <p className="text-[0.78rem] leading-6 text-slate-500">
                  "LaundryTrack has revolutionized how we manage our business
                  laundry. The photo documentation gives us complete confidence."
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={laundry8Image}
                    alt="Michael Rodriguez"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[0.8rem] font-semibold text-slate-900">
                      Michael Rodriguez
                    </p>
                    <p className="text-[0.72rem] text-slate-500">Business Customer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[420px] flex-col justify-between py-2 sm:py-4">
          <div>
            <div className="text-center">
              <h1 className="text-[1.4rem] font-semibold text-slate-900 sm:text-[1.55rem]">
                Create Your Account
              </h1>
              <p className="mt-2 text-[0.82rem] text-slate-500">
                Join thousands of satisfied customers
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-1">
              {customerTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedCustomerType(type)}
                  className={`rounded-lg px-3 py-2 text-[0.72rem] font-medium transition-colors ${
                    selectedCustomerType === type
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <FormField
                label="Full Name"
                placeholder="Enter your full name"
                Icon={User}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
              <FormField
                label="Email Address"
                placeholder="Enter your email address"
                Icon={Mail}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <FormField
                label="Phone Number"
                placeholder="Enter your phone number"
                Icon={Phone}
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
              <PasswordField
                label="Password"
                placeholder="Create a strong password"
                visible={showPassword}
                onToggleVisibility={() => setShowPassword((value) => !value)}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <p className="-mt-2 border-t border-[var(--color-primary-soft)] pt-2 text-[0.68rem] text-slate-400">
                Use 8+ characters with a mix of letters, numbers & symbols
              </p>
              <PasswordField
                label="Confirm Password"
                placeholder="Confirm your password"
                visible={showConfirmPassword}
                onToggleVisibility={() =>
                  setShowConfirmPassword((value) => !value)
                }
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />

              <label className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={() => setAgreedToTerms((value) => !value)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-[0.68rem] leading-5 text-slate-500">
                  I agree to the{" "}
                  <span className="text-[var(--color-primary)]">Terms of Service</span>
                  {" "}and{" "}
                  <span className="text-[var(--color-primary)]">Privacy Policy</span>
                </span>
              </label>

              {errorMessage && (
                <p className="text-[0.72rem] font-medium text-red-500">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 text-[0.82rem] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-5 text-center text-[0.68rem] uppercase tracking-[0.2em] text-slate-300">
              OR
            </div>

            <div className="mt-4 space-y-3">
              <SocialButton label="Sign up with Google" icon="google" />
              <SocialButton label="Sign up with Apple" icon="apple" />
            </div>

            <p className="mt-5 text-center text-[0.72rem] text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-[var(--color-primary)]">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.62rem] text-slate-400">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Help</span>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

const FormField = ({ label, placeholder, Icon, type = "text", value, onChange }) => {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.72rem] font-medium text-slate-700">
        {label}
      </span>
      <div className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3">
        <Icon className="h-4 w-4 shrink-0 text-slate-300" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent text-[0.78rem] text-slate-700 outline-none placeholder:text-slate-300"
        />
      </div>
    </label>
  );
};

const PasswordField = ({
  label,
  placeholder,
  visible,
  onToggleVisibility,
  value,
  onChange,
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.72rem] font-medium text-slate-700">
        {label}
      </span>
      <div className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3">
        <BriefcaseBusiness className="h-4 w-4 shrink-0 text-transparent" />
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent text-[0.78rem] text-slate-700 outline-none placeholder:text-slate-300"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="text-slate-300 transition-colors hover:text-slate-500"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  );
};

const SocialButton = ({ label, icon }) => {
  return (
    <button
      type="button"
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-[0.78rem] font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
    >
      {icon === "google" ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="#EA4335"
            d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.6 14.6 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12S6.9 21.3 12 21.3c6.1 0 9.1-4.3 9.1-6.6 0-.4 0-.7-.1-1H12Z"
          />
          <path
            fill="#34A853"
            d="M2.8 7.7l3.2 2.3C6.9 8 9.2 6.3 12 6.3c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.6 14.6 2.7 12 2.7 8.4 2.7 5.3 4.8 3.7 7.9l-.9-.2Z"
          />
          <path
            fill="#FBBC05"
            d="M12 21.3c2.5 0 4.7-.8 6.3-2.4l-3-2.4c-.8.6-1.9 1-3.3 1-3.9 0-5.3-2.6-5.6-3.9l-3.1 2.4c1.6 3.2 4.8 5.3 8.7 5.3Z"
          />
          <path
            fill="#4285F4"
            d="M21.1 13.7c.1-.3.1-.6.1-1 0-.4 0-.7-.1-1H12v3.9h5.5c-.3 1.2-1.3 2.2-2.3 2.9l3 2.4c1.8-1.7 2.9-4.1 2.9-7.2Z"
          />
        </svg>
      ) : (
        <Apple className="h-4 w-4 fill-current text-slate-900" />
      )}
      <span>{label}</span>
    </button>
  );
};

export default Signup;
