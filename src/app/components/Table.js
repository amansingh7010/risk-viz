import React, { useState, useMemo } from "react";
import { useTable, usePagination, useFilters, useSortBy } from "react-table"

const emptyArray = [];
const columns = [
  {
    Header: "Asset Name",
    accessor: "Asset Name",
  },
  {
    Header: "Business Category",
    accessor: "Business Category",
  },
  {
    Header: "Risk Rating",
    accessor: "Risk Rating",
  },
  {
    Header: "Risk Factors",
    accessor: "Risk Factors",
  },
];

// Define a default UI for filtering
const DefaultColumnFilter = ({
  column: { filterValue, setFilter },
}) => {

  return (
    <input
      value={filterValue || ''}
      className="w-3/4 px-2"
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
      placeholder={`Search...`}
    />
  )
}

const Table = ({ data = [] }) => {

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  )

  
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
    usePagination,
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
                  className="px-3 py-2 text-left text-gray-600 font-semibold tracking-wider uppercase"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
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

      <div className="p-0.5 flex flex-auto justify-evenly">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        <span>
          Page
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <span>
          Go to page:
        </span>
        <span>
          <input
            type="number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>
        <select
          value={pageSize}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
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
