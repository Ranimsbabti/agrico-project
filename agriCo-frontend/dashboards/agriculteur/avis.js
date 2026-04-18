/* avis.js */
document.addEventListener('DOMContentLoaded', () => {

  const layout = document.getElementById('appLayout');
  layout.innerHTML = getSidebarHTML('avis') + `
  <main class="main">
    <header class="main-header">
      <div>
        <h1 class="page-title">Mes Avis</h1>
        <p class="page-sub">Consultez les avis que vous avez laissés sur vos produits et services commandés ou réservés.</p>
      </div>
      <div class="header-actions">
        <button class="avatar" id="profileBtn" title="Mon Profil"> </button>
      </div>
    </header>

    <!-- Overview Removed as requested -->

    <!-- Reviews list -->
    <div class="reviews-header">
      <h3 id="myReviewsTitle" style="font-family:var(--font-head);font-size:1rem;font-weight:600;">Mes avis</h3>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
        <select class="sort-select" id="sortAvis">
          <option value="recent">Les plus récents</option>
          <option value="old">Les plus anciens</option>
          <option value="best">Meilleures notes</option>
          <option value="worst">Notes les plus basses</option>
        </select>
      </div>
    </div>

    <div class="reviews-grid" id="reviewsGrid"></div>
  </main>`;

  initSidebar('avis');

  // Reviews authored by the current agriculteur (sample data)
  const reviews = [
    { id: 'AV-001', initials:'JD', date:'08 Mars 2024', stars:5, type:'produit', item:'Semences de blé bio', text:'Très bonnes semences, excellente germination.' },
    { id: 'AV-002', initials:'JD', date:'12 Mars 2024', stars:4, type:'service', item:'Labour de précision', text:'Bon travail, mais petit retard à l\'arrivée.' },
    { id: 'AV-003', initials:'JD', date:'22 Mars 2024', stars:5, type:'produit', item:'Aliment bétail NutriFarm', text:'Amélioration visible de la troupe.' },
  ];

  function starsHTML(n) {
    return Array.from({length:5}).map((_,i) => `<i class="fa fa-star${i < n ? '' : '-half-stroke'}" style="color:${i < n ? 'var(--gold)' : '#ddd'};font-size:.8rem"></i>`).join('');
  }

  function renderReviews(data) {
    document.getElementById('reviewsGrid').innerHTML = data.map(r => `
      <div class="review-card" data-id="${r.id}">
        <div class="review-top">
          <div class="reviewer">
            <div class="reviewer-avatar">${r.initials}</div>
            <div>
              <div class="reviewer-name">Vous</div>
              <div class="reviewer-date">${r.date}</div>
            </div>
          </div>
          <div class="review-stars">${starsHTML(r.stars)}</div>
        </div>
        <div class="review-service"><i class="fa fa-tag"></i> ${r.type === 'produit' ? 'Produit' : 'Service'} : <strong>${r.item}</strong></div>
        <p class="review-text">${r.text}</p>
        <div style="display:flex;gap:8px;margin-top:10px;justify-content:flex-end">
          <button class="btn-outline btn-edit" data-id="${r.id}">Modifier</button>
          <button class="btn-outline btn-delete" data-id="${r.id}">Supprimer</button>
        </div>
      </div>`).join('');
    document.getElementById('myReviewsTitle').textContent = `Mes avis laissés (${data.length})`;

  }

  renderReviews(reviews);

  // Edit / Delete handlers for user's own reviews
  document.getElementById('reviewsGrid').addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-edit');
    const delBtn = e.target.closest('.btn-delete');
    if (editBtn) {
      const id = editBtn.dataset.id;
      const idx = reviews.findIndex(r => r.id === id);
      if (idx === -1) return;
      const newText = prompt('Modifier votre avis :', reviews[idx].text);
      if (newText === null) return; // cancelled
      const newStars = parseInt(prompt('Modifier la note (1-5) :', reviews[idx].stars), 10);
      if (!isNaN(newStars) && newStars >= 1 && newStars <= 5) reviews[idx].stars = newStars;
      reviews[idx].text = newText;
      renderReviews(reviews);
    }
    if (delBtn) {
      const id = delBtn.dataset.id;
      const idx = reviews.findIndex(r => r.id === id);
      if (idx === -1) return;
      if (confirm('Supprimer cet avis ?')) {
        reviews.splice(idx, 1);
        renderReviews(reviews);
      }
    }
  });

  /* Star filter */
  document.getElementById('starFilter').addEventListener('click', e => {
    const btn = e.target.closest('.star-filter-btn');
    if (!btn) return;
    document.querySelectorAll('.star-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const stars = parseInt(btn.dataset.stars);
    renderReviews(stars === 0 ? reviews : reviews.filter(r => r.stars === stars));
  });

  /* Sort */
  document.getElementById('sortAvis').addEventListener('change', function() {
    let sorted = [...reviews];
    if (this.value === 'best')   sorted.sort((a,b) => b.stars - a.stars);
    if (this.value === 'worst')  sorted.sort((a,b) => a.stars - b.stars);
    if (this.value === 'recent') sorted = [...reviews];
    if (this.value === 'old')    sorted = [...reviews].reverse();
    renderReviews(sorted);
  });
});
