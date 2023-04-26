const fetch = require("node-fetch");

exports.getLinks = async () => {
  const res = await fetch("https://bndcmpr.co/api/gimme/userlists", {
    method: "post",
    body: JSON.stringify({ user: "totalvibration" }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  const links = data
    .filter((l) => l.name.startsWith(`Viking's`)) // seems like shows that don't start with Viking's arent actually ready yet
    .map((l) => ({
      title: l.name,
      url: `https://bndcmpr.co/${l.uniqid}`,
      timestamp: new Date(l.timestamp),
      tags: ["viking's choice", "bndcmpr", "playlist"],
    }));

  return links;
};

exports.name = "viking's choice";
