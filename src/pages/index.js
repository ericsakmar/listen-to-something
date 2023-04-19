import * as React from "react";
import { graphql } from "gatsby";
import { format, parseISO } from "date-fns";
import "./index.css";

const pageStyles = {
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

const IndexPage = ({ data }) => {
  const links = data.allLink.nodes;

  const tagSet = links
    .flatMap((l) => l.tags)
    .reduce((tags, tag) => {
      tags.add(tag);
      return tags;
    }, new Set());

  const tags = Array.from(tagSet);

  const localRawTags = localStorage.getItem("tags");
  const initialTags = localRawTags === null ? tags : JSON.parse(localRawTags);
  const [selectedTags, setSelectedTags] = React.useState(initialTags);

  const toggle = (tag) => () => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newTags);
    localStorage.setItem("tags", JSON.stringify(newTags));
  };

  const filtered = links.filter((l) => {
    return l.tags.every((t) => selectedTags.includes(t));
  });

  return (
    <main style={pageStyles}>
      <h1 style={{ fontSize: 96 }}>listen to something.</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {tags.map((t) => (
          <button
            key={t}
            style={{
              backgroundColor: selectedTags.includes(t) ? "black" : "white",
              color: selectedTags.includes(t) ? "white" : "black",
              padding: "2px 4px",
              border: "2px solid black",
            }}
            onClick={toggle(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {filtered.map((l) => (
          <div key={l.url}>
            <a href={l.url}>
              <h2 style={{ margin: 0 }}>{l.title}</h2>

              <div style={{ textTransform: "lowercase" }}>
                {l.tags.join(", ")}
              </div>

              <div style={{ fontStyle: "italic" }}>
                {format(parseISO(l.timestamp), "E, LLL d yyyy")}
              </div>
            </a>
          </div>
        ))}
      </div>
    </main>
  );
};

export default IndexPage;

export const Head = () => <title>Home Page</title>;

export const query = graphql`
  query MyQuery {
    allLink(sort: { timestamp: DESC }, limit: 100) {
      nodes {
        timestamp
        title
        tags
        url
      }
    }
  }
`;
