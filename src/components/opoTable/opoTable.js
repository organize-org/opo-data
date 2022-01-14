import React, { useMemo } from "react";
import { Link } from "gatsby";
import { Row, Table } from "react-bootstrap";
import { useTable, useSortBy } from "react-table";
import ReactMarkdown from "react-markdown";

import ChevronUp from "../../images/icons/chevron-up.svg";
import ChevronDown from "../../images/icons/chevron-down.svg";
import ChevronDownGrey from "../../images/icons/chevron-down-grey.svg";

import * as styles from "./opoTable.module.css";
import { LegendItem, OPO_PERFORMANCE_TIER_FILL } from "../map/legend";

export default function OpoTable({
  headings,
  inState = true,
  inOpo = false,
  opos,
  title,
}) {
  const columns = useMemo(() => {
    const cols = inState
      ? ["name", "region", "tier", "donors", "shadow", "investigation"]
      : inOpo
      ? ["ethnicity", "death", "donors", "recovery", "rank"]
      : ["states", "name", "tier", "donors", "shadow"];

    const createCol = accessor => {
      const col = {
        Header: <ReactMarkdown>{headings[accessor]}</ReactMarkdown>,
        accessor,
      };
      if (accessor === "name") {
        return {
          ...col,
          Cell: props => (
            <Link
              to={`/opo/${opos.find(opo => opo.name === props.value)?.opo}`}
            >
              {props.value}
            </Link>
          ),
        };
      } else if (
        (accessor === "donors" && !inOpo) ||
        accessor === "investigation"
      ) {
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
            <LegendItem 
              className={styles.tierCol}
              text={props.value.split(" ")[1]}
              background={OPO_PERFORMANCE_TIER_FILL[props.value.split(" ")[1]].fill}
            />
          ),
        };
      } else if (accessor === "death") {
        return {
          ...col,
          sortType: (a, b) =>
            parseInt(a.values.death?.replace(/,/g, "")) -
            parseInt(b.values.death?.replace(/,/g, "")),
        };
      } else {
        return col;
      }
    };
    return cols.map(col => createCol(col));
  }, [headings, inState, opos, inOpo]);

  const data = useMemo(() => {
    const formatNumber = (num, options) =>
      !num || isNaN(num) ? "--" : num.toLocaleString("en-US", options);

    return opos.map(
      ({
        donors,
        investigation,
        name,
        region,
        shadows,
        states,
        tier,
        death,
        recovery,
        ethnicity,
        rank,
      }) => {
        return {
          donors: formatNumber(donors),
          investigation: investigation ? "Yes" : "--",
          name: name,
          region: region,
          shadow: formatNumber(shadows),
          states: states,
          tier: tier,
          ethnicity,
          death: death?.toLocaleString(),
          recovery: formatNumber(recovery),
          rank: formatNumber(rank),
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
