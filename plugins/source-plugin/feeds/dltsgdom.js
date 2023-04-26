const fetch = require("node-fetch");

exports.getLinks = async () => {
  const res = await fetch("https://bndcmpr.co/api/gimme/userlists", {
    method: "post",
    body: JSON.stringify({ user: "dltsgdom" }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  const links = data.map((l) => ({
    title: l.name,
    url: `https://bndcmpr.co/${l.uniqid}`,
    timestamp: new Date(l.timestamp),
    tags: ["dltsgdom", "bndcmpr", "playlist", "pittsburgh"],
  }));

  return links;
};

exports.name = "dltsgdom";
