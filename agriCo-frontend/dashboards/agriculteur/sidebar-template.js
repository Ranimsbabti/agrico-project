/* sidebar-template.js — génère le HTML de la sidebar */
function getSidebarHTML(activeSection) {
  const links = [
    { section: 'dashboard',    href: 'dashboard-agriculteur.html', icon: 'fa-chart-pie',        label: 'Dashboard' },
    { section: 'commandes',    href: 'commandes.html',             icon: 'fa-bag-shopping',      label: 'Mes commandes' },
    { section: 'reservations', href: 'reservations.html',          icon: 'fa-calendar',          label: 'Mes réservations' },
    { section: 'avis',         href: 'avis.html',                  icon: 'fa-comment',           label: 'Mes avis' },
    { section: 'depenses',     href: 'depenses.html',              icon: 'fa-chart-line',        label: 'Dépenses' },
  ];

  return `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <a href="../../index.html" class="nav-logo">
          <img src="../../images/logo.png" alt="AgriCo" class="logo-img" />
        </a>
        <div class="role-switcher">
          <button class="role-btn" id="roleSwitchBtn">
            <span class="role-dot green"></span>
            <span class="role-label">Agriculteur</span>
            <i class="fa fa-rotate role-refresh"></i>
          </button>
          <div class="role-dropdown" id="roleDropdown">
            <button class="role-option" data-role="prestataire">
              <span class="role-dot blue"></span>Passer en Prestataire
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
