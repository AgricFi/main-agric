// ── NAV HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

// ── WALLET CONNECT ──
const connectButton = document.getElementById('connectButton');
if (connectButton) {
  connectButton.addEventListener('click', async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        connectButton.textContent = 'Connected: ' + accounts[0].slice(0, 6) + '...' + accounts[0].slice(-4);
        connectButton.style.background = 'var(--green)';
        connectButton.style.color = '#fff';
      } catch (err) {
        console.error(err);
        alert('Wallet connection failed. Please try again.');
      }
    } else {
      alert('No Web3 wallet found. Please install MetaMask or a supported wallet.');
    }
  });
}

// ── CHARTS (token distribution + revenue ROI) ──
function initCharts() {
  const tokenEl = document.getElementById('tokenChart');
  if (tokenEl && window.Chart) {
    new Chart(tokenEl.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Public Sale 25%','Team 15%','Staking 20%','Liquidity 10%','Ecosystem 20%','Partnerships 10%'],
        datasets: [{
          data: [25, 15, 20, 10, 20, 10],
          backgroundColor: ['#22c55e','#f59e0b','#4ade80','#86efac','#fbbf24','#4b7a5c'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#86efac', font: { size: 10 } } }
        }
      }
    });
  }

  const revEl = document.getElementById('revenueChart');
  if (revEl && window.Chart) {
    new Chart(revEl.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Rev Share', 'Staking', 'NFT Apprec.', 'Carbon Credits'],
        datasets: [{
          label: 'Max ROI %',
          data: [50, 40, 100, 20],
          backgroundColor: ['#22c55e','#4ade80','#f59e0b','#86efac'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, ticks: { color: '#86efac' }, grid: { color: 'rgba(74,222,128,0.07)' } },
          x: { ticks: { color: '#86efac' }, grid: { display: false } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }
}

// ── SCROLL REVEAL ──
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  reveals.forEach(el => obs.observe(el));
}

// ── INIT ──
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { initCharts(); initReveal(); });
} else {
  initCharts(); initReveal();
}
