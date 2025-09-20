const tokenData = [25,15,20,10,20,10];
const tokenLabels = ['Public Sale 25%','Team 15%','Staking 20%','Liquidity 10%','Ecosystem 20%','Partnerships 10%'];

function initCharts(){
  const tokenEl = document.getElementById('tokenChart');
  if(tokenEl){
    new Chart(tokenEl.getContext('2d'), {
      type:'doughnut',
      data:{ labels: tokenLabels, datasets:[{ data: tokenData, backgroundColor:['#4caf50','#ff9800','#2196f3','#9c27b0','#f44336','#00bcd4'] }] },
      options:{ responsive:true, plugins:{ legend:{ position:'bottom' } } }
    });
  }
  const revEl = document.getElementById('revenueChart');
  if(revEl){
    new Chart(revEl.getContext('2d'), {
      type:'bar',
      data:{ labels:['Revenue Sharing','Staking','NFT Appreciation','Carbon Credits'], datasets:[{ label:'Max ROI % (illustrative)', data:[50,40,100,20], backgroundColor:['#4caf50','#2196f3','#ff9800','#9c27b0'] }] },
      options:{ responsive:true, scales:{ y:{ beginAtZero:true, title:{ display:true, text:'ROI %' } } }, plugins:{ legend:{ display:false } } }
    });
  }
}

document.addEventListener('DOMContentLoaded', initCharts);