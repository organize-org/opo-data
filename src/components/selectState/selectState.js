import React from "react";
import Select from "react-select";
import useDataMaps from "../../hooks/useDataMaps";
import { navigate } from "gatsby";

import * as styles from "./selectState.module.css";

export default function SelectState({
  label,
  link = false,
  popoutAbbreviation,
  setPopoutAbbrevation,
}) {
  const [{ stateDataMap }] = useDataMaps();

  return (
    <div className={styles.selectState}>
      <p>{label}</p>
      <Select
        className={styles.selectInput}
        value={
          popoutAbbreviation
            ? {
                value: popoutAbbreviation,
                label: stateDataMap[popoutAbbreviation]?.name,
              }
            : typeof link === "string"
            ? {
                value: link,
                label: link,
              }
            : null
        }
        onChange={({ value }) =>
          typeof link === "string"
            ? navigate(`/state/${value}`, {
                replace: true,
              })
            : setPopoutAbbrevation(value)
        }
        options={Object.entries(stateDataMap)
          .sort()
          .map(([key, { name }]) => ({
            value: key,
            label: name,
          }))}
        placeholder="Select state"
      />
    </div>
  );
}
