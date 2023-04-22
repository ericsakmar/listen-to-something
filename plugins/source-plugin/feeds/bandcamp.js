const fetch = require("node-fetch");
const dateFns = require("date-fns");

// 18 Apr 2023 00:00:00 GMT
const DATE_FORMART = "d MMM yyyy KK:mm:ss";

const parseDate = (raw) => {
  // best I can do for now...
  const noTz = raw.replace(" GMT", "");
  return dateFns.parse(noTz, DATE_FORMART, new Date());
};

// https://bandcamp.com/api/bcweekly/3/list
exports.getLinks = async () => {
  const res = await fetch("https://bandcamp.com/api/bcweekly/3/list");

  const data = await res.json();

  const links = data.results.map((d) => ({
    title: d.subtitle,
    url: `https://bandcamp.com/?show=${d.id}`,
    timestamp: parseDate(d.date),
    tags: ["bandcamp", d.title, "show"],
  }));

  return links;
};
