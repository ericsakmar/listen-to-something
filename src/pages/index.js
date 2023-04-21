import * as React from "react";
import { graphql } from "gatsby";
import { format, parseISO } from "date-fns";
import "./index.css";

const IndexPage = ({ data }) => {
  const links = data.allLink.nodes;

  const tagSet = links
    .flatMap((l) => l.tags)
    .reduce((tags, tag) => {
      tags.add(tag.toLowerCase());
      return tags;
    }, new Set());

  const tags = Array.from(tagSet).slice().sort();

  const [selectedTags, setSelectedTags] = React.useState(tags);

  React.useEffect(() => {
    const rawTags = localStorage.getItem("tags");
    if (rawTags) {
      setSelectedTags(JSON.parse(rawTags));
    }
  }, []);

  const toggle = (tag) => () => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newTags);
    localStorage.setItem("tags", JSON.stringify(newTags));
  };

  const filtered = links.filter((l) => {
    return l.tags.some((t) => selectedTags.includes(t));
  });

  return (
    <main>
      <h1>listen to something.</h1>

      <div
        style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}
      >
        {tags.map((t) => (
          <button
            key={t}
            style={{
              backgroundColor: selectedTags.includes(t) ? "black" : "white",
              color: selectedTags.includes(t) ? "white" : "black",
              padding: "2px 4px",
              border: "2px solid black",
              cursor: "pointer",
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
