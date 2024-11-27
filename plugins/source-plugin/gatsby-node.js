const bandcamp = require("./feeds/bandcamp");
const bandcampdaily = require("./feeds/bandcampdaily");
const cruelnoise = require("./feeds/cruelnoise");
const feckingbahamas = require("./feeds/feckingbahamas");
const vikings = require("./feeds/vikingschoice");

const NODE_TYPE = "link";
const MAX_RETRIES = 3;

const getLinks = async (feed, retries = 0) => {
  if (retries >= MAX_RETRIES) {
    console.warn(`max retries exceeded for ${feed.name}`);
    return [];
  }

  try {
    const links = await feed.getLinks();

    if (links.length === 0) {
      console.warn(`no links found for ${feed.name}`);
    }

    return links;
  } catch (error) {
    console.error(error);

    const retry = await getLinks(feed, retries + 1);
    return retry;
  }
};

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
}) => {
  const { createNode } = actions;

  const feeds = [bandcamp, bandcampdaily, cruelnoise, feckingbahamas, vikings];

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
    }),
  );
};
