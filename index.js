const express = require("express");
const { connectToMongoDb } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const app = express();

const PORT = 8002;

connectToMongoDb("mongodb://127.0.0.1:27017/shortUrl").then(() => {
  console.log("MongoDB connected!");

  // Start the server after the MongoDB connection is established
  app.use(express.json());
  app.use("/url", urlRoute);

  app.get("/:shortId", async (req, res) => {
    try {
      const shortId = req.params.shortId;

      // Validate shortId format (e.g., alphanumeric characters)
      if (!/^[a-zA-Z0-9]+$/.test(shortId)) {
        return res.status(400).json({ error: "Invalid shortId format" });
      }

      const entry = await URL.findOneAndUpdate(
        { shortId },
        {
          $push: {
            visitHistory: {
              timestamp: Date.now(),
            },
          },
        },
        { new: true } // Return the updated document
      );

      // Check if entry is not found
      if (!entry) {
        return res.status(404).json({ error: "Short URL not found" });
      }

      res.redirect(entry.redirectURL);
    console.log("Updated Entry:", entry);

    } catch (error) {
      console.error("Error handling shortId request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

  });
});

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
