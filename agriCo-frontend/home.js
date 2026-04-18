(function () {
  // Initialize data from API first
  initializeData().then(() => {
    const servicesGrid = document.getElementById('homeServicesGrid');
    const produitsGrid = document.getElementById('homeProduitsGrid');

    servicesGrid.innerHTML = SERVICES.slice(0, 6).map(serviceCardHtml).join('');
    produitsGrid.innerHTML = PRODUITS.slice(0, 3).map(produitCardHtml).join('');

  // ── Tooltip ──────────────────────────────────────────────
  const tooltip = document.getElementById('sellerTooltip');
  let tooltipTimer;

  function showTooltip(e, vid) {
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
    const rect = e.target.getBoundingClientRect();
    const ttW  = 260;
    let left   = rect.left + window.scrollX;
    let top    = rect.bottom + window.scrollY + 8;
    if (left + ttW > window.innerWidth - 16) left = window.innerWidth - ttW - 16;
    if (left < 8) left = 8;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top + 'px';
  }

  function hideTooltip() {
    tooltipTimer = setTimeout(() => tooltip.classList.remove('visible'), 180);
  }

  tooltip.addEventListener('mouseenter', () => clearTimeout(tooltipTimer));
  tooltip.addEventListener('mouseleave', hideTooltip);

  // ── Modal ─────────────────────────────────────────────────
  const detailModalEl   = document.getElementById('detailModal');
  const detailModalBody = document.getElementById('detailModalBody');
  const bsModal = typeof bootstrap !== 'undefined'
    ? new bootstrap.Modal(detailModalEl)
    : null;

  // ── Events ────────────────────────────────────────────────
  document.querySelectorAll('.card-details-link').forEach(el => {
    el.addEventListener('click', () => {
      const { id, type } = el.dataset;
      let item, vendeurKey;

      if (type === 'service') {
        item = SERVICES.find(s => s.id === id);
        vendeurKey = item?.prestataire;
        if (item) detailModalBody.innerHTML = serviceDetailHtml(item, VENDEURS[vendeurKey] || {});
        // changer texte du bouton Réserver dans le modal
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
          });
        }
      } else {
        item = PRODUITS.find(p => p.id === id);
        vendeurKey = item?.fournisseur;
        if (item) detailModalBody.innerHTML = produitDetailHtml(item, VENDEURS[vendeurKey] || {});
      }

      // if produit, attach quantity handlers (same behavior as pages.js)
      if (type === 'produit' && item) {
        const qtyInput = detailModalBody.querySelector('.detail-qty-input');
        const totalEl  = detailModalBody.querySelector('.detail-total-price');
        const orderBtn = detailModalBody.querySelector('.btn-cart');
        const stock    = item.stock || 0;
        const price    = item.prix || 0;

        if (qtyInput) {
          try { qtyInput.readOnly = true; } catch (e) {}
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

          qtyInput.addEventListener('blur', updateTotal);
          updateTotal();
        }

        if (orderBtn) {
          orderBtn.addEventListener('click', (e) => {
            if (!isUserConnected()) {
              window.location.href = 'login.html';
              return;
            }
            if (orderBtn.disabled) return;
            const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
            // feedback
            orderBtn.disabled = true;
            orderBtn.classList.add('disabled');
            orderBtn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Demande envoyé';
            if (typeof addToCart === 'function') {
              try { addToCart(item.id, qty); } catch (err) { /* ignore */ }
            }
            if (bsModal) bsModal.hide();
          });
        }
      }

      // ✅ item existe ici, dans le bon scope
      if (item && bsModal) bsModal.show();
    });
  });

  // Ouvrir le modal de détails depuis les boutons Réserver / Commander sur la page d'accueil
  document.querySelectorAll('.btn-reserve, .btn-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.disabled) return;
      const card = btn.closest('.service-card, .product-card');
      const link = card ? card.querySelector('.card-details-link') : null;
      if (!link) return;
      const { id, type } = link.dataset;
      let item, vendeurKey;

      if (type === 'service') {
        item = SERVICES.find(s => s.id === id);
        vendeurKey = item?.prestataire;
        if (item) detailModalBody.innerHTML = serviceDetailHtml(item, VENDEURS[vendeurKey] || {});
        // changer texte du bouton Réserver dans le modal
        const reserveBtnHome = detailModalBody.querySelector('.btn-reserve');
        if (reserveBtnHome) {
          reserveBtnHome.addEventListener('click', (e) => {
            if (reserveBtnHome.disabled) return;
            reserveBtnHome.disabled = true;
            reserveBtnHome.classList.add('disabled');
            reserveBtnHome.innerHTML = '<i class="fa-solid fa-check me-2"></i>Demande envoyé';
            if (typeof sendReservation === 'function') {
              try { sendReservation(item.id); } catch (err) { /* ignore */ }
            }
            if (bsModal) bsModal.hide();
          });
        }
      } else {
        item = PRODUITS.find(p => p.id === id);
        vendeurKey = item?.fournisseur;
        if (item) detailModalBody.innerHTML = produitDetailHtml(item, VENDEURS[vendeurKey] || {});
      }

      if (item && bsModal) bsModal.show();
    });
  });

  document.querySelectorAll('.seller-name').forEach(el => {
    el.addEventListener('mouseenter', e => showTooltip(e, el.dataset.vid));
    el.addEventListener('mouseleave', hideTooltip);
  });

  // ouvrir modal depuis les boutons Réserver / Commander (home)
  document.querySelectorAll('.btn-reserve, .btn-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!isUserConnected()) {
        window.location.href = 'login.html';
        return;
      }
      if (btn.disabled) return;
      const card = btn.closest('.service-card, .product-card');
      const link = card ? card.querySelector('.card-details-link') : null;
      if (!link) return;
      const { id, type } = link.dataset;
      let item, vendeurKey;

      if (type === 'service') {
        item = SERVICES.find(s => s.id === id);
        vendeurKey = item?.prestataire;
        if (item) detailModalBody.innerHTML = serviceDetailHtml(item, VENDEURS[vendeurKey] || {});
      } else {
        item = PRODUITS.find(p => p.id === id);
        vendeurKey = item?.fournisseur;
        if (item) detailModalBody.innerHTML = produitDetailHtml(item, VENDEURS[vendeurKey] || {});
      }

      // si produit, attacher handlers +/-
      if (type === 'produit' && item) {
        const qtyInput = detailModalBody.querySelector('.detail-qty-input');
        const totalEl  = detailModalBody.querySelector('.detail-total-price');
        const orderBtn = detailModalBody.querySelector('.btn-cart');
        const stock    = item.stock || 0;
        const price    = item.prix || 0;

        if (qtyInput) {
          try { qtyInput.readOnly = true; } catch (e) {}
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

          qtyInput.addEventListener('blur', updateTotal);
          updateTotal();
        }

        if (orderBtn) {
          orderBtn.addEventListener('click', (e) => {
            if (!isUserConnected()) {
              window.location.href = 'login.html';
              return;
            }
            if (orderBtn.disabled) return;
            const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
            // feedback
            orderBtn.disabled = true;
            orderBtn.classList.add('disabled');
            orderBtn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Demande envoyé';
            if (typeof addToCart === 'function') {
              try { addToCart(item.id, qty); } catch (err) { /* ignore */ }
            }
            if (bsModal) bsModal.hide();
          });
        }
      }

      if (item && bsModal) bsModal.show();
    });
  });
  });

})();




