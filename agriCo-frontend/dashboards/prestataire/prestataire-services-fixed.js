/* prestataire-services-fixed.js — Fixed version without sidebar dependencies */
console.log('✅ prestataire-services-fixed.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Page initialized');

  const layout = document.getElementById('appLayout');
  const API_BASE = 'http://127.0.0.1:5000';
  let currentServices = [];

  // Verify auth
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  const role = localStorage.getItem('userRole');

  console.log('🔐 Auth:', { token: !!token, user: !!user, role });

  if (!token || role !== 'prestataire') {
    console.error('❌ Not authenticated as prestataire');
    return;
  }

  // API helper
  async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
    return data;
  }

  // Service functions
  async function loadServices() {
    try {
      const data = await apiRequest('/services/tous_services');
      currentServices = data.map(s => ({
        id: s.id,
        name: s.titre,
        price: s.prix,
        status: s.disponibilite ? 'actif' : 'inactif',
        cat: s.categorie,
        rating: s.rating || 4.5,
        reservations: s.nbAvis || 0,
        img: s.image || 'https://via.placeholder.com/300',
        desc: s.description,
        unite: s.unite
      }));
      renderCards(currentServices);
      renderTable(currentServices);
      updateStats();
      console.log('📚 Loaded', currentServices.length, 'services');
    } catch (error) {
      console.error('Load error:', error);
    }
  }

  async function createService(serviceData) {
    try {
      const result = await apiRequest('/services', {
        method: 'POST',
        body: JSON.stringify(serviceData)
      });
      console.log('✅ Service created:', result.service_id);
      await loadServices();
      return result;
    } catch (error) {
      console.error('❌ Create error:', error);
      throw error;
    }
  }

  // Render functions
  function renderCards(data) {
    const grid = document.getElementById('cardsContainer');
    if (!grid) return;
    grid.innerHTML = data.map(s => `
      <div class="svc-card" data-id="${s.id}">
        <div class="svc-card-img"><img src="${s.img}" alt="${s.name}" loading="lazy" onError="this.src='https://via.placeholder.com/300'"/></div>
        <div class="svc-card-body">
          <div class="svc-card-top">
            <span class="badge ${s.status}">${s.status === 'actif' ? 'Actif' : 'Inactif'}</span>
            <div class="svc-card-actions">
              <button class="svc-action-btn edit" data-id="${s.id}"><i class="fa fa-pen"></i></button>
              <button class="svc-action-btn del" data-id="${s.id}"><i class="fa fa-trash"></i></button>
            </div>
          </div>
          <p class="svc-name">${s.name}</p>
          <p class="svc-desc">${s.desc}</p>
          <div class="svc-card-footer">
            <div class="svc-price">${s.price}€ <small>/ ${s.unite}</small></div>
            <div class="svc-rating"><i class="fa fa-star"></i> ${s.rating}</div>
          </div>
        </div>
      </div>`).join('') + `
      <button class="svc-add-card" id="btnAddCard"><i class="fa fa-plus"></i>Ajouter un service</button>`;
  }

  function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    tbody.innerHTML = data.map(s => `
      <tr data-id="${s.id}">
        <td><div class="item-with-icon"><div class="item-icon blue"><i class="fa fa-briefcase"></i></div><span class="bold">${s.name}</span></div></td>
        <td class="muted">${s.cat}</td>
        <td class="amount">${s.price}€/${s.unite}</td>
        <td><span class="badge ${s.status}">${s.status === 'actif' ? 'Actif' : 'Inactif'}</span></td>
        <td><span style="color:var(--gold);font-weight:700"><i class="fa fa-star"></i> ${s.rating}</span></td>
        <td class="muted">${s.reservations}</td>
        <td style="text-align:right; display:flex; gap:6px; justify-content:flex-end">
          <button class="svc-action-btn edit" data-id="${s.id}"><i class="fa fa-pen"></i></button>
          <button class="svc-action-btn del" data-id="${s.id}"><i class="fa fa-trash"></i></button>
        </td>
      </tr>`).join('');
  }

  function updateStats() {
    const active = currentServices.filter(s => s.status === 'actif').length;
    const total = currentServices.reduce((sum, s) => sum + (s.reservations || 0), 0);
    const avg = currentServices.length > 0 ? (currentServices.reduce((sum, s) => sum + (s.rating || 0), 0) / currentServices.length).toFixed(1) : 0;

    const stats = document.querySelectorAll('.mini-stat-value');
    if (stats.length >= 3) {
      stats[0].textContent = active;
      stats[1].textContent = total;
      stats[2].textContent = avg;
    }
  }

  // Modal helper
  function showToast(msg, type = 'success') {
    const div = document.createElement('div');
    div.style.cssText = `position: fixed; top: 20px; right: 20px; padding: 15px; background: ${type === 'error' ? '#f8d7da' : '#d4edda'}; color: ${type === 'error' ? '#721c24' : '#155724'}; border-radius: 4px; z-index: 9999;`;
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }

  function closeModal() {
    console.log('🔒 closeModal called');
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
      overlay.classList.remove('show');
      document.body.style.overflow = 'auto';
      console.log('✅ Modal closed');
    }
  }

  // Build page HTML
  layout.innerHTML = getSidebarHTML('services') + `
  <main class="main">
    <header class="main-header">
      <div><h1 class="page-title">Mes Services</h1><p class="page-sub">Gérez et publiez vos offres de services agricoles.</p></div>
      <div class="header-actions">
        <div class="view-toggle">
          <button class="view-btn active" id="viewGrid"><i class="fa fa-grid-2"></i></button>
          <button class="view-btn" id="viewList"><i class="fa fa-list"></i></button>
        </div>
        <button class="btn-blue" id="btnAdd"><i class="fa fa-plus"></i> Nouveau service</button>
        <button class="avatar" id="profileBtn"> </button>
      </div>
    </header>

    <div class="stats-row">
      <div class="mini-stat"><div class="mini-stat-icon blue"><i class="fa fa-briefcase"></i></div><div><p class="mini-stat-label">Services actifs</p><h3 class="mini-stat-value">0</h3></div></div>
      <div class="mini-stat"><div class="mini-stat-icon green"><i class="fa fa-calendar-check"></i></div><div><p class="mini-stat-label">Réservations totales</p><h3 class="mini-stat-value">0</h3></div></div>
      <div class="mini-stat"><div class="mini-stat-icon gold"><i class="fa fa-star"></i></div><div><p class="mini-stat-label">Note moyenne</p><h3 class="mini-stat-value">0</h3></div></div>
    </div>

    <div class="toolbar">
      <div class="toolbar-search"><i class="fa fa-search"></i><input type="text" id="searchSvc" placeholder="Rechercher un service..."/></div>
      <select class="btn-outline" id="filterStatus" style="padding:10px 14px">
        <option value="">Tous les statuts</option>
        <option value="actif">Actif</option>
        <option value="inactif">Inactif</option>
      </select>
    </div>

    <div id="cardsView"><div id="cardsContainer" class="cards-view"></div></div>

    <div class="table-view" id="tableView">
      <div class="table-card">
        <div class="table-card-header"><h3>Liste des services</h3></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Service</th><th>Catégorie</th><th>Prix</th><th>Statut</th><th>Note</th><th>Réservations</th><th style="text-align:right">Actions</th></tr></thead>
            <tbody id="tableBody"></tbody>
          </table>
        </div>
      </div>
    </div>
  </main>`;

  // Initialize sidebar and modal
  initSidebar('services');
  initModal();

  // Load data
  loadServices();

  // Modal open
  function openAddModal() {
    console.log('🎯 openAddModal called');
    
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBodyFields = document.getElementById('modalBodyFields');
    
    console.log('Modal elements:', { overlay: !!modalOverlay, title: !!modalTitle, body: !!modalBodyFields });
    
    if (!modalOverlay || !modalTitle || !modalBodyFields) {
      console.error('❌ Modal elements missing from DOM');
      return;
    }
    
    modalTitle.textContent = 'Nouveau service';
    modalBodyFields.innerHTML = `
      <div class="form-row">
        <div class="form-group"><label>Nom du service</label><input type="text" id="serviceTitre" required/></div>
        <div class="form-group"><label>Catégorie</label><select id="serviceCategorie" required><option>Sol</option><option>Arrosage</option><option>Plantation</option><option>Matériels</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Prix (€)</label><input type="number" id="servicePrix" required step="0.01"/></div>
        <div class="form-group"><label>Unité</label><select id="serviceUnite"><option>jour</option><option>heure</option><option>hectare</option></select></div>
      </div>
      <div class="form-group"><label>Description</label><textarea id="serviceDescription" required></textarea></div>
      <div class="modal-footer">
        <button class="btn-cancel" onclick="document.getElementById('modalOverlay').classList.remove('show'); document.body.style.overflow = 'auto';">Annuler</button>
        <button class="modal-submit" id="submitBtn"><i class="fa fa-check"></i> Publier</button>
      </div>`;
    
    console.log('📝 Modal content set');
    
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Modal display classes applied, show =', modalOverlay.classList.contains('show'));

    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) {
      console.error('❌ Submit button not found');
      return;
    }

    submitBtn.onclick = async function() {
      console.log('📝 Submitting service');
      this.disabled = true;
      const orig = this.innerHTML;
      this.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Publication...';

      try {
        const title = document.getElementById('serviceTitre').value.trim();
        const cat = document.getElementById('serviceCategorie').value;
        const price = parseFloat(document.getElementById('servicePrix').value);
        const desc = document.getElementById('serviceDescription').value.trim();
        const unite = document.getElementById('serviceUnite').value;

        console.log('Form data:', { title, cat, price, desc, unite });

        if (!title || !cat || isNaN(price) || !desc) {
          showToast('Veuillez remplir tous les champs', 'error');
          throw new Error('Validation failed');
        }

        await createService({
          titre: title,
          categorie: cat,
          prix: price,
          unite: unite,
          description: desc,
          disponibilite: 1,
          actif: 1,
          image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80'
        });

        showToast('✅ Service publié avec succès !');
        closeModal();
      } catch (error) {
        console.error('Submit error:', error);
        showToast(error.message || 'Erreur publication', 'error');
      } finally {
        this.disabled = false;
        this.innerHTML = orig;
      }
    };
  }

  // Event listeners
  const btnAdd = document.getElementById('btnAdd');
  
  console.log('🎲 Button elements:', { btnAdd: !!btnAdd });
  
  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      console.log('🖱️ btnAdd clicked');
      openAddModal();
    });
    console.log('✅ btnAdd listener bound');
  }
  
  // Use event delegation for dynamically created buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('#btnAddCard')) {
      console.log('🖱️ btnAddCard clicked via delegation');
      openAddModal();
    }
  });
  console.log('✅ Event delegation set up for btnAddCard');
  
  document.getElementById('viewGrid').addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('viewList').classList.remove('active');
    document.getElementById('cardsView').style.display = '';
    document.getElementById('tableView').classList.remove('active');
  });
  document.getElementById('viewList').addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('viewGrid').classList.remove('active');
    document.getElementById('cardsView').style.display = 'none';
    document.getElementById('tableView').classList.add('active');
  });
  document.getElementById('searchSvc').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    const f = currentServices.filter(s => s.name.toLowerCase().includes(q) || s.cat.toLowerCase().includes(q));
    renderCards(f);
    renderTable(f);
  });
  document.getElementById('filterStatus').addEventListener('change', function() {
    const v = this.value;
    const f = v ? currentServices.filter(s => s.status === v) : currentServices;
    renderCards(f);
    renderTable(f);
  });

  console.log('✅ All listeners bound');
});
