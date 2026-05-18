import { Clock3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Button from "../../Button";

const operationalHours = [
  { day: "Monday", start: "09:00 AM", end: "06:00 PM", closed: false },
  { day: "Tuesday", start: "09:00 AM", end: "06:00 PM", closed: false },
  { day: "Wednesday", start: "09:00 AM", end: "06:00 PM", closed: false },
  { day: "Thursday", start: "09:00 AM", end: "06:00 PM", closed: false },
  { day: "Friday", start: "09:00 AM", end: "06:00 PM", closed: false },
  { day: "Saturday", start: "10:00 AM", end: "04:00 PM", closed: false },
  { day: "Sunday", start: "12:00 PM", end: "05:00 PM", closed: true },
];

const TextField = ({ label, name, onChange, value }) => (
  <label className="space-y-2">
    <span className="text-[0.78rem] font-bold text-slate-900">{label}</span>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
    />
  </label>
);

const Toggle = ({ checked = false, label, name, onChange }) => (
  <label className="inline-flex items-center gap-3">
    <span
      className={`relative inline-flex h-7 w-12 rounded-full transition-colors ${
        checked ? "bg-[var(--color-primary)]" : "bg-[var(--color-primary-soft)]"
      }`}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
    </span>
    <span className="text-sm text-slate-700">{label}</span>
  </label>
);

const TimeInput = ({ value }) => (
  <label className="relative block w-[130px]">
    <input
      type="text"
      defaultValue={value}
      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
    />
    <Clock3 className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
  </label>
);

const getGeneralSettings = (settings = {}) => settings.general || settings;

const TenantGeneralSetting = ({ onSave, settings }) => {
  const generalSettings = useMemo(() => getGeneralSettings(settings), [settings]);
  const [formData, setFormData] = useState({
    autoReplyEnabled: false,
    currency: "USD ($)",
    customerServiceEmailTemplate: "Standard Support Template",
    dateFormat: "MM/DD/YYYY",
    languagePreference: "English",
    supportEmail: "support@cleanexpress.com",
    supportPhone: "+1 (555) 123-4567",
    tenantStatus: "Active",
    timeFormat24Hour: false,
    timezone: "Eastern Time (UTC-5)",
  });
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      autoReplyEnabled:
        generalSettings.autoReplyEnabled ??
        generalSettings.autoReplySettings?.enabled ??
        current.autoReplyEnabled,
      currency: generalSettings.currency || current.currency,
      customerServiceEmailTemplate:
        generalSettings.customerServiceEmailTemplate ||
        current.customerServiceEmailTemplate,
      dateFormat: generalSettings.dateFormat || current.dateFormat,
      languagePreference:
        generalSettings.languagePreference || generalSettings.language || current.languagePreference,
      supportEmail:
        generalSettings.supportEmail ||
        generalSettings.contact?.supportEmail ||
        current.supportEmail,
      supportPhone:
        generalSettings.supportPhone ||
        generalSettings.contact?.supportPhone ||
        current.supportPhone,
      tenantStatus:
        generalSettings.tenantStatus || generalSettings.status || current.tenantStatus,
      timeFormat24Hour:
        generalSettings.timeFormat24Hour ??
        (generalSettings.timeFormat
          ? generalSettings.timeFormat === "24-hour"
          : current.timeFormat24Hour),
      timezone: generalSettings.timezone || current.timezone,
    }));
  }, [generalSettings]);

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!onSave) return;

    setSaveError("");
    setIsSaving(true);

    try {
      await onSave(formData);
    } catch (error) {
      setSaveError(error.message || "Unable to save general settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-950">
          Business Configuration
        </h2>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <TextField label="Tenant Status" name="tenantStatus" value={formData.tenantStatus} onChange={handleChange} />
          <TextField label="Timezone" name="timezone" value={formData.timezone} onChange={handleChange} />
          <TextField label="Currency" name="currency" value={formData.currency} onChange={handleChange} />
          <TextField label="Date Format" name="dateFormat" value={formData.dateFormat} onChange={handleChange} />
          <div className="space-y-2">
            <span className="text-[0.78rem] font-bold text-slate-900">
              Time Format
            </span>
            <div className="flex h-12 items-center">
              <Toggle
                checked={formData.timeFormat24Hour}
                label="24-hour format"
                name="timeFormat24Hour"
                onChange={handleChange}
              />
            </div>
          </div>
          <TextField
            label="Language Preference"
            name="languagePreference"
            value={formData.languagePreference}
            onChange={handleChange}
          />
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-950">
            Operational Hours
          </h2>
          <button
            type="button"
            className="self-start text-xs font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)] sm:self-auto"
          >
            Copy to all days
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {operationalHours.map((schedule) => (
            <div
              key={schedule.day}
              className="grid gap-3 text-sm sm:grid-cols-[92px_130px_20px_130px_120px] sm:items-center"
            >
              <span className="font-semibold text-slate-900">
                {schedule.day}
              </span>
              <TimeInput value={schedule.start} />
              <span className="text-slate-500">to</span>
              <TimeInput value={schedule.end} />
              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  defaultChecked={schedule.closed}
                  className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                Closed
              </label>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-7 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
        >
          Holiday closure schedule
        </button>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-950">
          Tenant Contact Information
        </h2>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <TextField
            label="Support Email Address"
            name="supportEmail"
            value={formData.supportEmail}
            onChange={handleChange}
          />
          <TextField
            label="Support Phone Number"
            name="supportPhone"
            value={formData.supportPhone}
            onChange={handleChange}
          />
          <TextField
            label="Customer Service Email Template"
            name="customerServiceEmailTemplate"
            value={formData.customerServiceEmailTemplate}
            onChange={handleChange}
          />
          <div className="space-y-2">
            <span className="text-[0.78rem] font-bold text-slate-900">
              Auto-reply Settings
            </span>
            <div className="flex h-12 items-center">
              <Toggle
                checked={formData.autoReplyEnabled}
                label="Enable auto-reply for support emails"
                name="autoReplyEnabled"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </section>

      {saveError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {saveError}
        </p>
      )}

      <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            fontWeight="bold"
            className="inline-flex h-11 items-center rounded-lg px-6 text-xs"
          >
            {isSaving ? "Saving..." : "Save All Changes"}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            variant="secondary"
            size="sm"
            fontWeight="bold"
            className="inline-flex h-11 items-center rounded-lg px-6 text-xs"
          >
            {isSaving ? "Applying..." : "Apply Changes"}
          </Button>
          <button
            type="button"
            className="h-11 px-4 text-xs font-medium text-slate-500 transition-colors hover:text-slate-800"
          >
            Discard Changes
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-xs">
          <button
            type="button"
            className="font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
          >
            View change history
          </button>
          <span className="text-slate-500">Last saved: 2:30 PM today</span>
        </div>
      </section>
    </div>
  );
};

export default TenantGeneralSetting;
