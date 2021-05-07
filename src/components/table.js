import React from "react";
import { Table as BootstrapTable } from "react-bootstrap";
import { useTable } from "react-table";

export default function Table({ data }) {
  const columns = [
    {
      Header: "OPO",
      accessor: "OPO",
    },
    {
      Header: "Tier",
      accessor: "Tier",
    },
    {
      Header: "State(s)",
      accessor: "States",
    },
    {
      Header: "State waitlist",
      accessor: "Waitlist",
    },
    {
      Header: "Donors needed",
      accessor: "Donors",
    },
    {
      Header: "Organs needed",
      accessor: "Organs",
    },
    {
      Header: "CEO compensation",
      accessor: "CEO",
    },
    {
      Header: "Board compensation",
      accessor: "Board",
    },
    {
      Header: "Notes",
      accessor: "Notes",
    },
  ];

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <div>
      <h2>OPO Performance Ratings Based on Final Rule</h2>
      <br />
      <BootstrapTable responsive striped bordered hover {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </BootstrapTable>
    </div>
  );
}
