const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const emergenciesPath = path.join(__dirname, "./../../data/emergencies.json");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

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

function getNextId(emergencies) {
  if (emergencies.length === 0) return 1;
  const maxId = Math.max(...emergencies.map((e) => e.id || 0));
  return maxId + 1;
}

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

  try {
    const emergencies = JSON.parse(fs.readFileSync(emergenciesPath, "utf8"));

    const emergencyData = {
      id: getNextId(emergencies),
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
      status: "pending",
    };

    emergencies.push(emergencyData);

    fs.writeFileSync(emergenciesPath, JSON.stringify(emergencies, null, 2));

    res.status(200).json({
      success: true,
      message: "Emergency received and stored",
      emergency: emergencyData,
    });
  } catch (error) {
    console.error("Error saving emergency:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save emergency data.",
    });
  }
});

app.put("/emergency/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res
      .status(400)
      .json({ success: false, message: "Status is required" });
  }

  try {
    const emergencies = JSON.parse(fs.readFileSync(emergenciesPath, "utf8"));
    const emergencyIndex = emergencies.findIndex(
      (emergency) => emergency.id === parseInt(id)
    );

    if (emergencyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Emergency not found",
      });
    }
    if (emergencies[emergencyIndex].status === status) {
      return res.status(200).json({
        success: true,
        message: "Status already set",
        emergency: emergencies[emergencyIndex],
      });
    }

    emergencies[emergencyIndex].status = status;

    if (status === "done") {
      emergencies[emergencyIndex].archivedAt = new Date().toISOString();
    }

    fs.writeFileSync(emergenciesPath, JSON.stringify(emergencies, null, 2));

    res.json({
      success: true,
      message: "Status updated successfully",
      emergency: emergencies[emergencyIndex],
    });
  } catch (error) {
    console.error("Error updating emergency status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update emergency status",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
