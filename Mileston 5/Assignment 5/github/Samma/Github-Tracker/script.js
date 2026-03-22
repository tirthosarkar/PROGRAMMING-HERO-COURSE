// sob issues ekhane save thakbe
let allIssues = [];

// kon tab selected ache
let currentTab = "all";


// ================================
//         LOGIN
// ================================

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

// enter press e login
document.getElementById("password-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        handleLogin();
    }
});

// ================================
//       LOAD ALL ISSUES
// ================================

async function loadAllIssues() {
    showSpinner();

    const res = await fetch(`${API_URL}/issues`);
    const data = await res.json();

    // api theke issues array niye nibo
    allIssues = data.data || data.issues || data;

    hideSpinner();

    // open/closed count update
    updateStatusCount();

    // show all issues by default
    showIssues(allIssues);
}


// ================================
//       SHOW ISSUES (RENDER)
// ================================

function showIssues(issues) {
    const grid = document.getElementById("cards-grid");
    const countText = document.getElementById("issues-count-text");

    grid.innerHTML = "";
    countText.textContent = `${issues.length} Issues`;

    if (issues.length === 0) {
        grid.innerHTML = `
            <div class="col-span-4 text-center py-16 text-gray-400">
                <p class="text-4xl mb-3">🔍</p>
                <p class="text-base">No issues found</p>
            </div>
        `;
        return;
    }

    issues.forEach(function (issue) {
        const card = createCard(issue);
        grid.appendChild(card);
    });
}
