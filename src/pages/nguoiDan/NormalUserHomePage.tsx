import { Fragment, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";
import { toast } from "react-toastify";
import {
  HanhDongHoKhauDisplay,
  VaiTroThanhVienDisplay,
} from "../../common/constants";
import Loading from "../../components/Loading";
import {
  useHoKhauQuery,
  useLichSuHoKhauChoNguoiDungLazyQuery,
} from "../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../utils/getApolloErrorMessage";

type Props = {};

const NormalUserHomePage = (props: Props) => {
  const navigate = useNavigate();
  const { data: hoKhauData, loading } = useHoKhauQuery({
    onCompleted(data) {
      const { xemHoKhauChiTietChoNguoiDung } = data;
      if (xemHoKhauChiTietChoNguoiDung.error) {
        toast.error(xemHoKhauChiTietChoNguoiDung.error.message);
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

  const [getLichSu, { data: lichSuHoKhauData, loading: lichSuHoKhauLoading }] =
    useLichSuHoKhauChoNguoiDungLazyQuery({
      onCompleted(data) {
        const { xemLichSuThayDoiNhanKhauChoNguoiDung } = data;
        if (xemLichSuThayDoiNhanKhauChoNguoiDung.error) {
          toast.error(xemLichSuThayDoiNhanKhauChoNguoiDung.error.message);
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

  const hoKhau = hoKhauData?.xemHoKhauChiTietChoNguoiDung.hoKhau;
  useEffect(() => {
    if (!hoKhau) return;
    getLichSu();
  }, [hoKhau]);

  const columns = useMemo(() => {
    return [
      {
        Header: "Vai trò",
        // @ts-ignore
        accessor: (row) => VaiTroThanhVienDisplay[row["vaiTroThanhVien"]],
      },
      {
        Header: "Họ tên",
        // @ts-ignore
        accessor: (row) => row,
        // @ts-ignore
        Cell: (row) => {
          const data = row["row"]["original"];
          return (
            <div className="flex space-x-2 items-center">
              <h1>{data["ten"]}</h1>
            </div>
          );
        },
      },
      {
        Header: " ",
        //@ts-ignore
        accessor: (row) => row,
        // @ts-ignore
        Cell: (row) => {
          const data = row["row"]["original"];
          return (
            <div className="space-x-2">
              <button
                onClick={() => {
                  navigate(`/thanhvien/${data["id"]}`);
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
  const chuHo = hoKhau?.thanhVien?.find((tv) => tv.vaiTroThanhVien === "ChuHo");
  const thanhVien = hoKhau?.thanhVien?.filter(
    (tv) => tv.vaiTroThanhVien !== "ChuHo"
  );
  const data = useMemo(() => thanhVien || [], [thanhVien]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ data, columns });
  const lichSuHoKhau =
    lichSuHoKhauData?.xemLichSuThayDoiNhanKhauChoNguoiDung.lichSuHoKhau;
  return (
    <Fragment>
      {loading && lichSuHoKhauLoading && <Loading />}
      {!loading && !lichSuHoKhauLoading && !hoKhau && (
        <div className="overflow-hidden bg-white py-4 pr-10">
          <div className="pl-4 py-5 sm:px-6 mt-2 ">
            <h3 className="text-3xl font-bold leading-6 text-indigo-700 mb-6 pb-6 border-b border-gray-300">
              Thông tin chi tiết hộ khẩu
            </h3>
            <h1 className="text-lg font-semibold leading-6 text-gray-700">
              Người dùng hiện không có hộ khẩu hoặc hộ khẩu chưa được cấp
            </h1>
          </div>
        </div>
      )}
      {!loading && !lichSuHoKhauLoading && hoKhau && (
        <div className="overflow-hidden bg-white py-4 pr-10">
          <div className="pl-4 py-5 sm:px-6 mt-2 ">
            <h3 className="text-3xl font-bold leading-6 text-indigo-700 mb-6 pb-6 border-b border-gray-300">
              Thông tin chi tiết hộ khẩu
            </h3>
          </div>
          <div>
            {[
              {
                title: "Số hộ khẩu",
                value: hoKhau.soHoKhau,
              },
              {
                title: "Địa chỉ thường trú",
                value: hoKhau.diaChiThuongTru,
              },
              {
                title: "Ngày cấp hộ khẩu",
                value: new Date(hoKhau.createdAt).toLocaleDateString("vi", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }),
              },
            ].map((item, i) => {
              const color = i % 2 == 0 ? "bg-gray-50" : "bg-white";
              return (
                <div
                  key={i}
                  className={
                    "bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 " +
                    color
                  }
                >
                  <dt className="text-sm font-semibold text-indigo-600">
                    {item.title}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {item.value}
                  </dd>
                </div>
              );
            })}
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-semibold text-indigo-600">Chủ hộ</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1 flex flex-row">
                {chuHo?.ten}
              </dd>
              <div className="space-x-2 ml-28">
                <button
                  onClick={() => {
                    navigate(`/thanhVien/${chuHo?.id}`);
                  }}
                  className="text-indigo-600 cursor-pointer hover:text-indigo-700 hover:bg-indigo-300 text-left rounded transition w-fit p-1 text-sm font-semibold"
                >
                  Chi tiết
                </button>
              </div>
            </div>
            <div className="mb-2">
              <h1 className="bg-white px-4 py-5 ml-2 text-sm font-semibold text-indigo-600">
                Thành viên khác:
              </h1>
              {hoKhau.thanhVien.length === 1 && (
                <div className="px-12 text-left text-sm font-semibold text-gray-500">
                  Không có thành viên khác
                </div>
              )}
              {hoKhau.thanhVien.length > 1 && (
                <div className="overflow-hidden shadow-sm ring-black ml-10 mr-6">
                  <table
                    {...getTableProps()}
                    className="min-w-full divide-y divide-gray-300"
                  >
                    <thead className="space-x-2">
                      {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                            <th
                              className="py-2 px-6 text-left text-sm font-semibold text-gray-500"
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
                      {rows.map((row) => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                              return (
                                <td
                                  className="whitespace-nowrap py-[0.5rem] px-6 text-sm font-semibold text-gray-600"
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
              )}
            </div>
            <div className="bg-white px-4 py-5 sm:px-6">
              <dt className="text-sm font-semibold text-indigo-600 mb-3">
                Lịch sử thay đổi hộ khẩu:
              </dt>
              {lichSuHoKhau && (
                <dl className="ml-4">
                  {lichSuHoKhau.map((ls, i) => {
                    const info = [
                      {
                        title: "Hành động",
                        value: HanhDongHoKhauDisplay[ls.hanhDong],
                      },
                      {
                        title: "Thời gian",
                        value: new Date(ls.thoiGian).toLocaleDateString("vi", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }),
                      },
                      {
                        title: "Người yêu cầu",
                        value: ls.nguoiYeuCau.ten,
                      },
                      {
                        title: "Người phê duyệt",
                        value: ls.nguoiPheDuyet.ten,
                      },
                      {
                        title: "Ghi chú",
                        value: ls.ghiChu || "Không có",
                      },
                    ];
                    return (
                      <div key={i} className="mb-10 border-2 rounded-md shadow">
                        {info.map((item, i1) => {
                          const color = i1 % 2 == 0 ? "bg-gray-50" : "bg-white";
                          return (
                            <div
                              key={i1 * i}
                              className={
                                "px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 " +
                                color
                              }
                            >
                              <dt className="text-sm font-semibold text-gray-500">
                                {item.title}
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {item.value}
                              </dd>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </dl>
              )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default NormalUserHomePage;
