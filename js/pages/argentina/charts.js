document.addEventListener('DOMContentLoaded', () => {

  ChartConfig.applyDefaults();

  const pct  = v => v + '%';
  const pctL = ctx => ctx.raw.toFixed(1) + '%';

  /* ── FISCALE ─────────────────────────────────────────── */
  ChartConfig.register('chartFiscale', () => {
    const c = ChartConfig.getColors();
    ChartConfig.make(
      'chartFiscale', 'bar',
      ['2022', '2023', '2024', '2025'],
      [
        ChartConfig.barDataset(
          [-2.00, -2.68, 1.78, 1.25],
          ctx => ctx.raw >= 0 ? c.green : c.red,
          { label: 'Saldo primario' }
        ),
        ChartConfig.barDataset(
          [-3.81, -4.38, 0.30, 0.15],
          ctx => ctx.raw >= 0 ? c.green + '66' : c.red + '66',
          { label: 'Saldo fiscale' }
        ),
      ],
      {
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: { boxWidth: 10, padding: 16, color: c.textMuted },
            onClick: (e, legendItem, legend) => {
              const ci = legend.chart;
              const clickedIndex = legendItem.datasetIndex;
              const otherIndex = clickedIndex === 0 ? 1 : 0;
              const otherMeta = ci.getDatasetMeta(otherIndex);
              const clickedMeta = ci.getDatasetMeta(clickedIndex);
              if (otherMeta.hidden) {
                ci.data.datasets.forEach((_, i) => { ci.getDatasetMeta(i).hidden = false; });
              } else {
                clickedMeta.hidden = false;
                otherMeta.hidden = true;
              }
              ci.update();
            },
          },
          tooltip: {
            ...ChartConfig.getTooltip(),
            callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.raw.toFixed(2) + '%' },
          },
        },
        scales: ChartConfig.getScales({
          y: { ticks: { callback: pct } },
        }),
      }
    );
  });

  /* ── INFLAZIONE MENSILE ───────────────────────────────── */
  ChartConfig.register('chartInflazione', () => {
    const c   = ChartConfig.getColors();
    const el  = document.getElementById('chartInflazione');
    if (!el) return;
    const grad = ChartConfig.makeGradient(el.getContext('2d'), '--chart-gradient');
    new Chart(el, {
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
          borderColor: c.gold,
          backgroundColor: grad,
          borderWidth: 1.5,
          pointRadius: 3,
          pointBackgroundColor: c.gold,
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...ChartConfig.getTooltip(), callbacks: { label: pctL } },
        },
        scales: ChartConfig.getScales({
          x: { ticks: { maxTicksLimit: 12 } },
          y: { ticks: { callback: pct } },
        }),
      },
    });
  });

  /* ── INFLAZIONE ANNUA ────────────────────────────────── */
  ChartConfig.register('chartInflazioneAnnua', () => {
    const c = ChartConfig.getColors();
    ChartConfig.make(
      'chartInflazioneAnnua', 'bar',
      ['2022', '2023', '2024', '2025'],
      [ChartConfig.barDataset([94.8, 211.4, 117.8, 31.5], c.gold, { label: 'Inflazione annua (%)' })],
      {
        plugins: {
          legend: { display: false },
          tooltip: { ...ChartConfig.getTooltip(), callbacks: { label: ctx => ctx.raw.toFixed(1) + '%' } },
        },
        scales: ChartConfig.getScales({ y: { ticks: { callback: pct } } }),
      }
    );
  });

  /* ── DEBITO ──────────────────────────────────────────── */
  ChartConfig.register('chartDebito', () => {
    const c   = ChartConfig.getColors();
    const el  = document.getElementById('chartDebito');
    if (!el) return;
    const grad = ChartConfig.makeGradient(el.getContext('2d'), '--chart-gradient-dim');
    new Chart(el, {
      type: 'line',
      data: {
        labels: ['2020','2021','2022','2023','2024','2025 (p)','2026 (p)'],
        datasets: [{
          data: [103.8, 80.8, 84.8, 155.4, 85.3, 78.7, 73.0],
          borderColor: c.goldDim,
          backgroundColor: grad,
          borderWidth: 1.5,
          pointRadius: 3,
          pointBackgroundColor: c.goldDim,
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...ChartConfig.getTooltip(), callbacks: { label: pctL } },
        },
        scales: ChartConfig.getScales({
          x: { ticks: {} },
          y: { ticks: { callback: pct } },
        }),
      },
    });
  });

  /* ── POVERTÀ ─────────────────────────────────────────── */
  ChartConfig.register('chartPoverta', () => {
    const c   = ChartConfig.getColors();
    const el  = document.getElementById('chartPoverta');
    if (!el) return;
    const grad = ChartConfig.makeGradient(el.getContext('2d'), '--chart-gradient');
    new Chart(el, {
      type: 'line',
      data: {
        labels: ['II sem 2022','I sem 2023','II sem 2023','I sem 2024','II sem 2024','I sem 2025','II sem 2025'],
        datasets: [{
          data: [39.2, 40.1, 41.7, 52.9, 38.1, 31.6, 28.2],
          borderColor: c.gold,
          backgroundColor: grad,
          borderWidth: 1.5,
          pointRadius: 4,
          pointBackgroundColor: [c.goldDim, c.goldDim, c.goldDim, c.red, c.gold, c.green, c.green],
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...ChartConfig.getTooltip(), callbacks: { label: pctL } },
        },
        scales: ChartConfig.getScales({
          y: { min: 25, ticks: { callback: pct } },
        }),
      },
    });
  });

  /* ── EMBI ────────────────────────────────────────────── */
  ChartConfig.register('chartEmbi', () => {
    const c   = ChartConfig.getColors();
    const el  = document.getElementById('chartEmbi');
    if (!el) return;
    const grad = ChartConfig.makeGradient(el.getContext('2d'), '--chart-gradient');
    new Chart(el, {
      type: 'line',
      data: {
        labels: [
          'Gen 24','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic',
          'Gen 25','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic 25',
        ],
        datasets: [{
          data: [
            1964,1702,1452,1215,1341,1455,1510,1433,1284,984,755,635,
            625,784,819,722,678,701,730,829,1222,662,645,561,
          ],
          borderColor: c.gold,
          backgroundColor: grad,
          borderWidth: 1.5,
          pointRadius: 3,
          pointBackgroundColor: c.gold,
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...ChartConfig.getTooltip(), callbacks: { label: ctx => ctx.raw + ' bp' } },
        },
        scales: ChartConfig.getScales({
          x: { ticks: { maxTicksLimit: 12 } },
          y: { ticks: { callback: v => v + ' bp' } },
        }),
      },
    });
  });

});
