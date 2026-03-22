// all issue
let allIssues = [];

// tab
let currentTab = "all";

//LOGIN

function handleLogin() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;

  // console.log(username, password);

  if (username === "admin" && password === "admin123") {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("login-error").classList.add("hidden");
    loadAllIssues();
  } else {
    document.getElementById("login-error").classList.remove("hidden");
  }
}
// enter press to login
document
  .getElementById("password-input")
  .addEventListener("keydown", function (key) {
    if (key.key === "Enter") {
      handleLogin();
    }
  });

// ISSUES LOADED HERE
async function loadAllIssues() {
  showSpinner();

  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await res.json();
  // console.log(data);
  allIssues = data.data || data.issues || data;
  // console.log(allIssues);
  hideSpinner();
  updateStatusCount();
  showIssues(allIssues);
}
// ISSUES SHOW HERE
function showIssues(issues) {
  const grid = document.getElementById("cards-grid");
  const countText = document.getElementById("issues-count-text");

  grid.innerHTML = "";
  countText.textContent = issues.length + " Issues";

  if (issues.length === 0) {
    grid.innerHTML =
      "<p class='text-center py-10 text-gray-400'>No issues found</p>";
    return;
  }

  issues.forEach(function (issue) {
    // console.log(issue);
    const card = createCard(issue);
    grid.appendChild(card);
  });
}


//CARD MADE
function createCard(issue) {
  const card = document.createElement("div");
  const status = issue.status;
  const priority = issue.priority;
  const issueId = issue.id;
  const author = issue.author;
  const title = issue.title;
  const description = issue.description;
  const date = formatDate(issue.createdAt);

  // console.log(issueId, title, status, priority);

  // labels array koro
  let labels = issue.labels;
  if (!Array.isArray(labels)) {
    labels = [labels];
  }
  // console.log(labels);

  // if open then green if closed then purple
  if (status.toLowerCase() === "open") {
    card.className = "issue-card card-open";
  } else {
    card.className = "issue-card card-closed";
  }
  // priority color
  let priorityBg = "#f3f4f6";
  let priorityText = "#6b7280";
  if (priority.toUpperCase() === "HIGH") {
    priorityBg = "#ffedd5";
    priorityText = "#ea580c";
  } else if (priority.toUpperCase() === "MEDIUM") {
    priorityBg = "#fef9c3";
    priorityText = "#ca8a04";
  } else if (priority.toUpperCase() === "LOW") {
    priorityBg = "#f3f4f6";
    priorityText = "#6b7280";
  }

  // if open green dot, if closed purple dot
  let dotColor = "#22c55e";
  if (status.toLowerCase() === "closed") {
    dotColor = "#a855f7";
  }

  // labels html create here
  let labelsHTML = "";
  labels.forEach(function (label) {
    let lBg = "#f3f4f6";
    let lText = "#374151";
    if (label.toUpperCase() === "BUG") {
      lBg = "#fee2e2";
      lText = "#dc2626";
    } else if (label.toUpperCase() === "HELP WANTED") {
      lBg = "#f3e8ff";
      lText = "#9333ea";
    } else if (label.toUpperCase() === "ENHANCEMENT") {
      lBg = "#dcfce7";
      lText = "#16a34a";
    } else if (label.toUpperCase() === "GOOD FIRST ISSUE") {
      lBg = "#dbeafe";
      lText = "#2563eb";
    } else if (label.toUpperCase() === "DOCUMENTATION") {
      lBg = "#fef3c7";
      lText = "#d97706";
    }
    labelsHTML += `<span style="background:${lBg}; color:${lText}; font-size:10px; font-weight:700; padding:2px 8px; border-radius:20px;">${label}</span>`;
  });
  card.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="w-2.5 h-2.5 rounded-full inline-block" style="background:${dotColor};"></span>
            <span style="background:${priorityBg}; color:${priorityText}; font-size:10px; font-weight:700; padding:2px 8px; border-radius:20px;">${priority}</span>
        </div>

        <h3 class="font-bold text-md text-gray-900 leading-snug">${title}</h3>

        <p class="text-sm text-gray-500 leading-relaxed line-clamp-2">${description}</p>

        <div class="flex gap-1 flex-wrap">${labelsHTML}</div>

        <div class="text-sm text-gray-400 border-t border-gray-100 pt-2">
            #${issueId} by ${author} <br> ${date}
        </div>
    `;

  // MODAL on click
  card.addEventListener("click", function () {
    // console.log("card clicked, issueId:", issueId);
    openModal(issueId);
  });

  return card;
}
//TAB CHANGE
function changeTab(tab) {
  currentTab = tab;
  // console.log("tab changed to:", tab);

  // Reset All
  document.getElementById("tab-all").classList.remove("tab-active");
  document.getElementById("tab-open").classList.remove("tab-active");
  document.getElementById("tab-closed").classList.remove("tab-active");

  // selected tab activated
  document.getElementById("tab-" + tab).classList.add("tab-active");

  // search clear
  document.getElementById("search-input").value = "";

  // filter tab
  if (tab === "all") {
    showIssues(allIssues);
  } else {
    const filtered = [];
    allIssues.forEach(function (issue) {
      if (issue.status.toLowerCase() === tab) {
        filtered.push(issue);
      }
    });
    // console.log("filtered issues:", filtered);
    showIssues(filtered);
  }
}

// OPEN/CLOSED COUNT

function updateStatusCount() {
  let openCount = 0;
  let closedCount = 0;
  allIssues.forEach(function (issue) {
    if (issue.status.toLowerCase() === "open") {
      openCount = openCount + 1;
    } else {
      closedCount = closedCount + 1;
    }
  });

  // console.log("open:", openCount, "closed:", closedCount);

  document.getElementById("open-count").textContent = openCount;
  document.getElementById("closed-count").textContent = closedCount;
}
//SEARCH

async function doSearch(query) {
  showSpinner();
  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=" + query,
  );
  const data = await res.json();
  // console.log("search result:", data);
  const results = data.data || data.issues || data;

  hideSpinner();
  showIssues(results);
  document.getElementById("issues-count-text").textContent =
    results.length + " Issues";
}

// MODAL
async function openModal(issueId) {
  // console.log("opening modal for id:", issueId);
  const modal = document.getElementById("issue-modal");
  modal.classList.remove("hidden");
  document.getElementById("modal-title").textContent = "Loading...";
  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issue/" + issueId,
  );
  const data = await res.json();
  // console.log("single issue data:", data);
  const issue = data.data || data.issue || data;
  fillModal(issue);
}
function fillModal(issue) {
  // console.log("filling modal with:", issue);
  const status = issue.status;
  const id = issue.id;
  const date = formatDate(issue.createdAt);

  let labels = issue.labels;
  if (!Array.isArray(labels)) {
    labels = [labels];
  }
  // title
  document.getElementById("modal-title").textContent = issue.title;
  // status badge
  const statusEl = document.getElementById("modal-status");
  if (status.toLowerCase() === "open") {
    statusEl.textContent = "● Open";
    statusEl.className =
      "text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-300";
  } else {
    statusEl.textContent = "● Closed";
    statusEl.className =
      "text-sm font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-300";
  }
  // opened by
  document.getElementById("modal-opened-info").textContent =
    "#" + id + " · Opened by " + issue.author + " · " + date;
  // labels
  let labelsHTML = "";
  labels.forEach(function (l) {
    let labelColor = "bg-gray-100 text-gray-700";
    if (l === "BUG") {
      labelColor = "bg-red-100 text-red-600";
    } else if (l === "HELP WANTED") {
      labelColor = "bg-purple-100 text-purple-600";
    } else if (l === "ENHANCEMENT") {
      labelColor = "bg-green-100 text-green-600";
    }
    labelsHTML += `<span class="text-sm font-bold px-2 py-0.5 rounded-full ${labelColor}">${l}</span>`;
  });
  document.getElementById("modal-labels").innerHTML = labelsHTML;

  // description
  document.getElementById("modal-desc").textContent = issue.description;

  // assignee
  const assignee =
    issue.assignee || issue.assignedTo || issue.assigned_to || "—";
  document.getElementById("modal-assignee").textContent = assignee;

  //  toUpperCase() so HIGH/Medium/low all match correctly
  document.getElementById("modal-priority-high").classList.add("hidden");
  document.getElementById("modal-priority-medium").classList.add("hidden");
  document.getElementById("modal-priority-low").classList.add("hidden");

  const p = (issue.priority || "").toUpperCase();
  if (p === "HIGH") {
    document.getElementById("modal-priority-high").classList.remove("hidden");
  } else if (p === "MEDIUM") {
    document.getElementById("modal-priority-medium").classList.remove("hidden");
  } else {
    document.getElementById("modal-priority-low").classList.remove("hidden");
  }
}

function closeModal() {
  const modal = document.getElementById("issue-modal");
  modal.classList.add("hidden");
}

// modal outside click to close
document.getElementById("issue-modal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

// SPINNER

function showSpinner() {
  document.getElementById("loading-spinner").style.display = "flex";
  document.getElementById("cards-grid").innerHTML = "";
}
function hideSpinner() {
  document.getElementById("loading-spinner").style.display = "none";
}
//       DATE FORMAT
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// new issue button a click to search
document
  .querySelector(".btn.btn-primary.btn-md")
  .addEventListener("click", function () {
    const query = document.getElementById("search-input").value.trim();
    // console.log("new issue button clicked, query:", query);
    if (query === "") {
      showIssues(allIssues);
    } else {
      doSearch(query);
    }
  });
