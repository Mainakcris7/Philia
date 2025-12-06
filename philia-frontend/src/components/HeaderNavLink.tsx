import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function HeaderNavLink({
  to,
  icon,
  tooltipText,
  color,
  activeColor = "white",
  badge = 0,
}: {
  to: string;
  icon: IconDefinition;
  tooltipText: string;
  color: string;
  activeColor?: string;
  badge?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col justify-center items-center h-16 px-2 relative ${
          isActive ? "border-b-2 border-white" : ""
        }`
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {({ isActive }) => {
        return (
          <div className="flex flex-col items-center relative">
            <FontAwesomeIcon
              icon={icon}
              className={`text-[2rem] relative ${
                isActive ? "" : "bottom-[0.5px]"
              }`}
              color={`${isActive || isHovered ? activeColor : color}`}
            />
            {badge > 0 && (
              <span className="absolute w-min h-min text-xs -top-1 left-5 rounded-full bg-red-600 px-1.5 font-semibold">
                {badge > 9 ? "9+" : badge}
              </span>
            )}
            <span
              className={`
                text-[11px] transition-all absolute duration-300 -bottom-4 text-gray-300
                ${
                  isHovered && !isActive
                    ? "opacity-100 translate-y-0" // Visible state
                    : "opacity-0 translate-y-1" // Hidden state (moved slightly down)
                }
              `}
            >
              {tooltipText}
            </span>
          </div>
        );
      }}
    </NavLink>
  );
}
