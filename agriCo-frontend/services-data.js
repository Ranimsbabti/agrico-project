

// Data variables (will be populated by pages.js)
let PRODUITS = [];
let SERVICES = [];
let VENDEURS = {};

function isUserConnected() {
    return !!localStorage.getItem('user');
}

// ─── FETCH FUNCTIONS ───────────────────────────────────────
async function fetch_produits() {
    try {
        const response = await fetch('http://127.0.0.1:5000/products/tousProduits');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Could not fetch products:", error);
        return [];
    }
}

async function fetch_services() {
    try {
        const response = await fetch('http://127.0.0.1:5000/services/tous_services');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Could not fetch services:", error);
        return [];
    }
}

async function fetch_vendeurs() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/vendeurs');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Could not fetch vendeurs:", error);
        return {};
    }
}

// ─── INITIALIZE DATA ────────────────────────────────────────
async function initializeData() {
    PRODUITS = await fetch_produits();
    SERVICES = await fetch_services();
    VENDEURS = await fetch_vendeurs();
}


