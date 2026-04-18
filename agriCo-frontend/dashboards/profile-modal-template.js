/* ================================
   profile-modal-template.js — Génère le HTML du modal de profil
================================ */

function createProfileModal() {
  const modalHTML = `
    <div class="modal-overlay" id="profileModalOverlay">
      <div class="profile-modal">
        <div class="profile-modal-header">
          <h2>Mon Profil</h2>
          <button class="profile-modal-close" id="profileModalClose">
            <i class="fa fa-xmark"></i>
          </button>
        </div>
        
        <div class="profile-modal-body">
          <div class="profile-field">
            <label>
              Nom complet
              <span class="required">*</span>
            </label>
            <div class="profile-field-wrap">
              <i class="fa fa-user profile-field-icon"></i>
              <input
                type="text"
                id="profileFullName"
                placeholder="Votre nom complet"
                required
              />
            </div>
          </div>

          <div class="profile-field">
            <label>
              Adresse e-mail
              <span class="required">*</span>
            </label>
            <div class="profile-field-wrap">
              <i class="fa fa-envelope profile-field-icon"></i>
              <input
                type="email"
                id="profileEmail"
                placeholder="votre.email@example.com"
                required
              />
            </div>
          </div>

          <div class="profile-field">
            <label>
              Téléphone
              <span class="required">*</span>
            </label>
            <div class="profile-field-wrap">
              <i class="fa fa-phone profile-field-icon"></i>
              <input
                type="tel"
                id="profilePhone"
                placeholder="+33 6 00 00 00 00"
                required
              />
            </div>
          </div>

          <div class="profile-field">
            <label>Localisation</label>
            <div class="profile-field-wrap">
              <i class="fa fa-map-marker-alt profile-field-icon"></i>
              <input
                type="text"
                id="profileLocation"
                placeholder="Ville, Région, Pays"
              />
            </div>
          </div>

          <div class="profile-field">
            <label>Description / Bio</label>
            <div class="profile-field-wrap">
              <textarea
                id="profileDescription"
                placeholder="Décrivez-vous brièvement (optionnel)..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="profile-modal-footer">
          <button id="profileCancelBtn" type="button">
            <i class="fa fa-times"></i> Annuler
          </button>
          <button id="profileSaveBtn" type="button">
            <i class="fa fa-floppy-disk"></i> Enregistrer
          </button>
        </div>
      </div>
    </div>
  `;

  // Créer le conteneur et ajouter le HTML
  const container = document.createElement('div');
  container.innerHTML = modalHTML;
  document.body.appendChild(container.firstElementChild);

  // Retourner l'overlay pour pouvoir l'accéder après
  return document.getElementById('profileModalOverlay');
}

// Créer le modal au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  createProfileModal();
});
