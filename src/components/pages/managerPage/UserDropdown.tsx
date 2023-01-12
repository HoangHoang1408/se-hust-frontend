import { useReactiveVar } from "@apollo/client";
import { Menu, Transition } from "@headlessui/react";
import { SelectorIcon, UserCircleIcon } from "@heroicons/react/outline";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { logout, userVar } from "../../../apollo/reactiveVar/loginStatusVar";
import { classNames } from "../../../common/utilFunctions";
type Props = {};
const UserDropdown = (props: Props) => {
  const navigate = useNavigate();
  const user = useReactiveVar(userVar);
  return (
    <Menu as="div" className="relative inline-block text-left w-full mt-2">
      <div>
        <Menu.Button className="group w-full bg-gray-100 rounded-md px-2 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 ">
          <span className="flex w-full justify-between items-center">
            <span className="flex min-w-0 items-center justify-between space-x-3">
              {user?.avatar?.fileUrl ? (
                <img
                  className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0"
                  src={user.avatar.fileUrl}
                />
              ) : (
                <UserCircleIcon className="w-8 h-8 text-indigo-500" />
              )}
              <span className="flex-1 flex flex-col min-w-0">
                <span className="text-gray-900 text-sm font-medium truncate">
                  {user?.ten}
                </span>
              </span>
            </span>
            <SelectorIcon
              className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
          </span>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm w-full text-left"
                  )}
                >
                  Settings
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    navigate("/changepassword");
                  }}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm w-full text-left"
                  )}
                >
                  Đổi mật khẩu
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm w-full text-left"
                  )}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserDropdown;
