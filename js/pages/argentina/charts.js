document.addEventListener('DOMContentLoaded', () => {

  ChartConfig.applyDefaults();

  const { colors, tooltip, make, lineDataset, barDataset } = ChartConfig;

  const percentTick = v => v + '%';
  const percentLabel = ctx => ctx.raw.toFixed(1) + '%';

  const yPercent = {
    grid: { color: colors.gridLine },
    ticks: { color: colors.textMuted, callback: percentTick },
  };

/* FISCALE */
make(
  'chartFiscale', 'bar',
  ['2022', '2023', '2024', '2025'],
  [
    barDataset(
      [-2.00, -2.68, 1.78, 1.25],
      ctx => ctx.raw >= 0 ? colors.green : colors.red,
      { label: 'Saldo primario' }
    ),
    barDataset(
      [-3.81, -4.38, 0.30, 0.15],
      ctx => ctx.raw >= 0 ? 'rgba(90,184,138,0.4)' : 'rgba(224,90,90,0.4)',
      { label: 'Saldo fiscale' }
    ),
  ],
  {
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { boxWidth: 10, padding: 16, color: '#A8A499' },
        onClick: (e, legendItem, legend) => {
          const ci = legend.chart;
          const clickedIndex = legendItem.datasetIndex;
          const otherIndex = clickedIndex === 0 ? 1 : 0;
          const otherMeta = ci.getDatasetMeta(otherIndex);
          const clickedMeta = ci.getDatasetMeta(clickedIndex);

          if (otherMeta.hidden) {
            // Already in isolated view — restore both
            ci.data.datasets.forEach((ds, i) => {
              ci.getDatasetMeta(i).hidden = false;
            });
          } else {
            // Normal state — isolate clicked, hide other
            clickedMeta.hidden = false;
            otherMeta.hidden = true;
          }
          ci.update();
        }
      },
      tooltip: {
        ...tooltip,
        callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.raw.toFixed(2) + '%' },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: colors.textMuted } },
      y: { grid: { color: colors.gridLine }, ticks: { color: colors.textMuted, callback: v => v + '%' } }
    },
  }
);

  /* INFLAZIONE MENSILE */
  const inflEl = document.getElementById('chartInflazione');
  if (inflEl) {
    const inflCtx = inflEl.getContext('2d');
    const inflGradient = inflCtx.createLinearGradient(0, 0, 0, 320);
    inflGradient.addColorStop(0, 'rgba(196,165,90,0.25)');
    inflGradient.addColorStop(1, 'rgba(196,165,90,0)');

    new Chart(inflEl, {
      type: 'line',
      data: {
        labels: [
          'Gen 22','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic',
          'Gen 23','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic',
          'Gen 24','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic',
          'Gen 25','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic 25',
        ],
        datasets: [{
          data: [
            3.9,4.7,6.7,6.0,5.1,5.3,7.4,7.0,6.2,6.3,4.9,5.1,
            6.0,6.6,7.7,8.4,7.8,6.0,6.3,12.4,12.7,8.3,12.8,25.5,
            20.6,13.2,11.0,8.8,4.2,4.6,4.0,4.2,3.5,2.4,2.4,2.7,
            2.2,2.4,3.7,3.0,3.3,3.3,3.0,3.5,3.5,3.0,2.4,2.8,
          ],
          borderColor: colors.gold,
          backgroundColor: inflGradient,
          borderWidth: 1.5,
          pointRadius: 3,
          pointBackgroundColor: colors.gold,
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltip, callbacks: { label: percentLabel } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: colors.textMuted, maxTicksLimit: 12 } },
          y: yPercent,
        },
      },
    });
  }

  /* INFLAZIONE ANNUA */
  make(
    'chartInflazioneAnnua', 'bar',
    ['2022', '2023', '2024', '2025'],
    [
      barDataset(
        [94.8, 211.4, 117.8, 31.5],
        colors.gold,
        { label: 'Inflazione annua (%)' }
      ),
    ],
    {
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltip, callbacks: { label: ctx => ctx.raw.toFixed(1) + '%' } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: colors.textMuted } },
        y: yPercent,
      },
    }
  );

  /* DEBITO */
  const debitoEl = document.getElementById('chartDebito');
  if (debitoEl) {
    const debitoCtx = debitoEl.getContext('2d');
    const debitoGradient = debitoCtx.createLinearGradient(0, 0, 0, 320);
    debitoGradient.addColorStop(0, 'rgba(138,114,64,0.25)');
    debitoGradient.addColorStop(1, 'rgba(138,114,64,0)');

    new Chart(debitoEl, {
      type: 'line',
      data: {
        labels: ['2020','2021','2022','2023','2024','2025 (p)','2026 (p)'],
        datasets: [{
          data: [103.8, 80.8, 84.8, 155.4, 85.3, 78.7, 73.0],
          borderColor: colors.goldDim,
          backgroundColor: debitoGradient,
          borderWidth: 1.5,
          pointRadius: 3,
          pointBackgroundColor: colors.goldDim,
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltip, callbacks: { label: percentLabel } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: colors.textMuted } },
          y: yPercent,
        },
      },
    });
  }

  /* POVERTÀ */
  const povertaEl = document.getElementById('chartPoverta');
  if (povertaEl) {
    const povertaCtx = povertaEl.getContext('2d');
    const povertaGradient = povertaCtx.createLinearGradient(0, 0, 0, 320);
    povertaGradient.addColorStop(0, 'rgba(196,165,90,0.25)');
    povertaGradient.addColorStop(1, 'rgba(196,165,90,0)');

    new Chart(povertaEl, {
      type: 'line',
      data: {
        labels: ['II sem 2022','I sem 2023','II sem 2023','I sem 2024','II sem 2024','I sem 2025','II sem 2025'],
        datasets: [{
          data: [39.2, 40.1, 41.7, 52.9, 38.1, 31.6, 28.2],
          borderColor: colors.gold,
          backgroundColor: povertaGradient,
          borderWidth: 1.5,
          pointRadius: 4,
          pointBackgroundColor: [
            colors.goldDim, colors.goldDim, colors.goldDim,
            colors.red, colors.gold, colors.green, colors.green,
          ],
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltip, callbacks: { label: percentLabel } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: colors.textMuted } },
          y: { min: 25, grid: { color: colors.gridLine }, ticks: { color: colors.textMuted, callback: percentTick } },
        },
      },
    });
  }

  /* EMBI */
  const embiEl = document.getElementById('chartEmbi');
  if (embiEl) {
    const embiCtx = embiEl.getContext('2d');
    const embiGradient = embiCtx.createLinearGradient(0, 0, 0, 320);
    embiGradient.addColorStop(0, 'rgba(196,165,90,0.25)');
    embiGradient.addColorStop(1, 'rgba(196,165,90,0)');

    new Chart(embiEl, {
      type: 'line',
      data: {
        labels: [
          'Gen 24','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic',
          'Gen 25','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic 25',
        ],
        datasets: [{
          data: [
            1964, 1702, 1452, 1215, 1341, 1455, 1510, 1433, 1284, 984, 755, 635,
            625, 784, 819, 722, 678, 701, 730, 829, 1222, 662, 645, 561,
          ],
          borderColor: colors.gold,
          backgroundColor: embiGradient,
          borderWidth: 1.5,
          pointRadius: 3,
          pointBackgroundColor: colors.gold,
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltip, callbacks: { label: ctx => ctx.raw + ' bp' } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: colors.textMuted, maxTicksLimit: 12 } },
          y: { grid: { color: colors.gridLine }, ticks: { color: colors.textMuted, callback: v => v + ' bp' } },
        },
      },
    });
  }

});