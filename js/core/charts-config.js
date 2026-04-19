const ChartConfig = (() => {

  const _registry = [];

  function css(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }

  function getColors() {
    return {
      gold:       css('--chart-gold'),
      goldDim:    css('--chart-gold-dim'),
      red:        css('--chart-red'),
      green:      css('--chart-green'),
      textMuted:  css('--chart-text-muted'),
      bg:         css('--chart-bg'),
      gridLine:   css('--chart-grid'),
      borderLine: css('--chart-border'),
      gradient:   css('--chart-gradient'),
      gradientDim: css('--chart-gradient-dim'),
    };
  }

  function getTooltip() {
    return {
      backgroundColor: css('--chart-tooltip-bg'),
      borderColor:     css('--chart-border'),
      borderWidth:     0.5,
      titleColor:      css('--chart-tooltip-title'),
      bodyColor:       css('--chart-tooltip-body'),
      padding:         10,
      cornerRadius:    4,
    };
  }

  function getScales(overrides = {}) {
    const c = getColors();
    return {
      x: {
        grid: { display: false },
        ticks: { color: c.textMuted, maxTicksLimit: 10 },
        ...overrides.x,
      },
      y: {
        grid: { color: c.gridLine },
        ticks: { color: c.textMuted },
        ...overrides.y,
      },
    };
  }

  function applyDefaults() {
    const c = getColors();
    Chart.defaults.color = c.textMuted;
    Chart.defaults.borderColor = c.borderLine;
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
          tooltip: getTooltip(),
        },
        scales: getScales(),
        ...options,
      },
    });
  }

  function lineDataset(data, color, options = {}) {
    return {
      data,
      borderColor: color,
      backgroundColor: 'transparent',
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

  /* Gradient helper — crea gradient basato sul tema corrente */
  function makeGradient(ctx, colorVar, height = 320) {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, css(colorVar));
    grad.addColorStop(1, 'transparent');
    return grad;
  }

  /* Registra un grafico: buildFn viene chiamata subito e ad ogni cambio tema */
  function register(id, buildFn) {
    _registry.push({ id, buildFn });
    buildFn();
  }

  function rebuildAll() {
    applyDefaults();
    _registry.forEach(({ id, buildFn }) => {
      const existing = Chart.getChart(id);
      if (existing) existing.destroy();
      buildFn();
    });
  }

  document.addEventListener('theme-change', rebuildAll);

  return { getColors, getTooltip, getScales, applyDefaults, make, lineDataset, barDataset, makeGradient, register };

})();
