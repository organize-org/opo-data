require(`dotenv`).config({ path: `.env` });

module.exports = {
  siteMetadata: {
    title: `Organ Procurement Organization (OPO)`,
    url: `https://opodata.org`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /images\/.*\.svg/,
        },
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`sans-serif`, `Barlow\:400,600,700`],
        display: "swap",
      },
    },
    {
      resolve: `gatsby-source-airtable`,
      options: {
        apiKey: process.env.AIRTABLE_API_KEY,
        tables: [
          {
            baseId: `appu0SGuPMX4CH7xz`,
            tableName: `OPOs`,
          },
          {
            baseId: `appu0SGuPMX4CH7xz`,
            tableName: `States`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-embedded-netlify-cms`,
      options: {
        buildConfig: async ({ graphql }) => {
          const {
            data: { opoData, statesData },
          } = await graphql(`
            query {
              opoData: allAirtable(filter: { table: { eq: "OPOs" } }) {
                nodes {
                  data {
                    opo
                    name
                  }
                }
              }
              statesData: allAirtable(filter: { table: { eq: "States" } }) {
                nodes {
                  data {
                    abbreviation
                    name
                  }
                }
              }
            }
          `);

          const opoOptions = opoData.nodes.map(({ data: { name, opo } }) => ({
            label: name,
            value: opo,
          }));
          const stateOptions = statesData.nodes.map(
            ({ data: { name, abbreviation } }) => ({
              label: name,
              value: abbreviation,
            })
          );

          const sources = {
            label: "Sources",
            name: "sources",
            widget: "list",
            field: { label: "Source", name: "source", widget: "markdown" },
          };

          return {
            backend: {
              name: "git-gateway",
              repo: "Bloom-Works/opo-dashboard",
              branch: "main",
            },
            local_backend: true,
            load_config_file: false,
            media_folder: "src/images",
            collections: [
              {
                name: "pages",
                label: "Pages",
                files: [
                  {
                    label: "Main Page",
                    name: "index",
                    file: "src/pages/index.content.yml",
                    fields: [
                      {
                        label: "Stats",
                        name: "stats",
                        widget: "list",
                        allow_add: false,
                        collapsed: false,
                        max: 3,
                        fields: [
                          { label: "Title", name: "title", widget: "string" },
                          { label: "Value", name: "value", widget: "string" },
                        ],
                      },
                      {
                        label: "Quote",
                        name: "quote",
                        widget: "object",
                        fields: [
                          { label: "Quote", name: "quote", widget: "string" },
                          {
                            label: "Attribution",
                            name: "attribution",
                            widget: "string",
                          },
                          {
                            label: "Image",
                            name: "image",
                            allow_multiple: false,
                            media_folder: "../images/quotes",
                            widget: "image",
                          },
                        ],
                      },
                      sources,
                      {
                        label: "Equity Embed",
                        name: "equityEmbed",
                        widget: "object",
                        fields: [
                          {
                            label: "Image",
                            name: "image",
                            allow_multiple: false,
                            media_folder: "../images/quotes",
                            widget: "image",
                          },
                          {
                            label: "Heading",
                            name: "heading",
                            widget: "string",
                          },
                          {
                            label: "Description",
                            name: "description",
                            widget: "markdown",
                          },
                          {
                            label: "Link Text",
                            name: "link",
                            widget: "string",
                          },
                        ],
                      },
                      {
                        label: "Video",
                        name: "video",
                        widget: "object",
                        fields: [
                          { label: "Title", name: "title", widget: "string" },
                          {
                            label: "Description",
                            name: "description",
                            widget: "text",
                          },
                          {
                            label: "Youtube Code",
                            name: "youtube",
                            widget: "string",
                          },
                        ],
                      },
                      {
                        label: "Articles",
                        name: "articles",
                        widget: "list",
                        allow_add: true,
                        collapsed: false,
                        fields: [
                          { label: "Link", name: "link", widget: "string" },
                          {
                            label: "Source",
                            name: "source",
                            widget: "string",
                          },
                          { label: "Title", name: "title", widget: "string" },
                          {
                            label: "Description",
                            name: "description",
                            widget: "text",
                          },
                          {
                            label: "Image",
                            name: "image",
                            allow_multiple: false,
                            media_folder: "../images/articles",
                            widget: "image",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    label: "State Page",
                    name: "state",
                    file: "src/pages/state/[state].content.yml",
                    fields: [
                      {
                        label: "Stat Headings",
                        name: "stats",
                        widget: "object",
                        collapsed: false,
                        fields: [
                          {
                            label: "Waitlist stat heading",
                            name: "waitlist",
                            widget: "string",
                          },
                          {
                            label: "CEO comp stat heading",
                            name: "comp",
                            widget: "string",
                          },
                          {
                            label: "Monthly dead stat heading",
                            name: "monthly",
                            widget: "string",
                          },
                        ],
                      },
                      {
                        label: "Table headings",
                        name: "headings",
                        widget: "object",
                        collapsed: false,
                        fields: [
                          {
                            label: "Name",
                            name: "name",
                            widget: "object",
                            fields: [
                              {
                                label: "heading",
                                name: "heading",
                                widget: "string",
                              },
                            ],
                          },
                          {
                            label: "Region",
                            name: "region",
                            widget: "object",
                            fields: [
                              {
                                label: "heading",
                                name: "heading",
                                widget: "string",
                              },
                            ],
                          },
                          {
                            label: "States",
                            name: "states",
                            widget: "object",
                            fields: [
                              {
                                label: "heading",
                                name: "heading",
                                widget: "string",
                              },
                            ],
                          },
                          {
                            label: "Tier",
                            name: "tier",
                            widget: "object",
                            fields: [
                              {
                                label: "heading",
                                name: "heading",
                                widget: "string",
                              },
                            ],
                          },
                          {
                            label: "Donors Needed",
                            name: "donors",
                            widget: "object",
                            fields: [
                              {
                                label: "heading",
                                name: "heading",
                                widget: "string",
                              },
                            ],
                          },
                          {
                            label: "Shadow Deaths",
                            name: "shadow",
                            widget: "object",
                            fields: [
                              {
                                label: "heading",
                                name: "heading",
                                widget: "string",
                              },
                            ],
                          },
                          {
                            label: "Under Investigation",
                            name: "investigation",
                            widget: "object",
                            fields: [
                              {
                                label: "heading",
                                name: "heading",
                                widget: "string",
                              },
                            ],
                          },
                        ],
                      },
                      sources,
                      {
                        label: "Equity Embed",
                        name: "equityEmbed",
                        widget: "object",
                        fields: [
                          {
                            label: "Image",
                            name: "image",
                            allow_multiple: false,
                            media_folder: "../../images/quotes",
                            widget: "image",
                          },
                          {
                            label: "Heading",
                            name: "heading",
                            widget: "string",
                          },
                          {
                            label: "Description",
                            name: "description",
                            widget: "markdown",
                          },
                          {
                            label: "Link Text",
                            name: "link",
                            widget: "string",
                          },
                        ],
                      },
                      {
                        label: "Videos",
                        label_singular: "Video",
                        name: "videos",
                        summary: "{{fields.title}}",
                        widget: "list",
                        add_to_top: true,
                        fields: [
                          { label: "Link", name: "link", widget: "string" },
                          { label: "Title", name: "title", widget: "string" },
                          {
                            label: "Description",
                            name: "description",
                            widget: "markdown",
                            required: false,
                          },
                          {
                            label: "Tags",
                            name: "tags",
                            widget: "select",
                            multiple: true,
                            collapsed: false,
                            options: stateOptions,
                          },
                        ],
                      },
                      {
                        label: "Notes",
                        label_singular: "Note",
                        name: "notes",
                        summary: "{{fields.tags}}",
                        widget: "list",
                        add_to_top: true,
                        collapsed: false,
                        fields: [
                          { label: "Note", name: "note", widget: "markdown" },
                          {
                            label: "Voices for Reform",
                            name: "voicesForReform",
                            widget: "boolean",
                            default: false,
                            required: true,
                          },
                          {
                            label: "Tags",
                            name: "tags",
                            widget: "select",
                            multiple: true,
                            options: [...opoOptions, ...stateOptions],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    label: "Equity Page",
                    name: "equity",
                    file: "src/pages/equity.content.yml",
                    fields: [
                      {
                        label: "Top quote",
                        name: "topQuote",
                        widget: "object",
                        fields: [
                          { label: "Quote", name: "quote", widget: "string" },
                          {
                            label: "Attribution",
                            name: "attribution",
                            widget: "string",
                          },
                          {
                            label: "Image",
                            name: "image",
                            allow_multiple: false,
                            media_folder: "../images/quotes",
                            widget: "image",
                          },
                        ],
                      },
                      {
                        label: "Bottom quote",
                        name: "bottomQuote",
                        widget: "object",
                        fields: [
                          { label: "Quote", name: "quote", widget: "string" },
                          {
                            label: "Attribution",
                            name: "attribution",
                            widget: "string",
                          },
                          {
                            label: "Image",
                            name: "image",
                            allow_multiple: false,
                            media_folder: "../images/quotes",
                            widget: "image",
                          },
                        ],
                      },
                      {
                        label: "Embedded",
                        name: "embedded",
                        widget: "object",
                        collapsed: false,
                        fields: [
                          {
                            label: "Heading",
                            name: "heading",
                            widget: "string",
                          },
                          {
                            label: "Description",
                            name: "description",
                            widget: "markdown",
                          },
                        ],
                      },
                      {
                        label: "Tables",
                        name: "tables",
                        widget: "object",
                        collapsed: false,
                        fields: [
                          {
                            label: "Table 1 Heading",
                            name: "table1Heading",
                            widget: "string",
                          },
                          {
                            label: "Table 2 Heading",
                            name: "table2Heading",
                            widget: "string",
                          },
                        ],
                      },
                      {
                        label: "Funnel",
                        name: "funnel",
                        widget: "object",
                        collapsed: false,
                        fields: [
                          {
                            label: "Heading",
                            name: "heading",
                            widget: "string",
                          },
                          {
                            label: "Steps",
                            name: "steps",
                            widget: "list",
                            allow_add: false,
                            collapsed: false,
                            fields: [
                              {
                                label: "Heading",
                                name: "heading",
                                widget: "string",
                              },
                              {
                                label: "Description",
                                name: "description",
                                widget: "markdown",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        label: "Small quotes",
                        name: "smallQuotes",
                        widget: "list",
                        collapsed: false,
                        fields: [
                          { label: "Quote", name: "quote", widget: "string" },
                          {
                            label: "Attribution",
                            name: "attribution",
                            widget: "string",
                          },
                        ],
                      },
                      {
                        label: "Tweet ID",
                        name: "tweet",
                        widget: "string",
                      },
                      sources,
                    ],
                  },
                  {
                    label: "FAQs Page",
                    name: "faqs",
                    file: "src/pages/faqs.content.yml",
                    fields: [
                      {
                        label: "Sections",
                        name: "sections",
                        widget: "list",
                        collapsed: false,
                        fields: [
                          {
                            label: "Heading",
                            name: "heading",
                            widget: "string",
                          },
                          {
                            label: "Q and A",
                            name: "qanda",
                            widget: "list",
                            collapsed: false,
                            fields: [
                              {
                                label: "Question",
                                name: "question",
                                widget: "string",
                              },
                              {
                                label: "Answer",
                                name: "answer",
                                widget: "markdown",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          };
        },
      },
    },
    "gatsby-plugin-netlify-identity-widget",
    `gatsby-transformer-geojson`,
    `gatsby-transformer-csv`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-leaflet`,
    `gatsby-plugin-netlify`,
  ],
};
