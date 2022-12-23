import { FC, MouseEventHandler } from "react";
import { loadingWhite } from "../../images";

type Props = {
  loading: boolean;
  text: string;
  className?: string;
  onClick?: MouseEventHandler;
};

const LoadingButton: FC<Props> = ({ loading, text, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      type="submit"
      className={
        "w-full h-10 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 " +
          className || ""
      }
    >
      {!loading && <p>{text}</p>}
      {loading && <img className="w-8 h-8" src={loadingWhite} />}
    </button>
  );
};

export default LoadingButton;
