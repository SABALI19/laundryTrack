import { ArrowLeft, ArrowRight, ChevronDown, X } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../Button";

const steps = [
  "Business Details",
  "Subscription Plan",
  "Configuration",
  "Review & Confirm",
];

const inputClass =
  "h-14 w-full rounded-xl border border-slate-200 bg-white px-5 text-[0.95rem] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]";

const Field = ({ label, required, placeholder, type = "text" }) => (
  <label className="block">
    <span className="text-[0.95rem] font-semibold text-slate-900">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    <input type={type} placeholder={placeholder} className={`mt-3 ${inputClass}`} />
  </label>
);

const SelectField = ({ label, required, placeholder }) => (
  <label className="block">
    <span className="text-[0.95rem] font-semibold text-slate-900">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    <span className="relative mt-3 block">
      <select className={`${inputClass} appearance-none pr-12 text-slate-700`}>
        <option>{placeholder}</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    </span>
  </label>
);

const NewTenant = () => {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Add New Tenant
          </h1>
          <p className="mt-3 text-base text-slate-600">Step 1 of 4</p>
        </div>
        <Link
          to="/super-admin/tenants"
          className="inline-flex items-center gap-3 text-sm font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
        >
          <X className="h-4 w-4" />
          Cancel
        </Link>
      </section>

      <section className="rounded-2xl bg-white px-8 py-7 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
        <div className="grid grid-cols-4 gap-4 text-sm">
          {steps.map((step, index) => (
            <div
              key={step}
              className={index === 0 ? "font-semibold text-slate-950" : "text-slate-500"}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-[var(--color-primary-soft)]">
          <div className="h-full w-1/4 rounded-full bg-[var(--color-primary)]" />
        </div>
      </section>

      <section className="rounded-2xl bg-white px-8 py-8 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
        <h2 className="text-xl font-semibold text-slate-950">Business Details</h2>

        <div className="mt-8 grid gap-x-8 gap-y-7 lg:grid-cols-2">
          <Field label="Business Legal Name" required placeholder="Enter business legal name" />
          <Field label="Trading Name / DBA" placeholder="Enter trading name" />
          <Field label="Business Registration Number" placeholder="Enter registration number" />
          <Field label="Tax ID / VAT Number" placeholder="Enter tax ID" />
          <SelectField label="Industry Category" placeholder="Select industry" />
          <Field label="Website URL" placeholder="https://example.com" />
        </div>

        <label className="mt-7 block">
          <span className="text-[0.95rem] font-semibold text-slate-900">
            Business Description
          </span>
          <textarea
            placeholder="Describe your laundry business..."
            className="mt-3 min-h-[110px] w-full resize-none rounded-xl border border-slate-200 bg-white px-5 py-4 text-[0.95rem] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
          />
        </label>

        <h2 className="mt-10 text-xl font-semibold text-slate-950">
          Contact Information
        </h2>
        <div className="mt-7 grid gap-x-8 gap-y-7 lg:grid-cols-2">
          <Field label="Primary Contact Name" required placeholder="Enter contact name" />
          <Field label="Contact Email" required placeholder="contact@example.com" type="email" />
          <Field label="Contact Phone Number" required placeholder="+1 (555) 123-4567" />
          <Field label="Business Phone Number" placeholder="+1 (555) 987-6543" />
        </div>

        <h2 className="mt-10 text-xl font-semibold text-slate-950">
          Business Address
        </h2>
        <div className="mt-7 space-y-7">
          <Field label="Street Address Line 1" required placeholder="Enter street address" />
          <Field label="Street Address Line 2" placeholder="Apartment, suite, etc. (optional)" />
          <div className="grid gap-x-8 gap-y-7 lg:grid-cols-2">
            <Field label="City" required placeholder="Enter city" />
            <SelectField label="State / Province" required placeholder="Select state" />
            <Field label="ZIP / Postal Code" required placeholder="Enter ZIP code" />
            <SelectField label="Country" required placeholder="Select country" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/super-admin/tenants"
          className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[var(--color-primary)] bg-white px-8 text-base font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)] sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <Button
          type="button"
          size="md"
          className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[var(--color-primary)] px-8 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-hover)] sm:w-auto"
        >
          Continue to Subscription
          <ArrowRight className="h-4 w-4" />
        </Button>
      </section>
    </div>
  );
};

export default NewTenant;
