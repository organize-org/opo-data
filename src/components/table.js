import React, { useMemo } from "react"
import { useTable } from "react-table"
import { COLUMNS } from "./columns"

export const Table = ({ data }) => {
  console.log("table component", data)

  const columns = useMemo(() => COLUMNS, [])

  const tableInstance = useTable({
    columns,
    data: data.allExampledataCsv.edges.map(({ node }) => ({ ...node })),
  })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance

  return (
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
          console.log(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
