/* fournisseur-revenus.js */
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('appLayout');

  const topProducts = [
    { rank:1, name:'Tracteur compact 50CV',   cat:'Matériels', amount:'45 000€', pct:100 },
    { rank:2, name:'Kit irrigation goutte',   cat:'Arrosage',  amount:'12 400€', pct:28  },
    { rank:3, name:'Semences de blé bio',     cat:'Semences',  amount:'8 500€',  pct:19  },
    { rank:4, name:'Engrais organique NPK',   cat:'Sol',       amount:'5 200€',  pct:12  },
    { rank:5, name:'Aliment bétail',          cat:'Aliments',  amount:'3 840€',  pct:9   },
  ];

  const transactions = [
    { ico:'fa-bag-shopping', color:'gold',  name:'CMD-008 · Ferme du Soleil',   date:'22 Mars 2024', amount:'+450€',   type:'ok'  },
    { ico:'fa-bag-shopping', color:'gold',  name:'CMD-007 · Jean Dupont',       date:'20 Mars 2024', amount:'+480€',   type:'ok'  },
    { ico:'fa-truck',        color:'green', name:'CMD-006 · SCA Val Loire',     date:'18 Mars 2024', amount:'+15 000€',type:'ok'  },
    { ico:'fa-clock',        color:'orange',name:'CMD-004 · Coop Agricole',     date:'14 Mars 2024', amount:'+640€',   type:'pnd' },
    { ico:'fa-bag-shopping', color:'gold',  name:'CMD-003 · GAEC Les Pins',     date:'12 Mars 2024', amount:'+400€',   type:'ok'  },
    { ico:'fa-clock',        color:'orange',name:'CMD-001 · Jean Dupont',       date:'08 Mars 2024', amount:'+425€',   type:'pnd' },
  ];

  const chartData = {
    semaine: { labels:['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'], values:[820,1500,980,2200,1800,3100,2750] },
    mois:    { labels:['S1','S2','S3','S4'], values:[5400,8200,6100,9800] },
    annee:   { labels:['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'], values:[8200,9100,7600,11400,12900,10600,13200,12000,11800,13100,10900,12450] },
  };

  const donutCats = [
    { name:'Matériels',  pct:42, color:'#c8940e' },
    { name:'Arrosage',   pct:24, color:'#58748c' },
    { name:'Semences',   pct:18, color:'#4a6741' },
    { name:'Aliments',   pct:10, color:'#f57c00' },
    { name:'Autres',     pct:6,  color:'#94a3b8' },
  ];

  const rankColors = ['gold','silver','bronze','silver','silver'];

  layout.innerHTML = getSidebarHTML('revenus') + `
  <main class="main">
    <header class="main-header">
      <div><h1 class="page-title">Revenus</h1><p class="page-sub">Analysez vos performances financières et vos ventes.</p></div>
      <div class="header-actions">
        <button class="avatar" id="profileBtn" title="Mon Profil"> </button>
      </div>
    </header>

    <!-- Stats -->
    <div class="rev-stats">
      <div class="rev-stat">
        <div class="rev-stat-top"><div class="rev-icon gold"><i class="fa fa-euro-sign"></i></div></div>
        <p class="rev-label">Revenus totaux</p><h3 class="rev-value">124 500€</h3>
      </div>
      <div class="rev-stat">
        <div class="rev-stat-top"><div class="rev-icon green"><i class="fa fa-chart-bar"></i></div></div>
        <p class="rev-label">Ce mois</p><h3 class="rev-value">12 450€</h3>
      </div>
      <div class="rev-stat">
        <div class="rev-stat-top"><div class="rev-icon blue"><i class="fa fa-bag-shopping"></i></div></div>
        <p class="rev-label">Commandes livrées</p><h3 class="rev-value">115</h3>
      </div>
      <div class="rev-stat">
        <div class="rev-stat-top"><div class="rev-icon orange"><i class="fa fa-clock"></i></div></div>
        <p class="rev-label">En attente</p><h3 class="rev-value">3 240€</h3>
      </div>
    </div>

    <!-- Graphs removed (évolution & répartition) -->

    <!-- Top products -->
    <div class="top-products">
      <div class="top-products-header"><h3>Top produits</h3><span style="font-size:.8rem;color:var(--text-muted)">Par chiffre d'affaires</span></div>
      ${topProducts.map((p,i) => `
        <div class="top-row">
          <div class="top-rank ${rankColors[i]}">${p.rank}</div>
          <div style="flex:1"><div class="top-name">${p.name}</div><div class="top-cat">${p.cat}</div></div>
          <div class="top-bar-wrap"><div class="top-bar-bg"><div class="top-bar-fill" style="width:${p.pct}%"></div></div></div>
          <div class="top-amount">${p.amount}</div>
        </div>`).join('')}
    </div>

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

  /* Transactions */
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
    renderTx(transactions.filter(t => t.name.toLowerCase().includes(this.value.toLowerCase())));
  });

  // Export button removed
});
