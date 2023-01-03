import { UserCircleIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FormInput } from "../../../components/form/FormInput";
import LoadingButton from "../../../components/form/LoadingButton";
import TextSearchInput from "../../../components/form/TextSearchInput";
import Loading from "../../../components/Loading";
import PaginationNav from "../../../components/PaginationNav";
import {
  useAddTamTruMutation,
  useDanhSachNguoiDungLazyQuery,
} from "../../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";
import { useForm } from "react-hook-form/dist/useForm";
import { yupResolver } from "@hookform/resolvers/yup";
type ByState = {
  canCuocCongDan?: string;
};
type Props = {};
const TamTruManager = (props: Props) => {
  //
  const navigate = useNavigate();
  const [addTamTru] = useAddTamTruMutation();
  const [getUsers, { data: userData, loading }] = useDanhSachNguoiDungLazyQuery(
    {
      onCompleted(data) {
        const { xemDanhSachNguoiDung } = data;
        if (xemDanhSachNguoiDung.error) {
          toast.error(xemDanhSachNguoiDung.error.message);
          return;
        }
      },
      onError(err) {
        const msg = getApolloErrorMessage(err);
        if (msg) {
          toast.error(msg);
          return;
        }
        toast.error("Lỗi xảy ra, thử lại sau");
      },
    }
  );
  const [byState, setByState] = useState<ByState>({
    canCuocCongDan: undefined,
  });
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    let { canCuocCongDan } = byState;
    getUsers({
      variables: {
        input: {
          canCuocCongDan,
          paginationInput: {
            page,
            resultsPerPage: 16,
          },
        },
      },
    });
  }, [byState, page]);
  //
  const users = userData?.xemDanhSachNguoiDung.users;
  // const columns = useMemo(() => {
  //   return [
  //     {
  //       Header: "ID",
  //       // @ts-ignore
  //       accessor: (row) => row["id"],
  //     },
  //     {
  //       Header: "Họ tên",
  //       // @ts-ignore
  //       accessor: (row) => row,
  //       // @ts-ignore
  //       Cell: (row) => {
  //         const data = row["row"]["original"];
  //         return (
  //           <div className="flex space-x-2 items-center">
  //             {data["avatar"] && (
  //               <img
  //                 className="w-8 h-8 rounded-full object-center"
  //                 src={data["avatar"]["fileUrl"]}
  //                 alt="image"
  //               />
  //             )}
  //             {!data["avatar"] && (
  //               <UserCircleIcon className="w-8 h-8 rounded-full object-center" />
  //             )}
  //             <h1>{data["ten"]}</h1>
  //           </div>
  //         );
  //       },
  //     },
  //     {
  //       Header: "Căn cước công dân",
  //       // @ts-ignore
  //       accessor: (row) => row["canCuocCongDan"],
  //     },
  //   ];
  // }, []);
  // const data = useMemo(() => users || [], [users]);
  return (
    <Fragment>
      <main className="flex-1 mb-8">
        {/* Page title & actions */}
        <div className=" border-gray-200 mt-4 py-4 sm:justify-between sm:px-6 lg:px-8">
          <div className="flex flex-row ">
            <div className="basis-1/2">
              <div className="text-2xl font-medium leading-6 text-indigo-500 sm:truncate ">
                Thêm tạm trú
              </div>
              <div className="flex flex-col space-y-6 ">
                <div className="basis-1/2 flex-col">
                  {loading && <Loading />}
                  {!loading && byState.canCuocCongDan && userData && (
                    <div className="">
                      <div> </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col px-6 py-6">
                  <div className="font-xl font-medium font-bold text-indigo-500">
                    Tìm kiếm{" "}
                  </div>
                  <TextSearchInput
                    labelText="Căn cước công dân"
                    setText={(v) =>
                      setByState((pre) => ({ ...pre, canCuocCongDan: v }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-neutral-200,"></div>
        </div>
      </main>
    </Fragment>
  );
};

export default TamTruManager;
