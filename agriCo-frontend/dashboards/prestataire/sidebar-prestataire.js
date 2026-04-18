/* sidebar-prestataire.js — génère le HTML de la sidebar prestataire */
function getSidebarHTML(activeSection) {
  const links = [
    { section: 'dashboard',      href: 'prestataire-dashboard.html',      icon: 'fa-chart-pie',     label: 'Dashboard' },
    { section: 'services',       href: 'prestataire-services.html',       icon: 'fa-briefcase',     label: 'Mes services' },
    { section: 'reservations',   href: 'prestataire-reservations.html',   icon: 'fa-calendar',      label: 'Réservations' },
    { section: 'avis',           href: 'prestataire-avis.html',           icon: 'fa-star',          label: 'Avis' },
    { section: 'revenus',        href: 'prestataire-revenus.html',        icon: 'fa-euro-sign',     label: 'Revenus' },
  ];

  return `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <a href="../../index.html" class="nav-logo">
          <img src="../../images/logo.png" alt="AgriCo" class="logo-img" />
        </a>
        <div class="role-switcher">
          <button class="role-btn" id="roleSwitchBtn">
            <span class="role-dot blue"></span>
            <span class="role-label">Prestataire</span>
            <i class="fa fa-rotate role-refresh"></i>
          </button>
          <div class="role-dropdown" id="roleDropdown">
            <button class="role-option" data-role="agriculteur">
              <span class="role-dot green"></span>Passer en Agriculteur
            </button>
            <button class="role-option" data-role="fournisseur">
              <span class="role-dot gold"></span>Passer en Fournisseur
            </button>
          </div>
        </div>
      </div>
      <nav class="sidebar-nav">
        ${links.map(l => `
          <a href="${l.href}" class="nav-item${activeSection === l.section ? ' active' : ''}" data-section="${l.section}">
            <i class="fa ${l.icon} nav-icon"></i>
            <span>${l.label}</span>
          </a>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        <button class="logout-btn">
          <i class="fa fa-right-from-bracket"></i>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  `;
}
