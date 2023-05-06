const cheerio = require("cheerio");
const fetchPage = require("./fetchPage");
const dateFns = require("date-fns");

// April 21, 2023
const DATE_FORMART = "LLLL d, yyyy";

const url = "https://daily.bandcamp.com/latest";

exports.getLinks = async () => {
  const data = await fetchPage.fetchPage(url);

  const $ = cheerio.load(data);

  const links = $(".list-article")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find(".title").text().trim();
      const link = n.find(".title").attr("href").trim();
      const rawDate = n
        .find(".article-info-text")
        .text()
        .trim()
        .split("·")[1]
        .trim();
      const date = dateFns.parse(rawDate, DATE_FORMART, new Date());
      const franchise = n.find(".franchise").text().trim();

      return {
        title,
        url: `https://daily.bandcamp.com${link}`,
        timestamp: date,
        tags: ["bandcamp", "bandcamp daily", franchise],
      };
    })
    .filter(
      (l) => l.tags.some(t => t ===  "ALBUM OF THE DAY" || t === "LISTS" || t.startsWith("BEST"))
    );

  return links;
};

exports.name = "bandcamp daily";
