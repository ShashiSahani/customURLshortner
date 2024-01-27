const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      require: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitHistory: [
      {
        timestamps: {
          type: Date,
           default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const URL=mongoose.model('url',urlSchema);
module.exports=URL;