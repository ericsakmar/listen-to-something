const bandcamp = require("./feeds/bandcamp");
const bandcampdaily = require("./feeds/bandcampdaily");
const boredinpittsburgh = require("./feeds/boredinpittsburgh");
const cruelnoise = require("./feeds/cruelnoise");
const dltsgdom = require("./feeds/dltsgdom");
const feckingbahamas = require("./feeds/feckingbahamas");
const pghmusictracker = require("./feeds/pghmusictracker");
const vikings = require("./feeds/vikingschoice");

const NODE_TYPE = "link";

const getLinks = async (feed) => {
  try {
    const links = await feed.getLinks();
    return links;
  } catch (e) {
    console.log(e);
    return [];
  }
};

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
}) => {
  const { createNode } = actions;

  const feeds = [
    bandcamp,
    bandcampdaily,
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
