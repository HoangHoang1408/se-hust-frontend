import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";
import { toast } from "react-toastify";
import TextSearchInput from "../../../components/form/TextSearchInput";
import PaginationNav from "../../../components/PaginationNav";
import { useXemDanhSachTamTruLazyQuery } from "../../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";

type ByState = {
  canCuocCongDan?: string;
};
type Props = {};
const QuanLiTamTru = (props: Props) => {
  const navigate = useNavigate();
  const [openHanhDong, setOpenHanhDong] = useState<boolean>(false);
  const [getTamTru, { data: tamTruData, loading }] =
    useXemDanhSachTamTruLazyQuery({
      onCompleted(data) {
        const { xemDanhSachTamTru } = data;
        if (xemDanhSachTamTru.error) {
          toast.error(xemDanhSachTamTru.error.message);
          return;
        }
      },
      onError(err) {
        const msg = getApolloErrorMessage(err);
        if (msg) {
          toast.error(msg);
          return;
        }
        toast.error("Lôi xảy ra, thử lại sau");
      },
    });
  const [byState, setByState] = useState<ByState>({
    canCuocCongDan: undefined,
  });

  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    let { canCuocCongDan } = byState;
    getTamTru({
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

  const tamTrus = tamTruData?.xemDanhSachTamTru?.tamTru || [];
  const columns = useMemo(() => {
    return [
      {
        Header: "Người tạm trú",
        // @ts-ignore
        accessor: (row) => {
          return row["nguoiTamTru"].ten;
        },
      },
      {
        Header: "Căn cước công dân",
        // @ts-ignore
        accessor: (row) => {
          return row["nguoiTamTru"].canCuocCongDan;
        },
      },
      {
        Header: "Nơi tạm trú hiện tại",
        // @ts-ignore
        accessor: (row) => row["noiTamTruHienTai"],
      },
      {
        Header: "Ngày tạo",
        // @ts-ignore
        accessor: (row) =>
          new Date(row["createdAt"]).toLocaleDateString("vi", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
      },
      {
        Header: "Ngày hết hạn",
        // @ts-ignore
        accessor: (row) =>
          new Date(row["ngayHetHanTamTru"]).toLocaleDateString("vi", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
      },
    ];
  }, []);
  console.log(tamTrus);
  const data = useMemo(() => tamTrus || [], [tamTrus]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ data, columns });
  console.log(tamTruData);

  return (
    <Fragment>
      <main className="flex-1 mb-8">
        {/* Page title & actions */}
        <div className="border-b border-gray-200 mt-4 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900 sm:truncate">
              Quản lí tạm trú
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 flex space-x-3">
            <TextSearchInput
              labelText="Số căn cước công dân"
              setText={(v) =>
                setByState((pre) => ({ ...pre, canCuocCongDan: v }))
              }
            />
            <div
              className="relative"
              tabIndex={0}
              onClick={(e) => {
                setOpenHanhDong((pre) => !pre);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setOpenHanhDong(false);
                }, 30);
              }}
            >
              <h1 className="w-fit h-fit flex my-auto justify-center py-2 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 select-none cursor-pointer">
                Hành động
              </h1>
              {openHanhDong && (
                <div className="absolute border-2 top-full left-1/2 transform -translate-x-1/2 w-max rounded bg-gray-200 p-1 z-20 flex flex-col space-y-1 text-center">
                  {[
                    { title: "Thêm mới", route: "add" },
                    { title: "Chỉnh sửa", route: "edit" },
                  ].map(({ route, title }) => {
                    return (
                      <h1
                        onClick={() => {
                          setOpenHanhDong(false);
                          navigate(`/manager/tamtru/${route}`);
                        }}
                        className="h-full w-full p-2 bg-white font-medium hover:bg-indigo-600 hover:text-white rounded cursor-pointer"
                      >
                        {title}
                      </h1>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* {loading && <Loading />} */}
        {!loading && tamTrus && (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                  <table
                    {...getTableProps()}
                    className="min-w-full divide-y divide-gray-300"
                  >
                    <thead className="bg-gray-50">
                      {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                            <th
                              className="py-3.5 px-2 text-left text-sm font-semibold text-gray-900"
                              {...column.getHeaderProps()}
                            >
                              {column.render("Header")}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody
                      {...getTableBodyProps()}
                      className="divide-y divide-gray-200 bg-white"
                    >
                      {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                              return (
                                <td
                                  className="whitespace-nowrap py-[0.5rem] px-2 text-sm font-medium text-gray-600"
                                  {...cell.getCellProps()}
                                >
                                  {cell.render("Cell")}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <PaginationNav
                  currentPage={page}
                  setCurrentPage={setPage}
                  totalPage={
                    tamTruData?.xemDanhSachTamTru?.paginationOutput
                      ?.totalPages || 0
                  }
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </Fragment>
  );
};

export default QuanLiTamTru;
