/* ================================
   shared-profile.js — Gestion du profil partagé
   Utilisé par tous les dashboards (agriculteur, fournisseur, prestataire)
================================ */

// Calculer les initiales depuis le nom complet
function getInitials(fullName) {
  if (!fullName || typeof fullName !== 'string') return 'U';
  
  const nameParts = fullName.trim().split(/\s+/).filter(part => part.length > 0);
  
  if (nameParts.length === 0) return 'U';
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  // Retourne la première lettre du premier mot et du dernier mot
  const firstLetter = nameParts[0].charAt(0).toUpperCase();
  const lastLetter = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  
  return firstLetter + lastLetter;
}

// Mettre à jour les initiales du bouton profil
function updateProfileAvatarInitials() {
  const profile = getSharedProfile();
  const profileBtn = document.getElementById('profileBtn');
  
  if (profileBtn) {
    const initials = getInitials(profile.fullName);
    profileBtn.textContent = initials;
  }
}

// Initialiser le profil avec les données par défaut
function initSharedProfile() {
  const defaultProfile = {
    fullName: 'Jean Dupont',
    email: 'jean.dupont@agrico.fr',
    phone: '+33 6 12 34 56 78',
    location: 'Montpellier, FR',
    description: 'Agriculteur passionné depuis plus de 15 ans, spécialisé dans les cultures céréalières bio.'
  };

  if (!localStorage.getItem('agricoProfile')) {
    localStorage.setItem('agricoProfile', JSON.stringify(defaultProfile));
  }
  
  // Mettre à jour les initiales après initialisation
  updateProfileAvatarInitials();
}

// Récupérer le profil depuis localStorage
function getSharedProfile() {
  const profile = localStorage.getItem('agricoProfile');
  return profile ? JSON.parse(profile) : {
    fullName: 'Utilisateur',
    email: 'email@agrico.fr',
    phone: '+33 6 00 00 00 00',
    location: 'France',
    description: ''
  };
}

// Sauvegarder le profil dans localStorage
function saveSharedProfile(profileData) {
  localStorage.setItem('agricoProfile', JSON.stringify(profileData));
  return true;
}

// Ouvrir le modal de profil
function openProfileModal() {
  const profile = getSharedProfile();
  const overlay = document.getElementById('profileModalOverlay');
  
  if (!overlay) {
    console.warn('Modal profil non trouvé');
    return;
  }

  // Remplir les champs
  document.getElementById('profileFullName').value = profile.fullName || '';
  document.getElementById('profileEmail').value = profile.email || '';
  document.getElementById('profilePhone').value = profile.phone || '';
  document.getElementById('profileLocation').value = profile.location || '';
  document.getElementById('profileDescription').value = profile.description || '';

  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Fermer le modal de profil
function closeProfileModal() {
  const overlay = document.getElementById('profileModalOverlay');
  if (overlay) {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Sauvegarder les modifications du profil
function saveProfileChanges() {
  const fullName = document.getElementById('profileFullName').value.trim();
  const email = document.getElementById('profileEmail').value.trim();
  const phone = document.getElementById('profilePhone').value.trim();
  const location = document.getElementById('profileLocation').value.trim();
  const description = document.getElementById('profileDescription').value.trim();

  // Validation basique
  if (!fullName || !email || !phone) {
    alert('Veuillez remplir les champs obligatoires (nom, email, téléphone)');
    return;
  }

  // Validation email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Veuillez entrer une adresse email valide');
    return;
  }

  const profileData = {
    fullName,
    email,
    phone,
    location,
    description
  };

  saveSharedProfile(profileData);
  
  // Mettre à jour les initiales
  updateProfileAvatarInitials();

  // Feedback visuel
  const saveBtn = document.getElementById('profileSaveBtn');
  if (saveBtn) {
    const originalHTML = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fa fa-check"></i> Enregistré !';
    saveBtn.style.background = '#2e7d32';
    saveBtn.disabled = true;

    setTimeout(() => {
      saveBtn.innerHTML = originalHTML;
      saveBtn.style.background = '';
      saveBtn.disabled = false;
      closeProfileModal();
    }, 1500);
  }

  // Émettre un événement pour que les autre pages puissent se mettre à jour
  window.dispatchEvent(new CustomEvent('profileUpdated', { detail: profileData }));
}

// Initialiser les event listeners du modal
function initProfileModalListeners() {
  const overlay = document.getElementById('profileModalOverlay');
  const closeBtn = document.getElementById('profileModalClose');
  const saveBtn = document.getElementById('profileSaveBtn');
  const cancelBtn = document.getElementById('profileCancelBtn');

  if (!overlay) return;

  // Fermer au clic sur close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeProfileModal);
  }

  // Fermer au clic sur l'overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeProfileModal();
    }
  });

  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('show')) {
      closeProfileModal();
    }
  });

  // Sauvegarder
  if (saveBtn) {
    saveBtn.addEventListener('click', saveProfileChanges);
  }

  // Annuler
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeProfileModal);
  }
  
  // Écouter les mises à jour du profil depuis d'autres pages
  window.addEventListener('profileUpdated', () => {
    updateProfileAvatarInitials();
  });
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  initSharedProfile();
  initProfileModalListeners();

  // Ajouter un listener au bouton profil s'il existe
  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn) {
    profileBtn.addEventListener('click', openProfileModal);
  }
});
