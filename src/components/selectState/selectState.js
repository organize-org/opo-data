import React from "react";
import { navigate } from "gatsby";
import Select from "react-select";

import useDataMaps from "../../hooks/useDataMaps";

import * as styles from "./selectState.module.css";

export default function SelectState({ label, link = false, opo = false }) {
  const [{ stateDataMap, opoDataMap }] = useDataMaps();

  return (
    <div className={styles.selectState}>
      <p>{label}</p>
      <Select
        className={styles.selectInput}
        value={
          typeof link === "string"
            ? {
                value: link,
                label: link,
              }
            : null
        }
        onChange={({ value }) =>
          navigate(`/${opo ? "opo" : "state"}/${value}`, {
            replace: true,
          })
        }
        options={Object.entries(opo ? opoDataMap : stateDataMap)
          .sort()
          .map(([key, { name }]) => ({
            value: key,
            label: opo ? `${name} (${key})` : name,
          }))}
        placeholder="See data by state"
      />
    </div>
  );
}
