/* reservations.js */
document.addEventListener('DOMContentLoaded', () => {

  const layout = document.getElementById('appLayout');
  layout.innerHTML = getSidebarHTML('reservations') + `
  <main class="main">
    <header class="main-header">
      <div>
        <h1 class="page-title">Mes Réservations</h1>
        <p class="page-sub">Gérez vos réservations de services agricoles.</p>
      </div>
      <div class="header-actions">
        <div class="view-toggle">
          <button class="view-btn active" id="viewList" title="Liste"><i class="fa fa-list"></i></button>
        </div>
        <button class="avatar" id="profileBtn" title="Mon Profil"> </button>
      </div>
    </header>

    <!-- Summary -->
    <div class="summary-grid">
      <div class="summary-card">
        <div><p class="sc-label">Total</p><h3 class="sc-value">8</h3></div>
        <div class="sc-icon green"><i class="fa fa-calendar-check"></i></div>
      </div>
      <div class="summary-card">
        <div><p class="sc-label">Confirmées</p><h3 class="sc-value">5</h3></div>
        <div class="sc-icon blue"><i class="fa fa-circle-check"></i></div>
      </div>
      <div class="summary-card">
        <div><p class="sc-label">En attente</p><h3 class="sc-value">2</h3></div>
        <div class="sc-icon gold"><i class="fa fa-clock"></i></div>
      </div>
      <div class="summary-card">
        <div><p class="sc-label">Refusées</p><h3 class="sc-value">1</h3></div>
        <div class="sc-icon red"><i class="fa fa-circle-xmark"></i></div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-search">
        <i class="fa fa-search"></i>
        <input type="text" id="searchRes" placeholder="Rechercher une réservation..."/>
      </div>
    </div>

    <!-- Status tabs removed (use actions + search) -->

    <!-- LIST VIEW -->
    <div class="table-card active" id="listView">
      <div class="table-card-header">
        <h3>Liste des réservations</h3>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>Service</th><th>Prestataire</th><th>Date</th><th>Durée</th><th>Montant</th><th>Statut</th><th style="text-align:right">Actions</th>
          </tr></thead>
          <tbody id="resBody"></tbody>
        </table>
      </div>
      <div class="table-footer-bar">
        <span class="result-count" id="resCount">8 réservations</span>
        <div class="pagination">
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
        </div>
      </div>
    </div>

    <!-- CALENDAR VIEW -->
    <div class="calendar-wrap" id="calView">
      <div class="cal-header">
        <h3 class="page-title" id="calMonthLabel" style="font-size:1.2rem"></h3>
        <div class="cal-nav">
          <button class="cal-today-btn" id="calToday">Aujourd'hui</button>
          <button class="cal-nav-btn" id="calPrev"><i class="fa fa-chevron-left"></i></button>
          <button class="cal-nav-btn" id="calNext"><i class="fa fa-chevron-right"></i></button>
        </div>
      </div>
      <div class="cal-grid" id="calGrid"></div>
    </div>
  </main>`;

  initSidebar('reservations');
  initModal();

  /* ---- Data ---- */
  const reservations = [
    { id: 'RES-001', service: 'Labour de précision', prestataire: 'Jean D.', date: '12 Mars 2024', duree: '1 jour', montant: '150€', status: 'confirme', day: 12 },
    { id: 'RES-002', service: 'Installation irrigation', prestataire: 'AgriTech', date: '15 Mars 2024', duree: '3 jours', montant: '1200€', status: 'attente', day: 15 },
    { id: 'RES-003', service: 'Taille de vergers', prestataire: 'Marc L.', date: '10 Mars 2024', duree: '2 jours', montant: '90€', status: 'refuse', day: 10 },
    { id: 'RES-004', service: 'Semis drone', prestataire: 'SkyAgri', date: '20 Mars 2024', duree: '1 jour', montant: '250€', status: 'confirme', day: 20 },
    { id: 'RES-005', service: 'Analyse de sol', prestataire: 'BioLab', date: '18 Mars 2024', duree: '1/2 jour', montant: '85€', status: 'confirme', day: 18 },
    { id: 'RES-006', service: 'Réparation tracteur', prestataire: 'MécAgri', date: '22 Mars 2024', duree: '1 jour', montant: '65€', status: 'attente', day: 22 },
    { id: 'RES-007', service: 'Drone surveillance cultures', prestataire: 'SkyAgri', date: '25 Mars 2024', duree: '1 jour', montant: '250€', status: 'confirme', day: 25 },
    { id: 'RES-008', service: 'Taille haies', prestataire: 'Jardinage Pro', date: '28 Mars 2024', duree: '1 jour', montant: '80€', status: 'confirme', day: 28 },
  ];

  const labelMap = { confirme: 'Confirmé', attente: 'En attente', refuse: 'Refusé' };

  function renderList(data) {
    document.getElementById('resBody').innerHTML = data.map(r => `
      <tr>
        <td><div class="item-with-icon">
          <div class="item-icon"><i class="fa fa-calendar-days"></i></div>
          <div><span class="bold">${r.service}</span><br><small style="color:var(--text-muted);font-size:.72rem">${r.id}</small></div>
        </div></td>
        <td class="muted">${r.prestataire}</td>
        <td class="muted">${r.date}</td>
        <td class="muted">${r.duree}</td>
        <td class="amount">${r.montant}</td>
        <td><span class="badge ${r.status}">${labelMap[r.status]}</span></td>
        <td style="text-align:right">
          <div style="display:flex;gap:6px;justify-content:flex-end">
            ${r.status === 'attente' ? `
              <button class="action-btn btn-cancel" data-id="${r.id}" title="Annuler cette réservation"><i class="fa fa-ban" style="color:var(--orange)"></i></button>
            ` : `
              <button class="action-btn btn-delete" data-id="${r.id}" title="Supprimer définitivement"><i class="fa fa-trash"></i></button>
            `}
          </div>
        </td>
      </tr>`).join('');
    document.getElementById('resCount').textContent = `${data.length} réservation(s)`;
  }

  renderList(reservations);

  // Removed filter-tabs: use search + actions to manage reservations

  // Row actions: cancel or delete
  document.getElementById('resBody').addEventListener('click', function (e) {
    const cancelBtn = e.target.closest('.btn-cancel');
    const delBtn = e.target.closest('.btn-delete');

    if (cancelBtn) {
      const id = cancelBtn.dataset.id;
      const idx = reservations.findIndex(r => r.id === id);
      if (idx !== -1 && confirm('Annuler cette réservation ? (Elle sera supprimée de votre liste)')) {
        reservations.splice(idx, 1);
        renderList(reservations);
        showToast('Réservation annulée.');
      }
    }
    if (delBtn) {
      const id = delBtn.dataset.id;
      const idx = reservations.findIndex(r => r.id === id);
      if (idx !== -1 && confirm('Supprimer cette réservation définitivement ?')) {
        reservations.splice(idx, 1);
        renderList(reservations);
        showToast('Réservation supprimée.');
      }
    }
  });



  /* Search */
  document.getElementById('searchRes').addEventListener('input', function () {
    const q = this.value.toLowerCase();
    renderList(reservations.filter(r => r.service.toLowerCase().includes(q) || r.prestataire.toLowerCase().includes(q)));
  });

  /* View toggle */
  const listView = document.getElementById('listView');
  const calView = document.getElementById('calView');
  document.getElementById('viewList').addEventListener('click', function () {
    this.classList.add('active');
    listView.style.display = 'block';
    calView.style.display = 'none';
  });
  // viewCal removed — calendar toggle disabled

  /* Calendar */
  let calYear = 2024, calMonth = 2; // March 2024
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  function renderCalendar() {
    const label = document.getElementById('calMonthLabel');
    label.textContent = monthNames[calMonth] + ' ' + calYear;
    const grid = document.getElementById('calGrid');
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    let html = days.map(d => `<div class="cal-day-header">${d}</div>`).join('');
    const first = new Date(calYear, calMonth, 1);
    const startDow = (first.getDay() + 6) % 7; // Monday-based
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === calYear && today.getMonth() === calMonth;

    // Leading blanks
    for (let i = 0; i < startDow; i++) {
      html += `<div class="cal-cell other-month"><div class="cal-num other"></div></div>`;
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = isCurrentMonth && today.getDate() === d;
      const evts = reservations.filter(r => r.day === d);
      html += `<div class="cal-cell">
        <div class="cal-num ${isToday ? 'today' : ''}">${d}</div>
        ${evts.map((e, i) => `<div class="cal-event ${i % 3 === 0 ? 'green' : i % 3 === 1 ? 'blue' : 'gold'}">${e.service}</div>`).join('')}
      </div>`;
    }
    grid.innerHTML = html;
  }

  document.getElementById('calPrev').addEventListener('click', () => { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar(); });
  document.getElementById('calNext').addEventListener('click', () => { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar(); });
  document.getElementById('calToday').addEventListener('click', () => { const n = new Date(); calYear = n.getFullYear(); calMonth = n.getMonth(); renderCalendar(); });

  /* 'Réserver' button removed for agriculteur (use services page) */
});
