import { ArrowLeft, ArrowRight, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "../../Button";
import { apiRequest } from "../../../utils/auth";

const steps = [
  "Business Details",
  "Subscription Plan",
  "Configuration",
  "Review & Confirm",
];

const inputClass =
  "h-14 w-full rounded-xl border border-slate-200 bg-white px-5 text-[0.95rem] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]";

const Field = ({
  label,
  name,
  onChange,
  required,
  placeholder,
  type = "text",
  value,
}) => (
  <label className="block">
    <span className="text-[0.95rem] font-semibold text-slate-900">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`mt-3 ${inputClass}`}
    />
  </label>
);

const SelectField = ({
  label,
  name,
  onChange,
  options = [],
  required,
  placeholder,
  value,
}) => (
  <label className="block">
    <span className="text-[0.95rem] font-semibold text-slate-900">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    <span className="relative mt-3 block">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`${inputClass} appearance-none pr-12 text-slate-700`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    </span>
  </label>
);

const NewTenant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessDescription: "",
    businessPhone: "",
    city: "",
    contactEmail: "",
    contactName: "",
    contactPhone: "",
    country: "",
    industryCategory: "",
    legalName: "",
    registrationNumber: "",
    state: "",
    streetAddress1: "",
    streetAddress2: "",
    subscriptionTier: "basic",
    taxId: "",
    tradingName: "",
    websiteUrl: "",
    zipCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const payload = {
        address: {
          city: formData.city,
          country: formData.country,
          state: formData.state,
          streetAddress1: formData.streetAddress1,
          streetAddress2: formData.streetAddress2,
          zipCode: formData.zipCode,
        },
        businessPhone: formData.businessPhone,
        contactEmail: formData.contactEmail,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        description: formData.businessDescription,
        industryCategory: formData.industryCategory,
        name: formData.tradingName || formData.legalName,
        registrationNumber: formData.registrationNumber,
        subscriptionTier: formData.subscriptionTier,
        taxId: formData.taxId,
        tradingName: formData.tradingName,
        websiteUrl: formData.websiteUrl,
      };

      const data = await apiRequest("/superadmin/tenants", {
        body: JSON.stringify(payload),
        method: "POST",
      });
      const tenantId =
        data?.tenant?._id ||
        data?.tenant?.id ||
        data?.data?.tenant?._id ||
        data?.data?.tenant?.id;

      navigate(tenantId ? `/super-admin/tenants/${tenantId}` : "/super-admin/tenants");
    } catch (error) {
      setSubmitError(error.message || "Unable to create tenant.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
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
          <Field
            label="Business Legal Name"
            name="legalName"
            required
            value={formData.legalName}
            onChange={handleChange}
            placeholder="Enter business legal name"
          />
          <Field
            label="Trading Name / DBA"
            name="tradingName"
            value={formData.tradingName}
            onChange={handleChange}
            placeholder="Enter trading name"
          />
          <Field
            label="Business Registration Number"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            placeholder="Enter registration number"
          />
          <Field
            label="Tax ID / VAT Number"
            name="taxId"
            value={formData.taxId}
            onChange={handleChange}
            placeholder="Enter tax ID"
          />
          <SelectField
            label="Industry Category"
            name="industryCategory"
            value={formData.industryCategory}
            onChange={handleChange}
            placeholder="Select industry"
            options={[
              { label: "Laundry & Dry Cleaning", value: "laundry" },
              { label: "Commercial Laundry", value: "commercial-laundry" },
              { label: "Pickup & Delivery", value: "pickup-delivery" },
            ]}
          />
          <Field
            label="Website URL"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <label className="mt-7 block">
          <span className="text-[0.95rem] font-semibold text-slate-900">
            Business Description
          </span>
          <textarea
            name="businessDescription"
            value={formData.businessDescription}
            onChange={handleChange}
            placeholder="Describe your laundry business..."
            className="mt-3 min-h-[110px] w-full resize-none rounded-xl border border-slate-200 bg-white px-5 py-4 text-[0.95rem] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
          />
        </label>

        <h2 className="mt-10 text-xl font-semibold text-slate-950">
          Contact Information
        </h2>
        <div className="mt-7 grid gap-x-8 gap-y-7 lg:grid-cols-2">
          <Field label="Primary Contact Name" name="contactName" required value={formData.contactName} onChange={handleChange} placeholder="Enter contact name" />
          <Field label="Contact Email" name="contactEmail" required value={formData.contactEmail} onChange={handleChange} placeholder="contact@example.com" type="email" />
          <Field label="Contact Phone Number" name="contactPhone" required value={formData.contactPhone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
          <Field label="Business Phone Number" name="businessPhone" value={formData.businessPhone} onChange={handleChange} placeholder="+1 (555) 987-6543" />
        </div>

        <h2 className="mt-10 text-xl font-semibold text-slate-950">
          Business Address
        </h2>
        <div className="mt-7 space-y-7">
          <Field label="Street Address Line 1" name="streetAddress1" required value={formData.streetAddress1} onChange={handleChange} placeholder="Enter street address" />
          <Field label="Street Address Line 2" name="streetAddress2" value={formData.streetAddress2} onChange={handleChange} placeholder="Apartment, suite, etc. (optional)" />
          <div className="grid gap-x-8 gap-y-7 lg:grid-cols-2">
            <Field label="City" name="city" required value={formData.city} onChange={handleChange} placeholder="Enter city" />
            <Field label="State / Province" name="state" required value={formData.state} onChange={handleChange} placeholder="Enter state" />
            <Field label="ZIP / Postal Code" name="zipCode" required value={formData.zipCode} onChange={handleChange} placeholder="Enter ZIP code" />
            <Field label="Country" name="country" required value={formData.country} onChange={handleChange} placeholder="Enter country" />
          </div>
        </div>
      </section>

      {submitError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {submitError}
        </p>
      )}

      <section className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/super-admin/tenants"
          className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[var(--color-primary)] bg-white px-8 text-base font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)] sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          size="md"
          className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[var(--color-primary)] px-8 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-hover)] sm:w-auto"
        >
          {isSubmitting ? "Creating Tenant..." : "Continue to Subscription"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </section>
    </form>
  );
};

export default NewTenant;
