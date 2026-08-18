const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwOYaYaCUccOTxAuX4YSwbSV1jH_DroxFABUl4R_Zl4G99GD5awhyZ2qsscy_BW-AJy/exec";
let globalData = [];
let isDataLoaded = false;

function checkLogin() {
    var inputPass = document.getElementById("password").value;
    if (inputPass === "CVUT_FEL_Edizon") {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("portal-container").style.display = "flex";
        sessionStorage.setItem("vlcr_auth_token", "active_session_2007");
        
        // Výchozí sekce po přihlášení
        const defaultLink = document.querySelector(".sidebar-links a");
        loadSection(defaultLink, 'info');
    } else {
        alert("Přístup odepřen: Zadané jednotné heslo je nesprávné! Zkontrolujte Caps Lock a překlepy.");
    }
}

function logout() {
    sessionStorage.removeItem("vlcr_auth_token");
    document.getElementById("password").value = "";
    document.getElementById("portal-container").style.display = "none";
    document.getElementById("login-container").style.display = "flex";
}

function loadSection(element, sectionFileName) {
    // Změna aktivní třídy v menu
    if (element) {
        var links = document.querySelectorAll(".sidebar-links a");
        links.forEach(link => link.classList.remove("active"));
        element.classList.add("active");
    }

    const container = document.getElementById('dynamic-content');
    container.innerHTML = '<div class="loading-text">Načítám modul...</div>';

    fetch(`sekce/${sectionFileName}.html`)
        .then(response => {
            if (!response.ok) throw new Error("Soubor sekce nebyl nalezen.");
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
            // Spuštění specifických funkcí pro konkrétní sekce
            if (sectionFileName === 'dochazka') {
                refreshData();
            }
        })
        .catch(err => {
            container.innerHTML = `<div style="color:red; padding:20px;">Chyba při načítání sekce: ${err.message}</div>`;
        });
}

window.onload = function() {
    if (sessionStorage.getItem("vlcr_auth_token") === "active_session_2007") {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("portal-container").style.display = "flex";
        const defaultLink = document.querySelector(".sidebar-links a");
        loadSection(defaultLink, 'info');
    }
}

// --- LOGIKA DOCHÁZKY ---
function refreshData() {
    const statusEl = document.getElementById("system-status");
    if (statusEl) {
        statusEl.innerText = "⚙️ Stahování dat...";
        statusEl.style.color = "blue";
    }
    
    fetch(`${SCRIPT_URL}?action=getData`)
        .then(res => res.json())
        .then(resData => {
            if (resData.status === "success") {
                globalData = resData.data;
                isDataLoaded = true;
                renderCurrentPresence();
                renderLocationHistory();
                if (statusEl) {
                    statusEl.innerText = "● Data synchronizována";
                    statusEl.style.color = "green";
                }
            }
        })
        .catch(err => {
            if (statusEl) {
                statusEl.innerText = "❌ Chyba připojení";
                statusEl.style.color = "red";
            }
        });
}

function renderCurrentPresence() {
    if (!isDataLoaded) return;
    const tbody = document.querySelector('#table-aktualni tbody');
    if (!tbody) return;
    const activeMembers = {};
    globalData.forEach(row => {
        if (row.checkIn && !row.checkOut) activeMembers[row.memberId] = { location: row.location, time: row.checkIn };
        else if (row.checkIn && row.checkOut && activeMembers[row.memberId]?.time === row.checkIn) delete activeMembers[row.memberId];
    });
    const keys = Object.keys(activeMembers);
    if (keys.length === 0) return tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Všichni jsou odhlášeni.</td></tr>`;
    tbody.innerHTML = keys.map(id => `<tr><td><strong>${id}</strong></td><td>${activeMembers[id].location}</td><td>${activeMembers[id].time}</td><td><span class="status-badge">AKTIVNÍ</span></td></tr>`).join('');
}

function renderLocationHistory() {
    if (!isDataLoaded) return;
    const selectEl = document.getElementById('hist-location-select');
    const tbody = document.querySelector('#table-mista tbody');
    if (!selectEl || !tbody) return;
    const selectedLoc = selectEl.value;
    const filtered = globalData.filter(row => row.location === selectedLoc).reverse();
    if (filtered.length === 0) return tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Žádné záznamy.</td></tr>`;
    tbody.innerHTML = filtered.map(row => `<tr><td>${row.datum}</td><td><strong>${row.memberId}</strong></td><td style="color: green;">${row.checkIn || '--:--'}</td><td style="color: ${row.checkOut?'maroon':'gray'};">${row.checkOut || 'probíhá'}</td></tr>`).join('');
}

function renderMemberHistory() {
    if (!isDataLoaded) return alert("Nejprve stáhněte data (Obnovit).");
    const searchInput = document.getElementById('hist-member-input');
    const tbody = document.querySelector('#table-clenove tbody');
    if (!searchInput || !tbody) return;
    const searchId = searchInput.value.trim();
    if (!searchId) return;
    const normSearchId = isNaN(searchId) ? searchId : String(Number(searchId));
    const filtered = globalData.filter(row => {
        const normRowId = isNaN(row.memberId) ? row.memberId : String(Number(row.memberId));
        return normRowId === normSearchId;
    }).reverse();
    if (filtered.length === 0) return tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenalezeno.</td></tr>`;
    tbody.innerHTML = filtered.map(row => `<tr><td>${row.datum}</td><td>${row.location}</td><td style="color: green;">${row.checkIn || '--:--'}</td><td>${row.checkOut ? `<span style="color: maroon;">${row.checkOut}</span>` : 'NEODHLÁŠEN'}</td></tr>`).join('');
}