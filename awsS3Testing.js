const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const app = express();
const port = 3000;
const cors = require("cors");
const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require("fs");

// Configure AWS with your credentials
AWS.config.update({
  accessKeyId: "YOUR_ACCESS_KEY_ID",
  secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
  region: "YOUR_S3_REGION",
});
const s3 = new AWS.S3();
const bucketName = "YOUR_S3_BUCKET_NAME";

// Middleware setup
app.use(express.json());
app.use(cors());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/user/:id/upload", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { buffer, mimetype: contentType } = req.file;

    // Upload the file to S3
    const params = {
      Bucket: bucketName,
      Key: `images/${id}-${Date.now()}`, // Change the Key as needed
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read",
    };

    const uploaded = await s3.upload(params).promise();

    // Save S3 URL to the user document
    const updateUser = await User.findByIdAndUpdate(
      id,
      { image: uploaded.Location, contentType },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://lahbibbilel:lahbibbilel@back-node.kmuw3yj.mongodb.net/Node-api?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });
