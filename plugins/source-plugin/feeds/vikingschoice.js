const Parser = require("rss-parser");
const parser = new Parser();

exports.getLinks = async () => {
  const feed = await parser.parseURL("https://www.vikingschoice.org/rss");

  const links = feed.items.map((i) => ({
    title: i.title,
    url: i.link,
    timestamp: new Date(i.isoDate),
    tags: ["viking's choice", "bndcmpr", "playlist"],
  }));

  return links;
};

exports.name = "viking's choice";
