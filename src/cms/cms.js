import { init } from "netlify-cms-app";
import opos from "../data/opos.csv";
import states from "../data/states.csv";

init({
  config: {
    backend: {
      name: "github",
      repo: "Bloom-Works/opo-dashboard",
      branch: "main",
    },
    local_backend: true,
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
                  { label: "Source", name: "source", widget: "string" },
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
                    options: [
                      { label: "All", value: "All" },
                      ...states.map(({ name, abbreviation }) => ({
                        label: name,
                        value: abbreviation,
                      })),
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
                fields: [
                  { label: "Note", name: "note", widget: "markdown" },
                  {
                    label: "Tags",
                    name: "tags",
                    widget: "select",
                    multiple: true,
                    options: opos.map(({ name, opo }) => ({
                      label: name,
                      value: opo,
                    })),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
