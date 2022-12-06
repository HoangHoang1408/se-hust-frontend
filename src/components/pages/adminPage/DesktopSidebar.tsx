import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";
import { Link, useNavigate } from "react-router-dom";
import { classNames } from "../../../common/utilFunctions";
import { NavState } from "../../../layouts/ManagerLayout";
import UserDropdown from "./UserDropdown";

type Props = {
  navState: NavState[];
  setNavState: Dispatch<SetStateAction<NavState[]>>;
};
const DesktopSidebar = ({ navState, setNavState }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:pt-5 lg:pb-4 lg:bg-gray-100">
      <div className="flex justify-center flex-shrink-0 px-6">
        <Link to={"/admin"}>
          {/* <img className="h-16 w-auto" src={logo2} /> */}
          <FontAwesomeIcon
            className="w-12 h-12 text-indigo-700 mx-auto"
            icon={faHome}
          />
        </Link>
      </div>
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="mt-6 h-0 flex-1 flex flex-col overflow-y-auto px-3">
        <UserDropdown />
        {/* Navigation */}
        <nav className="mt-6">
          <div className="space-y-1">
            {navState.map((item, i) => (
              <button
                //@ts-ignore
                onClick={() => navigate(navState[i].routes[0])}
                key={item.name}
                className={classNames(
                  item.current
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                <item.icon
                  className={classNames(
                    item.current
                      ? "text-indigo-500"
                      : "text-indigo-400 group-hover:text-indigo-500",
                    "mr-3 flex-shrink-0 h-6 w-6"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default DesktopSidebar;
