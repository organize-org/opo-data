import React, {useMemo} from "react";
import { Container, Row, Table } from "react-bootstrap";
 import { useTable, useSortBy } from "react-table";

import Tier from "../tier/tier";

import * as styles from "./opoTable.module.css";

export default function OpoTableRT({
  citations,
  headings,
  inState = true,
  opos,
  title,
}) {


const columns = useMemo(() => {
  const cols = [
    "states",
    "name",
    "region",
    "tier",
    "donors",
    "shadow",
    "investigation",
  ];
  const Heading = ({ color, title }) => (
    <>
      {headings[title].heading}
      {citations[title] && (
        <sup>
          <a
            className={color ?? null}
            href={`#citations-${citations[title].index}`}
            target="_self"
          >
            {citations[title].index + 1}
          </a>
        </sup>
      )}
    </>
  );
  const createCol = accessor => {
    let col = {
      Header: (
        <Heading
          title={accessor}
          color={accessor === "shadow" ? "red" : null}
        />
      ),
      accessor: accessor,
    };
    if (accessor === "donors" || accessor === "investigation")
      col.cellClass = "text-center";
    if (accessor === "shadow") {
      col.cellClass = styles.shadows
      col.color = "red"
    };
    if (accessor === "tier") {
      col.Cell = props => (
        <Container>
          <Tier className={styles.tierCol} tier={props.value} />
        </Container>
      );
      col.cellClass = styles.tierCol;
    }
    return col;
  };
  return cols
    .map(col => {
      if (inState && col === "states") return col;
      if (!inState && (col === "region" || col === "investigation")) return col;
      return createCol(col);
    })
    .filter(head => typeof head !== "string");
}, [headings, inState, citations]);

  const data = useMemo(() => {
    const formatNumber = (num, options) =>
      !num || isNaN(num) ? "--" : num.toLocaleString("en-US", options);

    return opos.map(
      ({ donors, investigation, name, region, shadows, states, tier }) => {
        return {
          donors: formatNumber(donors),
          investigation: investigation ? "Yes" : "--",
          name: name,
          region: region,
          shadow: formatNumber(shadows),
          states: states,
          tier: tier,
        };
      }
    );
  }, [opos]);

   const {
     getTableProps,
     getTableBodyProps,
     headerGroups,
     rows,
     prepareRow,
   } = useTable({ columns, data }, useSortBy);

   const table = (
     <Row className={styles.opoTable}>
       <h3>{title}</h3>
       <Table striped {...getTableProps()}>
         <thead>
           {headerGroups.map(headerGroup => (
             <tr {...headerGroup.getHeaderGroupProps()}>
               {headerGroup.headers.map(column => (
                 <th
                   {...column.getHeaderProps(column.getSortByToggleProps())}
                   scope="col"
                   className={column.color ?? null}
                 >
                   {column.render("Header")}
                 </th>
               ))}
             </tr>
           ))}
         </thead>
         <tbody {...getTableBodyProps()}>
           {rows.map(row => {
             prepareRow(row);
             return (
               <tr {...row.getRowProps()}>
                 {row.cells.map(cell => {
                   return (
                     <td
                       {...cell.getCellProps()}
                       className={cell.column.cellClass ?? ""}
                     >
                       {cell.render("Cell")}
                     </td>
                   );
                 })}
               </tr>
             );
           })}
         </tbody>
       </Table>
     </Row>
   );

   return table;
}