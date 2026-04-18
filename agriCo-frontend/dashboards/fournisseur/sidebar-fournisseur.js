/* sidebar-fournisseur.js — génère le HTML de la sidebar fournisseur */
function getSidebarHTML(activeSection) {
  const links = [
    { section: 'dashboard',  href: 'fournisseur-dashboard.html',  icon: 'fa-chart-pie',   label: 'Dashboard' },
    { section: 'produits',   href: 'fournisseur-produits.html',   icon: 'fa-box',         label: 'Mes produits' },
    { section: 'commandes',  href: 'fournisseur-commandes.html',  icon: 'fa-bag-shopping', label: 'Commandes' },
    { section: 'revenus',    href: 'fournisseur-revenus.html',    icon: 'fa-euro-sign',   label: 'Revenus' },
    { section: 'inventaire', href: 'fournisseur-inventaire.html', icon: 'fa-warehouse',   label: 'Inventaire' },
  ];

  return `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <a href="../../index.html" class="nav-logo">
          <img src="../../images/logo.png" alt="AgriCo" class="logo-img" />
        </a>
        <div class="role-switcher">
          <button class="role-btn" id="roleSwitchBtn">
            <span class="role-dot gold"></span>
            <span class="role-label">Fournisseur</span>
            <i class="fa fa-rotate role-refresh"></i>
          </button>
          <div class="role-dropdown" id="roleDropdown">
            <button class="role-option" data-role="agriculteur">
              <span class="role-dot green"></span>Passer en Agriculteur
            </button>
            <button class="role-option" data-role="prestataire">
              <span class="role-dot blue"></span>Passer en Prestataire
            </button>
          </div>
        </div>
      </div>

      <nav class="sidebar-nav">
        ${links.map(l => `
          <a href="${l.href}" class="nav-item${activeSection === l.section ? ' active' : ''}" data-section="${l.section}">
            <i class="fa ${l.icon} nav-icon"></i>
            <span>${l.label}</span>
          </a>`).join('')}
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn">
          <i class="fa fa-right-from-bracket"></i>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>`;
}
