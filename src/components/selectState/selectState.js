import React from "react";
import Select from "react-select";
import useDataMaps from "../../hooks/useDataMaps";
import { navigate } from "gatsby";

import * as styles from "./selectState.module.css";

export default function SelectState({
  label,
  link = false,
}) {
  const [{ stateDataMap }] = useDataMaps();

  return (
    <div className={styles.selectState}>
      <p>{label}</p>
      <Select
        className={styles.selectInput}
        value={typeof link === "string"
            ? {
                value: link,
                label: link,
              }
            : null
        }
        onChange={({ value }) =>
         navigate(`/state/${value}`, {
                replace: true,
              })
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
