import React from "react";
import { navigate } from "gatsby";
import Select from "react-select";

import useDataMaps from "../../hooks/useDataMaps";

import * as styles from "./selectState.module.css";

export default function SelectState({ label, link = false, opo = false }) {
  const { stateDataMap, opoDataMap } = useDataMaps();

  const sortFunc = opo
    ? (entryA, entryB) => {
        if (entryA[1].name > entryB[1].name) return 1;
        if (entryA[1].name < entryB[1].name) return -1;
        return 0;
      } // sort by name for OPOs
    : undefined; // use default sort for states

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
          .sort(sortFunc)
          .map(([key, { name }]) => ({
            value: key,
            label: opo ? `${name} (${key})` : name,
          }))}
        placeholder={`See data by ${opo ? "OPO" : "state"}`}
      />
    </div>
  );
}
