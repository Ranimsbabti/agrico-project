/* ================================
   AgriCo — dashboard-agriculteur.js
================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* Charts removed (dépenses) */

  /* ================================================
     2. ROLE SWITCHER
  ================================================ */
  const roleSwitchBtn = document.getElementById('roleSwitchBtn');
  const roleDropdown  = document.getElementById('roleDropdown');

  roleSwitchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    roleDropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => roleDropdown.classList.remove('show'));

  document.querySelectorAll('.role-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role;
      roleDropdown.classList.remove('show');
      if (role === 'prestataire') window.location.href = '../prestataire/prestataire-dashboard.html';
      else if (role === 'fournisseur') window.location.href = '../fournisseur/fournisseur-dashboard.html';
    });
  });

  /* ================================================
     3. SIDEBAR NAV ACTIVE STATE
  ================================================ */
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

  /* ================================================
     4. MODAL
  ================================================ */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle   = document.getElementById('modalTitle');
  const modalClose   = document.getElementById('modalClose');

  function openModal(title) {
    modalTitle.textContent = title;
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  document.getElementById('btnNouvCmd').addEventListener('click', () => window.location.href = '../../produits.html');
  document.getElementById('btnReserve').addEventListener('click', () => window.location.href = '../../services.html');
  // Bouton 'Contacter Support' supprimé — listener retiré

  modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* Modal submit feedback */
  document.querySelector('.modal-submit').addEventListener('click', function () {
    const original = this.textContent;
    this.textContent = '✓ Envoyé avec succès !';
    this.style.background = '#2e7d32';
    setTimeout(() => {
      this.textContent = original;
      this.style.background = '';
      closeModal();
    }, 1600);
  });

  /* ================================================
     5. LOGOUT
  ================================================ */
  document.querySelector('.logout-btn').addEventListener('click', () => {
    console.log('Logout button clicked');
    console.log('localStorage before clear:', localStorage.getItem('user'));
    localStorage.clear();
    console.log('localStorage after clear:', localStorage.getItem('user'));
    console.log('Redirecting to index.html');
    setTimeout(() => window.location.href = '../../index.html', 100);
  });

  /* ================================================
     6. "VOIR TOUT" — feedback
  ================================================ */
  /* voir-tout links are now real hrefs — no override needed */

  /* ================================================
     7. NOTIFICATION BELL — animation
  ================================================ */
  const bellBtn = document.querySelector('.icon-btn[title="Notifications"]');
  bellBtn.addEventListener('click', () => {
    bellBtn.querySelector('i').style.animation = 'none';
    bellBtn.style.color = '#3a5a1c';
    const dot = bellBtn.querySelector('.notif-dot');
    if (dot) dot.style.display = 'none';
    setTimeout(() => { bellBtn.style.color = ''; }, 600);
  });

  /* ================================================
     8. CALENDAR BUTTON
  ================================================ */
  // Bouton Calendrier supprimé — listener retiré

  /* ================================================
     9. DOTS MENU (table options)
  ================================================ */
  document.querySelectorAll('.dots-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const card  = this.closest('.table-card');
      const title = card.querySelector('.section-title').textContent;
      alert('Options pour : ' + title);
    });
  });

  /* ================================================
     10. STAT CARDS — subtle pulse on hover
  ================================================ */
  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.stat-icon');
      icon.style.background = 'var(--green-light)';
      icon.style.color = 'var(--green-dark)';
    });
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.stat-icon');
      icon.style.background = '';
      icon.style.color = '';
    });
  });

});
