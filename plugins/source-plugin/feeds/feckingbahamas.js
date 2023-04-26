const Parser = require("rss-parser");
const parser = new Parser();

exports.getLinks = async () => {
  const feed = await parser.parseURL(
    "https://feckingbahamas.com/category/release-o-meter/feed"
  );

  const links = feed.items.map((i) => ({
    title: i.title,
    url: i.link,
    timestamp: new Date(i.isoDate),
    tags: ["fecking bahamas", "release-o-meter", "blog"],
  }));

  return links;
};

exports.name = "fecking bahamas";
