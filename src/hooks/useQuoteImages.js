import { useStaticQuery, graphql } from "gatsby";

export default function useQuoteImages() {
  const { quoteImages } = useStaticQuery(
    graphql`
      query {
        quoteImages: allFile(
          filter: { relativeDirectory: { eq: "images/quotes" } }
        ) {
          edges {
            node {
              relativePath
              childImageSharp {
                gatsbyImageData(
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
          }
        }
      }
    `
  );

  return [
    {
      quoteImagesByPath: quoteImages?.edges?.reduce(
        (imgMap, { node }) => ({
          ...imgMap,
          [`../${node.relativePath}`]: node,
        }),
        {}
      ),
    },
  ];
}
