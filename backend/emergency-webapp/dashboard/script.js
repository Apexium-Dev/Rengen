let data = [];
let lastUpdated = null;
let archivedData = [];

const dataContainer = document.getElementById("data");
const loadingElement = document.getElementById("loading");
const errorElement = document.getElementById("error");
const searchInput = document.querySelector('input[type="search"]');
const refreshBtn = document.getElementById("refreshBtn");
const lastUpdatedElement = document.getElementById("lastUpdated");
const statusCheckboxes = document.querySelectorAll(
  '.filter-option input[type="checkbox"]'
);
const archiveToggleBtn = document.getElementById("archiveToggleBtn");
const archiveHeader = document.getElementById("archiveHeader");

const state = {
  searchTerm: "",
  activeStatuses: ["pending", "processing"],
  isLoading: false,
  error: null,
  showArchived: false,
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

archiveToggleBtn.addEventListener("click", () => {
  state.showArchived = !state.showArchived;
  archiveToggleBtn.classList.toggle("active", state.showArchived);
  archiveToggleBtn.innerHTML = state.showArchived
    ? '<i class="fas fa-times"></i> Hide Archive'
    : '<i class="fas fa-archive"></i> View Archive';

  archiveHeader.classList.toggle("hidden", !state.showArchived);
  showData();
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

    archivedData = data.filter((item) => item.status === "done");
    data = data.filter((item) => item.status !== "done");

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

  let dataToShow = state.showArchived ? archivedData : filteredData;

  if (state.searchTerm) {
    dataToShow = dataToShow.filter(
      (item) =>
        item.name.toLowerCase().includes(state.searchTerm) ||
        item.age.toString().includes(state.searchTerm) ||
        item.gender.toLowerCase().includes(state.searchTerm) ||
        item.bloodType.toLowerCase().includes(state.searchTerm) ||
        (item.allergies &&
          item.allergies.toLowerCase().includes(state.searchTerm)) ||
        (item.medications &&
          item.medications.toLowerCase().includes(state.searchTerm)) ||
        (item.phone && item.phone.includes(state.searchTerm))
    );
  }

  if (!state.showArchived) {
    dataToShow = dataToShow.filter((item) =>
      state.activeStatuses.includes(item.status || "pending")
    );
  }

  if (dataToShow.length === 0) {
    dataContainer.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <p>No emergencies found matching your criteria</p>
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  dataToShow.forEach((element) => {
    const card = createEmergencyCard(element);
    fragment.appendChild(card);
  });

  dataContainer.appendChild(fragment);
}

function createEmergencyCard(element) {
  const card = document.createElement("div");
  card.classList.add("card", element.status || "pending");

  const archivedDate = element.archivedAt
    ? new Date(element.archivedAt).toLocaleString()
    : "";

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
      ${
        archivedDate
          ? `
      <div class="card-field archived-date">
        <span class="field-label">Archived On</span>
        <span class="field-value">${archivedDate}</span>
      </div>
      `
          : ""
      }
    </div>
    ${
      !state.showArchived
        ? `
    <div class="card-actions">
      ${
        element.status !== "processing"
          ? `
        <button class="action-btn processing" data-status="processing" data-emergency-id="${element.id}">
          <i class="fas fa-clock"></i> Start Processing
        </button>
      `
          : ""
      }
      ${
        element.status !== "done"
          ? `
        <button class="action-btn done" data-status="done" data-emergency-id="${element.id}">
          <i class="fas fa-check"></i> Mark Done
        </button>
      `
          : ""
      }
    </div>
    `
        : ""
    }
  `;

  if (!state.showArchived) {
    const buttons = card.querySelectorAll(".action-btn");
    buttons.forEach((button) => {
      let isProcessing = false;
      button.addEventListener("click", async (event) => {
        event.stopPropagation();

        if (isProcessing) return;
        isProcessing = true;

        button.disabled = true;

        try {
          const newStatus = button.dataset.status;
          const emergencyId = button.dataset.emergencyId;

          const response = await fetch(
            `http://localhost:3000/emergency/${emergencyId}/status`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: newStatus }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();

          if (result.success) {
            element.status = newStatus;

            if (newStatus === "done") {
              const isAlreadyArchived = archivedData.some(
                (item) => item.id === element.id
              );

              if (!isAlreadyArchived) {
                archivedData.push({
                  ...element,
                  archivedAt: result.emergency.archivedAt || new Date(),
                });

                const index = data.findIndex((item) => item.id === element.id);

                if (index !== -1) {
                  data.splice(index, 1);
                }

                showNotification("Emergency archived successfully");
              }
            }

            showData();
          } else {
            throw new Error(result.message || "Failed to update status");
          }
        } catch (error) {
          console.error("Error updating status:", error);
          showNotification(`Error: ${error.message}`, "error");
        } finally {
          button.disabled = false;
          isProcessing = false;
        }
      });
    });
  }

  return card;
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.classList.add("notification", type);
  notification.innerHTML = `
    <i class="fas fa-${
      type === "success" ? "check-circle" : "exclamation-circle"
    }"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

getData();
