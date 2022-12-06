import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/outline";
import { range } from "lodash";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  totalPage: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
};

const PaginationNav: FC<Props> = ({
  totalPage,
  currentPage,
  setCurrentPage,
}: Props) => {
  return (
    <nav className="px-4 flex items-center justify-center sm:px-0 mt-4 select-none w-max mx-auto">
      {currentPage > 1 && (
        <div
          onClick={() => {
            if (currentPage > 1) setCurrentPage((pre) => pre - 1);
          }}
          className="-mt-px w-fit flex justify-end"
        >
          <div className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer">
            <ArrowNarrowLeftIcon
              className="mr-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Trước
          </div>
        </div>
      )}
      <div className="hidden md:-mt-px md:flex">
        {range(totalPage).map((e) => {
          if (e + 1 === currentPage)
            return (
              <div
                key={e}
                className="border-indigo-500 text-indigo-600 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium cursor-pointer"
              >
                {e + 1}
              </div>
            );
          return (
            <div
              key={e}
              onClick={() => setCurrentPage(e + 1)}
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium cursor-pointer"
            >
              {e + 1}
            </div>
          );
        })}
      </div>
      {currentPage < totalPage && (
        <div
          onClick={() => {
            if (currentPage < totalPage) setCurrentPage((pre) => pre + 1);
          }}
          className="-mt-px w-fit flex"
        >
          <div className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer">
            Tiếp
            <ArrowNarrowRightIcon className="ml-3 h-5 w-5 text-gray-400" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default PaginationNav;
