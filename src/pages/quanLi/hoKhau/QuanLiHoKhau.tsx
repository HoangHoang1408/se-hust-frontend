import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
type ByState = {
  hoTen?: string;
  canCuocCongDan?: string;
};

type Props = {};
const QuanLiHoKhau = (props: Props) => {
  const navigate = useNavigate();
  // const [getUsers, { data: userData, loading }] = useDanhSachNguoiDungLazyQuery(
  //   {
  //     onCompleted(data) {
  //       const { xemDanhSachNguoiDung } = data;
  //       if (xemDanhSachNguoiDung.error) {
  //         toast.error(xemDanhSachNguoiDung.error.message);
  //         return;
  //       }
  //     },
  //     onError(err) {
  //       const msg = getApolloErrorMessage(err);
  //       if (msg) {
  //         toast.error(msg);
  //         return;
  //       }
  //       toast.error("Lôi xảy ra, thử lại sau");
  //     },
  //   }
  // );
  // const [byState, setByState] = useState<ByState>({
  //   hoTen: undefined,
  //   canCuocCongDan: undefined,
  // });
  // const [page, setPage] = useState<number>(1);
  // useEffect(() => {
  //   let { hoTen, canCuocCongDan } = byState;
  //   getUsers({
  //     variables: {
  //       input: {
  //         hoTen,
  //         canCuocCongDan,
  //         paginationInput: {
  //           page,
  //           resultsPerPage: 16,
  //         },
  //       },
  //     },
  //   });
  // }, [byState, page]);
  // const users = userData?.xemDanhSachNguoiDung.users;
  // const columns = useMemo(() => {
  //   return [
  //     {
  //       Header: "Id",
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
  //       Header: "Vai trò",
  //       // @ts-ignore
  //       accessor: (row) => row["vaiTroNguoiDung"],
  //     },
  //     {
  //       Header: "Đã đăng kí",
  //       // @ts-ignore
  //       accessor: (row) => {
  //         return row["daDangKi"] ? "Đã đăng kí" : "Chưa đăng kí";
  //       },
  //     },
  //     {
  //       Header: "Căn cước công dân",
  //       // @ts-ignore
  //       accessor: (row) => row["canCuocCongDan"],
  //     },
  //     {
  //       Header: "SĐT",
  //       // @ts-ignore
  //       accessor: (row) => row["soDienThoai"] || "Không có",
  //     },
  //     {
  //       Header: "Giới tính",
  //       // @ts-ignore
  //       accessor: (row) => row["gioiTinh"],
  //     },
  //     {
  //       Header: "Ngày sinh",
  //       // @ts-ignore
  //       accessor: (row) =>
  //         new Date(row["ngaySinh"]).toLocaleDateString("vi", {
  //           year: "numeric",
  //           month: "2-digit",
  //           day: "2-digit",
  //         }),
  //     },
  //     {
  //       Header: "Hành động",
  //       //@ts-ignore
  //       accessor: (row) => row,
  //       // @ts-ignore
  //       Cell: (row) => {
  //         const data = row["row"]["original"];
  //         return (
  //           <div className="space-x-2">
  //             <button
  //               onClick={() => {
  //                 navigate(`/manager/users/${data["id"]}`);
  //               }}
  //               className="font-semibold text-indigo-500 cursor-pointer hover:text-indigo-700 p-1 hover:bg-indigo-300 text-left rounded transition w-fit"
  //             >
  //               Chi tiết
  //             </button>
  //             <button
  //               onClick={() => {
  //                 navigate(`/manager/users/edit/${data["id"]}`);
  //               }}
  //               className="font-semibold text-indigo-500 cursor-pointer hover:text-indigo-700 p-1 hover:bg-indigo-300 text-left rounded transition w-fit"
  //             >
  //               Cập nhật
  //             </button>
  //           </div>
  //         );
  //       },
  //     },
  //   ];
  // }, []);
  // const data = useMemo(() => users || [], [users]);
  // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  //   useTable({ data, columns });
  return (
    <Fragment>
      <main className="flex-1 mb-8">
        {/* Page title & actions */}
        <div className="border-b border-gray-200 mt-4 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
              Quản lí hộ khẩu
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 flex space-x-3">
            {/* <TextSearchInput
              labelText="Họ tên"
              setText={(v) => setByState((pre) => ({ ...pre, hoTen: v }))}
            />
            <TextSearchInput
              labelText="Căn cước công dân"
              setText={(v) =>
                setByState((pre) => ({ ...pre, canCuocCongDan: v }))
              }
            /> */}
            {/* <div className="flex flex-col space-y-1">
              <h1 className="text-gray-700 font-medium">Vai trò</h1>
              <select
                onChange={(e) =>
                  //@ts-ignore
                  setByState((pre) => ({ ...pre, role: e.target.value }))
                }
                value={byState.role}
                className="appearance-none block w-full px-2 py-1 h-full border border-gray-300 shadow-sm rounded-none placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-semibold"
              >
                <option value="all">Tất cả</option>
                {Object.values(UserRole).map((t, i) => (
                  <option key={i} value={t}>
                    {[t]}
                  </option>
                ))}
              </select>
            </div> */}
            <button
              onClick={() => navigate("/manager/hokhau/add")}
              className="w-fit h-fit flex my-auto justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Thêm mới
            </button>
          </div>
        </div>
        {/* {loading && <Loading />} */}
        {/* {!loading && userData && (
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
                    userData.xemDanhSachNguoiDung.paginationOutput?.totalPages!
                  }
                />
              </div>
            </div>
          </div>
        )} */}
      </main>
    </Fragment>
  );
};

export default QuanLiHoKhau;
