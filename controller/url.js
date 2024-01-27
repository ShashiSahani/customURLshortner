const shortId = require("shortid");
const URL = require("../models/url");

function isValidUrl(url) {
  // A simple regex to check if the URL has a valid format
  // expression (urlRegex). The regular expression checks if the URL starts with either
  // "ftp", "http", or "https" followed by "://", and then any non-space characters.
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}

async function handleGenerateNewShortURL(req, res) {
  try {
    const shortID = shortId();
    const url = req.body.url;

    // Validate URL format
    if (!url || !isValidUrl(url)) {
      throw new Error("Valid URL is required");
    }

    await URL.create({
      shortId: shortID,
      redirectURL: url,
      visitHistory: [],
    });

    return res.json({ id: shortID });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function handleGetAnalytics(req, res) {
    try {
      const shortId = req.params.shortId;  // Use req.params instead of req.param
      const result = await URL.findOne({ shortId });
      return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
      });
    } catch (error) {
      console.log("Error", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
