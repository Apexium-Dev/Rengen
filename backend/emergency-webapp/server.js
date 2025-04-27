const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Endpoint to retrieve all emergencies
app.get("/emergencies", (req, res) => {
  fs.readFile(
    path.join(__dirname, "./../../data/emergencies.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch emergency data.",
        });
      }
      const emergencies = data ? JSON.parse(data) : [];
      res.status(200).json(emergencies);
    }
  );
});

app.post("/emergency", (req, res) => {
  const {
    name,
    phone,
    age,
    gender,
    bloodType,
    allergies,
    medications,
    latitude,
    longitude,
  } = req.body;

  const emergencyData = {
    name,
    phone,
    age,
    gender,
    bloodType,
    allergies,
    medications,
    timestamp: new Date().toString(),
    latitude,
    longitude,
  };

  fs.readFile(
    path.join(__dirname, "./../../data/emergencies.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to save emergency data.",
        });
      }

      const emergencies = data ? JSON.parse(data) : [];
      emergencies.push(emergencyData);

      fs.writeFile(
        path.join(__dirname, "./../../data/emergencies.json"),
        JSON.stringify(emergencies, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing to file:", err);
            return res.status(500).json({
              success: false,
              message: "Failed to save emergency data.",
            });
          }
          res.status(200).json({
            success: true,
            message: "Emergency received and stored",
          });
        }
      );
    }
  );
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
