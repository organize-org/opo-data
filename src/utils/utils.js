export const tierColors = {
  Passing: "#C4C4C4",
  Underperforming: "#FFB042",
  Failing: "#D43C37",
};

export const donorMapColors = nhb_rank => {
  if (nhb_rank < 10) return "#4E1C19";
  if (nhb_rank < 15) return "#89322B";
  if (nhb_rank < 20) return "#D43C37";
  if (nhb_rank < 25) return "#FFB042";
  if (nhb_rank < 30) return "#F9D558";
  if (nhb_rank > 35) return "#00768F";

  return "7A7A7A";
};

export const racialDemographics = {
  race_perf_white: "White",
  race_perf_native: "American Indian/Alaskan Native",
  race_perf_asian: "Asian",
  race_perf_black: "Black",
  race_perf_hispanic: "Hispanic",
  race_perf_islander: "Pacific Islander",
  race_perf_multiracial: "Multiracial",
  race_perf_unkown: "Unknown",
};

export const findStateFeature = (statesGeoData, abbrev) =>
  abbrev
    ? statesGeoData?.childGeoJson?.features?.find(
        ({ properties: { abbreviation } }) => abbreviation === abbrev
      )
    : null;
export const findOpoFeature = (dsaGeoJson, abbr) =>
  abbr
    ? dsaGeoJson?.childGeoJson?.features?.find(
        ({ properties: { opo } }) => opo === abbr
      )
    : null;

export const formatNumber = (num, options) =>
  !num || isNaN(num) ? "N/A" : num.toLocaleString("en-US", options);

export const formatPercent = percent =>
  !percent || isNaN(percent)
    ? "N/A"
    : `${percent.toLocaleString("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
      })}`;

export const formatMoney = num => {
  return formatNumber(num, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const formatName = (
  { abbreviation, name },
  { includeAbbreviation = true } = {}
) =>
  `${name}${
    includeAbbreviation ? ` (${abbreviation.toLocaleUpperCase()})` : ""
  }`;

export const formatOPORank = ({ rank }) => (!isNaN(rank) ? rank : "N/A");
export const getRankedOPOCount = opoDataMap =>
  Object.values(opoDataMap).filter(opo => !isNaN(opo.rank)).length;
