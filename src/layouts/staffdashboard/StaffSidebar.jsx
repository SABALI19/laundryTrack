import Quickfilter from "./Quickfilter.jsx";
import ShiftInformation from "./ShiftInformation.jsx";
import TodaySummary from "./TodaySummary.jsx";

const StaffSidebar = ({ summaryItems = [], filters = [] }) => {
  return (
    <aside className="space-y-5">
      <TodaySummary summaryItems={summaryItems} />
      <Quickfilter filters={filters} />
      <ShiftInformation />
    </aside>
  );
};

export default StaffSidebar;
