const bandcamp = require("./feeds/bandcamp");
const cruelnoise = require("./feeds/cruelnoise");
const dltsgdom = require("./feeds/dltsgdom");
// const hacksaw = require("./feeds/hacksaw");
const vikings = require("./feeds/vikingschoice");
const pghmusictracker = require("./feeds/pghmusictracker");
const feckingbahamas = require("./feeds/feckingbahamas");

const NODE_TYPE = "link";

const getLinks = async (feed) => {
  const links = await feed.getLinks();
  return links;
};

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
}) => {
  const { createNode } = actions;

  // const feeds = [bandcamp, cruelnoise, dltsgdom, vikings, pghmusictracker];
  const feeds = [feckingbahamas];

  const results = await Promise.all(feeds.map((s) => getLinks(s)));

  const links = results.flatMap((r) => r);

  links.forEach((link) =>
    createNode({
      ...link,
      id: createNodeId(`${NODE_TYPE}-${link.url}`),
      parent: null,
      children: [],
      internal: {
        type: NODE_TYPE,
        content: JSON.stringify(link),
        contentDigest: createContentDigest(link),
      },
    })
  );
};
