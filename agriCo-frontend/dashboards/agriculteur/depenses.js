/* depenses.js */
document.addEventListener('DOMContentLoaded', () => {

  const layout = document.getElementById('appLayout');
  layout.innerHTML = getSidebarHTML('depenses') + `
  <main class="main">
    <header class="main-header">
      <div>
        <h1 class="page-title">Dépenses</h1>
        <p class="page-sub">Suivez et analysez toutes vos dépenses agricoles.</p>
      </div>
      <div class="header-actions">
        <button class="avatar" id="profileBtn" title="Mon Profil"> </button>
      </div>
    </header>

    <!-- Stats -->
    <div class="dep-stats">
      <div class="dep-stat-card">
        <div class="dep-stat-top">
          <div class="dep-icon green"><i class="fa fa-euro-sign"></i></div>
        </div>
        <p class="dep-label">Total dépenses</p>
        <h3 class="dep-value">4 250€</h3>
      </div>
      <div class="dep-stat-card">
        <div class="dep-stat-top">
          <div class="dep-icon blue"><i class="fa fa-chart-bar"></i></div>
        </div>
        <p class="dep-label">Ce mois</p>
        <h3 class="dep-value">1 120€</h3>
      </div>
      <div class="dep-stat-card">
        <div class="dep-stat-top">
          <div class="dep-icon gold"><i class="fa fa-clock"></i></div>
        </div>
        <p class="dep-label">En attente</p>
        <h3 class="dep-value">450€</h3>
      </div>
    </div>

    <!-- Graphs removed (évolution & répartition) -->

    <!-- Transactions -->
    <div class="tx-card">
      <div class="tx-header">
        <h3>Dernières transactions</h3>
        <div style="display:flex;gap:10px">
          <div class="toolbar-search" style="max-width:220px;background:var(--bg);border-radius:8px;padding:0 10px;display:flex;align-items:center;gap:8px">
            <i class="fa fa-search" style="color:var(--text-muted);font-size:.85rem"></i>
            <input id="searchTx" type="text" placeholder="Rechercher..." style="border:none;outline:none;background:transparent;font-family:var(--font-body);font-size:.85rem;color:var(--text);width:100%;padding:8px 0"/>
          </div>
        </div>
      </div>
      <div id="txList"></div>
    </div>
  </main>`;

  initSidebar('depenses');

  /* Charts removed (évolution & répartition) */

  /* ---- Transactions ---- */
  const transactions = [
    { icon: 'fa-box',         color: 'green', name: 'Semences de blé bio',        date: '08 Mars',  amount: -85  },
    { icon: 'fa-calendar',    color: 'blue',  name: 'Labour de précision',         date: '12 Mars',  amount: -150 },
    { icon: 'fa-box',         color: 'gold',  name: 'Engrais organique NPK',       date: '14 Mars',  amount: -120 },
    { icon: 'fa-calendar',    color: 'blue',  name: 'Irrigation goutte à goutte',  date: '15 Mars',  amount: -1200},
    { icon: 'fa-wrench',      color: 'red',   name: 'Réparation tracteur',         date: '17 Mars',  amount: -65  },
    { icon: 'fa-box',         color: 'green', name: 'Plants de tomates cerises',   date: '20 Mars',  amount: -15  },
    { icon: 'fa-calendar',    color: 'blue',  name: 'Semis drone SkyAgri',         date: '22 Mars',  amount: -250 },
    { icon: 'fa-box',         color: 'gold',  name: 'Aliment bétail NutriFarm',    date: '25 Mars',  amount: -32  },
  ];

  function renderTx(data) {
    document.getElementById('txList').innerHTML = data.map(t => `
      <div class="tx-item">
        <div class="tx-left">
          <div class="tx-icon ${t.color}"><i class="fa ${t.icon}"></i></div>
          <div>
            <div class="tx-name">${t.name}</div>
            <div class="tx-date">${t.date} 2024</div>
          </div>
        </div>
        <div class="tx-amount negative">${t.amount}€</div>
      </div>`).join('');
  }

  renderTx(transactions);

  document.getElementById('searchTx').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    renderTx(transactions.filter(t => t.name.toLowerCase().includes(q)));
  });
});
