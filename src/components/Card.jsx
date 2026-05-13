// Card.jsx
import React from "react";

const Card = ({
  title,
  children,
  footer,
  className = "",
  headerAction,
  badge,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Card Header */}
      {title && (
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="text-base font-semibold text-gray-900">{title}</div>
            {badge && (
              <span className="inline-block bg-teal-100 text-[#2c4a7d] text-xs font-medium px-2.5 py-1 rounded">
                {badge}
              </span>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className="px-4 pt- pb-4">{children}</div>

      {/* Card Footer */}
      {footer && (
        <div className="bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;