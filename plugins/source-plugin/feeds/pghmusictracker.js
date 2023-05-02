const fetch = require("node-fetch");
const dateFns = require("date-fns");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const getToken = async () => {
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const tokenData = await tokenRes.json();
  const { access_token } = tokenData;
  return access_token;
};

const getPlaylists = async (token) => {
  const playlistsRes = await fetch(
    "https://api.spotify.com/v1/users/22yo3v2h7xnixpb3ywo4cc7oi/playlists",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const playlistData = await playlistsRes.json();

  const playlists = playlistData.items.filter((p) =>
    p.name.toLowerCase().includes("releases")
  );

  const detailRequests = playlists.map((p) =>
    fetch(p.href, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );

  const detailRes = await Promise.all(detailRequests);
  const details = await Promise.all(detailRes.map((d) => d.json()));

  return details;
};

const getLastUpdated = (tracks) => {
  const lastAdded = tracks
    .map((track) => ({ ...track, added_at: dateFns.parseISO(track.added_at) }))
    .reduce((last, track) =>
      dateFns.isAfter(track.added_at, last.added_at) ? track : last
    );

  return lastAdded.added_at;
};

exports.getLinks = async () => {
  const token = await getToken();
  const playlists = await getPlaylists(token);

  const links = playlists.map((p) => ({
    title: p.name,
    url: p.external_urls.spotify,
    timestamp: getLastUpdated(p.tracks.items),
    tags: ["pgh local music tracker", "spotify", "playlist", "pittsburgh"],
  }));

  return links;
};

exports.name = "pgh local music tracker";
