/* prestataire-dashboard.js */
document.addEventListener('DOMContentLoaded', () => {

  const layout = document.getElementById('appLayout');
  const API_BASE = 'http://127.0.0.1:5000';

  async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Utilisateur non authentifié');
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      ...options
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  }

  async function createService(serviceData) {
    return apiRequest('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData)
    });
  }

  const services = [
    { id:1, name:'Labour de précision',       price:150,  status:'actif',   icon:'fa-tractor' },
    { id:2, name:'Installation Irrigation',   price:1200, status:'actif',   icon:'fa-droplet' },
    { id:3, name:'Taille de vergers',          price:45,   status:'inactif', icon:'fa-scissors' },
  ];

  function serviceCardsHTML() {
    return services.map(s => `
      <div class="service-card">
        <div class="service-card-top">
          <span class="badge ${s.status}">${s.status === 'actif' ? 'Actif' : 'Inactif'}</span>
          <div class="service-card-actions">
            <button class="svc-action-btn del" title="Supprimer" data-id="${s.id}"><i class="fa fa-trash"></i></button>
          </div>
        </div>
        <p class="service-name">${s.name}</p>
        <div class="service-price">${s.price}€ <small>/ jour</small></div>
      </div>`).join('');
  }

  layout.innerHTML = getSidebarHTML('dashboard') + `
  <main class="main">
    <header class="main-header">
      <div>
        <h1 class="page-title">Espace Prestataire</h1>
        <p class="page-sub">Gérez vos services et vos réservations en temps réel.</p>
      </div>
      <div class="header-actions">
        <button class="icon-btn" title="Notifications"><i class="fa fa-bell"></i><span class="notif-dot"></span></button>
        <button class="btn-blue" id="btnAddService"><i class="fa fa-plus"></i> Ajouter un service</button>
        <button class="avatar" id="profileBtn" title="Mon Profil"> </button>
      </div>
    </header>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon-box blue"><i class="fa fa-briefcase"></i></div>
        </div>
        <p class="stat-label">Services Actifs</p>
        <h3 class="stat-value">5</h3>
      </div>
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon-box green"><i class="fa fa-calendar-check"></i></div>
        </div>
        <p class="stat-label">Total Réservations</p>
        <h3 class="stat-value">128</h3>
      </div>
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon-box gold"><i class="fa fa-euro-sign"></i></div>
        </div>
        <p class="stat-label">Revenus Mensuels</p>
        <h3 class="stat-value">3 840€</h3>
      </div>
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon-box brown"><i class="fa fa-star"></i></div>
        </div>
        <p class="stat-label">Note Moyenne</p>
        <h3 class="stat-value">4.9/5</h3>
      </div>
    </div>

    <!-- Chart + Timeline -->
    <div class="mid-grid">
      <!-- Graph removed (revenus chart) -->

      <div class="timeline-card">
        <h3 class="timeline-title">Réservations du jour</h3>
        <div class="timeline">
          <div class="tl-item">
            <div class="tl-dot done"><i class="fa fa-check"></i></div>
            <p class="tl-time">09:00</p>
            <p class="tl-client">Ferme du Soleil</p>
            <p class="tl-service">Labour de précision</p>
          </div>
          <div class="tl-item">
            <div class="tl-dot ongoing"><i class="fa fa-clock"></i></div>
            <p class="tl-time">14:30</p>
            <p class="tl-client">GAEC Les Plaines</p>
            <p class="tl-service">Irrigation</p>
          </div>
          <div class="tl-item">
            <div class="tl-dot pending"><i class="fa fa-clock"></i></div>
            <p class="tl-time">17:00</p>
            <p class="tl-client">Jean Martin</p>
            <p class="tl-service">Conseil sol</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Services -->
    <div class="services-section">
      <div class="section-header">
        <h3>Gestion des services</h3>
        <a href="prestataire-services.html" class="btn-outline"><i class="fa fa-arrow-right"></i> Voir tout</a>
      </div>
      <div class="services-grid" id="servicesGrid">
        ${serviceCardsHTML()}
        <button class="add-service-card" id="btnAddCard">
          <i class="fa fa-plus"></i>
          Ajouter un service
        </button>
      </div>
    </div>
  </main>`;

  initSidebar('dashboard');
  initModal();

  /* Chart removed (revenus) */

  /* ---- Modal open ---- */
  const modalFields = `
    <div class="upload-zone" id="uploadZone">
      <i class="fa fa-cloud-arrow-up"></i>
      <p>Cliquez ou glissez une image ici</p>
      <small>PNG, JPG jusqu'à 5MB</small>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Nom du service</label><input type="text" placeholder="Ex: Labour de précision"/></div>
      <div class="form-group"><label>Catégorie</label>
        <select><option>Sol</option><option>Arrosage</option><option>Plantation</option><option>Matériels</option></select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Prix (€)</label><input type="number" placeholder="0.00"/></div>
      <div class="form-group"><label>Unité</label>
        <select><option>Par jour</option><option>Par heure</option><option>Par hectare</option></select>
      </div>
    </div>
    <div class="form-group"><label>Description</label><textarea placeholder="Décrivez brièvement votre service..."></textarea></div>
    <div class="modal-footer">
      <button class="btn-cancel" onclick="closeModal()">Annuler</button>
      <button class="modal-submit"><i class="fa fa-check"></i> Publier le service</button>
    </div>`;

  function openAddServiceModal() {
    document.getElementById('modalTitle').textContent = 'Ajouter un service';
    document.getElementById('modalBodyFields').innerHTML = modalFields;
    document.getElementById('modalOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
    const submitBtn = document.querySelector('.modal-submit');
    if (submitBtn) {
      submitBtn.onclick = async function() {
        const orig = this.innerHTML;
        this.disabled = true;
        this.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Publication...';

        const title = document.querySelector('.modal-body input[type="text"]').value.trim();
        const category = document.querySelector('.modal-body select').value;
        const price = parseFloat(document.querySelector('.modal-body input[type="number"]').value);
        const unitSelect = document.querySelectorAll('.modal-body select')[1].value;
        const description = document.querySelector('.modal-body textarea').value.trim();
        const unite = unitSelect.toLowerCase().replace('par ', '');

        if (!title || !category || isNaN(price) || !description) {
          showToast('Veuillez remplir tous les champs du service.', 'error');
          this.disabled = false;
          this.innerHTML = orig;
          return;
        }

        try {
          const payload = {
            titre: title,
            categorie: category,
            prix: price,
            unite: unite,
            description: description,
            disponibilite: 1,
            actif: 1,
            image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80'
          };

          const result = await createService(payload);
          showToast('Service publié avec succès !');
          closeModal();

          const grid = document.getElementById('servicesGrid');
          grid.insertAdjacentHTML('beforeend', `
            <div class="service-card">
              <div class="service-card-top">
                <span class="badge actif">Actif</span>
                <div class="service-card-actions">
                  <button class="svc-action-btn del" title="Supprimer" data-id="${result.service_id}"><i class="fa fa-trash"></i></button>
                </div>
              </div>
              <p class="service-name">${title}</p>
              <div class="service-price">${price}€ <small>/ ${unite}</small></div>
            </div>
          `);
        } catch (error) {
          console.error('Erreur publication service:', error);
          showToast(error.message || 'Erreur lors de la publication', 'error');
        } finally {
          this.disabled = false;
          this.innerHTML = orig;
        }
      };
    }
  }

  document.getElementById('btnAddService').addEventListener('click', openAddServiceModal);
  document.getElementById('btnAddCard').addEventListener('click', openAddServiceModal);

  /* ---- Delete service ---- */
  document.getElementById('servicesGrid').addEventListener('click', e => {
    const delBtn = e.target.closest('.svc-action-btn.del');
    if (delBtn && confirm('Supprimer ce service ?')) {
      delBtn.closest('.service-card').remove();
      showToast('Service supprimé.');
    }
  });
});
