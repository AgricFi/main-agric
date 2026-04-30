// ── NAV HAMBURGER ──
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      navLinks.classList.toggle('open');
    });
    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
    // Close when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // ── WALLET CONNECT ──
  const connectButton = document.getElementById('connectButton');
  if (connectButton) {
    connectButton.addEventListener('click', async function () {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          connectButton.textContent = 'Connected: ' + accounts[0].slice(0,6) + '...' + accounts[0].slice(-4);
          connectButton.style.background = 'var(--green)';
          connectButton.style.color = '#fff';
          connectButton.style.borderColor = 'var(--green)';
        } catch (err) {
          alert('Wallet connection failed. Please try again.');
        }
      } else {
        alert('No Web3 wallet found. Please install MetaMask.');
      }
    });
  }

  // ── CHARTS ──
  if (window.Chart) {
    const tokenEl = document.getElementById('tokenChart');
    if (tokenEl) {
      new Chart(tokenEl.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['Public Sale 25%','Team 15%','Staking 20%','Liquidity 10%','Ecosystem 20%','Partnerships 10%'],
          datasets: [{ data: [25,15,20,10,20,10], backgroundColor: ['#22c55e','#f59e0b','#4ade80','#86efac','#fbbf24','#4b7a5c'], borderWidth: 0 }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#86efac', font: { size: 10 } } } } }
      });
    }
    const revEl = document.getElementById('revenueChart');
    if (revEl) {
      new Chart(revEl.getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['Rev Share','Staking','NFT Apprec.','Carbon Credits'],
          datasets: [{ data: [50,40,100,20], backgroundColor: ['#22c55e','#4ade80','#f59e0b','#86efac'], borderRadius: 6 }]
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
  document.querySelectorAll('.reveal').forEach(function (el) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 }).observe(el);
  });
});
