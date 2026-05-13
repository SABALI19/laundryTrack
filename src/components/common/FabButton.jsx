import { createElement } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FabButton = ({
  Icon = Plus,
  ariaLabel = "New laundry order",
  className = "",
  iconClassName = "h-6 w-6",
  onClick,
  shapeClassName = "rounded-full",
  to = "/new-order",
  visibilityClassName = "sm:hidden",
}) => {
  const navigate = useNavigate();
  const handleClick = onClick || (() => navigate(to));

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`fixed right-4 top-30 z-50 flex h-14 w-14 items-center justify-center ${shapeClassName} border-b-4 border-b-[#2c4a7d] bg-white p-0 text-[#2c4a7d] shadow-2xl shadow-[#2c4a7d] transition-all active:scale-95 ${visibilityClassName} ${className}`}
      aria-label={ariaLabel}
    >
      {createElement(Icon, { className: iconClassName })}
    </button>
  );
};

export default FabButton;
