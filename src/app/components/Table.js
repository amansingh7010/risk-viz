import React, { useState, useMemo } from "react";
import { useTable, usePagination, useSortBy, useFilters } from "react-table"

const Table = ({ data = [] }) => {

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
      data,
      initialState: { pageIndex: 0 },
    },
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
                  {...column.getHeaderProps()}
                  className="px-4 py-2 text-left text-gray-600 font-semibold tracking-wider uppercase"
                >
                  {column.render("Header")}
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
                        className: "px-4 py-2 border-t border-gray-200 text-sm",
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

      <div style={{padding: '0.5rem'}}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
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
