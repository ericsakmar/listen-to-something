import * as React from "react";
import { graphql } from "gatsby";
import { format, parseISO } from "date-fns";
import "./index.css";

const getAccentColor = (link) => {
  const tags = link.tags.map((t) => t.toLowerCase());
  if (tags.includes("bandcamp")) {
    return "#477987";
  }

  if (tags.includes("bandcamp daily")) {
    return "hsla(194, 48%, 50%, 1)";
  }

  if (tags.includes("pittsburgh")) {
    return "gold";
  }

  if (tags.includes("fecking bahamas")) {
    return "#333";
  }

  return "purple";
};

const IndexPage = ({ data }) => {
  const links = data.allLink.nodes;
  const firstRef = React.useRef();

  // useTags hook?
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

  const handleSkip = () => {
    firstRef.current.focus();
  };

  const toggle = (tag) => () => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newTags);
    localStorage.setItem("tags", JSON.stringify(newTags));
  };

  const handleAllTags = () => {
    setSelectedTags(tags);
    localStorage.removeItem("tags");
  };

  const handleNoTags = () => {
    setSelectedTags([]);
    localStorage.setItem("tags", JSON.stringify([]));
  };

  const filtered = links
    .filter((l) => l.tags.some((t) => selectedTags.includes(t.toLowerCase())))
    .map((l) => ({
      ...l,
      timestamp: format(parseISO(l.timestamp), "E, LLL d"),
    }));

  const surprise = filtered[Math.floor(Math.random() * filtered.length)];

  return (
    <main>
      <button onClick={handleSkip} className="skip-link">
        skip to content
      </button>

      <h1>listen to something.</h1>

      <div
        style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}
      >
        {tags.map((t) => (
          <button
            key={t}
            style={{
              backgroundColor: selectedTags.includes(t) ? "#333" : "white",
              color: selectedTags.includes(t) ? "white" : "#111",
            }}
            className="tag"
            onClick={toggle(t)}
          >
            {t}
          </button>
        ))}

        <button className="tag tag-action" onClick={handleAllTags}>
          all
        </button>

        <button className="tag tag-action" onClick={handleNoTags}>
          none
        </button>
      </div>

      {filtered.length === 0 ? (
        <p>there's nothing here!</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <a
            style={{
              "--accent-color": "goldenrod",
              backgroundColor: "lightgoldenrodyellow",
              border: "4px dotted gold",
            }}
            href={surprise.url}
            className="card"
          >
            <h2 style={{ margin: 0 }}>Surprise Me!</h2>
            <div>go to a random selection from this list</div>
          </a>

          {filtered.map((l, i) => (
            <a
              key={l.url}
              href={l.url}
              ref={i === 0 ? firstRef : undefined}
              style={{
                "--accent-color": getAccentColor(l),
                border: "4px solid silver",
              }}
              className="card"
              title={l.title}
            >
              <h2 style={{ margin: 0 }}>{l.title}</h2>

              <div style={{ textTransform: "lowercase", color: "#333" }}>
                {l.tags.join(", ")}
              </div>

              <div
                style={{
                  fontStyle: "italic",
                  color: "#333",
                  textTransform: "lowercase",
                }}
              >
                {l.timestamp}
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
};

export default IndexPage;

export const Head = () => (
  <>
    <title>listen to something.</title>

    <meta name="description" content="a collection of music feeds." />
    <meta property="og:title" content="listen to something." />
    <meta property="og:type" content="website" />
    <meta property="og:description" content="a collection of music feeds." />
    <meta
      property="og:url"
      content="https://listentosomething.ericsakmar.com"
    />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,700;1,300&display=swap"
      rel="stylesheet"
    />
  </>
);

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
