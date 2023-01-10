import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";
import { toast } from "react-toastify";
import TextSearchInput from "../../../components/form/TextSearchInput";
import PaginationNav from "../../../components/PaginationNav";
import {
  useDanhSachHoKhauLazyQuery,
  VaiTroThanhVien,
} from "../../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";
type ByState = {
  soHoKhau?: string;
};

type Props = {};
const QuanLiHoKhau = (props: Props) => {
  const navigate = useNavigate();
  const [openHanhDong, setOpenHanhDong] = useState<boolean>(false);
  const [getHoKhau, { data: hoKhauData, loading }] = useDanhSachHoKhauLazyQuery(
    {
      onCompleted(data) {
        const { xemDanhSachHoKhau } = data;
        if (xemDanhSachHoKhau.error) {
          toast.error(xemDanhSachHoKhau.error.message);
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
    }
  );
  const [byState, setByState] = useState<ByState>({
    soHoKhau: undefined,
  });
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    let { soHoKhau } = byState;
    getHoKhau({
      variables: {
        input: {
          soHoKhau,
          paginationInput: {
            page,
            resultsPerPage: 16,
          },
        },
      },
    });
  }, [byState, page]);
  const hoKhaus = hoKhauData?.xemDanhSachHoKhau.hoKhau || [];
  const columns = useMemo(() => {
    return [
      {
        Header: "Số hộ khẩu",
        // @ts-ignore
        accessor: (row) => row["soHoKhau"],
      },
      {
        Header: "Chủ hộ",
        // @ts-ignore
        accessor: (row) => {
          return row["thanhVien"].find(
            // @ts-ignore
            (tv) => tv.vaiTroThanhVien == VaiTroThanhVien.ChuHo
          ).ten;
        },
      },
      {
        Header: "Địa chỉ thường trú",
        // @ts-ignore
        accessor: (row) => row["diaChiThuongTru"],
      },
      {
        Header: "Số lượng thành viên",
        // @ts-ignore
        accessor: (row) => row["thanhVien"].length,
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
        Header: "Hành động",
        //@ts-ignore
        accessor: (row) => row,
        // @ts-ignore
        Cell: (row) => {
          const data = row["row"]["original"];
          return (
            <div className="space-x-2">
              <button
                onClick={() => {
                  navigate(`/manager/hokhau/${data["id"]}`);
                }}
                className="font-semibold text-indigo-500 cursor-pointer hover:text-indigo-700 p-1 hover:bg-indigo-300 text-left rounded transition w-fit"
              >
                Chi tiết
              </button>
            </div>
          );
        },
      },
    ];
  }, []);
  const data = useMemo(() => hoKhaus || [], [hoKhaus]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ data, columns });
  return (
    <Fragment>
      <main className="flex-1 mb-8">
        {/* Page title & actions */}
        <div className="border-b border-gray-200 mt-4 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900 sm:truncate">
              Quản lí hộ khẩu
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 flex space-x-3">
            <TextSearchInput
              labelText="Số hộ khẩu"
              setText={(v) => setByState((pre) => ({ ...pre, soHoKhau: v }))}
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
                    { title: "Cập nhật", route: "update" },
                    { title: "Phân chia", route: "split" },
                  ].map(({ route, title }) => {
                    return (
                      <h1
                        onClick={() => {
                          setOpenHanhDong(false);
                          navigate(`/manager/hokhau/${route}`);
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
        {!loading && hoKhaus && (
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
                    hoKhauData?.xemDanhSachHoKhau.paginationOutput
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

export default QuanLiHoKhau;
