import { Clock3 } from "lucide-react";
import Button from "../../Button";

const businessFields = [
  { label: "Tenant Status", value: "Active" },
  { label: "Timezone", value: "Eastern Time (UTC-5)" },
  { label: "Currency", value: "USD ($)" },
  { label: "Date Format", value: "MM/DD/YYYY" },
  { label: "Language Preference", value: "English" },
];

const operationalHours = [
  { day: "Monday", start: "09:00 AM", end: "06:00 PM", closed: false },
  { day: "Tuesday", start: "09:00 AM", end: "06:00 PM", closed: false },
  { day: "Wednesday", start: "09:00 AM", end: "06:00 PM", closed: false },
  { day: "Thursday", start: "09:00 AM", end: "06:00 PM", closed: false },
  { day: "Friday", start: "09:00 AM", end: "06:00 PM", closed: false },
  { day: "Saturday", start: "10:00 AM", end: "04:00 PM", closed: false },
  { day: "Sunday", start: "12:00 PM", end: "05:00 PM", closed: true },
];

const TextField = ({ label, value }) => (
  <label className="space-y-2">
    <span className="text-[0.78rem] font-bold text-slate-900">{label}</span>
    <input
      type="text"
      defaultValue={value}
      className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
    />
  </label>
);

const Toggle = ({ label, defaultChecked = false }) => (
  <label className="inline-flex items-center gap-3">
    <span
      className={`relative inline-flex h-7 w-12 rounded-full transition-colors ${
        defaultChecked ? "bg-[var(--color-primary)]" : "bg-[var(--color-primary-soft)]"
      }`}
    >
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
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

const TenantGeneralSetting = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-950">
          Business Configuration
        </h2>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {businessFields.slice(0, 4).map((field) => (
            <TextField key={field.label} {...field} />
          ))}
          <div className="space-y-2">
            <span className="text-[0.78rem] font-bold text-slate-900">
              Time Format
            </span>
            <div className="flex h-12 items-center">
              <Toggle label="24-hour format" />
            </div>
          </div>
          <TextField {...businessFields[4]} />
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
          <TextField label="Support Email Address" value="support@cleanexpress.com" />
          <TextField label="Support Phone Number" value="+1 (555) 123-4567" />
          <TextField
            label="Customer Service Email Template"
            value="Standard Support Template"
          />
          <div className="space-y-2">
            <span className="text-[0.78rem] font-bold text-slate-900">
              Auto-reply Settings
            </span>
            <div className="flex h-12 items-center">
              <Toggle label="Enable auto-reply for support emails" />
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            fontWeight="bold"
            className="inline-flex h-11 items-center rounded-lg px-6 text-xs"
          >
            Save All Changes
          </Button>
          <Button
            variant="secondary"
            size="sm"
            fontWeight="bold"
            className="inline-flex h-11 items-center rounded-lg px-6 text-xs"
          >
            Apply Changes
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
