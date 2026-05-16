import {
  Edit3,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Target,
} from "lucide-react";

const profileFields = [
  ["Legal Business Name", "Clean Express Laundry LLC"],
  ["Business Registration", "BR-2023-4567"],
  ["Tax ID", "45-1234567"],
  ["Primary Contact", "Sarah Johnson"],
];

const contactRows = [
  { Icon: Mail, value: "sarah@cleanexpress.com" },
  { Icon: Phone, value: "+1 (555) 123-4567" },
  { Icon: MapPin, value: "1234 Main St, New York, NY 10001" },
  { Icon: Globe2, value: "www.cleanexpress.com" },
];

const BusinessProfile = () => {
  return (
    <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-base font-semibold text-slate-900">
          Business Profile
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-[0.76rem] font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit Profile
        </button>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#24415d] text-white">
          <div className="text-center">
            <Target className="mx-auto h-5 w-5" />
            <p className="mt-1 text-[0.48rem] font-bold leading-none">
              Clean
              <br />
              Express
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            Clean Express
          </h3>
          <p className="mt-1 text-[0.78rem] text-slate-600">
            Professional Laundry Services
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-x-12 gap-y-4 sm:grid-cols-2">
        {profileFields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[0.72rem] text-slate-500">{label}</dt>
            <dd className="mt-1 text-[0.82rem] font-medium text-slate-900">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 space-y-3">
        {contactRows.map(({ Icon, value }) => (
          <div key={value} className="flex items-center gap-3 text-[0.82rem] text-slate-700">
            <Icon className="h-3.5 w-3.5 text-slate-500" />
            <span>{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-[0.76rem] text-slate-500">
        <span>Created: March 15, 2023</span>
        <span>By: Admin User</span>
      </div>
    </section>
  );
};

export default BusinessProfile;
