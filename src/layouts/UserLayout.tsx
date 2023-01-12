import { MenuAlt1Icon } from "@heroicons/react/outline";
import { BookOpenIcon, UserCircleIcon } from "@heroicons/react/solid";
import { cloneDeep } from "lodash";
import { Fragment, SVGProps, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DesktopSidebar from "../components/pages/managerPage/DesktopSidebar";

const navigation = [
  {
    routes: ["/", "/hokhau", RegExp("/hokhau/*")],
    name: "Hộ khẩu",
    icon: BookOpenIcon,
    current: true,
  },
  {
    routes: ["/thongtin"],
    name: "Thông tin cá nhân",
    icon: UserCircleIcon,
    current: false,
  },
  {
    routes: ["/changepassword"],
    name: "Thay đổi mật khẩu",
    icon: UserCircleIcon,
    current: false,
  },
];

export type NavState = {
  routes: (string | RegExp)[];
  name: string;
  icon: (p: SVGProps<SVGSVGElement>) => JSX.Element;
  current: boolean;
};
type Props = {};
const NormalUserLayout = (props: Props) => {
  const [navState, setNavState] = useState<NavState[]>(navigation);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    const index = navState.findIndex((s) =>
      s.routes
        .map((v) => {
          if (v instanceof RegExp) return (x: string) => v.test(x);
          return (x: string) => v === x;
        })
        .some((f) => f(location.pathname))
    );
    if (index === -1) return;
    setNavState((pre) => {
      const newState = cloneDeep(pre);
      newState.forEach((s) => (s.current = false));
      newState[index].current = true;
      return newState;
    });
  }, [location]);
  return (
    <Fragment>
      <div className="min-h-full">
        <DesktopSidebar navState={navState} setNavState={setNavState} />
        <div className="lg:pl-64 flex flex-col">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};

export default NormalUserLayout;
