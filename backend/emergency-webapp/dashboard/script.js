let data = [];
let lastUpdated = null;

const dataContainer = document.getElementById("data");
const loadingElement = document.getElementById("loading");
const errorElement = document.getElementById("error");
const searchInput = document.querySelector('input[type="search"]');
const refreshBtn = document.getElementById("refreshBtn");
const lastUpdatedElement = document.getElementById("lastUpdated");
const statusCheckboxes = document.querySelectorAll(
  '.filter-option input[type="checkbox"]'
);

const state = {
  searchTerm: "",
  activeStatuses: ["pending", "processing", "done"],
  isLoading: false,
  error: null,
};

searchInput.addEventListener("input", (e) => {
  state.searchTerm = e.target.value.toLowerCase();
  showData();
});

statusCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    state.activeStatuses = Array.from(statusCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    showData();
  });
});

refreshBtn.addEventListener("click", () => {
  getData();
});

async function getData() {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch("http://localhost:3000/emergencies");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    data = await response.json();
    lastUpdated = new Date();
    updateLastUpdated();
    showData();
  } catch (error) {
    console.error("Error fetching data:", error);
    setError("Failed to load emergencies data. Please try again later.");
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  state.isLoading = isLoading;
  loadingElement.classList.toggle("hidden", !isLoading);
  refreshBtn.disabled = isLoading;
}

function setError(error) {
  state.error = error;
  errorElement.classList.toggle("hidden", !error);
  if (error) {
    errorElement.querySelector("span").textContent = error;
  }
}

function updateLastUpdated() {
  if (lastUpdated) {
    lastUpdatedElement.textContent = `Last updated: ${lastUpdated.toLocaleTimeString()}`;
  }
}

function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredData = data.filter(
    (element) =>
      element.name.toLowerCase().includes(searchTerm) ||
      element.age.toString().includes(searchTerm) ||
      element.gender.toLowerCase().includes(searchTerm) ||
      element.bloodType.toLowerCase().includes(searchTerm) ||
      element.allergies.toLowerCase().includes(searchTerm) ||
      element.medications.toLowerCase().includes(searchTerm) ||
      element.phone.includes(searchTerm)
  );
  showData(filteredData);
}

function showData(filteredData = data) {
  dataContainer.innerHTML = "";

  const filteredResults = filteredData.filter((item) =>
    state.activeStatuses.includes(item.status || "pending")
  );

  if (filteredResults.length === 0) {
    dataContainer.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <p>No emergencies found matching your criteria</p>
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  filteredResults.forEach((element) => {
    const card = createEmergencyCard(element);
    fragment.appendChild(card);
  });

  dataContainer.appendChild(fragment);
}

function createEmergencyCard(element) {
  const card = document.createElement("div");
  card.classList.add("card", element.status || "pending");

  card.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">${element.name}</h3>
      <span class="status-badge ${element.status || "pending"}">${
    element.status || "Pending"
  }</span>
    </div>
    <div class="card-content">
      <div class="card-field">
        <span class="field-label">Age</span>
        <span class="field-value">${element.age}</span>
      </div>
      <div class="card-field">
        <span class="field-label">Gender</span>
        <span class="field-value">${element.gender}</span>
      </div>
      <div class="card-field">
        <span class="field-label">Blood Type</span>
        <span class="field-value">${element.bloodType}</span>
      </div>
      <div class="card-field">
        <span class="field-label">Allergies</span>
        <span class="field-value">${element.allergies || "None"}</span>
      </div>
      <div class="card-field">
        <span class="field-label">Medications</span>
        <span class="field-value">${element.medications || "None"}</span>
      </div>
      <div class="card-field">
        <span class="field-label">Phone</span>
        <span class="field-value">${element.phone}</span>
      </div>
    </div>
    <div class="card-actions">
      ${
        element.status !== "processing"
          ? `
        <button class="action-btn processing" data-status="processing">
          <i class="fas fa-clock"></i> Start Processing
        </button>
      `
          : ""
      }
      ${
        element.status !== "done"
          ? `
        <button class="action-btn done" data-status="done">
          <i class="fas fa-check"></i> Mark Done
        </button>
      `
          : ""
      }
    </div>
  `;

  const buttons = card.querySelectorAll(".action-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const newStatus = event.target.closest(".action-btn").dataset.status;
      try {
        element.status = newStatus;
        showData();
      } catch (error) {
        console.error("Error updating status:", error);
        alert("Failed to update status. Please try again.");
      }
    });
  });

  return card;
}

getData();
