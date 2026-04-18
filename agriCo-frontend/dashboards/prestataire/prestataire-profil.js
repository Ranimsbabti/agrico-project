/* prestataire-profil.js */
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('appLayout');

  let skills = ['Labour', 'Irrigation', 'Semis', 'Analyse sol', 'Drone'];

  function skillsHTML() {
    return skills.map(s => `
      <span class="skill-tag">${s}
        <button class="remove-skill" data-skill="${s}"><i class="fa fa-xmark"></i></button>
      </span>`).join('');
  }

  layout.innerHTML = getSidebarHTML('profil') + `
  <main class="main">
    <header class="main-header">
      <div><h1 class="page-title">Mon Profil</h1><p class="page-sub">Gérez vos informations et paramètres de compte.</p></div>
      <div class="header-actions">
        <button class="save-btn" id="globalSave"><i class="fa fa-floppy-disk"></i> Enregistrer</button>
        <div class="avatar">MP</div>
      </div>
    </header>

    <div class="profil-grid">

      <!-- Left -->
      <div>
        <div class="profile-card">
          <div class="avatar-wrap">
            <div class="avatar-circle"><i class="fa fa-user"></i></div>
            <button class="avatar-upload" id="avatarUpload" title="Changer photo"><i class="fa fa-camera"></i></button>
          </div>
          <h2 class="profile-name">Marc Prestataire</h2>
          <p class="profile-role">Prestataire Agricole</p>
          <div class="profile-stats">
            <div class="ps-item"><div class="ps-value">4.9</div><div class="ps-label">Note</div></div>
            <div class="ps-item"><div class="ps-value">128</div><div class="ps-label">Avis</div></div>
            <div class="ps-item"><div class="ps-value">5</div><div class="ps-label">Services</div></div>
          </div>
          <div class="profile-badges">
            <span class="p-badge blue"><i class="fa fa-shield-halved"></i> Vérifié</span>
            <span class="p-badge gold"><i class="fa fa-star"></i> Top prestataire</span>
            <span class="p-badge green"><i class="fa fa-leaf"></i> Certifié bio</span>
          </div>
        </div>

        <nav class="tab-nav">
          <button class="tab-nav-btn active" data-tab="personal"><i class="fa fa-user"></i> Infos Personnelles</button>
        </nav>
      </div>

      <!-- Right -->
      <div class="content-panel">

        <!-- PERSONAL -->
        <div class="tab-pane active" id="tab-personal">
          <h3 class="pane-title">Informations Personnelles</h3>
          <div class="form-grid">
            <div class="field">
              <label>Nom complet</label>
              <div class="field-wrap"><i class="fa fa-user field-icon"></i><input type="text" value="Marc Prestataire"/></div>
            </div>
            <div class="field">
              <label>Adresse e-mail</label>
              <div class="field-wrap"><i class="fa fa-envelope field-icon"></i><input type="email" value="marc@agrico.fr"/></div>
            </div>
            <div class="field">
              <label>Téléphone</label>
              <div class="field-wrap"><i class="fa fa-phone field-icon"></i><input type="tel" value="+33 6 98 76 54 32"/></div>
            </div>
            <div class="field">
              <label>Localisation</label>
              <div class="field-wrap"><i class="fa fa-map-marker-alt field-icon"></i><input type="text" value="Toulouse, FR"/></div>
            </div>
            <div class="field">
              <label>Rayon d'intervention (km)</label>
              <div class="field-wrap"><i class="fa fa-location-dot field-icon"></i><input type="number" value="80"/></div>
            </div>
            <div class="field">
              <label>Disponibilité</label>
              <div class="field-wrap">
                <i class="fa fa-calendar field-icon"></i>
                <select>
                  <option selected>Temps plein</option>
                  <option>Temps partiel</option>
                  <option>Week-ends uniquement</option>
                </select>
              </div>
            </div>
            <div class="field full">
              <label>Bio / Présentation</label>
              <textarea>Prestataire agricole depuis 10 ans, spécialisé dans le labour de précision, l'installation d'irrigation et le semis par drone. Matériel récent et certifié. Intervention dans un rayon de 80km autour de Toulouse.</textarea>
            </div>
          </div>
          <button class="save-btn" onclick="showSaved(this)"><i class="fa fa-floppy-disk"></i> Enregistrer</button>
        </div>

      </div><!-- /content-panel -->
    </div>
  </main>`;

  initSidebar('profil');

  /* Tab switching */
  document.querySelectorAll('.tab-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  /* Save feedback */
  window.showSaved = function(btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-check"></i> Enregistré !';
    btn.style.background = '#2e7d32';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; showToast('Profil mis à jour !'); }, 1600);
  };
  document.getElementById('globalSave').addEventListener('click', function() { showSaved(this); });

  /* Compétences removed (section deleted from DOM) */

  /* Avatar upload */
  document.getElementById('avatarUpload').addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = e => { if (e.target.files[0]) showToast('Photo "' + e.target.files[0].name + '" sélectionnée.'); };
    inp.click();
  });
});
