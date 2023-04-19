const hacksaw = require("./feeds/hacksaw");

exports.onPreInit = () => console.log("Loaded source plugin");

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

  const feeds = [hacksaw];

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
