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

async function submitRepreData() {
    const clenyInput = document.getElementById("repre-cleny");
    const mistoInput = document.getElementById("repre-misto");
    const btn = document.getElementById("repre-submit-btn");
    const status = document.getElementById("repre-status");

    if (!clenyInput || !mistoInput) return;

    // Kontrola povinných polí
    if (!clenyInput.value.trim() || !mistoInput.value.trim()) {
        alert("Prosím vyplňte členy týmu a místo lokality!");
        return;
    }

    btn.disabled = true;
    status.style.color = "#333";
    status.innerText = "⏳ Ukládám záznam...";

    const payload = {
        cleny: clenyInput.value,
        misto: mistoInput.value,
        jmeno: document.getElementById("repre-jmeno").value,
        kontakt: document.getElementById("repre-kontakt").value,
        obor: document.getElementById("repre-obor").value,
        poznamka: document.getElementById("repre-poznamka").value
    };

    const scriptURL = "https://script.google.com/macros/s/AKfycbwnqtPqfXMjdj1gH2K-viT9pU_KM9Nh44XeZ1uMzGpXVdUqpwlumVqy_yJndv8OjxugAw/exec";

    try {
        await fetch(scriptURL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(payload)
        });

        status.style.color = "green";
        status.innerText = "✅ Záznam byl úspěšně uložen do Google Tabulky!";
        document.getElementById("repre-form").reset();
    } catch (err) {
        status.style.color = "red";
        status.innerText = "❌ Chyba při uložení: " + err.message;
    } finally {
        btn.disabled = false;
    }
}

let allRepreData = []; // Globální proměnná pro ukládání načtených dat

// 1. Odeslání nového záznamu
async function submitRepreData() {
    const clenyInput = document.getElementById("repre-cleny");
    const mistoInput = document.getElementById("repre-misto");
    const btn = document.getElementById("repre-submit-btn");
    const status = document.getElementById("repre-status");

    if (!clenyInput || !mistoInput) return;
    
    if (!clenyInput.value.trim() || !mistoInput.value.trim()) {
        alert("Prosím vyplňte členy týmu a místo lokality!");
        return;
    }

    btn.disabled = true;
    status.style.color = "#333";
    status.innerText = "⏳ Ukládám záznam...";

    const payload = {
        cleny: clenyInput.value,
        misto: mistoInput.value,
        jmeno: document.getElementById("repre-jmeno").value,
        kontakt: document.getElementById("repre-kontakt").value,
        obor: document.getElementById("repre-obor").value,
        hodnoceni: document.getElementById("repre-hodnoceni").value,
        poznamka: document.getElementById("repre-poznamka").value
    };

    const scriptURL = "https://script.google.com/macros/s/AKfycbwnqtPqfXMjdj1gH2K-viT9pU_KM9Nh44XeZ1uMzGpXVdUqpwlumVqy_yJndv8OjxugAw/exec";

    try {
        await fetch(scriptURL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(payload)
        });

        status.style.color = "green";
        status.innerText = "✅ Záznam byl úspěšně uložen do Google Tabulky!";
        document.getElementById("repre-form").reset();
        
        // Obnovíme tabulku po 1.5 sekundě
        setTimeout(loadRepreData, 1500);
    } catch (err) {
        status.style.color = "red";
        status.innerText = "❌ Chyba při uložení: " + err.message;
    } finally {
        btn.disabled = false;
    }
}

// 2. Načtení dat z Google Sheets
async function loadRepreData() {
    const tbody = document.getElementById("repre-table-body");
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" style="padding: 15px; text-align: center; color: #666;">⏳ Načítám data z databáze...</td></tr>';

    const scriptURL = "https://script.google.com/macros/s/AKfycbwnqtPqfXMjdj1gH2K-viT9pU_KM9Nh44XeZ1uMzGpXVdUqpwlumVqy_yJndv8OjxugAw/exec";

    try {
        const response = await fetch(scriptURL);
        allRepreData = await response.json();
        filterRepreTable(); // Vykreslení dat
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7" style="padding: 15px; text-align: center; color: red;">❌ Chyba při načítání dat. Zkontrolujte připojení.</td></tr>';
    }
}

// 3. Filtrování, vyhledávání a řazení dat v tabulce
function filterRepreTable() {
    const tbody = document.getElementById("repre-table-body");
    if (!tbody || !allRepreData) return;

    const searchValue = document.getElementById("repre-search").value.toLowerCase();
    const ratingFilter = document.getElementById("repre-filter-rating").value;
    const sortBy = document.getElementById("repre-sort").value;

    // Filtrování
    let filtered = allRepreData.filter(item => {
        const matchesSearch = (item.jmeno || "").toLowerCase().includes(searchValue) ||
                              (item.kontakt || "").toLowerCase().includes(searchValue) ||
                              (item.misto || "").toLowerCase().includes(searchValue) ||
                              (item.obor || "").toLowerCase().includes(searchValue) ||
                              (item.poznamka || "").toLowerCase().includes(searchValue);

        const matchesRating = ratingFilter === "all" || String(item.hodnoceni) === ratingFilter;

        return matchesSearch && matchesRating;
    });

    // Řazení
    filtered.sort((a, b) => {
        if (sortBy === "name-asc") return (a.jmeno || "").localeCompare(b.jmeno || "");
        if (sortBy === "name-desc") return (b.jmeno || "").localeCompare(a.jmeno || "");
        if (sortBy === "rating-asc") return Number(a.hodnoceni || 3) - Number(b.hodnoceni || 3);
        return 0; // "date-desc" zůstává v pořadí z tabulky
    });

    // Vykreslení do HTML
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="padding: 15px; text-align: center; color: #888;">Žádné záznamy neodpovídají filtru.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(item => {
        // Formátování odznaku podle hodnocení
        let ratingBadge = `<span style="background: #28a745; color: white; padding: 3px 6px; border-radius: 3px; font-weight: bold;">⭐ 1 (Top)</span>`;
        if (String(item.hodnoceni) === "2") {
            ratingBadge = `<span style="background: #ffc107; color: black; padding: 3px 6px; border-radius: 3px; font-weight: bold;">⭐ 2 (Střed)</span>`;
        } else if (String(item.hodnoceni) === "3") {
            ratingBadge = `<span style="background: #dc3545; color: white; padding: 3px 6px; border-radius: 3px; font-weight: bold;">⭐ 3 (Slabé)</span>`;
        }

        return `
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px;">${ratingBadge}</td>
                <td style="padding: 8px; font-weight: bold;">${item.jmeno || '-'}</td>
                <td style="padding: 8px;">${item.kontakt || '-'}</td>
                <td style="padding: 8px;">${item.obor || '-'}</td>
                <td style="padding: 8px;">${item.misto || '-'}</td>
                <td style="padding: 8px; color: #555;">${item.cleny || '-'}</td>
                <td style="padding: 8px; font-style: italic;">${item.poznamka || '-'}</td>
            </tr>
        `;
    }).join("");
}

// Automatické načtení dat při přechodu do sekce reprezentace
// (zavolejte loadRepreData() uvnitř vaší existující funkce loadSection('reprezentace'))
