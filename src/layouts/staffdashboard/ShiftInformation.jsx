const ShiftInformation = ({
  currentShift = "8:00 AM - 4:00 PM",
  staffMember = "Sarah Johnson",
  role = "Processing Specialist",
}) => {
  return (
    <section className="rounded-[1.4rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
      <h2 className="text-[0.95rem] font-semibold text-slate-900">
        Shift Information
      </h2>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-[0.78rem] text-slate-500">Current shift</p>
          <p className="mt-1.5 text-[0.95rem] font-semibold text-slate-900">
            {currentShift}
          </p>
        </div>

        <div>
          <p className="text-[0.78rem] text-slate-500">Staff member</p>
          <p className="mt-1.5 text-[0.95rem] font-semibold text-slate-900">
            {staffMember}
          </p>
        </div>

        <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-3 py-1.5 text-[0.78rem] font-semibold text-[var(--color-primary)]">
          {role}
        </span>
      </div>
    </section>
  );
};

export default ShiftInformation;
