import { NavLink } from "react-router-dom";
import { menuRoutes } from "../../router/router";

export const SideBarMenuItem = () => {
  return (
    <>
      {menuRoutes.map((option) => (
        <NavLink
          key={option.to}
          to={option.to}
          className={({ isActive }) =>
            isActive
              ? `flex justify-center items-center bg-gray-800 rounded-md p-2 transition-colors`
              : "flex justify-center items-center hover:bg-gray-800 rounded-md p-2 transition-colors"
          }
        >
          <i className={`${option.icon} text-2cl mr-4 text-indigo-400`}></i>
          <div className="flex flex-col flex-grow">
            <span className="text-white text-lg font-semibold">
              {option.title}
            </span>
            <span className="text-gary-400 text-sm">{option.description}</span>{" "}
          </div>
        </NavLink>
      ))}
    </>
  );
};
