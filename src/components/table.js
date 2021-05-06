import React from "react"
import { useTable } from "react-table"

export const Table = ({ data }) => {
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
      accessor: "State_s_",
    },
    {
      Header: "Patients on waitlist",
      accessor: "Patients_on_waitlist",
    },
    {
      Header: "Donors needed",
      accessor: "Donors_needed",
    },
    {
      Header: "Organs needed",
      accessor: "Organs_needed",
    },
    {
      Header: "Notes",
      accessor: "Notes",
    },
  ]

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  return (
    <div>
      <h2>OPO Dashboard Table</h2>
      <table {...getTableProps()}>
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
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
