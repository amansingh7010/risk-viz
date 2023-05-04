import React, { useMemo } from "react";
import { useTable, usePagination, useFilters, useSortBy } from "react-table";

const emptyArray = [];
const columns = [
  {
    Header: "Asset Name",
    accessor: "Asset Name",
    width: 50,
  },
  {
    Header: "Business Category",
    accessor: "Business Category",
    width: 50,
  },
  {
    Header: "Risk Rating",
    accessor: "Risk Rating",
    width: 50,
  },
  {
    Header: "Risk Factors",
    accessor: "Risk Factors",
    width: 1000,
  },
];

// Define a default UI for filtering
const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
  return (
    <input
      value={filterValue || ""}
      className="w-3/4 px-2 bg-gray-700 border-gray-200 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search...`}
    />
  );
};

const Table = ({ data = [] }) => {
  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: data || emptyArray,
      defaultColumn,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <>
      <table {...getTableProps()} className="table-fixed w-full">
        <thead>
          {headerGroups.map((headerGroup, headerGroupIndex) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="bg-gray-100"
              key={`headergroup-${headerGroupIndex}`}
            >
              {headerGroup.headers.map((column, columnIndex) => (
                <th
                  key={`column-${columnIndex}`}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-3 py-2 text-left bg-gray- bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  style={{ tableLayout: column.size }}
                >
                  {column.render("Header")}
                  <span style={{ cursor: "pointer" }}>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                  <div className="my-1">
                    {column.canFilter ? column.render("Filter") : null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, rowKey) => {
            prepareRow(row);
            return (
              <tr key={`row-${rowKey}`} {...row.getRowProps()}>
                {row.cells.map((cell, cellKey) => {
                  return (
                    <td
                      key={`cell-${cellKey}`}
                      {...cell.getCellProps({
                        className: "px-3 py-2 border-t border-gray-200 text-xs",
                      })}
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

      <div className="p-0.5 flex flex-auto justify-center">
        <button
          className="mx-2"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>
        <button
          className="mx-2"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>
        <button
          className="mx-2"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {">"}
        </button>
        <button
          className="mx-2"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>
        <span className="mx-2">
          Page
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <span className="mx-2">Go to page:</span>
        <span className="mx-2">
          <input
            type="number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>
        <select
          value={pageSize}
          className="bg-gray-50 mx-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Table;
