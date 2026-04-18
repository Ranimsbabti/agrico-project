/* fournisseur-commandes.js */
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('appLayout');

  const orders = [
    { id: 'CMD-001', product: 'Semences de blé bio', client: 'Jean Dupont', date: '08 Mars 2024', qty: 5, amount: '425€', status: 'attente' },
    { id: 'CMD-002', product: 'Engrais organique NPK', client: 'Ferme Beaumont', date: '10 Mars 2024', qty: 10, amount: '450€', status: 'en-cours' },
    { id: 'CMD-003', product: 'Kit irrigation goutte', client: 'GAEC Les Pins', date: '12 Mars 2024', qty: 2, amount: '400€', status: 'livre' },
    { id: 'CMD-004', product: 'Aliment bétail', client: 'Coop Agricole', date: '14 Mars 2024', qty: 20, amount: '640€', status: 'attente' },
    { id: 'CMD-005', product: 'Plants tomates cerises', client: 'Marie Laurent', date: '15 Mars 2024', qty: 15, amount: '225€', status: 'en-cours' },
    { id: 'CMD-006', product: 'Tracteur compact 50CV', client: 'SCA Val Loire', date: '18 Mars 2024', qty: 1, amount: '15000€', status: 'livre' },
    { id: 'CMD-007', product: 'Semences maïs hybride', client: 'Jean Dupont', date: '20 Mars 2024', qty: 8, amount: '480€', status: 'attente' },
    { id: 'CMD-008', product: 'Système arrosage auto', client: 'Ferme du Soleil', date: '22 Mars 2024', qty: 1, amount: '450€', status: 'livre' },
  ];

  const labelMap = { attente: 'En attente', 'en-cours': 'En cours', livre: 'Livré' };

  function renderKanban(data) {
    const cols = { attente: [], 'en-cours': [], livre: [] };
    data.forEach(o => { if (cols[o.status]) cols[o.status].push(o); });

    ['attente', 'en-cours', 'livre'].forEach(s => {
      const el = document.getElementById('col-' + s);
      if (!el) return;
      document.getElementById('count-' + s).textContent = cols[s].length;
      el.innerHTML = cols[s].map(o => `
        <div class="kanban-card" data-id="${o.id}">
          <div class="kanban-card-top">
            <span class="kanban-id">${o.id}</span>
            <span class="kanban-amount">${o.amount}</span>
          </div>
          <p class="kanban-product">${o.product}</p>
          <p class="kanban-client"><i class="fa fa-user" style="font-size:.7rem"></i> ${o.client} · Qté: ${o.qty}</p>
          <div class="kanban-footer">
            <span class="kanban-date"><i class="fa fa-calendar" style="font-size:.7rem;margin-right:3px"></i>${o.date}</span>
            <div class="kanban-actions">
              ${s === 'attente' ? `
                <button class="kanban-btn accept btn-accept" data-id="${o.id}" title="Accepter"><i class="fa fa-check"></i></button>
                <button class="kanban-btn reject btn-refuse" data-id="${o.id}" title="Refuser"><i class="fa fa-xmark"></i></button>` : `
                <button class="kanban-btn btn-delete" data-id="${o.id}" title="Supprimer"><i class="fa fa-trash"></i></button>`}
            </div>
          </div>
        </div>`).join('');
    });
  }

  function renderTable(data) {
    document.getElementById('ordersBody').innerHTML = data.map(o => `
      <tr data-id="${o.id}">
        <td><div class="item-with-icon">
          <div class="item-icon gold"><i class="fa fa-box"></i></div>
          <div><span class="bold">${o.product}</span><br><small style="color:var(--text-muted);font-size:.72rem">${o.id}</small></div>
        </div></td>
        <td class="muted">${o.client}</td>
        <td class="muted">${o.date}</td>
        <td class="muted" style="text-align:center">${o.qty}</td>
        <td class="amount">${o.amount}</td>
        <td><span class="badge ${o.status}">${labelMap[o.status]}</span></td>
        <td style="text-align:right; display:flex; gap:6px; justify-content:flex-end">
          ${o.status === 'attente' ? `
            <button class="action-btn btn-accept" data-id="${o.id}" title="Accepter"><i class="fa fa-check" style="color:var(--green)"></i></button>
            <button class="action-btn btn-refuse" data-id="${o.id}" title="Refuser"><i class="fa fa-xmark" style="color:var(--red)"></i></button>
          ` : `
            <button class="action-btn btn-delete" data-id="${o.id}" title="Supprimer"><i class="fa fa-trash"></i></button>
          `}
        </td>
      </tr>`).join('');
    document.getElementById('orderCount').textContent = `${data.length} commande(s)`;
  }

  layout.innerHTML = getSidebarHTML('commandes') + `
  <main class="main">
    <header class="main-header">
      <div><h1 class="page-title">Commandes</h1><p class="page-sub">Traitez et suivez toutes les commandes de vos clients.</p></div>
      <div class="header-actions">
        <div class="view-toggle">
          <button class="view-btn active" id="vKanban" title="Kanban"><i class="fa fa-columns-3"></i></button>
          <button class="view-btn" id="vList" title="Liste"><i class="fa fa-list"></i></button>
        </div>
        <button class="avatar" id="profileBtn" title="Mon Profil"> </button>
      </div>
    </header>

    <!-- Summary -->
    <div class="summary-grid">
      <div class="summary-card"><div><p class="sc-label">Total commandes</p><h3 class="sc-value">128</h3></div><div class="sc-icon gold"><i class="fa fa-bag-shopping"></i></div></div>
      <div class="summary-card"><div><p class="sc-label">En attente</p><h3 class="sc-value">5</h3></div><div class="sc-icon orange"><i class="fa fa-clock"></i></div></div>
      <div class="summary-card"><div><p class="sc-label">En cours</p><h3 class="sc-value">8</h3></div><div class="sc-icon gold"><i class="fa fa-truck"></i></div></div>
      <div class="summary-card"><div><p class="sc-label">Livrées</p><h3 class="sc-value">115</h3></div><div class="sc-icon green"><i class="fa fa-circle-check"></i></div></div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-search"><i class="fa fa-search"></i><input type="text" id="searchOrd" placeholder="Rechercher une commande..."/></div>
      <div class="toolbar-right">
        <select class="btn-outline" id="filterOrd" style="padding:10px 14px">
          <option value="">Tous les statuts</option>
          <option value="attente">En attente</option>
          <option value="en-cours">En cours</option>
          <option value="livre">Livré</option>
        </select>
      </div>
    </div>

    <!-- Kanban view -->
    <div id="kanbanView">
      <div class="kanban-wrap">
        <div class="kanban-col">
          <div class="kanban-col-title">
            <span class="kanban-col-label attente">En attente</span>
            <span class="kanban-col-count" id="count-attente">0</span>
          </div>
          <div id="col-attente"></div>
        </div>
        <div class="kanban-col">
          <div class="kanban-col-title">
            <span class="kanban-col-label en-cours">En cours</span>
            <span class="kanban-col-count" id="count-en-cours">0</span>
          </div>
          <div id="col-en-cours"></div>
        </div>
        <div class="kanban-col">
          <div class="kanban-col-title">
            <span class="kanban-col-label livre">Livré</span>
            <span class="kanban-col-count" id="count-livre">0</span>
          </div>
          <div id="col-livre"></div>
        </div>
      </div>
    </div>

    <!-- List view -->
    <div class="list-view" id="listView">
      <div class="table-card">
        <div class="table-card-header"><h3>Liste des commandes</h3></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Produit</th><th>Client</th><th>Date</th><th style="text-align:center">Qté</th><th>Montant</th><th>Statut</th><th style="text-align:right">Action</th></tr></thead>
            <tbody id="ordersBody"></tbody>
          </table>
        </div>
        <div class="table-footer-bar">
          <span class="result-count" id="orderCount">8 commandes</span>
          <div class="pagination"><button class="page-btn active">1</button><button class="page-btn">2</button><button class="page-btn">3</button></div>
        </div>
      </div>
    </div>
  </main>`;

  initSidebar('commandes');
  initModal();
  renderKanban(orders);
  renderTable(orders);

  /* Filters */
  function applyFilters() {
    const q = document.getElementById('searchOrd').value.toLowerCase();
    const f = document.getElementById('filterOrd').value;
    const filtered = orders.filter(o =>
      (o.product.toLowerCase().includes(q) || o.client.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)) &&
      (!f || o.status === f)
    );
    renderKanban(filtered);
    renderTable(filtered);
  }
  document.getElementById('searchOrd').addEventListener('input', applyFilters);
  document.getElementById('filterOrd').addEventListener('change', applyFilters);
  // Export button removed

  /* View toggle */
  document.getElementById('vKanban').addEventListener('click', function () {
    this.classList.add('active'); document.getElementById('vList').classList.remove('active');
    document.getElementById('kanbanView').style.display = '';
    document.getElementById('listView').classList.remove('active');
  });
  document.getElementById('vList').addEventListener('click', function () {
    this.classList.add('active'); document.getElementById('vKanban').classList.remove('active');
    document.getElementById('kanbanView').style.display = 'none';
    document.getElementById('listView').classList.add('active');
  });

  /* Actions delegation */
  document.addEventListener('click', e => {
    const btnAcc = e.target.closest('.btn-accept');
    const btnRef = e.target.closest('.btn-refuse');
    const btnDel = e.target.closest('.btn-delete');

    if (btnAcc) {
      const o = orders.find(x => x.id === btnAcc.dataset.id);
      if (o) {
        o.status = 'en-cours';
        renderKanban(orders);
        renderTable(orders);
        showToast('Commande acceptée !');
      }
    }

    if (btnRef) {
      if (!confirm('Refuser cette commande ?')) return;
      const id = btnRef.dataset.id;
      const idx = orders.findIndex(x => x.id === id);
      if (idx !== -1) {
        orders.splice(idx, 1);
        renderKanban(orders);
        renderTable(orders);
        showToast('Commande refusée.', 'error');
      }
    }

    if (btnDel) {
      if (!confirm('Supprimer cette commande ?')) return;
      const id = btnDel.dataset.id;
      const idx = orders.findIndex(x => x.id === id);
      if (idx !== -1) {
        orders.splice(idx, 1);
        renderKanban(orders);
        renderTable(orders);
        showToast('Commande supprimée.');
      }
    }
  });
});
