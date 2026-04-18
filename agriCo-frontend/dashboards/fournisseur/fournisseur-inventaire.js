/* fournisseur-inventaire.js */
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('appLayout');

  const stock = [
    { id:1, name:'Semences de blé bio',    cat:'Semences', qty:50,  seuil:10, prix:'85€',    status:'en-stock' },
    { id:2, name:'Engrais organique NPK',  cat:'Sol',      qty:5,   seuil:15, prix:'45€',    status:'faible'   },
    { id:3, name:'Tracteur compact 50CV',  cat:'Matériels',qty:2,   seuil:1,  prix:'15000€', status:'en-stock' },
    { id:4, name:'Aliment bétail',         cat:'Aliments', qty:0,   seuil:20, prix:'32€',    status:'rupture'  },
    { id:5, name:'Kit irrigation goutte',  cat:'Arrosage', qty:15,  seuil:5,  prix:'200€',   status:'en-stock' },
    { id:6, name:'Plants tomates cerises', cat:'Plantes',  qty:8,   seuil:20, prix:'15€',    status:'faible'   },
    { id:7, name:'Semences maïs hybride',  cat:'Semences', qty:30,  seuil:10, prix:'60€',    status:'en-stock' },
    { id:8, name:'Système arrosage auto',  cat:'Arrosage', qty:0,   seuil:3,  prix:'450€',   status:'rupture'  },
  ];

  const alertsFaible  = stock.filter(s => s.status === 'faible');
  const alertsRupture = stock.filter(s => s.status === 'rupture');
  const labelMap = { 'en-stock':'En stock','faible':'Stock faible','rupture':'Rupture' };
  const colorMap = { 'en-stock':'green','faible':'orange','red':'red' };

  function stockClass(qty, seuil) {
    if (qty === 0) return 'low';
    if (qty <= seuil) return 'medium';
    return 'high';
  }

  function renderTable(data) {
    document.getElementById('stockBody').innerHTML = data.map(s => {
      const pct  = Math.min(s.qty / Math.max(s.seuil * 3, 60) * 100, 100);
      const cls  = stockClass(s.qty, s.seuil);
      return `
      <tr data-id="${s.id}">
        <td><div class="item-with-icon">
          <div class="item-icon ${cls==='high'?'gold':cls==='medium'?'orange':'red'}"><i class="fa fa-box"></i></div>
          <div><span class="bold">${s.name}</span><br><small style="color:var(--text-muted);font-size:.72rem">ID-${String(s.id).padStart(3,'0')}</small></div>
        </div></td>
        <td class="muted">${s.cat}</td>
        <td>
          <div class="progress-bar-wrap">
            <div class="progress-bg"><div class="progress-fill ${cls}" style="width:${pct}%"></div></div>
            <span class="progress-num">${s.qty} u.</span>
          </div>
        </td>
        <td class="muted">${s.seuil} u.</td>
        <td class="amount">${s.prix}</td>
        <td><span class="badge ${s.status}">${labelMap[s.status]}</span></td>
        <td style="text-align:right"><button class="stock-edit-btn update-btn" data-id="${s.id}"><i class="fa fa-pen"></i> Modifier</button></td>
      </tr>`;
    }).join('');
    document.getElementById('stockCount').textContent = `${data.length} produit(s)`;
  }

  layout.innerHTML = getSidebarHTML('inventaire') + `
  <main class="main">
    <header class="main-header">
      <div><h1 class="page-title">Inventaire</h1><p class="page-sub">Gérez vos niveaux de stock et recevez des alertes automatiques.</p></div>
      <div class="header-actions">
        <button class="avatar" id="profileBtn" title="Mon Profil"> </button>
      </div>
    </header>

    <!-- Alert cards -->
    <div class="alert-grid">
      <div class="alert-card">
        <div class="ac-icon blue"><i class="fa fa-box-open"></i></div>
        <div><p class="ac-label">Total produits</p><h3 class="ac-value">42</h3></div>
      </div>
      <div class="alert-card">
        <div class="ac-icon gold"><i class="fa fa-circle-check"></i></div>
        <div><p class="ac-label">En stock</p><h3 class="ac-value">36</h3></div>
      </div>
      <div class="alert-card warn">
        <div class="ac-icon orange"><i class="fa fa-triangle-exclamation"></i></div>
        <div><p class="ac-label">Stock faible</p><h3 class="ac-value">${alertsFaible.length}</h3></div>
      </div>
      <div class="alert-card crit">
        <div class="ac-icon red"><i class="fa fa-ban"></i></div>
        <div><p class="ac-label">Rupture</p><h3 class="ac-value">${alertsRupture.length}</h3></div>
      </div>
    </div>

    <!-- Layout: chart + alerts -->
    <div class="inv-layout">
      <!-- Graph removed (répartition du stock) -->

      <!-- Alerts panel -->
      <div class="alerts-panel">
        <div class="panel-card">
          <div class="panel-header">
            <h3>Stock faible <span class="alert-badge-count orange">${alertsFaible.length}</span></h3>
          </div>
          ${alertsFaible.map(s => `
            <div class="alert-item">
              <div class="alert-item-icon orange"><i class="fa fa-triangle-exclamation"></i></div>
              <div><div class="alert-item-name">${s.name}</div><div class="alert-item-info">${s.qty} u. restantes · Seuil: ${s.seuil}</div></div>
              <button class="restock-btn orange restock" data-id="${s.id}" data-name="${s.name}">Réappro.</button>
            </div>`).join('')}
        </div>
        <div class="panel-card">
          <div class="panel-header">
            <h3>Rupture de stock <span class="alert-badge-count red">${alertsRupture.length}</span></h3>
          </div>
          ${alertsRupture.map(s => `
            <div class="alert-item">
              <div class="alert-item-icon red"><i class="fa fa-ban"></i></div>
              <div><div class="alert-item-name">${s.name}</div><div class="alert-item-info">0 unité en stock · Urgence</div></div>
              <button class="restock-btn red restock" data-id="${s.id}" data-name="${s.name}">Réappro.</button>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Full inventory table -->
    <div class="inv-table-card">
      <div class="inv-table-header">
        <h3>Stock complet</h3>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
          <div class="toolbar-search" style="max-width:220px;background:var(--bg);border-radius:8px;padding:0 12px;display:flex;align-items:center;gap:8px">
            <i class="fa fa-search" style="color:var(--text-muted);font-size:.85rem"></i>
            <input id="searchStock" type="text" placeholder="Rechercher..." style="border:none;outline:none;background:transparent;font-family:var(--font-body);font-size:.85rem;padding:9px 0;width:140px;color:var(--text)"/>
          </div>
          <select class="btn-outline" id="filterStock" style="padding:9px 14px">
            <option value="">Tous les statuts</option>
            <option value="en-stock">En stock</option>
            <option value="faible">Stock faible</option>
            <option value="rupture">Rupture</option>
          </select>
        </div>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Produit</th><th>Catégorie</th><th>Quantité</th><th>Seuil d'alerte</th><th>Prix</th><th>Statut</th><th style="text-align:right">Action</th></tr></thead>
          <tbody id="stockBody"></tbody>
        </table>
      </div>
      <div class="table-footer-bar">
        <span class="result-count" id="stockCount">8 produits</span>
        <div class="pagination"><button class="page-btn active">1</button><button class="page-btn">2</button></div>
      </div>
    </div>
  </main>`;

  initSidebar('inventaire');
  initModal();
  renderTable(stock);

  /* Chart removed (répartition du stock) */

  /* Filters */
  function applyFilters() {
    const q = document.getElementById('searchStock').value.toLowerCase();
    const f = document.getElementById('filterStock').value;
    renderTable(stock.filter(s => (s.name.toLowerCase().includes(q) || s.cat.toLowerCase().includes(q)) && (!f || s.status === f)));
  }
  document.getElementById('searchStock').addEventListener('input', applyFilters);
  document.getElementById('filterStock').addEventListener('change', applyFilters);

  // Export button removed

  /* Update stock modal */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.update-btn, .restock');
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    const item = stock.find(s => s.id === id);
    if (!item) return;

    document.getElementById('modalTitle').textContent = 'Modifier le stock — ' + item.name;
    document.getElementById('modalBodyFields').innerHTML = `
      <div class="form-group"><label>Produit</label><input value="${item.name}" readonly/></div>
      <div class="form-row">
        <div class="form-group"><label>Quantité actuelle</label><input type="number" id="newQty" value="${item.qty}" min="0"/></div>
        <div class="form-group"><label>Seuil d'alerte</label><input type="number" id="newSeuil" value="${item.seuil}" min="0"/></div>
      </div>
      <div class="form-group"><label>Raison de la mise à jour</label>
        <select><option>Réapprovisionnement</option><option>Vente</option><option>Correction manuelle</option><option>Retour client</option></select>
      </div>
      <div class="form-group"><label>Notes (optionnel)</label><textarea placeholder="Ex: Livraison fournisseur du 15 Mars..."></textarea></div>
      <div class="modal-footer">
        <button class="btn-cancel" onclick="closeModal()">Annuler</button>
        <button class="modal-submit" id="confirmUpdate"><i class="fa fa-check"></i> Mettre à jour</button>
      </div>`;
    document.getElementById('modalOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';

    document.getElementById('confirmUpdate').addEventListener('click', function() {
      const newQty = parseInt(document.getElementById('newQty').value) || 0;
      const newSeuil = parseInt(document.getElementById('newSeuil').value) || item.seuil;
      item.qty = newQty;
      item.seuil = newSeuil;
      item.status = newQty === 0 ? 'rupture' : newQty <= newSeuil ? 'faible' : 'en-stock';
      this.innerHTML = '<i class="fa fa-check"></i> Mis à jour !'; this.style.background = '#2e7d32';
      setTimeout(() => { closeModal(); renderTable(stock); showToast('Stock mis à jour !'); }, 1400);
    });
  });
});
