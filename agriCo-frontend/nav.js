// Gère l'affichage du lien "Mon Dashboard" et remplace login/signup
// par un bouton "Mon Dashboard" proposant les 3 rôles lorsqu'on est connecté.
document.addEventListener('DOMContentLoaded', () => {
  console.log('nav.js loaded');
  const userData = localStorage.getItem('user');
  console.log('nav.js: localStorage user:', userData);
  const isLoggedIn = !!userData;
  console.log('nav.js: isLoggedIn:', isLoggedIn);

  // Footer link (présent sur les pages publiques)
  const dashLink = document.getElementById('dashboardLink');
  if (dashLink) dashLink.style.display = isLoggedIn ? 'block' : 'none';

  // Header auth area replacement
  const authContainer = document.getElementById('authButtons');
  if (!authContainer) return;

  function buildDashboardDropdown(container) {
    container.style.position = 'relative';

    const btn = document.createElement('button');
    btn.id = 'dashboardBtn';
    btn.type = 'button';
    btn.className = 'btn btn-agri';
    btn.textContent = 'Mon Dashboard';

    const menu = document.createElement('div');
    menu.id = 'dashboardMenu';
    menu.style.position = 'absolute';
    menu.style.right = '0';
    menu.style.top = 'calc(100% + 6px)';
    menu.style.background = '#fff';
    menu.style.border = '1px solid rgba(0,0,0,0.08)';
    menu.style.borderRadius = '8px';
    menu.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
    menu.style.padding = '6px 0';
    menu.style.display = 'none';
    menu.style.minWidth = '190px';
    menu.style.zIndex = '1000';

    const options = [
      { role: 'agriculteur', label: 'Agriculteur', href: 'dashboards/agriculteur/dashboard-agriculteur.html' },
      { role: 'prestataire', label: 'Prestataire', href: 'dashboards/prestataire/prestataire-dashboard.html' },
      { role: 'fournisseur', label: 'Fournisseur', href: 'dashboards/fournisseur/fournisseur-dashboard.html' },
    ];

    options.forEach(opt => {
      const a = document.createElement('a');
      a.href = opt.href;
      a.dataset.role = opt.role;
      a.className = 'dropdown-item';
      a.style.display = 'block';
      a.style.padding = '10px 14px';
      a.style.color = '#222';
      a.style.fontWeight = '700';
      a.style.textDecoration = 'none';
      a.textContent = opt.label;
      a.addEventListener('click', () => {
        localStorage.setItem('userRole', opt.role);
      });
      menu.appendChild(a);
    });

    // Put elements in container
    container.innerHTML = '';
    container.appendChild(btn);
    container.appendChild(menu);

    // Toggle and outside click
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', () => { menu.style.display = 'none'; });
  }

  if (isLoggedIn) {
    buildDashboardDropdown(authContainer);
  } else {
    // Ensure default login/signup are shown for guests
    if (!authContainer.querySelector('a[href="login.html"]')) {
      authContainer.innerHTML = '<a href="login.html" class="btn btn-outline-agri">Se connecter</a> <a href="signup.html" class="btn btn-agri">S\'inscrire</a>';
    }
  }
});