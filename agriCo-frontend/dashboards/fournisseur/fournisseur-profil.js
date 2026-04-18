/* fournisseur-profil.js */
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('appLayout');

  let zones = ['Occitanie', 'Nouvelle-Aquitaine', 'Bretagne', 'Île-de-France'];

  function zonesHTML() {
    return zones.map(z => `
      <div class="zone-item">
        <span class="zone-name"><i class="fa fa-map-marker-alt"></i> ${z}</span>
        <button class="zone-del" data-zone="${z}" title="Supprimer"><i class="fa fa-xmark"></i></button>
      </div>`).join('');
  }

  layout.innerHTML = getSidebarHTML('profil') + `
  <main class="main">
    <header class="main-header">
      <div><h1 class="page-title">Mon Profil</h1><p class="page-sub">Gérez vos informations et paramètres de compte.</p></div>
      <div class="header-actions">
        <button class="save-btn" id="globalSave"><i class="fa fa-floppy-disk"></i> Enregistrer</button>
        <div class="avatar">AF</div>
      </div>
    </header>

    <div class="profil-grid">

      <!-- Left -->
      <div>
        <div class="profile-card">
          <div class="avatar-wrap">
            <div class="avatar-circle"><i class="fa fa-building"></i></div>
            <button class="avatar-upload" id="avatarUpload" title="Changer logo"><i class="fa fa-camera"></i></button>
          </div>
          <h2 class="profile-name">AgriSupply France</h2>
          <p class="profile-role">Fournisseur Agricole</p>
          <div class="profile-stats">
            <div class="ps-item"><div class="ps-value">42</div><div class="ps-label">Produits</div></div>
            <div class="ps-item"><div class="ps-value">128</div><div class="ps-label">Clients</div></div>
            <div class="ps-item"><div class="ps-value">4.8</div><div class="ps-label">Note</div></div>
          </div>
          <div class="profile-badges">
            <span class="p-badge gold"><i class="fa fa-shield-halved"></i> Vérifié</span>
            <span class="p-badge green"><i class="fa fa-leaf"></i> Certifié bio</span>
            <span class="p-badge blue"><i class="fa fa-star"></i> Top fournisseur</span>
          </div>
        </div>

        <nav class="tab-nav">
          <button class="tab-nav-btn active" data-tab="contact"><i class="fa fa-address-card"></i> Contact</button>
        </nav>
      </div>

      <!-- Right -->
      <div class="content-panel">

        <!-- CONTACT -->
        <div class="tab-pane active" id="tab-contact">
          <h3 class="pane-title">Contact</h3>
          <div class="form-grid">
            <div class="field">
              <label>Nom du responsable</label>
              <div class="field-wrap"><i class="fa fa-user field-icon"></i><input type="text" value="Antoine Fournisseur"/></div>
            </div>
            <div class="field">
              <label>Poste / Fonction</label>
              <div class="field-wrap"><i class="fa fa-briefcase field-icon"></i><input type="text" value="Directeur Commercial"/></div>
            </div>
            <div class="field">
              <label>E-mail professionnel</label>
              <div class="field-wrap"><i class="fa fa-envelope field-icon"></i><input type="email" value="antoine@agrisupply.fr"/></div>
            </div>
            <div class="field">
              <label>Téléphone</label>
              <div class="field-wrap"><i class="fa fa-phone field-icon"></i><input type="tel" value="+33 5 61 23 45 67"/></div>
            </div>
            <div class="field">
              <label>Site web</label>
              <div class="field-wrap"><i class="fa fa-globe field-icon"></i><input type="url" value="https://www.agrisupply.fr"/></div>
            </div>
            <div class="field">
              <label>Adresse siège social</label>
              <div class="field-wrap"><i class="fa fa-map-marker-alt field-icon"></i><input type="text" value="45 Rue du Négoce, 31000 Toulouse"/></div>
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

  /* Livraison zones removed (section deleted from DOM) */

  /* Avatar upload */
  document.getElementById('avatarUpload').addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = e => { if (e.target.files[0]) showToast('Logo "' + e.target.files[0].name + '" sélectionné.'); };
    inp.click();
  });
});
