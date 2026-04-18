/* fournisseur-dashboard.js */
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('appLayout');

  const inventory = [
    { id:1, name:'Semences de blé bio',    cat:'Semences', stock:50,  price:'85€',    status:'en-stock' },
    { id:2, name:'Engrais NPK',            cat:'Sol',      stock:5,   price:'45€',    status:'faible'   },
    { id:3, name:'Tracteur compact 50CV',  cat:'Matériels',stock:2,   price:'15 000€',status:'en-stock' },
    { id:4, name:'Aliment bétail',         cat:'Aliments', stock:0,   price:'32€',    status:'rupture'  },
    { id:5, name:'Kit irrigation goutte',  cat:'Arrosage', stock:15,  price:'200€',   status:'en-stock' },
    { id:6, name:'Plants tomates cerises', cat:'Plantes',  stock:8,   price:'15€',    status:'faible'   },
  ];

  const labelMap = { 'en-stock':'En stock', 'faible':'Stock faible', 'rupture':'Rupture' };
  const iconMap  = { 'Semences':'fa-seedling','Sol':'fa-mountain','Matériels':'fa-tractor','Aliments':'fa-drumstick-bite','Arrosage':'fa-droplet','Plantes':'fa-leaf' };
  const colorMap = { 'en-stock':'green', 'faible':'orange', 'rupture':'red' };

  function stockBar(stock) {
    const pct = Math.min(stock, 60) / 60 * 100;
    const cls = stock > 20 ? 'high' : stock > 0 ? 'medium' : 'low';
    return `<div class="stock-bar-wrap">
      <div class="stock-bar-bg"><div class="stock-bar-fill ${cls}" style="width:${pct}%"></div></div>
      <span class="stock-num">${stock}</span>
    </div>`;
  }

  function renderRows(data) {
    document.getElementById('invBody').innerHTML = data.map(item => `
      <tr data-id="${item.id}">
        <td><div class="item-with-icon">
          <div class="item-icon ${colorMap[item.status]}"><i class="fa ${iconMap[item.cat] || 'fa-box'}"></i></div>
          <span class="bold">${item.name}</span>
        </div></td>
        <td class="muted">${item.cat}</td>
        <td>${stockBar(item.stock)}</td>
        <td class="amount">${item.price}</td>
        <td><span class="badge ${item.status}">${labelMap[item.status]}</span></td>
        <td style="text-align:right"><button class="action-btn"><i class="fa fa-ellipsis-vertical"></i></button></td>
      </tr>`).join('');
  }

  layout.innerHTML = getSidebarHTML('dashboard') + `
  <main class="main">
    <header class="main-header">
      <div>
        <h1 class="page-title">Espace Fournisseur</h1>
        <p class="page-sub">Gérez votre catalogue et suivez vos ventes.</p>
      </div>
      <div class="header-actions">
        <button class="icon-btn" title="Notifications"><i class="fa fa-bell"></i><span class="notif-dot"></span></button>
        <button class="btn-gold" id="btnPublish"><i class="fa fa-plus"></i> Publier un produit</button>
        <button class="avatar" id="profileBtn" title="Mon Profil"> </button>
      </div>
    </header>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-info"><p class="stat-label">Total Produits</p><h3 class="stat-value">42</h3></div>
        <div class="stat-icon-box blue"><i class="fa fa-box-open"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info"><p class="stat-label">Commandes du jour</p><h3 class="stat-value">18</h3></div>
        <div class="stat-icon-box green"><i class="fa fa-bag-shopping"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info"><p class="stat-label">Revenus</p><h3 class="stat-value">12 450€</h3></div>
        <div class="stat-icon-box gold"><i class="fa fa-euro-sign"></i></div>
      </div>
      <div class="stat-card alert-card">
        <div class="stat-info"><p class="stat-label alert">Stock Faible</p><h3 class="stat-value alert">4 alertes</h3></div>
        <div class="stat-icon-box red"><i class="fa fa-triangle-exclamation"></i></div>
      </div>
    </div>

    <!-- Inventory -->
    <div class="inv-card">
      <div class="inv-header">
        <h3>Inventaire des produits</h3>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <div class="inv-search"><i class="fa fa-search"></i><input type="text" id="invSearch" placeholder="Rechercher..."/></div>
          <select class="btn-outline" id="statusFilter" style="padding:9px 14px"><option value="">Tous les statuts</option><option value="en-stock">En stock</option><option value="faible">Stock faible</option><option value="rupture">Rupture</option></select>
          <!-- export button removed -->
        </div>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Produit</th><th>Catégorie</th><th>Stock</th><th>Prix</th><th>Statut</th><th style="text-align:right">Action</th></tr></thead>
          <tbody id="invBody"></tbody>
        </table>
      </div>
      <div class="table-footer-bar">
        <span class="result-count" id="invCount">6 produits</span>
        <a href="fournisseur-produits.html" style="font-size:.82rem;font-weight:700;color:var(--gold);display:flex;align-items:center;gap:5px">Voir tout <i class="fa fa-arrow-right"></i></a>
      </div>
    </div>

    <!-- Alert banner -->
    <div class="alert-banner">
      <div class="alert-banner-left">
        <div class="alert-banner-icon"><i class="fa fa-bag-shopping"></i></div>
        <div>
          <div class="alert-banner-title">Nouvelles commandes</div>
          <div class="alert-banner-sub">Vous avez 5 nouvelles commandes à traiter aujourd'hui.</div>
        </div>
      </div>
      <button class="alert-banner-btn" onclick="window.location.href='fournisseur-commandes.html'">
        Voir les commandes <i class="fa fa-arrow-up-right-from-square"></i>
      </button>
    </div>
  </main>`;

  initSidebar('dashboard');
  initModal();
  renderRows(inventory);

  /* Filters */
  document.getElementById('invSearch').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    const f = document.getElementById('statusFilter').value;
    renderRows(inventory.filter(i =>
      (i.name.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q)) &&
      (!f || i.status === f)
    ));
  });
  document.getElementById('statusFilter').addEventListener('change', function() {
    const q = document.getElementById('invSearch').value.toLowerCase();
    renderRows(inventory.filter(i => i.name.toLowerCase().includes(q) && (!this.value || i.status === this.value)));
  });

  // Export button removed

  /* Modal produit */
  function getProductFields() {
    return `
      <div class="upload-zone"><i class="fa fa-cloud-arrow-up"></i><p>Cliquez ou glissez une image</p><small>PNG, JPG max 5MB</small></div>
      <div class="form-row">
        <div class="form-group"><label>Nom du produit</label><input type="text" placeholder="Ex: Semences de blé bio"/></div>
        <div class="form-group"><label>Catégorie</label>
          <select><option>Semences</option><option>Sol</option><option>Matériels</option><option>Aliments</option><option>Arrosage</option><option>Plantes</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Prix (€)</label><input type="number" placeholder="0.00"/></div>
        <div class="form-group"><label>Stock initial</label><input type="number" placeholder="0"/></div>
      </div>
      <div class="form-group"><label>Description</label><textarea placeholder="Décrivez votre produit..."></textarea></div>
      <div class="modal-footer">
        <button class="btn-cancel" onclick="closeModal()">Annuler</button>
        <button class="modal-submit"><i class="fa fa-check"></i> Publier</button>
      </div>`;
  }

  document.getElementById('btnPublish').addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Publier un produit';
    document.getElementById('modalBodyFields').innerHTML = getProductFields();
    document.getElementById('modalOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
    document.querySelector('.modal-submit').addEventListener('click', function() {
      this.innerHTML = '<i class="fa fa-check"></i> Publié !'; this.style.background = '#2e7d32';
      setTimeout(() => { closeModal(); showToast('Produit publié avec succès !'); }, 1400);
    });
  });
});
