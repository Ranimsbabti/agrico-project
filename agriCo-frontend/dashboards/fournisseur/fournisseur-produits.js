/* fournisseur-produits.js */
const API_BASE = 'http://127.0.0.1:5000';
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('appLayout');

  const products = [
    { id: 1, name: 'Semences de blé bio', cat: 'Semences', price: 85, stock: 50, status: 'en-stock', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80' },
    { id: 2, name: 'Engrais organique NPK', cat: 'Sol', price: 45, stock: 5, status: 'faible', img: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=400&q=80' },
    { id: 3, name: 'Tracteur compact 50CV', cat: 'Matériels', price: 15000, stock: 2, status: 'en-stock', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80' },
    { id: 4, name: 'Aliment bétail', cat: 'Aliments', price: 32, stock: 0, status: 'rupture', img: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&q=80' },
    { id: 5, name: 'Kit irrigation goutte', cat: 'Arrosage', price: 200, stock: 15, status: 'en-stock', img: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=400&q=80' },
    { id: 6, name: 'Plants tomates cerises', cat: 'Plantes', price: 15, stock: 8, status: 'faible', img: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&q=80' },
    { id: 7, name: 'Semences maïs hybride', cat: 'Semences', price: 60, stock: 30, status: 'en-stock', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80' },
    { id: 8, name: 'Système arrosage auto', cat: 'Arrosage', price: 450, stock: 0, status: 'rupture', img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80' },
  ];

  const API_BASE = 'http://127.0.0.1:5000';
  let current = [...products];
  const labelMap = { 'en-stock': 'En stock', 'faible': 'Stock faible', 'rupture': 'Rupture' };
  const stockColor = s => s > 15 ? 'green' : s > 0 ? '#d4a017' : '#e53935';

  function renderCards(data) {
    document.getElementById('cardsGrid').innerHTML = data.map(p => `
      <div class="prod-card" data-id="${p.id}">
        <div class="prod-img"><img src="${p.img}" alt="${p.name}" loading="lazy"/></div>
        <div class="prod-body">
          <div class="prod-top">
            <span class="badge ${p.status}">${labelMap[p.status]}</span>
            <div class="prod-actions">
              <button class="prod-action-btn edit" data-id="${p.id}" title="Modifier"><i class="fa fa-pen"></i></button>
              <button class="prod-action-btn del"  data-id="${p.id}" title="Supprimer"><i class="fa fa-trash"></i></button>
            </div>
          </div>
          <p class="prod-name">${p.name}</p>
          <p class="prod-cat"><i class="fa fa-tag" style="margin-right:5px;color:var(--text-muted)"></i>${p.cat}</p>
          <div class="prod-footer">
            <div class="prod-price">${p.price.toLocaleString('fr-FR')}€ <small>/ unité</small></div>
            <div class="prod-stock" style="color:${stockColor(p.stock)}">
              <i class="fa fa-cube"></i> ${p.stock} unités
            </div>
          </div>
        </div>
      </div>`).join('') + `
      <button class="prod-add-card" id="btnAddCard"><i class="fa fa-plus"></i>Ajouter un produit</button>`;
  }

  function renderTable(data) {
    document.getElementById('tableBody').innerHTML = data.map(p => `
      <tr data-id="${p.id}">
        <td><div class="item-with-icon">
          <div class="item-icon gold"><i class="fa fa-box"></i></div>
          <div><span class="bold">${p.name}</span><br><small style="color:var(--text-muted);font-size:.72rem">ID-${String(p.id).padStart(3, '0')}</small></div>
        </div></td>
        <td class="muted">${p.cat}</td>
        <td>
          <div class="stock-bar-wrap">
            <div class="stock-bar-bg"><div class="stock-bar-fill ${p.stock > 15 ? 'high' : p.stock > 0 ? 'medium' : 'low'}" style="width:${Math.min(p.stock, 60) / 60 * 100}%"></div></div>
            <span class="stock-num">${p.stock}</span>
          </div>
        </td>
        <td class="amount">${p.price.toLocaleString('fr-FR')}€</td>
        <td><span class="badge ${p.status}">${labelMap[p.status]}</span></td>
        <td style="text-align:right; display:flex; gap:6px; justify-content:flex-end">
          <button class="prod-action-btn edit" data-id="${p.id}" title="Modifier"><i class="fa fa-pen"></i></button>
          <button class="prod-action-btn del"  data-id="${p.id}" title="Supprimer"><i class="fa fa-trash"></i></button>
        </td>
      </tr>`).join('');
  }

  layout.innerHTML = getSidebarHTML('produits') + `
  <main class="main">
    <header class="main-header">
      <div><h1 class="page-title">Mes Produits</h1><p class="page-sub">Gérez et publiez vos produits agricoles.</p></div>
      <div class="header-actions">
        <div class="view-toggle">
          <button class="view-btn active" id="vGrid" title="Grille"><i class="fa fa-grid-2"></i></button>
          <button class="view-btn" id="vList" title="Liste"><i class="fa fa-list"></i></button>
        </div>
        <button class="btn-gold" id="btnAdd"><i class="fa fa-plus"></i> Nouveau produit</button>
        <button class="avatar" id="profileBtn" title="Mon Profil"> </button>
      </div>
    </header>

    <div class="stats-row">
      <div class="mini-stat"><div class="ms-icon gold"><i class="fa fa-box-open"></i></div><div><p class="ms-label">Total produits</p><h3 class="ms-value">42</h3></div></div>
      <div class="mini-stat"><div class="ms-icon green"><i class="fa fa-circle-check"></i></div><div><p class="ms-label">En stock</p><h3 class="ms-value">36</h3></div></div>
      <div class="mini-stat"><div class="ms-icon orange"><i class="fa fa-triangle-exclamation"></i></div><div><p class="ms-label">Stock faible</p><h3 class="ms-value">4</h3></div></div>
      <div class="mini-stat"><div class="ms-icon red"><i class="fa fa-ban"></i></div><div><p class="ms-label">Rupture</p><h3 class="ms-value">2</h3></div></div>
    </div>

    <div class="toolbar">
      <div class="toolbar-search"><i class="fa fa-search"></i><input type="text" id="searchProd" placeholder="Rechercher un produit..."/></div>
      <div class="toolbar-right">
        <select class="btn-outline" id="filterCat" style="padding:10px 14px">
          <option value="">Toutes catégories</option>
          <option>Semences</option><option>Sol</option><option>Matériels</option>
          <option>Aliments</option><option>Arrosage</option><option>Plantes</option>
        </select>
        <select class="btn-outline" id="filterStatus" style="padding:10px 14px">
          <option value="">Tous statuts</option>
          <option value="en-stock">En stock</option>
          <option value="faible">Stock faible</option>
          <option value="rupture">Rupture</option>
        </select>
      </div>
    </div>

    <div class="filter-tabs">
      <button class="filter-tab active" data-s="">Tous (${products.length})</button>
      <button class="filter-tab" data-s="en-stock">En stock (${products.filter(p => p.status === 'en-stock').length})</button>
      <button class="filter-tab" data-s="faible">Stock faible (${products.filter(p => p.status === 'faible').length})</button>
      <button class="filter-tab" data-s="rupture">Rupture (${products.filter(p => p.status === 'rupture').length})</button>
    </div>

    <!-- Grid view -->
    <div id="gridView"><div class="prod-grid" id="cardsGrid"></div></div>

    <!-- Table view -->
    <div class="table-view" id="tableView">
      <div class="table-card">
        <div class="table-card-header"><h3>Liste des produits</h3></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Produit</th><th>Catégorie</th><th>Stock</th><th>Prix</th><th>Statut</th><th style="text-align:right">Actions</th></tr></thead>
            <tbody id="tableBody"></tbody>
          </table>
        </div>
      </div>
    </div>
  </main>`;

  initSidebar('produits');
  initModal();
  renderCards(current);
  renderTable(current);

  function applyFilters() {
    const q = document.getElementById('searchProd').value.toLowerCase();
    const cat = document.getElementById('filterCat').value;
    const st = document.getElementById('filterStatus').value;
    const tab = document.querySelector('.filter-tab.active')?.dataset.s || '';
    current = products.filter(p =>
      (p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)) &&
      (!cat || p.cat === cat) &&
      (!st || p.status === st) &&
      (!tab || p.status === tab)
    );
    renderCards(current);
    renderTable(current);
    rebindAddCard();
  }

  document.getElementById('searchProd').addEventListener('input', applyFilters);
  document.getElementById('filterCat').addEventListener('change', applyFilters);
  document.getElementById('filterStatus').addEventListener('change', applyFilters);
  document.querySelectorAll('.filter-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      applyFilters();
    });
  });

  /* View toggle */
  document.getElementById('vGrid').addEventListener('click', function () {
    this.classList.add('active'); document.getElementById('vList').classList.remove('active');
    document.getElementById('gridView').style.display = '';
    document.getElementById('tableView').classList.remove('active');
  });
  document.getElementById('vList').addEventListener('click', function () {
    this.classList.add('active'); document.getElementById('vGrid').classList.remove('active');
    document.getElementById('gridView').style.display = 'none';
    document.getElementById('tableView').classList.add('active');
  });

  /* Modal fields */
  function getFields(p = null) {
    return `
      <div class="upload-zone"><i class="fa fa-cloud-arrow-up"></i><p>Cliquez ou glissez une image</p><small>PNG, JPG max 5MB</small></div>
      <div class="form-row">
        <div class="form-group"><label>Nom du produit</label><input type="text" value="${p ? p.name : ''}"/></div>
        <div class="form-group"><label>Catégorie</label>
          <select>${['Semences', 'Sol', 'Matériels', 'Aliments', 'Arrosage', 'Plantes'].map(c => `<option${p && p.cat === c ? ' selected' : ''}>${c}</option>`).join('')}</select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Prix (€)</label><input type="number" value="${p ? p.price : ''}"/></div>
        <div class="form-group"><label>Stock</label><input type="number" value="${p ? p.stock : ''}"/></div>
      </div>
      <div class="form-group"><label>Description</label><textarea>${p ? '' : ''}</textarea></div>
      <div class="modal-footer">
        <button class="btn-cancel" onclick="closeModal()">Annuler</button>
        <button type="button" class="modal-submit"><i class="fa fa-check"></i> ${p ? 'Enregistrer' : 'Publier'}</button>
      </div>`;
  }

  function openAdd() {
    // Clear previous form state
    if (document.getElementById('modalBodyFields')) {
        document.getElementById('modalBodyFields').innerHTML = '';
    }
    
    document.getElementById('modalTitle').textContent = 'Nouveau produit';
    document.getElementById('modalBodyFields').innerHTML = getFields();
    document.getElementById('modalOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
    
    const submitBtn = document.querySelector('.modal-submit');
    if (submitBtn) {
      submitBtn.onclick = handleAddProduct;
    }
  }

  document.getElementById('btnAdd').addEventListener('click', openAdd);

  function rebindAddCard() {
    const btn = document.getElementById('btnAddCard');
    if (btn) btn.addEventListener('click', openAdd);
  }
  rebindAddCard();

  /* Edit / Delete */
  document.addEventListener('click', e => {
    const del = e.target.closest('.prod-action-btn.del');
    const edit = e.target.closest('.prod-action-btn.edit');
    if (del && confirm('Supprimer ce produit ?')) {
      const id = parseInt(del.dataset.id);
      products.splice(products.findIndex(p => p.id === id), 1);
      current = [...products];
      renderCards(current); renderTable(current); rebindAddCard();
      showToast('Produit supprimé.');
    }
    if (edit) {
      const p = products.find(x => x.id === parseInt(edit.dataset.id));
      document.getElementById('modalTitle').textContent = 'Modifier le produit';
      document.getElementById('modalBodyFields').innerHTML = getFields(p);
      document.getElementById('modalOverlay').classList.add('show');
      document.body.style.overflow = 'hidden';
      document.querySelector('.modal-submit').addEventListener('click', function () {
        this.innerHTML = '<i class="fa fa-check"></i> Enregistré !'; this.style.background = '#2e7d32';
        setTimeout(() => { closeModal(); showToast('Produit mis à jour !'); }, 1400);
      });
    }
  });
});




// Function to handle the "Publier" button in the modal
async function handleAddProduct() {
    const form = document.getElementById('modalBodyFields');
    
    // IMPORTANT: Map your UI fields to the "ALLOWED_FIELDS" in product_service.py
    const productData = {
        titre: form.querySelector('input[type="text"]').value.trim(),      // maps to backend 'titre' 
        categorie: form.querySelector('select').value,  // maps to backend 'categorie' 
        prix: parseFloat(form.querySelectorAll('input[type="number"]')[0].value) || 0,       // maps to backend 'prix' 
        stock: parseInt(form.querySelectorAll('input[type="number"]')[1].value) || 0,      // maps to backend 'stock' 
        description: form.querySelector('textarea').value.trim(), // maps to backend 'description' 
        image_url: ""                // add if you have an image input 
    };

    try {
        const url = `${API_BASE}/products`;
        console.log('Publishing product to', url, productData);
        const response = await fetch(url, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('authToken')
            },
            body: JSON.stringify(productData)
        });

        const result = await response.json();

        if (response.ok) {
            showToast("Produit ajouté avec succès !");
            closeModal();
            location.reload(); // Refresh to show the new product from the DB
        } else {
            // Provide specific error messages based on status
            if (response.status === 401) {
                showToast("Erreur: Vous devez être connecté");
            } else if (response.status === 400) {
                showToast("Erreur: " + (result.error || "Données invalides"));
            } else {
                showToast("Erreur serveur: " + (result.error || "Inconnue"));
            }
        }
    } catch (error) {
        console.error("Fetch error:", error);
        showToast("Erreur réseau: Vérifiez votre connexion");
    }
}