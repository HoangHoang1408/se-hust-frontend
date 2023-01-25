import { useReactiveVar } from "@apollo/client";
import { Menu } from "@headlessui/react";
import { SelectorIcon, UserCircleIcon } from "@heroicons/react/outline";
import { userVar } from "../../../apollo/reactiveVar/loginStatusVar";
type Props = {};
const UserDropdown = (props: Props) => {
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
    </Menu>
  );
};

export default UserDropdown;
