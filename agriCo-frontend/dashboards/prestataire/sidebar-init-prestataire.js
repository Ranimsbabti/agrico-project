/* sidebar-init-prestataire.js — logique partagée pour le dashboard prestataire */

function initSidebar(activeSection) {
  /* Role Switcher */
  const roleSwitchBtn = document.getElementById('roleSwitchBtn');
  const roleDropdown = document.getElementById('roleDropdown');
  if (roleSwitchBtn && roleDropdown) {
    roleSwitchBtn.addEventListener('click', e => {
      e.stopPropagation();
      roleDropdown.classList.toggle('show');
    });
    document.addEventListener('click', () => roleDropdown.classList.remove('show'));
    document.querySelectorAll('.role-option').forEach(btn => {
      btn.addEventListener('click', () => {
        roleDropdown.classList.remove('show');
        const role = btn.dataset.role;
        if (role === 'agriculteur') window.location.href = '../agriculteur/dashboard-agriculteur.html';
        else if (role === 'fournisseur') window.location.href = '../fournisseur/fournisseur-dashboard.html';
      });
    });
  }

  /* Logout */
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      console.log('Logout button clicked');
      console.log('localStorage before clear:', localStorage.getItem('user'));
      localStorage.clear();
      console.log('localStorage after clear:', localStorage.getItem('user'));
      console.log('Redirecting to index.html');
      setTimeout(() => window.location.href = '../../index.html', 100);
    });
  }
}

/* Modal helper */
function initModal() {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;
  const closeBtn = document.getElementById('modalClose');

  window.openModal = function (title, fieldsHTML) {
    document.getElementById('modalTitle').textContent = title;
    const f = document.getElementById('modalBodyFields');
    if (f && fieldsHTML) f.innerHTML = fieldsHTML;
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function () {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  const submitBtn = document.querySelector('.modal-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      const orig = this.innerHTML;
      this.innerHTML = '<i class="fa fa-check"></i> Enregistré !';
      this.style.background = '#2e7d32';
      setTimeout(() => {
        this.innerHTML = orig;
        this.style.background = '';
        closeModal();
      }, 1500);
    });
  }
}

/* Shared toast notification */
window.showToast = function (msg, type = 'success') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.style.cssText = `
    position:fixed; bottom:28px; right:28px; z-index:9999;
    padding:14px 22px; border-radius:12px; font-family:var(--font-body);
    font-size:.88rem; font-weight:600; color:#fff;
    background:${type === 'success' ? '#3a5a1c' : '#e53935'};
    box-shadow:0 8px 24px rgba(0,0,0,0.15);
    animation: slideUp 0.3s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
};
