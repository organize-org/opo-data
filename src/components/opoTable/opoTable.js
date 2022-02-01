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

export default function OpoTable({ headings, opos, title }) {
  const columns = useMemo(() => {
    const createCol = ([accessor, heading]) => {
      const col = {
        Header: <ReactMarkdown>{heading.title}</ReactMarkdown>,
        accessor,
      };

      if (accessor === "name") {
        return {
          ...col,
          Cell: props => (
            <Link
              to={`/opo/${opos
                .find(opo => opo.name === props.value)
                ?.abbreviation.trim()}`}
            >
              {props.value} (
              {opos.find(opo => opo.name === props.value)?.abbreviation})
            </Link>
          ),
        };
      } else if (accessor === "states") {
        return {
          ...col,
          Cell: props => {
            const states = props.value.split(",");
            return states.map((s, idx) => (
              <>
                <Link to={`/state/${s.trim()}`}>{s}</Link>
                {idx === states.length - 1 ? "" : ", "}
              </>
            ));
          },
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
              background={
                OPO_PERFORMANCE_TIER_FILL[props.value.split(" ")[1]].fill
              }
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

    return Object.entries(headings)
      .filter(([_, val]) => !!val)
      .map((col, idx) => createCol(col, idx));
  }, [headings, opos]);

  const captions = Object.values(headings)
    .filter(heading => !!heading?.caption)
    .map(heading => heading.caption);

  const data = useMemo(() => {
    const formatNumber = (num, options) =>
      typeof num === "number" ? num.toLocaleString("en-US", options) : "N/A";

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
          investigation: investigation ? "Yes" : "No",
          name: name,
          region: region,
          shadow: formatNumber(shadows),
          states: states,
          tier: tier,
          ethnicity,
          death: formatNumber(death),
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
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [{ id: columns[0].accessor }],
      },
    },
    useSortBy
  );

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
      {captions?.length &&
        captions.map(caption => (
          <p className={styles.tableCaption}>* {caption}</p>
        ))}
    </Row>
  );

  return table;
}
