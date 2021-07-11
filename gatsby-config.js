require(`dotenv`).config({ path: `.env` });

module.exports = {
  siteMetadata: {
    title: `Organ Procurement Organization (OPO)`,
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
                        allow_add: false,
                        collapsed: false,
                        max: 3,
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
                          },
                          {
                            label: "Tags",
                            name: "tags",
                            widget: "select",
                            multiple: true,
                            collapsed: false,
                            options: [
                              { label: "All States", value: "All" },
                              ...stateOptions,
                            ],
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
                ],
              },
            ],
          };
        },
      },
    },
    `gatsby-transformer-geojson`,
    `gatsby-transformer-csv`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-leaflet`,
    `gatsby-plugin-netlify`,
  ],
};
