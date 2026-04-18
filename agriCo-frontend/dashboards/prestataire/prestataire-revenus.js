/* prestataire-revenus.js */
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('appLayout');

  const transactions = [
    { ico:'fa-calendar', color:'blue',  name:'Labour de précision — Ferme du Soleil',   date:'12 Mars 2024', amount:'+150€',  type:'positive' },
    { ico:'fa-calendar', color:'blue',  name:'Installation irrigation — GAEC Les Plaines',date:'15 Mars 2024',amount:'+1200€', type:'positive' },
    { ico:'fa-calendar', color:'green', name:'Taille de vergers — Ferme Beaumont',       date:'18 Mars 2024', amount:'+90€',   type:'positive' },
    { ico:'fa-clock',    color:'gold',  name:'Analyse de sol — Coop Agricole 34',        date:'22 Mars 2024', amount:'+85€',   type:'pending'  },
    { ico:'fa-calendar', color:'blue',  name:'Semis drone — SCA Val de Loire',           date:'20 Mars 2024', amount:'+250€',  type:'positive' },
    { ico:'fa-calendar', color:'green', name:'Conseil sol — Jean Martin',                date:'10 Mars 2024', amount:'+80€',   type:'positive' },
    { ico:'fa-clock',    color:'gold',  name:'Labour — Ferme Nord',                      date:'25 Mars 2024', amount:'+150€',  type:'pending'  },
    { ico:'fa-calendar', color:'blue',  name:'Irrigation — Domaine des Pins',            date:'28 Mars 2024', amount:'+600€',  type:'positive' },
  ];

  layout.innerHTML = getSidebarHTML('revenus') + `
  <main class="main">
    <header class="main-header">
      <div><h1 class="page-title">Revenus</h1><p class="page-sub">Analysez vos revenus et vos performances financières.</p></div>
      <div class="header-actions">
        <button class="avatar" id="profileBtn" title="Mon Profil"> </button>
      </div>
    </header>

    <!-- Stats -->
    <div class="rev-stats">
      <div class="rev-stat">
        <div class="rev-stat-top">
          <div class="rev-icon blue"><i class="fa fa-euro-sign"></i></div>
        </div>
        <p class="rev-label">Revenus totaux</p>
        <h3 class="rev-value">23 840€</h3>
      </div>
      <div class="rev-stat">
        <div class="rev-stat-top">
          <div class="rev-icon green"><i class="fa fa-chart-bar"></i></div>
        </div>
        <p class="rev-label">Ce mois</p>
        <h3 class="rev-value">3 840€</h3>
      </div>
      <div class="rev-stat">
        <div class="rev-stat-top">
          <div class="rev-icon gold"><i class="fa fa-clock"></i></div>
        </div>
        <p class="rev-label">En attente</p>
        <h3 class="rev-value">1 235€</h3>
      </div>
    </div>

    <!-- Graphs removed (évolution & répartition) -->

    <!-- Transactions -->
    <div class="tx-card">
      <div class="tx-header">
        <h3>Dernières transactions</h3>
        <div style="position:relative;display:flex;align-items:center;background:var(--bg);border-radius:8px;padding:0 12px;gap:8px">
          <i class="fa fa-search" style="color:var(--text-muted);font-size:.85rem"></i>
          <input id="searchTx" type="text" placeholder="Rechercher..." style="border:none;outline:none;background:transparent;font-family:var(--font-body);font-size:.85rem;color:var(--text);padding:9px 0;width:180px"/>
        </div>
      </div>
      <div id="txList"></div>
    </div>
  </main>`;

  initSidebar('revenus');

  /* Charts removed (évolution & répartition) */

  /* ---- Transactions ---- */
  function renderTx(data) {
    document.getElementById('txList').innerHTML = data.map(t => `
      <div class="tx-item">
        <div class="tx-left">
          <div class="tx-ico ${t.color}"><i class="fa ${t.ico}"></i></div>
          <div><div class="tx-name">${t.name}</div><div class="tx-date">${t.date}</div></div>
        </div>
        <div class="tx-amount ${t.type}">${t.amount}</div>
      </div>`).join('');
  }

  renderTx(transactions);

  document.getElementById('searchTx').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    renderTx(transactions.filter(t => t.name.toLowerCase().includes(q)));
  });

  // Export button removed
});
