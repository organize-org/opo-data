export const tierColors = {
  "1 Passing": "#C4C4C4",
  "2 Underperforming": "#FFB042",
  "3 Failing": "#D43C37",
};

export const formatNumber = (num, options) =>
  !num || isNaN(num) ? "--" : num.toLocaleString("en-US", options);

export const formatStateName = ({ abbreviation, name }) =>
  `${name} (${abbreviation.toLocaleUpperCase()})`;
