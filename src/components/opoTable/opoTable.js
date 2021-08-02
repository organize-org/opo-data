import React, { useMemo } from "react";
import { Container, Row, Table } from "react-bootstrap";
import { useTable, useSortBy } from "react-table";

import ChevronUp from "../../images/icons/chevron-up.svg";
import ChevronDown from "../../images/icons/chevron-down.svg";
import ChevronDownGrey from "../../images/icons/chevron-down-grey.svg";
import Tier from "../tier/tier";

import * as styles from "./opoTable.module.css";

export default function OpoTable({
  citations,
  headings,
  inState = true,
  opos,
  title,
}) {
  const columns = useMemo(() => {
    const cols = inState
      ? ["name", "region", "tier", "donors", "shadow", "investigation"]
      : ["states", "name", "tier", "donors", "shadow"];

    const createCol = accessor => {
      const col = {
        Header: (
          <div>
            {headings[accessor].heading}
            {citations[accessor] && (
              <sup>
                <a
                  className={accessor === "shadow" ? "red" : null}
                  href={`#citations-${citations[accessor].index}`}
                  target="_self"
                >
                  {citations[accessor].index + 1}
                </a>
              </sup>
            )}
          </div>
        ),
        accessor,
      };
      if (accessor === "donors" || accessor === "investigation") {
        return {
          ...col,
          cellClass: "text-center",
        };
      } else if (accessor === "shadow") {
        return {
          ...col,
          cellClass: styles.shadows,
          color: "red",
        };
      } else if (accessor === "tier") {
        return {
          ...col,
          cellClass: styles.tierCol,
          Cell: props => (
            <Container>
              <Tier className={styles.tierCol} tier={props.value} />
            </Container>
          ),
        };
      } else {
        return col;
      }
    };
    return cols.map(col => createCol(col));
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
                  <div className={styles.header}>
                    {column.render("Header")}
                    <div className={styles.chevron}>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )
                      ) : (
                        <ChevronDownGrey />
                      )}
                    </div>
                  </div>
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
                      className={cell.column.cellClass ?? null}
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
