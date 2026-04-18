/* prestataire-avis.js */
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('appLayout');

  const reviews = [
    { initials:'FS', name:'Ferme du Soleil',   date:'Il y a 2 jours',    stars:5, service:'Labour de précision',    text:'Prestataire exceptionnel ! Travail soigné, rapide et très professionnel. L\'équipement est moderne et bien entretenu. Je recommande sans hésiter pour vos travaux de labour.' },
    { initials:'GP', name:'GAEC Les Plaines',  date:'Il y a 5 jours',    stars:5, service:'Installation irrigation', text:'Installation parfaite du système d\'irrigation. L\'équipe a respecté les délais et expliqué le fonctionnement en détail. Très satisfait du résultat.' },
    { initials:'JM', name:'Jean Martin',       date:'Il y a 1 semaine',  stars:4, service:'Conseil sol',             text:'Bons conseils et rapport détaillé. Quelques points techniques à clarifier mais globalement une prestation de qualité. Je referai appel à ce prestataire.' },
    { initials:'SC', name:'SCA Val de Loire',  date:'Il y a 2 semaines', stars:5, service:'Semis drone',             text:'Technologie impressionnante et résultats visibles dès la levée. La répartition des semences est parfaitement homogène. Très bonne expérience.' },
    { initials:'FB', name:'Ferme Beaumont',    date:'Il y a 3 semaines', stars:5, service:'Taille de vergers',       text:'Taille de précision réalisée avec soin. Mes arbres fruitiers sont en bien meilleure forme. Excellent rapport qualité-prix pour ce niveau de service.' },
    { initials:'CA', name:'Coop Agricole 34',  date:'Il y a 1 mois',     stars:3, service:'Analyse de sol',         text:'Analyse correcte avec un bon rapport. Le délai de rendu était un peu long mais les informations sont complètes. Service acceptable.' },
  ];

  function starsHTML(n) {
    return Array.from({length:5}).map((_,i) => `<i class="fa fa-star" style="color:${i<n?'var(--gold)':'#e0ddd5'};font-size:.82rem"></i>`).join('');
  }

  function renderReviews(data) {
    document.getElementById('reviewsGrid').innerHTML = data.map(r => `
      <div class="review-card">
        <div class="review-top">
          <div class="reviewer">
            <div class="reviewer-avatar">${r.initials}</div>
            <div><div class="reviewer-name">${r.name}</div><div class="reviewer-date">${r.date}</div></div>
          </div>
          <div class="review-stars">${starsHTML(r.stars)}</div>
        </div>
        <div class="review-service"><i class="fa fa-tag"></i> ${r.service}</div>
        <p class="review-text">${r.text}</p>
      </div>`).join('');
  }

  layout.innerHTML = getSidebarHTML('avis') + `
  <main class="main">
    <header class="main-header">
      <div><h1 class="page-title">Avis clients</h1><p class="page-sub">Consultez les retours de vos clients sur vos prestations.</p></div>
      <div class="header-actions"><button class="avatar" id="profileBtn" title="Mon Profil"> </button></div>
    </header>

    <div class="avis-overview">
      <div class="score-card">
        <div class="score-big">4.9</div>
        <div class="stars-row">
          ${[1,2,3,4,5].map(()=>`<i class="fa fa-star" style="color:var(--gold);font-size:1rem"></i>`).join('')}
        </div>
        <p class="score-sub">Note moyenne</p>
        <p class="score-count">Basé sur 128 avis</p>
      </div>
      <div class="distrib-card">
        ${[{n:5,p:85},{n:4,p:10},{n:3,p:3},{n:2,p:1},{n:1,p:1}].map(s=>`
          <div class="distrib-row">
            <span class="distrib-label">${s.n}</span>
            <div class="distrib-bar-bg"><div class="distrib-bar-fill" style="width:${s.p}%"></div></div>
            <span class="distrib-pct">${s.p}%</span>
          </div>`).join('')}
      </div>
    </div>

    <div class="reviews-header">
      <h3 style="font-family:var(--font-head);font-size:1rem;font-weight:600">128 avis reçus</h3>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <div class="star-filter" id="starFilter">
          <button class="star-filter-btn active" data-s="0">Tous</button>
          <button class="star-filter-btn" data-s="5"><i class="fa fa-star"></i> 5</button>
          <button class="star-filter-btn" data-s="4"><i class="fa fa-star"></i> 4</button>
          <button class="star-filter-btn" data-s="3"><i class="fa fa-star"></i> 3</button>
        </div>
        <select class="sort-select" id="sortAvis">
          <option value="recent">Les plus récents</option>
          <option value="best">Meilleures notes</option>
          <option value="worst">Notes les plus basses</option>
        </select>
      </div>
    </div>
    <div class="reviews-grid" id="reviewsGrid"></div>
  </main>`;

  initSidebar('avis');
  renderReviews(reviews);

  document.getElementById('starFilter').addEventListener('click', e => {
    const btn = e.target.closest('.star-filter-btn');
    if (!btn) return;
    document.querySelectorAll('.star-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const s = parseInt(btn.dataset.s);
    renderReviews(s === 0 ? reviews : reviews.filter(r => r.stars === s));
  });
  document.getElementById('sortAvis').addEventListener('change', function() {
    let d = [...reviews];
    if (this.value === 'best') d.sort((a,b)=>b.stars-a.stars);
    if (this.value === 'worst') d.sort((a,b)=>a.stars-b.stars);
    renderReviews(d);
  });
});
