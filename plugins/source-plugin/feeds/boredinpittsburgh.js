const Parser = require("rss-parser");
const parser = new Parser();

exports.getLinks = async () => {
  const feed = await parser.parseURL(
    "https://boredinpittsburgh.home.blog/category/daily-discovery/daily-yinz/feed/"
  );

  const links = feed.items.map((i) => ({
    title: i.title,
    url: i.link,
    timestamp: new Date(i.isoDate),
    tags: ["bored in pittsburgh", "daily yinz", "blog", "pittsburgh"],
  }));

  return links;
};

exports.name = "bored in pittsburgh";
