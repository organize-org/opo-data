import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function NotesMarkdown({ data }) {
  // console.log(data);

  const markdown = `OPO executives sentenced to 
  <a href= 'https://archives.fbi.gov/archives/birmingham/press-releases/2012/former-alabama-organ-center-executive-sentenced-for-fraud'> Federal prison </a>
   in 2012 for fraud; included in <a href='https://oversight.house.gov/news/press-releases/oversight-subcommittee-launches-investigation-into-poor-performance-waste-and'> House Committee on Oversight and Reform investigation </a>`;

  const notes = [
    //////Legacy of Hope - Alabama///////
    `OPO executives sentenced to <a href= 'https://archives.fbi.gov/archives/birmingham/press-releases/2012/former-alabama-organ-center-executive-sentenced-for-fraud'> Federal prison </a> in 2012 for fraud; included in <a href='https://oversight.house.gov/news/press-releases/oversight-subcommittee-launches-investigation-into-poor-performance-waste-and'> House Committee on Oversight and Reform investigation </a>`,
    //////Arkansas Regional Organ Recovery Agency///////
    `N/A`,
    //////Donor Network of Arizona///////
    `<a href = 'https://oig.hhs.gov/oas/reports/region9/91102035.pdf'> OIG </a> found the OPO overstating organ procurement costs and not reporting proceeds from the sale of research organs. 2019 CEO compensation increased by 17.6% from 2018`,
    //////OneLegacy///////
    `<a href = 'https://oig.hhs.gov/oas/reports/region9/91102035.pdf'> OIG </a> found wasteful spending; OPO also subject of 2019 LA Times investigation into tissue processing business; Board Chair paid $100,000 annually; included in <a href='https://oversight.house.gov/news/press-releases/oversight-subcommittee-launches-investigation-into-poor-performance-waste-and'> House Committee on Oversight and Reform investigation </a>`,
    //////Sierra Donor Services///////
    `Included in <a href='https://oversight.house.gov/news/press-releases/oversight-subcommittee-launches-investigation-into-poor-performance-waste-and'> House Committee on Oversight and Reform investigation </a>`,
    //////Donor Network West///////
    `New CEO led <a href = 'https://www.bridgespan.org/bridgespan/Images/articles/transforming-organ-donation-in-america/transforming-organ-donation-in-america-dec2020-update.pdf'> major improvements </a> following leadership change, increasing donations by nearly 30%`,
    //////LifeSharing - A Donate Life Organization///////
    `N/A`,
    //////Donor Alliance///////
    `N/A`,
    //////LifeChoice Donor Services///////
    `Included in <a href='https://oversight.house.gov/news/press-releases/oversight-subcommittee-launches-investigation-into-poor-performance-waste-and'> House Committee on Oversight and Reform investigation </a>`,
    //////New England Organ Bank///////
    `Bought <a href = 'https://4kx391lh5z1qexgd32brx810-wpengine.netdna-ssl.com/wp-content/uploads/2018/08/Essex_case_study_NEDS.pdf'> private jet </a> in 2018; included in <a href='https://oversight.house.gov/news/press-releases/oversight-subcommittee-launches-investigation-into-poor-performance-waste-and'> House Committee on Oversight and Reform investigation </a>`,
    //////Washington Regional Transplant Community///////
    `N/A`,
    //////OurLegacy///////
    `<a href = 'https://morningconsult.com/opinions/organ-donation-can-save-more-lives-through-reform/'> CEO published support </a> for new OPO rule`,
    //////LifeQuest Organ Recovery Services///////
    `N/A`,
    //////Life Alliance Organ Recovery Agency///////
    `Subject of investigative reporting for quality control issues and workplace violence (see Washington Post and Miami Herald); included in <a href='https://oversight.house.gov/news/press-releases/oversight-subcommittee-launches-investigation-into-poor-performance-waste-and'> House Committee on Oversight and Reform investigation </a>`,
    //////Lifelink of Florida///////
    `Parent company LifeLink Foundation has $117M in assets, paid Board Chair $750,000 in 2017; subject of <a href='https://archive.triblive.com/local/pittsburgh-allegheny/gift-of-life-worth-millions-to-donation-organizations/'> investigative reporting </a>; included in <a href='https://oversight.house.gov/news/press-releases/oversight-subcommittee-launches-investigation-into-poor-performance-waste-and'> House Committee on Oversight and Reform investigation </a>`,
    //////Lifelink of Georgia///////
    `Parent company LifeLink Foundation has $117M in assets, paid Board Chair $750,000 in 2017; subject of <a href='https://archive.triblive.com/local/pittsburgh-allegheny/gift-of-life-worth-millions-to-donation-organizations/'> investigative reporting </a>; included in <a href='https://oversight.house.gov/news/press-releases/oversight-subcommittee-launches-investigation-into-poor-performance-waste-and'> House Committee on Oversight and Reform investigation </a>`,
    //////Legacy of Life///////
    `N/A`,
    //////Iowa Donor Network///////
    `<a href = 'https://projects.propublica.org/nonprofits/organizations/421414092/202011199349301261/full'> Owns $8M </a> 'interest in net assets' of tissue processor Allosource`,
    //////Gift of Hope Organ & Tissue Donor Network///////
    `Investment in affiliate” worth <a href = 'https://projects.propublica.org/nonprofits/display_990/363516431/12_2019_prefixes_35-38%2F363516431_201812_990_2019121116944630'> $24M </a>`,
    //////Indiana Donor Network///////
    `Started private jet business <a href = 'https://txjet.org/'> TxJet </a> in 2014; currently subject of <a href = 'https://www.finance.senate.gov/imo/media/doc/2020-02-10%20Grassley,%20Wyden,%20Young,%20Cardin%20to%20UNOS%20(Information%20Request%20on%20Organ%20Transplant%20System).pdf' > Senate oversight inquiry </a>; included in <a href='https://oversight.house.gov/news/press-releases/oversight-subcommittee-launches-investigation-into-poor-performance-waste-and'> House Committee on Oversight and Reform investigation </a>`,
    //////Midwest Transplant Network///////
    `N/A`,
    //////Kentucky Organ Donor Affiliates///////
    `Included in <a href='https://oversight.house.gov/news/press-releases/oversight-subcommittee-launches-investigation-into-poor-performance-waste-and'> House Committee on Oversight and Reform investigation </a>`,
    //////Louisiana Organ Procurement Agency///////
    `N/A`,
    //////The Living Legacy Foundation of Maryland///////
    `N/A`,
    //////Gift of Life Michigan///////
    `Built <a href= 'https://www.giftoflifemichigan.org/news-calendar/latest-news/gift-life-begins-recovering-organs-and-tissue-new-ann-arbor-surgical'> $14.3M </a> , 40,000 foot surgical center in 2016`,
    //////Lifesource - MN///////
    `Included in <a href='https://oversight.house.gov/news/press-releases/oversight-subcommittee-launches-investigation-into-poor-performance-waste-and'> House Committee on Oversight and Reform investigation </a>`,
    //////Mid-America Transplant Services///////
    ` <a href = 'https://morningconsult.com/opinions/organ-donation-can-save-more-lives-through-reform/'> CEO published support </a> for new OPO rule; $25 million investment in tissue processor Allosource`,
    //////Mississippi Organ Recovery Agency///////
    `N/A`,
    //////Carolina Donor Services///////
    `N/A`,
    //////LifeShare of the Carolinas///////
    `N/A`,
    //////Nebraska Organ Recovery///////
    `N/A`,
    //////New Jersey Sharing Network///////
    `Investigative reporting re. “A <a href = 'https://www.pogo.org/investigation/2021/04/americas-transformative-new-organ-donation-rule-goes-into-effect-over-objections-from-monopolistic-contractors/'> lobbyist for the [OPO] </a> created a website that questions the motives of philanthropist and patient organizations that have supported reforms”`,
    //////New Mexico Donor Services///////
    `Included in <a href='https://oversight.house.gov/news/press-releases/oversight-subcommittee-launches-investigation-into-poor-performance-waste-and'> House Committee on Oversight and Reform investigation </a>`,
    //////Nevada Donor Network///////
    `Has $1.8M investment in related tissue processor`,
    //////Center for Donation and Transplant///////
    `N/A`,
    //////Finger Lakes Donor Recovery Network///////
    `N/A`,
    //////LiveOnNY///////
    `Board Chair published support for new OPO rule`,
    //////ConnectLife///////
    `Owns $11M stake in tissue processor Allosource`,
    //////LifeLine of Ohio///////
    `Investigative reporting found board members billing taxpayers for private planes`,
    //////LifeBanc///////
    `N/A`,
    //////Life Connection of Ohio///////
    `CEO supportive of reform, led 34% growth in donors in one year when he took over as leader`,
    //////LifeCenter Organ Donor Network///////
    `N/A`,
    //////Lifeshare of Oklahoma///////
    `N/A`,
    //////Pacific NW Transplant Bank///////
    `N/A`,
    //////Gift of Life///////
    `2017 CEO compensation $2.5M`,
    //////Center for Organ Recovery and Education///////
    `N/A`,
    //////Lifelink of Puerto Rico///////
    `Parent company LifeLink Foundation has $117M in assets, paid Board Chair $750,000 in 2017; subject of investigative reporting ; included in House Committee on Oversight and Reform investigation`,
    //////Sharing Hope SC///////
    `Included in House Committee on Oversight and Reform investigation ; investigative reporting found fatal lapses in patient safety`,
    //////Tennessee Donor Services///////
    `Included in House Committee on Oversight and Reform investigation ; investigative reporting found fatal lapses in patient safety`,
    //////Mid-South Transplant Foundation///////
    `N/A`,
    //////Southwest Transplant Alliance///////
    `CEO published support of new OPO rule`,
    //////LifeGift Organ Donation Center///////
    `N/A`,
    //////Texas Organ Sharing Alliance///////
    `N/A`,
    //////DonorConnect///////
    `N/A`,
    //////LifeNet///////
    `Spent $392M on "tissue processing" and $22M on "organ procurement" in 2018; included in House Committee on Oversight and Reform investigation ; 2018 CEO Salary was $1.6 million`,
    //////LifeCenter Northwest///////
    `OIG found OPO “did not fully comply with Medicare requirements… on cost report”`,
    //////OPO at the U. of Wisconsin///////
    `N/A`,
    //////Versiti///////
    `N/A`,
  ];

  console.log("notes", notes);

  const notesparse = notes.toString(" ");

  return (
    <div>
      <h1>Notes Markdown</h1>

      <ReactMarkdown
        remarkPlugins={[gfm]}
        rehypePlugins={[rehypeRaw]}
        children={notesparse}
        className="markdown"
      />
    </div>
  );
}
