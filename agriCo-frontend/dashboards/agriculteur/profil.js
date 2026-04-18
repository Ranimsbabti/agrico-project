/* profil.js */
document.addEventListener('DOMContentLoaded', () => {

  const layout = document.getElementById('appLayout');
  layout.innerHTML = getSidebarHTML('profil') + `
  <main class="main">
    <header class="main-header">
      <div>
        <h1 class="page-title">Mon Profil</h1>
        <p class="page-sub">Gérez vos informations et vos paramètres.</p>
      </div>
      <div class="header-actions">
        <button class="save-btn" id="globalSave"><i class="fa fa-floppy-disk"></i> Enregistrer</button>
        <div class="avatar">JD</div>
      </div>
    </header>

    <div class="profil-grid">

      <!-- Left col -->
      <div>
        <div class="profile-card">
          <div class="avatar-wrap">
            <div class="avatar-circle"><i class="fa fa-user"></i></div>
            <button class="avatar-upload" title="Changer la photo"><i class="fa fa-camera"></i></button>
          </div>
          <h2 class="profile-name">Jean Dupont</h2>
          <p class="profile-role">Agriculteur</p>
          <div class="profile-stats">
            <div class="ps-item"><div class="ps-value">4.9</div><div class="ps-label">Note</div></div>
            <div class="ps-item"><div class="ps-value">128</div><div class="ps-label">Avis</div></div>
            <div class="ps-item"><div class="ps-value">3</div><div class="ps-label">Ans</div></div>
          </div>
        </div>

        <nav class="tab-nav">
          <button class="tab-nav-btn active" data-tab="personal"><i class="fa fa-user"></i> Infos Personnelles</button>
        </nav>
      </div>

      <!-- Right col -->
      <div class="content-panel">

        <!-- PERSONAL -->
        <div class="tab-pane active" id="tab-personal">
          <h3 class="pane-title">Informations Personnelles</h3>
          <div class="form-grid">
            <div class="field">
              <label>Nom complet</label>
              <div class="field-input-wrap">
                <i class="fa fa-user field-icon"></i>
                <input type="text" value="Jean Dupont"/>
              </div>
            </div>
            <div class="field">
              <label>Adresse e-mail</label>
              <div class="field-input-wrap">
                <i class="fa fa-envelope field-icon"></i>
                <input type="email" value="jean.dupont@agrico.fr"/>
              </div>
            </div>
            <div class="field">
              <label>Numéro de téléphone</label>
              <div class="field-input-wrap">
                <i class="fa fa-phone field-icon"></i>
                <input type="tel" value="+33 6 12 34 56 78"/>
              </div>
            </div>
            <div class="field">
              <label>Localisation</label>
              <div class="field-input-wrap">
                <i class="fa fa-map-marker-alt field-icon"></i>
                <input type="text" value="Montpellier, FR"/>
              </div>
            </div>
            <div class="field full">
              <label>Bio / Description</label>
              <textarea>Agriculteur passionné depuis plus de 15 ans, spécialisé dans les cultures céréalières bio. Je cherche toujours à optimiser mes méthodes de travail grâce aux nouvelles technologies.</textarea>
            </div>
          </div>
        </div>

        </div>

      </div>
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
    btn.classList.add('saving');
    btn.style.background = '#2e7d32';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.classList.remove('saving');
      btn.style.background = '';
    }, 1800);
  };

  document.getElementById('globalSave').addEventListener('click', function() {
    showSaved(this);
  });

  /* Avatar upload */
  document.querySelector('.avatar-upload').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = e => {
      const file = e.target.files[0];
      if (file) alert('Photo "' + file.name + '" sélectionnée.');
    };
    input.click();
  });
});
