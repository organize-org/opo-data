import React from "react";

export default function NotesMarkdown({ data }) {
  // console.log(data);
  const notes = [
    {
      OPO: "Legacy of Hope - Alabama",
      Note:
        "OPO executives sentenced to Federal prison in 2012 for fraud; included in House Committee on Oversight and Reform investigation",
    },
    { OPO: "Arkansas Regional Organ Recovery Agency", Note: " " },
  ];
  console.log("notes", notes);
  return (
    <div>
      <h1>Notes Markdown</h1>
    </div>
  );
}
