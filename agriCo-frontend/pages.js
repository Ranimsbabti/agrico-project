// helpers ajouté par ranim pour evitée la dupliaction des fcts

function starsHtml(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i)             html += '<i class="fa-solid fa-star"></i>';
    else if (rating >= i - 0.5)  html += '<i class="fa-solid fa-star-half-stroke"></i>';
    else                         html += '<i class="fa-regular fa-star"></i>';
  }
  return html;
}

function serviceCardHtml(s) {
  const v = VENDEURS[s.prestataire] || {};
  const authDisabled = isUserConnected() ? '' : 'disabled';
  const btnClass = isUserConnected() ? 'btn-reserve' : 'btn-reserve disabled';
  const btnLabel = isUserConnected() ? 'Réserver' : 'Connexion requise';
  return `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="service-card h-100">
        <div class="card-img-wrap">
          <img src="${s.image}" alt="${s.titre}" loading="lazy">
          <span class="card-tag"><span class="tag-dot"></span>${s.categorie.toUpperCase()}</span>
        </div>
        <div class="card-body-custom d-flex flex-column">
          <div class="card-top-row">
            <span class="card-title">${s.titre}</span>
            <span class="card-rating"><i class="fa-solid fa-star"></i> ${s.rating}</span>
          </div>
          <div class="card-provider mt-1 mb-2">
            <span class="seller-name" data-vid="${s.prestataire}">
              <i class="fa-solid fa-user-tie me-1"></i>${v.nom || '—'}
            </span>
          </div>
          <div class="card-bottom-row mt-auto">
            <span class="card-price">${s.prix} DT <span>/ ${s.unite}</span></span>
            <button class="${btnClass}" ${authDisabled}>${btnLabel}</button>
          </div>
          <div class="card-details-link mt-2" data-id="${s.id}" data-type="service">
            Voir plus de détails
          </div>
        </div>
      </div>
    </div>`;
}

function produitCardHtml(p) {
  const v           = VENDEURS[p.fournisseur] || {};
  const stockColor  = p.stock === 0 ? 'text-danger' : '';
  const authDisabled = isUserConnected() ? '' : 'disabled';
  const btnAvailable = p.disponible && isUserConnected();
  const btnClass    = btnAvailable ? 'btn-cart' : 'btn-cart disabled';
  const btnLabel    = btnAvailable ? 'Commander' : 'Connectez-vous pour commander';
  return `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="product-card h-100">
        <div class="prod-img-wrap">
          <img src="${p.image}" alt="${p.titre}" loading="lazy">
          <span class="card-tag"><span class="tag-dot"></span>${p.categorie.toUpperCase()}</span>
          <span class="status-badge ${p.disponible ? 'status-ok' : 'status-out'}">
            ${p.disponible ? 'DISPONIBLE' : 'RUPTURE'}
          </span>
        </div>
        <div class="card-body-custom d-flex flex-column">
          <div class="prod-title">${p.titre}</div>
          <div class="card-provider mb-1">
            <span class="seller-name" data-vid="${p.fournisseur}">
              <i class="fa-solid fa-store me-1"></i>${v.nom || '—'}
            </span>
          </div>
          <div class="prod-rating mb-2">
            <span class="stars-wrap">${starsHtml(p.rating)}</span>
            <span class="rating-num">${p.rating}
              <span class="rating-count">(${p.nbAvis} avis)</span>
            </span>
          </div>
          <div class="prod-price-row">
            <span class="card-price">${p.prix.toLocaleString('fr')} DT</span>
            <div class="prod-stock">STOCK<strong class="${stockColor}">${p.stock} unités</strong></div>
          </div>
          <button class="${btnClass} w-100 mt-2" ${btnAvailable ? '' : 'disabled'}>
            <i class="fa-solid fa-bag-shopping me-2"></i>${btnLabel}
          </button>
          <div class="card-details-link mt-2" data-id="${p.id}" data-type="produit">
            Voir plus de détails
          </div>
        </div>
      </div>
    </div>`;
}

function serviceDetailHtml(s, v) {
  const loggedIn = isUserConnected();
  const btnClass = loggedIn ? 'btn-reserve' : 'btn-reserve disabled';
  const btnLabel = loggedIn ? 'Réserver ce service' : 'Connectez-vous pour réserver';
  return `
    <div class="detail-img-wrap mb-4">
      <img src="${s.image}" alt="${s.titre}" class="detail-img">
      <span class="card-tag detail-tag"><span class="tag-dot"></span>${s.categorie.toUpperCase()}</span>
    </div>
    <div class="detail-body">
      <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
        <h2 class="detail-title">${s.titre}</h2>
        <span class="detail-rating">
          <i class="fa-solid fa-star"></i> ${s.rating}
          <span class="rating-count">(${s.nbAvis} avis)</span>
        </span>
      </div>
      <div class="detail-price mb-3">${s.prix} DT <span class="price-unit">/ ${s.unite}</span></div>
      <div class="detail-section">
        <h5 class="detail-section-title"><i class="fa-solid fa-align-left me-2"></i>Description</h5>
        <p class="detail-desc">${s.description}</p>
      </div>
      <div class="detail-section">
        <h5 class="detail-section-title"><i class="fa-solid fa-clock me-2"></i>Disponibilité</h5>
        <p class="detail-desc">${s.disponibilite}</p>
      </div>
      <div class="detail-section detail-seller-box">
        <h5 class="detail-section-title"><i class="fa-solid fa-user-tie me-2"></i>Prestataire</h5>
        <div class="detail-seller">
          <img src="${v.avatar}" alt="${v.nom}" class="detail-seller-avatar">
          <div>
            <div class="detail-seller-name">${v.nom}</div>
            <div class="detail-seller-loc"><i class="fa-solid fa-location-dot me-1"></i>${v.localisation}</div>
            <div class="detail-seller-bio">${v.bio}</div>
            <div class="detail-seller-contacts mt-2">
              <span><i class="fa-solid fa-phone me-1"></i>${v.telephone}</span>
              <span><i class="fa-solid fa-envelope me-1"></i>${v.email}</span>
            </div>
          </div>
        </div>
      </div>
      <button class="${btnClass} w-100 mt-3" ${loggedIn ? '' : 'disabled'} style="padding:.85rem; border-radius:12px; font-size:1rem;">
        <i class="fa-solid fa-calendar-check me-2"></i>${btnLabel}
      </button>
    </div>`;
}

function produitDetailHtml(p, v) {
  const stockColor  = p.stock === 0 ? 'text-danger' : 'text-success';
  const loggedIn    = isUserConnected();
  const isAvailable = p.disponible;
  const btnDisabled = !isAvailable || !loggedIn ? 'disabled' : '';
  const btnClass    = isAvailable && loggedIn ? 'btn-cart' : 'btn-cart disabled';
  const btnLabel    = !loggedIn ? 'Connectez-vous pour commander' : (isAvailable ? 'Commander ce produit' : 'Produit indisponible');
  return `
    <div class="detail-img-wrap mb-4">
      <img src="${p.image}" alt="${p.titre}" class="detail-img">
      <span class="card-tag detail-tag"><span class="tag-dot"></span>${p.categorie.toUpperCase()}</span>
      <span class="status-badge detail-status ${p.disponible ? 'status-ok' : 'status-out'}">
        ${p.disponible ? 'DISPONIBLE' : 'RUPTURE'}
      </span>
    </div>
    <div class="detail-body">
      <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
        <h2 class="detail-title">${p.titre}</h2>
        <span class="detail-rating">
          ${starsHtml(p.rating)} ${p.rating}
          <span class="rating-count">(${p.nbAvis} avis)</span>
        </span>
      </div>
      <div class="detail-price mb-1">${p.prix.toLocaleString('fr')} DT</div>
      <div class="mb-3 ${stockColor}" style="font-weight:700; font-size:.9rem;">
        <i class="fa-solid fa-boxes-stacked me-1"></i>Stock : ${p.stock} unités
      </div>

      <div class="detail-quantity mt-3">
        <label class="detail-qty-label mb-2">Quantité</label>
        <div class="d-flex align-items-center gap-3 qty-row">
          <div class="qty-control" role="group" aria-label="Choisir la quantité">
            <button type="button" class="qty-btn qty-decrease" aria-label="Réduire la quantité">−</button>
            <input type="number" class="form-control detail-qty-input" aria-label="Quantité" min="1" max="${p.stock}" value="${p.stock > 0 ? 1 : 0}">
            <button type="button" class="qty-btn qty-increase" aria-label="Augmenter la quantité">+</button>
          </div>
          <div class="ms-auto detail-total">Total : <strong class="detail-total-price">${(p.prix * (p.stock > 0 ? 1 : 0)).toLocaleString('fr')} DT</strong></div>
        </div>
      </div>

      <div class="detail-section">
        <h5 class="detail-section-title"><i class="fa-solid fa-align-left me-2"></i>Description</h5>
        <p class="detail-desc">${p.description}</p>
      </div>
      <div class="detail-section detail-seller-box">
        <h5 class="detail-section-title"><i class="fa-solid fa-store me-2"></i>Fournisseur</h5>
        <div class="detail-seller">
          <img src="${v.avatar}" alt="${v.nom}" class="detail-seller-avatar">
          <div>
            <div class="detail-seller-name">${v.nom}</div>
            <div class="detail-seller-loc"><i class="fa-solid fa-location-dot me-1"></i>${v.localisation}</div>
            <div class="detail-seller-bio">${v.bio}</div>
            <div class="detail-seller-contacts mt-2">
              <span><i class="fa-solid fa-phone me-1"></i>${v.telephone}</span>
              <span><i class="fa-solid fa-envelope me-1"></i>${v.email}</span>
            </div>
          </div>
        </div>
      </div>
      <button class="${btnClass} w-100 mt-3" ${btnDisabled} style="padding:.85rem; border-radius:12px; font-size:1rem;">
        <i class="fa-solid fa-bag-shopping me-2"></i>${btnLabel}
      </button>
    </div>`;
}

// ═══════════════════════════════════════════════
// INIT PAGE (services.html & produits.html)
// ═══════════════════════════════════════════════

function initPage(type) {
  // Load data from API before initializing page
  initializeData().then(() => {
    const state = {
      type,
      search: '',
      cat: 'tous',
      priceMax: type === 'services' ? 2000 : 20000,
      minRating: 0,
    };

    const data    = type === 'services' ? SERVICES : PRODUITS;
    const gridId  = type === 'services' ? 'servicesGrid' : 'produitsGrid';
    const grid    = document.getElementById(gridId);
    const noRes   = document.getElementById('noResults');
    const resInfo = document.getElementById('resultsInfo');

  // ── Search ─────────────────────────────────────────────────
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');

  searchInput.addEventListener('input', () => {
    state.search = searchInput.value.trim().toLowerCase();
    searchClear.style.display = state.search ? 'flex' : 'none';
    render();
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    state.search = '';
    searchClear.style.display = 'none';
    render();
  });

  // ── Filter toggle ──────────────────────────────────────────
  const filterPanel  = document.getElementById('filterPanel');
  const filterToggle = document.getElementById('filterToggle');

  filterToggle.addEventListener('click', () => {
    filterPanel.classList.toggle('open');
    filterToggle.classList.toggle('active');
  });

  // ── Price range ────────────────────────────────────────────
  const priceRange = document.getElementById('priceRange');
  const priceVal   = document.getElementById('priceVal');

  priceRange.addEventListener('input', () => {
    state.priceMax = +priceRange.value;
    priceVal.textContent = Number(priceRange.value).toLocaleString('fr') + ' DT';
    render();
  });

  // ── Star filter ────────────────────────────────────────────
  document.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.minRating = parseFloat(btn.dataset.min);
      render();
    });
  });

  // ── Reset filters ──────────────────────────────────────────
  document.getElementById('resetFilters').addEventListener('click', () => {
    state.search   = '';
    state.cat      = 'tous';
    state.minRating = 0;
    state.priceMax  = type === 'services' ? 2000 : 20000;
    searchInput.value = '';
    searchClear.style.display = 'none';
    priceRange.value = priceRange.max;
    priceVal.textContent = Number(priceRange.max).toLocaleString('fr') + ' DT';
    document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.star-btn[data-min="0"]').classList.add('active');
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.cat-tab[data-cat="tous"]').classList.add('active');
    render();
  });

  // ── Category tabs ──────────────────────────────────────────
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.cat = tab.dataset.cat;
      render();
    });
  });

  // ── Filter ────────────────────────────────────────────────
  function filter() {
    return data.filter(item => {
      const seller = type === 'services'
        ? VENDEURS[item.prestataire]?.nom.toLowerCase()
        : VENDEURS[item.fournisseur]?.nom.toLowerCase();
      const matchSearch  = !state.search
        || item.titre.toLowerCase().includes(state.search)
        || (seller && seller.includes(state.search));
      const matchCat     = state.cat === 'tous' || item.categorie === state.cat;
      const matchPrice   = item.prix <= state.priceMax;
      const matchRating  = item.rating >= state.minRating;
      return matchSearch && matchCat && matchPrice && matchRating;
    });
  }

  // ── Render ────────────────────────────────────────────────
  function render() {
    const items = filter();
    resInfo.textContent = `${items.length} ${type === 'services' ? 'service(s)' : 'produit(s)'} trouvé(s)`;

    if (items.length === 0) {
      grid.innerHTML = '';
      noRes.style.display = 'flex';
      return;
    }
    noRes.style.display = 'none';
    grid.innerHTML = items.map(item =>
      type === 'services' ? serviceCardHtml(item) : produitCardHtml(item)
    ).join('');

    attachCardEvents();
  }

  // ── Attach events ─────────────────────────────────────────
  function attachCardEvents() {
    document.querySelectorAll('.card-details-link').forEach(el => {
      el.addEventListener('click', () => openDetailModal(el.dataset.id, el.dataset.type));
    });
    // Ouvrir la card de détails aussi depuis les boutons Réserver / Commander
    document.querySelectorAll('.btn-reserve, .btn-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (btn.disabled) return;
        const card = btn.closest('.service-card, .product-card');
        const link = card ? card.querySelector('.card-details-link') : null;
        if (link) openDetailModal(link.dataset.id, link.dataset.type);
      });
    });
    document.querySelectorAll('.seller-name').forEach(el => {
      el.addEventListener('mouseenter', e => showSellerTooltip(e, el.dataset.vid));
      el.addEventListener('mouseleave', hideSellerTooltip);
      el.addEventListener('focus',      e => showSellerTooltip(e, el.dataset.vid));
      el.addEventListener('blur',       hideSellerTooltip);
    });
  }

  // ── Seller tooltip ────────────────────────────────────────
  const tooltip = document.getElementById('sellerTooltip');
  let tooltipTimer;

  function showSellerTooltip(e, vid) {
    const v = VENDEURS[vid];
    if (!v) return;
    clearTimeout(tooltipTimer);
    tooltip.innerHTML = `
      <div class="tt-header">
        <img src="${v.avatar}" alt="${v.nom}" class="tt-avatar">
        <div>
          <div class="tt-name">${v.nom}</div>
          <div class="tt-location"><i class="fa-solid fa-location-dot me-1"></i>${v.localisation}</div>
        </div>
      </div>
      <p class="tt-bio">${v.bio}</p>
      <div class="tt-footer">
        <span><i class="fa-solid fa-comment-dots me-1"></i>${v.nbAvis} avis</span>
        <span><i class="fa-solid fa-envelope me-1"></i>${v.email}</span>
      </div>`;
    tooltip.classList.add('visible');
    positionTooltip(e);
  }

  function positionTooltip(e) {
    const rect = e.target.getBoundingClientRect();
    const ttW  = 260;
    let left   = rect.left + window.scrollX;
    let top    = rect.bottom + window.scrollY + 8;
    if (left + ttW > window.innerWidth - 16) left = window.innerWidth - ttW - 16;
    if (left < 8) left = 8;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top + 'px';
  }

  function hideSellerTooltip() {
    tooltipTimer = setTimeout(() => tooltip.classList.remove('visible'), 180);
  }

  tooltip.addEventListener('mouseenter', () => clearTimeout(tooltipTimer));
  tooltip.addEventListener('mouseleave', hideSellerTooltip);

  // ── Detail modal ──────────────────────────────────────────
  const detailModalEl   = document.getElementById('detailModal');
  const detailModalBody = document.getElementById('detailModalBody');

  // item actuellement affiché dans le modal (pour handlers délégués)
  let modalCurrentItem = null;

  // délégation: gérer les clicks sur Commander / Réserver directement depuis le modal
  detailModalBody.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-reserve, .btn-cart');
    if (!btn) return;
    if (!isUserConnected()) {
      window.location.href = 'login.html';
      return;
    }
    if (btn.disabled) return;

    if (btn.classList.contains('btn-reserve')) {
      btn.disabled = true;
      btn.classList.add('disabled');
      btn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Demande envoyé';
      if (modalCurrentItem && typeof sendReservation === 'function') {
        try { sendReservation(modalCurrentItem.id); } catch (err) { /* ignore */ }
      }
      if (bsModal) bsModal.hide();
      return;
    }

    if (btn.classList.contains('btn-cart')) {
      // récupérer quantité si présente
      const qtyInput = detailModalBody.querySelector('.detail-qty-input');
      const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
      btn.disabled = true;
      btn.classList.add('disabled');
      btn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Demande envoyé';
      if (modalCurrentItem && typeof addToCart === 'function') {
        try { addToCart(modalCurrentItem.id, qty); } catch (err) { /* ignore */ }
      }
      if (bsModal) bsModal.hide();
      return;
    }
  });

  // ✅ Vérification bootstrap avant instanciation
  const bsModal = typeof bootstrap !== 'undefined'
    ? new bootstrap.Modal(detailModalEl)
    : null;

  // Support clavier dans le modal: + pour augmenter, - pour diminuer
  detailModalEl.addEventListener('keydown', (e) => {
    const qtyInputGlob = detailModalBody.querySelector('.detail-qty-input');
    if (!qtyInputGlob) return;
    // accepter '+' et '-' (numpad et clavier principal)
    if (e.key === '+' || e.key === 'Add') {
      e.preventDefault();
      const inc = detailModalBody.querySelector('.qty-increase');
      if (inc && !inc.disabled) inc.click();
    } else if (e.key === '-' || e.key === 'Subtract') {
      e.preventDefault();
      const dec = detailModalBody.querySelector('.qty-decrease');
      if (dec && !dec.disabled) dec.click();
    }
  });

  function openDetailModal(id, itemType) {
    const item = itemType === 'service'
      ? SERVICES.find(s => s.id === id)
      : PRODUITS.find(p => p.id === id);
    if (!item) return;

    const vendeurKey = itemType === 'service' ? item.prestataire : item.fournisseur;
    const v = VENDEURS[vendeurKey] || {};

    // stocker item courant pour les handlers délégués
    modalCurrentItem = { id: item.id, type: itemType, item };

    if (itemType === 'service') {
      detailModalBody.innerHTML = serviceDetailHtml(item, v);
      // changer le texte du bouton Réserver après clic
      const reserveBtn = detailModalBody.querySelector('.btn-reserve');
      if (reserveBtn) {
        reserveBtn.addEventListener('click', (e) => {
          if (reserveBtn.disabled) return;
          reserveBtn.disabled = true;
          reserveBtn.classList.add('disabled');
          reserveBtn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Demande envoyé';
          if (typeof sendReservation === 'function') {
            try { sendReservation(item.id); } catch (err) { /* ignore */ }
          }
          if (bsModal) bsModal.hide();
        });
      }
    } else {
      detailModalBody.innerHTML = produitDetailHtml(item, v);
      // --- quantity selector + total calculation for produit detail ---
      const qtyInput = detailModalBody.querySelector('.detail-qty-input');
      const totalEl  = detailModalBody.querySelector('.detail-total-price');
      const orderBtn = detailModalBody.querySelector('.btn-cart');
      const stock    = item.stock || 0;
      const price    = item.prix || 0;

      if (qtyInput) {
        // Forcer la saisie via boutons +/- (éviter saisie directe et flèches)
        try { qtyInput.readOnly = true; } catch (e) { /* silent */ }
        const btnInc = detailModalBody.querySelector('.qty-increase');
        const btnDec = detailModalBody.querySelector('.qty-decrease');

        if (stock <= 0) {
          qtyInput.value = 0;
          qtyInput.min = 0;
          qtyInput.max = 0;
          qtyInput.disabled = true;
          if (btnInc) btnInc.disabled = true;
          if (btnDec) btnDec.disabled = true;
        } else {
          qtyInput.value = 1;
          qtyInput.min = 1;
          qtyInput.max = stock;
          qtyInput.disabled = false;
          if (btnInc) btnInc.disabled = false;
          if (btnDec) btnDec.disabled = false;
        }

        const updateTotal = () => {
          let q = parseInt(qtyInput.value, 10) || 0;
          if (stock <= 0) q = 0;
          else {
            if (q < 1) q = 1;
            if (q > stock) q = stock;
          }
          qtyInput.value = q;
          if (totalEl) totalEl.textContent = (price * q).toLocaleString('fr') + ' DT';
          if (orderBtn) {
            orderBtn.disabled = !item.disponible || q <= 0;
            if (!item.disponible) orderBtn.classList.add('disabled');
            else orderBtn.classList.remove('disabled');
          }
        };

        qtyInput.addEventListener('input', updateTotal);
        qtyInput.addEventListener('change', updateTotal);

        if (btnInc) {
          btnInc.addEventListener('click', () => {
            let q = parseInt(qtyInput.value, 10) || 0;
            q = Math.min(q + 1, stock);
            qtyInput.value = q;
            qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
          });
        }
        if (btnDec) {
          btnDec.addEventListener('click', () => {
            let q = parseInt(qtyInput.value, 10) || 0;
            q = Math.max(q - 1, stock > 0 ? 1 : 0);
            qtyInput.value = q;
            qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
          });
        }

        // keyboard friendly: clamp on blur
        qtyInput.addEventListener('blur', updateTotal);
        updateTotal();
      }

      if (orderBtn) {
        orderBtn.addEventListener('click', (e) => {
          if (orderBtn.disabled) return;
          const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
          // feedback utilisateur
          orderBtn.disabled = true;
          orderBtn.classList.add('disabled');
          orderBtn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Demande envoyé';
          if (typeof addToCart === 'function') {
            try { addToCart(item.id, qty); } catch (err) { /* ignore */ }
          } else {
            if (bsModal) bsModal.hide();
          }
        });
      }
    }

    // ✅ Vérification bsModal avant show()
    if (bsModal) bsModal.show();
  }

  // ── Initial render ────────────────────────────────────────
  render();
  });
}