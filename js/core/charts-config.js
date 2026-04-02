const ChartConfig = (() => {

  const colors = {
    gold: '#C4A55A',
    goldDim: '#8A7240',
    goldLight: '#E8D5A3',
    red: '#E05A5A',
    green: '#5AB88A',
    textMuted: '#6B6760',
    bg2: '#14161C',
    gridLine: 'rgba(196,165,90,0.06)',
    borderLine: 'rgba(196,165,90,0.08)',
  };

  const tooltip = {
    backgroundColor: '#14161C',
    borderColor: 'rgba(196,165,90,0.3)',
    borderWidth: 0.5,
    titleColor: '#F0EDE6',
    bodyColor: '#A8A499',
    padding: 10,
    cornerRadius: 4,
  };

  const defaultScales = {
    x: {
      grid: { display: false },
      ticks: { color: colors.textMuted, maxTicksLimit: 10 },
    },
    y: {
      grid: { color: colors.gridLine },
      ticks: { color: colors.textMuted },
    },
  };

  function applyDefaults() {
    Chart.defaults.color = colors.textMuted;
    Chart.defaults.borderColor = colors.borderLine;
    Chart.defaults.font.family = "'DM Sans', sans-serif";
    Chart.defaults.font.size = 11;
  }

  function make(id, type, labels, datasets, options = {}) {
    const el = document.getElementById(id);
    if (!el) return null;

    return new Chart(el, {
      type,
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip,
        },
        scales: defaultScales,
        ...options,
      },
    });
  }

  function lineDataset(data, color, options = {}) {
    return {
      data,
      borderColor: color,
      backgroundColor: color.replace(')', ', 0.06)').replace('rgb', 'rgba'),
      borderWidth: 1.5,
      pointRadius: 3,
      pointBackgroundColor: color,
      fill: true,
      tension: 0.3,
      ...options,
    };
  }

  function barDataset(data, colorFn, options = {}) {
    return {
      data,
      backgroundColor: colorFn,
      borderRadius: 3,
      barPercentage: 0.5,
      ...options,
    };
  }

  return { colors, tooltip, defaultScales, applyDefaults, make, lineDataset, barDataset };

})();