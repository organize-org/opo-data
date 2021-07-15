export const tierColors = {
  "1 Passing": "#C4C4C4",
  "2 Underperforming": "#FFB042",
  "3 Failing": "#D43C37",
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

export const formatNumber = (num, options) =>
  !num || isNaN(num) ? "--" : num.toLocaleString("en-US", options);

export const formatPercent = percent =>
  !percent || isNaN(percent)
    ? "--"
    : `${percent.toLocaleString("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
      })}`;

export const formatStateName = ({ abbreviation, name }) =>
  `${name} (${abbreviation.toLocaleUpperCase()})`;
