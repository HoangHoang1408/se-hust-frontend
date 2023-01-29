import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";
import { toast } from "react-toastify";
import TextSearchInput from "../../../components/form/TextSearchInput";
import PaginationNav from "../../../components/PaginationNav";
import { useXemDanhSachTamVangLazyQuery } from "../../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";

type ByState = {
  canCuocCongDan?: string;
};
type Props = {};
const QuanLiTamVang = (props: Props) => {
  const navigate = useNavigate();
  const [openHanhDong, setOpenHanhDong] = useState<boolean>(false);
  const [getTamVang, { data: tamVangData, loading }] =
    useXemDanhSachTamVangLazyQuery({
      onCompleted(data) {
        const { xemDanhSachTamVang } = data;
        if (xemDanhSachTamVang.error) {
          toast.error(xemDanhSachTamVang.error.message);
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
        console.log(err);
      },
    });
  const [byState, setByState] = useState<ByState>({
    canCuocCongDan: undefined,
  });

  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    let { canCuocCongDan } = byState;
    getTamVang({
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

  const tamVangs = tamVangData?.xemDanhSachTamVang?.tamVang || [];
  const columns = useMemo(() => {
    return [
      {
        Header: "Người tạm vắng",
        // @ts-ignore
        accessor: (row) => {
          return row["nguoiTamVang"].ten;
        },
      },
      {
        Header: "Căn cước công dân",
        // @ts-ignore
        accessor: (row) => {
          return row["nguoiTamVang"].canCuocCongDan;
        },
      },
      {
        Header: " Lý do tạm vắng",
        // @ts-ignore
        accessor: (row) => row["lyDoTamVang"],
      },
      {
        Header: "Nơi chuyển đến",
        // @ts-ignore
        accessor: (row) => row["diaChiNoiDen"],
      },
      {
        Header: "Ngày bắt đầu tạm vắng",
        // @ts-ignore
        accessor: (row) =>
          new Date(row["ngayBatDauTamVang"]).toLocaleDateString("vi", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
      },
      {
        Header: "Ngày kết thúc tạm vắng",
        // @ts-ignore
        accessor: (row) => {
          if (row["ngayHetHieuLuc"]) {
            return new Date(row["ngayHetHieuLuc"]).toLocaleDateString("vi", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
          }
          return "Chưa xác định";
        },
      },
    ];
  }, []);
  console.log(tamVangs);
  const data = useMemo(() => tamVangs || [], [tamVangs]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ data, columns });
  console.log(tamVangData);

  return (
    <Fragment>
      <main className="flex-1 mb-8">
        {/* Page title & actions */}
        <div className="border-b border-gray-200 mt-4 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900 sm:truncate">
              Quản lí tạm vắng
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
                    { title: "Kết thúc", route: "ketthuc" },
                  ].map(({ route, title }) => {
                    return (
                      <h1
                        onClick={() => {
                          setOpenHanhDong(false);
                          navigate(`/manager/tamvang/${route}`);
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
        {!loading && tamVangs && (
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
                    tamVangData?.xemDanhSachTamVang?.paginationOutput
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
export default QuanLiTamVang;
