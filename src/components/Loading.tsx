import { FC } from "react";
import { loadingWhite } from "../images";

type Props = {};

const Loading: FC<Props> = (props) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
      <img src={loadingWhite}></img>
      <h2 className="text-center text-white text-xl font-semibold">
        Loading...
      </h2>
      <p className="w-1/3 text-center text-white">
        Đang tải trang vui lòng đợi
      </p>
    </div>
  );
};

export default Loading;
