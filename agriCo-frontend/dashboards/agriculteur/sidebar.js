/* ================================
   sidebar.js — partagé par toutes les pages dashboard
================================ */

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
        const role = btn.dataset.role;
        if (role === 'prestataire') window.location.href = '../prestataire/prestataire-dashboard.html';
        else if (role === 'fournisseur') window.location.href = '../fournisseur/fournisseur-dashboard.html';
        roleDropdown.classList.remove('show');
      });
    });
  }

  /* Active nav item */
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.section === activeSection) item.classList.add('active');
    else item.classList.remove('active');
  });

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

/* ---- Modal helper ---- */
function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  if (!overlay) return;

  window.openModal = function (title, fields) {
    document.getElementById('modalTitle').textContent = title;
    const body = document.getElementById('modalBodyFields');
    if (body && fields) {
      body.innerHTML = fields.map(f => `
        <div class="form-group">
          <label>${f.label}</label>
          <${f.type === 'textarea' ? 'textarea' : `input type="${f.type || 'text'}"`}
            placeholder="${f.placeholder || ''}"
            ${f.value ? `value="${f.value}"` : ''}
          >${f.type === 'textarea' ? (f.value || '') + '</textarea>' : ''}
        </div>
      `).join('');
    }
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
      const orig = this.textContent;
      this.textContent = '✓ Enregistré !';
      this.style.background = '#2e7d32';
      setTimeout(() => {
        this.textContent = orig;
        this.style.background = '';
        closeModal();
      }, 1500);
    });
  }
}
