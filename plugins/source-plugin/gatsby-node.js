const bandcamp = require("./feeds/bandcamp");
const boredinpittsburgh = require("./feeds/boredinpittsburgh");
const cruelnoise = require("./feeds/cruelnoise");
const dltsgdom = require("./feeds/dltsgdom");
const feckingbahamas = require("./feeds/feckingbahamas");
const pghmusictracker = require("./feeds/pghmusictracker");
const vikings = require("./feeds/vikingschoice");

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

  const feeds = [
    bandcamp,
    boredinpittsburgh,
    cruelnoise,
    dltsgdom,
    feckingbahamas,
    pghmusictracker,
    vikings,
  ];

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
