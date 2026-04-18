/* commandes.js */
document.addEventListener('DOMContentLoaded', () => {

  /* Inject sidebar */
  const layout = document.getElementById('appLayout');
  layout.innerHTML = getSidebarHTML('commandes') + `
  <main class="main">
    <header class="main-header">
      <div>
        <h1 class="page-title">Mes Commandes</h1>
        <p class="page-sub">Gérez et suivez toutes vos commandes de produits.</p>
      </div>
      <div class="header-actions">
        <button class="avatar" id="profileBtn" title="Mon Profil"> </button>
      </div>
    </header>

    <!-- Summary cards -->
    <div class="summary-grid">
      <div class="summary-card">
        <div class="sc-info"><p class="sc-label">Total commandes</p><h3 class="sc-value">24</h3></div>
        <div class="sc-icon green"><i class="fa fa-bag-shopping"></i></div>
      </div>
      <div class="summary-card">
        <div class="sc-info"><p class="sc-label">En attente</p><h3 class="sc-value">5</h3></div>
        <div class="sc-icon gold"><i class="fa fa-clock"></i></div>
      </div>
      <div class="summary-card">
        <div class="sc-info"><p class="sc-label">Confirmées</p><h3 class="sc-value">17</h3></div>
        <div class="sc-icon blue"><i class="fa fa-circle-check"></i></div>
      </div>
      <div class="summary-card">
        <div class="sc-info"><p class="sc-label">Annulées</p><h3 class="sc-value">2</h3></div>
        <div class="sc-icon red"><i class="fa fa-circle-xmark"></i></div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-search">
        <i class="fa fa-search"></i>
        <input type="text" id="searchCmd" placeholder="Rechercher une commande..."/>
      </div>
    </div>

    <!-- Status tabs removed (managed by actions) -->

    <!-- Table -->
      <div class="table-card">
      <div class="table-card-header">
        <h3>Liste des commandes</h3>
      </div>
      <div class="table-wrap">
        <table class="data-table" id="cmdTable">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Fournisseur</th>
              <th>Date</th>
              <th>Montant</th>
              <th>Statut</th>
              <th style="text-align:right">Actions</th>
            </tr>
          </thead>
          <tbody id="cmdBody"></tbody>
        </table>
      </div>
      <div class="table-footer-bar">
        <span class="result-count" id="resultCount">Affichage de 6 résultats</span>
        <div class="pagination">
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">3</button>
          <button class="page-btn"><i class="fa fa-chevron-right"></i></button>
        </div>
      </div>
    </div>
  </main>`;

  initSidebar('commandes');
  initModal();

  /* Data */
  const commandes = [
    { id: 'CMD-001', name: 'Semences de blé bio', fournisseur: 'BioSemence Co.', date: '08 Mars 2024', montant: '85€', status: 'confirme' },
    { id: 'CMD-002', name: 'Engrais organique NPK', fournisseur: 'FertilAgri', date: '14 Mars 2024', montant: '120€', status: 'attente' },
    { id: 'CMD-003', name: 'Tracteur compact 50CV', fournisseur: 'EquipAgri', date: '18 Mars 2024', montant: '15000€', status: 'confirme' },
    { id: 'CMD-004', name: 'Aliment bétail haute énergie', fournisseur: 'NutriFarm', date: '22 Mars 2024', montant: '32€', status: 'attente' },
    { id: 'CMD-005', name: 'Système arrosage automatique', fournisseur: 'WaterSmart', date: '25 Mars 2024', montant: '450€', status: 'annule' },
    { id: 'CMD-006', name: 'Plants de tomates cerises', fournisseur: 'Le Jardinier Bio', date: '28 Mars 2024', montant: '12€', status: 'confirme' },
  ];

  const labelMap = { confirme: 'Confirmé', attente: 'En attente', annule: 'Annulé' };

  function renderTable(data) {
    const tbody = document.getElementById('cmdBody');
    tbody.innerHTML = data.map(c => `
      <tr data-status="${c.status}">
        <td><div class="item-with-icon">
          <div class="item-icon"><i class="fa fa-box"></i></div>
          <div><span class="bold">${c.name}</span><br><small style="color:var(--text-muted);font-size:.72rem">${c.id}</small></div>
        </div></td>
        <td class="muted">${c.fournisseur}</td>
        <td class="muted">${c.date}</td>
        <td class="amount">${c.montant}</td>
        <td><span class="badge ${c.status}">${labelMap[c.status]}</span></td>
        <td style="text-align:right">
          <div style="display:flex;gap:6px;justify-content:flex-end">
            ${c.status === 'attente' ? `
              <button class="action-btn btn-cancel" data-id="${c.id}" title="Annuler cette commande"><i class="fa fa-ban" style="color:var(--orange)"></i></button>
            ` : `
              <button class="action-btn btn-delete" data-id="${c.id}" title="Supprimer définitivement"><i class="fa fa-trash"></i></button>
            `}
          </div>
        </td>
      </tr>`).join('');
    document.getElementById('resultCount').textContent = `Affichage de ${data.length} résultats`;
  }

  renderTable(commandes);

  // Removed filter-tabs: use search + actions to manage orders

  // Row actions: cancel or delete
  document.getElementById('cmdBody').addEventListener('click', function (e) {
    const cancelBtn = e.target.closest('.btn-cancel');
    const delBtn = e.target.closest('.btn-delete');

    if (cancelBtn) {
      const id = cancelBtn.dataset.id;
      const idx = commandes.findIndex(c => c.id === id);
      if (idx !== -1 && confirm('Annuler cette commande ? (Elle sera supprimée de votre liste)')) {
        commandes.splice(idx, 1);
        renderTable(commandes);
        showToast('Commande annulée.');
      }
    }
    if (delBtn) {
      const id = delBtn.dataset.id;
      const idx = commandes.findIndex(c => c.id === id);
      if (idx !== -1 && confirm('Supprimer cette commande définitivement ?')) {
        commandes.splice(idx, 1);
        renderTable(commandes);
        showToast('Commande supprimée.');
      }
    }
  });



  /* Search */
  document.getElementById('searchCmd').addEventListener('input', function () {
    const q = this.value.toLowerCase();
    const filtered = commandes.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.fournisseur.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
    renderTable(filtered);
  });

  /* 'Ajouter' removed for agriculteur (orders are placed via product page) */
});
