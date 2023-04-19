const fetch = require("node-fetch");

exports.getLinks = async () => {
  // const res = await fetch("https://bndcmpr.co/api/gimme/userlists", {
  //   method: "post",
  //   body: JSON.stringify({ user: "esbass" }),
  //   headers: { "Content-Type": "application/json" },
  // });
  //
  // const data = await res.json();
  const data = [
    {
      id: 2622,
      uniqid: "56554ed5",
      timestamp: "2022-09-30T14:29:11.000Z",
      creator: "esbass",
      name: "Fecking Bahamas, September 2022",
    },
  ];

  const links = data.map((l) => ({
    title: l.name,
    url: `https://bndcmpr.co/${l.uniqid}`,
    timestamp: new Date(l.timestamp),
    tags: ["bndcmpr", "playlist"],
  }));

  return links;
};
