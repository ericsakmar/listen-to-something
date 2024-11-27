const Parser = require("rss-parser");
const parser = new Parser();

exports.getLinks = async () => {
  const releasesFeed = await parser.parseURL(
    "https://feckingbahamas.com/category/release-o-meter/feed",
  );

  const releasesLinks = releasesFeed.items.map((i) => ({
    title: i.title,
    url: i.link,
    timestamp: new Date(i.isoDate),
    tags: ["fecking bahamas", "release-o-meter", "blog"],
  }));

  const exclusivesFeed = await parser.parseURL(
    "https://feckingbahamas.com/category/release-o-meter/feed",
  );

  const exclusivesLinks = exclusivesFeed.items.map((i) => ({
    title: i.title,
    url: i.link,
    timestamp: new Date(i.isoDate),
    tags: ["fecking bahamas", "exclusives", "blog"],
  }));

  return [...releasesLinks, ...exclusivesLinks];
};

exports.name = "fecking bahamas";
