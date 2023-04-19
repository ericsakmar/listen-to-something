import * as React from "react";
import { graphql } from "gatsby";

const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
};

const IndexPage = ({ data }) => {
  const links = data.allLink.nodes;
  console.log(links);

  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>listen to something</h1>
      {links.map((l) => (
        <div key={l.url}>
          {l.title} - {l.url}
        </div>
      ))}
    </main>
  );
};

export default IndexPage;

export const Head = () => <title>Home Page</title>;

export const query = graphql`
  query MyQuery {
    allLink {
      nodes {
        timestamp
        title
        tags
        url
      }
    }
  }
`;
