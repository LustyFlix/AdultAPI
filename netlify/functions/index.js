import express from "express";
import serverless from "serverless-http";
import { getVideoDiscover } from "../../src/MediaDiscover.js";
import { getVideoDetails } from "../../src/MediaDetails.js";
import { port } from "../../src/constants.js";
import { getCategories } from "../../src/Categories.js";
import { getVideoSources } from "../../src/Resolver.js";
import { getSearchResults } from "../../src/Search.js";

const app = express();

// JSON middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    intro: "Welcome to the unofficial eporner provider: check the provider website @ https://www.eporner.com/ ",
    routes: {
      category_list: "/cats",
      video_discover: "/discover/movie",
      video_details_and_sources: "/details/:epornerid",
      search: "/search/:query"
    },
    author: "This api is developed and created by Inside4ndroid"
  });
});

app.get("/details/:id", async (req, res) => {
  const id = req.params.id || null;
  const thumbsize = "medium";

  const getDetails = await getVideoDetails(id, thumbsize);
  const getSources = await getVideoSources(id);

  if (!getDetails || !getSources) {
    res.status(404).json({
      status: 404,
      return: "Oops reached rate limit of this api"
    });
  } else {
    getDetails.sources = getSources.sources;
    res.status(200).json(getDetails);
  }
});

app.get("/discover/movie", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const with_genres = req.query.with_genres;

  const getDiscover = await getVideoDiscover(with_genres, page);

  if (!getDiscover) {
    return res.status(429).json({
      status: 429,
      message: "Oops, reached rate limit of this API"
    });
  }

  res.status(200).json(getDiscover);
});

app.get("/search/:query", async (req, res) => {
  const query = req.params.query;
  const getResults = await getSearchResults(query, "30", "1", "medium", "latest", "0", "1");

  if (!getResults) {
    res.status(404).json({
      status: 404,
      return: "Oops reached rate limit of this api"
    });
  } else {
    res.status(200).json([getResults]);
  }
});

app.get("/cats", async (req, res) => {
  const getCats = await getCategories();
  if (!getCats) {
    res.status(404).json({
      status: 404,
      return: "Oops reached rate limit of this api"
    });
  } else {
    res.status(200).json(getCats);
  }
});

// Export handler for Netlify
export const handler = serverless(app);
