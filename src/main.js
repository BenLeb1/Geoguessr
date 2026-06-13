import { countryData } from './data/countryData.js';

// Derived data
const coveredCountries = new Set(Object.keys(countryData));

const continentColors = {
  Europe: 'var(--c-europe)',
  Asia: 'var(--c-asia)',
  Africa: 'var(--c-africa)',
  'North America': 'var(--c-namerica)',
  'South America': 'var(--c-samerica)',
  Oceania: 'var(--c-oceania)'
};
const continentHover = {
  Europe: 'var(--c-hover-europe)', Asia: 'var(--c-hover-asia)', Africa: 'var(--c-hover-africa)',
  'North America': 'var(--c-hover-namerica)', 'South America': 'var(--c-hover-samerica)', Oceania: 'var(--c-hover-oceania)'
};
const continentBg = {
  Europe: 'rgba(78,124,186,.18)', Asia: 'rgba(192,118,58,.18)', Africa: 'rgba(196,168,32,.18)',
  'North America': 'rgba(63,160,107,.18)', 'South America': 'rgba(139,95,207,.18)', Oceania: 'rgba(46,168,160,.18)'
};

// ================================================================
//  MODAL STATE
// ================================================================
let currentCountry = null, currentCard = 0;
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');
const modalClose = document.getElementById('modal-close');
const modalCountry = document.getElementById('modal-country');
const modalCont = document.getElementById('modal-cont');
const modalFlag = document.getElementById('modal-flag');
const tipCountBadge = document.getElementById('tip-count-badge');
const cardCounter = document.getElementById('card-counter');
const progressFill = document.getElementById('progress-fill');
const flashcard = document.getElementById('flashcard');
const cardImg = document.getElementById('card-img');
const cardText = document.getElementById('card-text');
const cardHint = document.getElementById('card-hint');
const noTipsMsg = document.getElementById('no-tips-msg');
const cardNav = document.getElementById('card-nav');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const tt = document.getElementById('tt');

function openModal(name) {
  const d = countryData[name];
  if (!d) return;
  currentCountry = name; currentCard = 0;
  modalCountry.textContent = name;
  modalFlag.textContent = d.flag || '';
  const col = continentColors[d.continent] || '#aaa';
  const bg = continentBg[d.continent] || 'rgba(80,80,80,.2)';
  modalCont.textContent = d.continent;
  modalCont.style.color = col; modalCont.style.background = bg;
  const tc = d.tips.length;
  tipCountBadge.textContent = tc > 0 ? `${tc} tip${tc !== 1 ? 's' : ''}` : ' No tips yet';
  renderCard();
  modal.classList.add('open');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  overlay.classList.remove('show');
  document.body.style.overflow = '';
  currentCountry = null;
}

function renderCard() {
  const tips = countryData[currentCountry]?.tips || [];
  if (!tips.length) {
    flashcard.style.display = 'none'; cardNav.style.display = 'none';
    cardCounter.textContent = ''; noTipsMsg.style.display = 'block';
    progressFill.style.width = '0'; return;
  }
  noTipsMsg.style.display = 'none'; flashcard.style.display = 'flex'; cardNav.style.display = 'flex';
  const tip = tips[currentCard];
  cardCounter.textContent = `Tip ${currentCard + 1} / ${tips.length}`;
  progressFill.style.width = `${((currentCard + 1) / tips.length) * 100}%`;
  flashcard.classList.add('fade');
  setTimeout(() => {
    cardText.textContent = tip.text;
    if (tip.hint) { cardHint.textContent = `💡 ${tip.hint}`; cardHint.style.display = 'block'; }
    else { cardHint.style.display = 'none'; }
    if (tip.image) { cardImg.src = tip.image; cardImg.style.display = 'block'; }
    else { cardImg.style.display = 'none'; cardImg.src = ''; }
    flashcard.classList.remove('fade');
  }, 150);
  btnPrev.disabled = currentCard === 0;
  btnNext.disabled = currentCard === tips.length - 1;
}

btnPrev.addEventListener('click', () => { if (currentCard > 0) { currentCard--; renderCard(); } });
btnNext.addEventListener('click', () => { const t = countryData[currentCountry]?.tips || []; if (currentCard < t.length - 1) { currentCard++; renderCard(); } });
modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (!currentCountry) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowRight' && !btnNext.disabled) btnNext.click();
  if (e.key === 'ArrowLeft' && !btnPrev.disabled) btnPrev.click();
});

// Update header stats
const totalTips = Object.values(countryData).reduce((a, c) => a + (c.tips?.length || 0), 0);
const statCoveredEl = document.getElementById('stat-covered');
const statTipsEl = document.getElementById('stat-tips');
if (statCoveredEl) statCoveredEl.textContent = coveredCountries.size;
if (statTipsEl) statTipsEl.textContent = totalTips;

// ================================================================
//  MAP
// ================================================================
const nameOverrides = {
  'Dem. Rep. Congo': 'Democratic Republic of the Congo',
  'Dominican Rep.': 'Dominican Republic',
  'Falkland Is.': 'Falkland Islands',
  'Falkland Islands': 'Falkland Islands',
  'eSwatini': 'Eswatini',
  'Israel': 'Israel & the West Bank',
  'Macedonia': 'North Macedonia',
  'North Macedonia': 'North Macedonia',
  'South Georgia & Sandwich Islands': 'South Georgia & Sandwich Islands',
  'Curaçao': 'Curaçao',
  'United States of America': 'United States of America'
};

const isoToName = {
  "004": "Afghanistan",
  "008": "Albania",
  "010": "Antarctica",
  "012": "Algeria",
  "016": "American Samoa",
  "020": "Andorra",
  "024": "Angola",
  "032": "Argentina",
  "036": "Australia",
  "040": "Austria",
  "050": "Bangladesh",
  "056": "Belgium",
  "060": "Bermuda",
  "064": "Bhutan",
  "068": "Bolivia",
  "072": "Botswana",
  "076": "Brazil",
  "086": "British Indian Ocean Territory",
  "100": "Bulgaria",
  "112": "Belarus",
  "116": "Cambodia",
  "124": "Canada",
  "144": "Sri Lanka",
  "152": "Chile",
  "156": "China",
  "158": "Taiwan",
  "162": "Christmas Island",
  "166": "Cocos Islands",
  "170": "Colombia",
  "188": "Costa Rica",
  "191": "Croatia",
  "196": "Cyprus",
  "203": "Czechia",
  "208": "Denmark",
  "214": "Dominican Republic",
  "218": "Ecuador",
  "233": "Estonia",
  "234": "Faroe Islands",
  "238": "Falkland Islands",
  "239": "South Georgia & Sandwich Islands",
  "246": "Finland",
  "250": "France",
  "276": "Germany",
  "288": "Ghana",
  "292": "Gibraltar",
  "300": "Greece",
  "304": "Greenland",
  "316": "Guam",
  "320": "Guatemala",
  "348": "Hungary",
  "352": "Iceland",
  "356": "India",
  "360": "Indonesia",
  "368": "Iraq",
  "372": "Ireland",
  "376": "Israel & the West Bank",
  "380": "Italy",
  "392": "Japan",
  "398": "Kazakhstan",
  "400": "Jordan",
  "404": "Kenya",
  "410": "South Korea",
  "417": "Kyrgyzstan",
  "418": "Laos",
  "422": "Lebanon",
  "426": "Lesotho",
  "428": "Latvia",
  "438": "Liechtenstein",
  "440": "Lithuania",
  "442": "Luxembourg",
  "446": "Macau",
  "450": "Madagascar",
  "458": "Malaysia",
  "466": "Mali",
  "470": "Malta",
  "474": "Martinique",
  "484": "Mexico",
  "492": "Monaco",
  "496": "Mongolia",
  "499": "Montenegro",
  "512": "Oman",
  "516": "Namibia",
  "524": "Nepal",
  "528": "Netherlands",
  "531": "Curaçao",
  "548": "Vanuatu",
  "554": "New Zealand",
  "566": "Nigeria",
  "578": "Norway",
  "580": "Northern Mariana Islands",
  "581": "US Minor Outlying Islands",
  "586": "Pakistan",
  "591": "Panama",
  "604": "Peru",
  "608": "Philippines",
  "612": "Pitcairn Islands",
  "616": "Poland",
  "620": "Portugal",
  "630": "Puerto Rico",
  "634": "Qatar",
  "638": "Reunion",
  "642": "Romania",
  "643": "Russia",
  "646": "Rwanda",
  "666": "Saint Pierre and Miquelon",
  "674": "San Marino",
  "678": "São Tomé and Príncipe",
  "686": "Senegal",
  "688": "Serbia",
  "702": "Singapore",
  "703": "Slovakia",
  "704": "Vietnam",
  "705": "Slovenia",
  "710": "South Africa",
  "724": "Spain",
  "748": "Eswatini",
  "756": "Switzerland",
  "764": "Thailand",
  "784": "United Arab Emirates",
  "788": "Tunisia",
  "792": "Turkey",
  "800": "Uganda",
  "804": "Ukraine",
  "807": "North Macedonia",
  "818": "Egypt",
  "826": "United Kingdom",
  "832": "Jersey",
  "833": "Isle of Man",
  "834": "Tanzania",
  "840": "United States of America",
  "850": "US Virgin Islands",
  "858": "Uruguay"
};

async function loadMap() {
  const [worldRes] = await Promise.all([
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json()),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js'),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js')
  ]);
  buildMap(worldRes);
  const loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.style.display = 'none';
}

function loadScript(src) {
  return new Promise(r => { const s = document.createElement('script'); s.src = src; s.onload = r; document.head.appendChild(s); });
}

let panZoom = null;

function buildMap(world) {
  if (!window.d3 || !window.topojson) return;
  const container = document.getElementById('map-svg-container');
  const W = container.clientWidth || 960;
  const H = container.clientHeight || 500;

  const svg = d3.select(container).append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%').style('height', '100%');

  const proj = d3.geoNaturalEarth1().scale(W / 6.2).translate([W / 2, H / 2]);
  const path = d3.geoPath().projection(proj);
  const countries = topojson.feature(world, world.objects.countries);

  const franceFeature = countries.features.find(f => f.properties?.name === 'France');
  if (franceFeature?.geometry?.type === 'MultiPolygon') {
    franceFeature.geometry.coordinates = franceFeature.geometry.coordinates.filter(polygon => {
      const points = polygon.flat();
      const [sumLon, sumLat] = points.reduce((acc, pt) => [acc[0] + pt[0], acc[1] + pt[1]], [0, 0]);
      const avgLon = sumLon / points.length;
      const avgLat = sumLat / points.length;
      return !(avgLon < -30 && avgLon > -90 && avgLat > -20 && avgLat < 10);
    });
  }

  const g = svg.append('g').attr('id', 'map-g');
  svg.insert('rect', 'g').attr('width', W).attr('height', H).attr('fill', '#0d1420');

  g.selectAll('path.country')
    .data(countries.features)
    .join('path')
    .attr('class', 'country-path')
    .attr('d', path)
    .each(function (d) {
      const id = String(d.id).padStart(3, '0');
      const rawName = d.properties?.name || isoToName[id] || isoToName[String(d.id)];
      const name = rawName && nameOverrides[rawName] ? nameOverrides[rawName] : rawName;
      const covered = name && coveredCountries.has(name);
      const cont = covered ? countryData[name]?.continent : null;
      const fill = covered ? (continentColors[cont] || '#555') : 'var(--c-grey)';
      d3.select(this)
        .attr('fill', fill).attr('stroke', '#060a14').attr('stroke-width', 0.4)
        .attr('cursor', covered ? 'pointer' : 'default')
        .attr('data-name', name || '').attr('data-covered', covered ? '1' : '0')
        .attr('data-fill', fill);
    })
    .on('mousemove', function (event) {
      const name = this.getAttribute('data-name');
      const covered = this.getAttribute('data-covered') === '1';
      if (!covered || !name) return;
      
      // Use CSS class for hover effects instead of manual JS fill changes
      // This keeps the continent colors visible under the hover filter
      const tips = countryData[name]?.tips?.length || 0;
      const cont = countryData[name]?.continent;
      document.getElementById('tt-name').textContent = (countryData[name]?.flag || '') + ' ' + name;
      document.getElementById('tt-cont').textContent = `${cont} · ${tips} tip${tips !== 1 ? 's' : ''}`;
      tt.style.opacity = '1';
      tt.style.left = (event.clientX + 14) + 'px';
      tt.style.top = (event.clientY - 48) + 'px';
    })
    .on('mouseleave', function () { d3.select(this).attr('fill', this.getAttribute('data-fill')); tt.style.opacity = '0'; })
    .on('click', function () { const name = this.getAttribute('data-name'); const covered = this.getAttribute('data-covered') === '1'; if (covered && name) openModal(name); });

  const grat = d3.geoGraticule()();
  g.append('path').datum(grat).attr('class', 'graticule')
    .attr('d', path).attr('fill', 'none')
    .attr('stroke', 'rgba(255,255,255,0.04)').attr('stroke-width', 0.5);

  const zoom = d3.zoom().scaleExtent([0.8, 30]).on('zoom', e => g.attr('transform', e.transform));
  svg.call(zoom);
  panZoom = { svg, zoom, W, H };

  document.getElementById('zin').onclick = () => svg.transition().duration(300).call(zoom.scaleBy, 1.6);
  document.getElementById('zout').onclick = () => svg.transition().duration(300).call(zoom.scaleBy, 0.625);
  document.getElementById('zreset').onclick = () => svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity);
}

// ================================================================
//  SEARCH
// ================================================================
const searchInput = document.getElementById('search');
const sugBox = document.getElementById('suggestions');
const allNames = Object.keys(countryData).sort();

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    sugBox.innerHTML = '';
    if (!q) { sugBox.style.display = 'none'; return; }
    const matches = allNames.filter(n => n.toLowerCase().includes(q)).slice(0, 8);
    if (!matches.length) { sugBox.style.display = 'none'; return; }
    matches.forEach(name => {
      const d = countryData[name];
      const tc = d.tips.length;
      const col = continentColors[d.continent] || '#aaa';
      const div = document.createElement('div');
      div.className = 's-item';
      div.innerHTML = `<span>${d.flag || ''} ${name}</span>
        <span class="s-badge" style="color:${col};background:${continentBg[d.continent] || 'rgba(80,80,80,.2)'}">${d.continent}</span>`;
      div.addEventListener('click', () => { searchInput.value = ''; sugBox.style.display = 'none'; openModal(name); });
      sugBox.appendChild(div);
    });
    sugBox.style.display = 'block';
  });

  document.addEventListener('click', e => { if (!document.getElementById('search-wrap').contains(e.target)) sugBox.style.display = 'none'; });

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { const first = sugBox.querySelector('.s-item'); if (first) first.click(); }
    if (e.key === 'Escape') { sugBox.style.display = 'none'; searchInput.blur(); }
  });
}

// ================================================================
//  INIT
// ================================================================
loadMap().catch(err => {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.innerHTML = '<p style="color:#f87171">Failed to load map. Check your internet connection.</p>';
  console.error(err);
});
