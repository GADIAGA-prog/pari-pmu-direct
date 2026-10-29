(function () {
  'use strict';

  const STORAGE_KEY = 'trading-journal-3s-trades-v1';
  const currencyFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 });
  const quantityFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 8 });
  const numberFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 6 });
  const fields = {
    date: document.getElementById('trade-date'),
    asset: document.getElementById('trade-asset'),
    setup: document.getElementById('trade-setup'),
    entry: document.getElementById('trade-entry'),
    stop: document.getElementById('trade-stop'),
    target: document.getElementById('trade-target'),
    size: document.getElementById('trade-size'),
    riskAmount: document.getElementById('trade-risk-amount'),
    riskPercent: document.getElementById('trade-risk-percent'),
    result: document.getElementById('trade-result'),
    plan: document.getElementById('trade-plan'),
    emotion: document.getElementById('trade-emotion'),
    screenshot: document.getElementById('trade-screenshot'),
  };

  let trades;
  let latestCalculation = null;
  let installPrompt = null;

  function localDate() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
  }

  function readTrades() {
    let raw;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      showStorageError('Le navigateur ne permet pas de lire le stockage local. Vos trades ne pourront pas être conservés.');
      return [];
    }

    if (!raw) return [];

    try {
      const saved = JSON.parse(raw);
      if (!Array.isArray(saved) || saved.some((trade) => !trade || typeof trade.id !== 'string')) {
        throw new Error('Format de journal invalide.');
      }
      return saved;
    } catch (error) {
      showStorageError('Le journal enregistré est illisible. Exportez ou récupérez une sauvegarde avant de continuer.');
      return [];
    }
  }

  function saveTrades() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
      showStorageError('');
      return true;
    } catch (error) {
      showStorageError('Impossible d’enregistrer le journal dans ce navigateur. Exportez vos données et vérifiez l’espace de stockage disponible.');
      return false;
    }
  }

  function showStorageError(message) {
    const element = document.getElementById('storage-error');
    element.textContent = message;
    element.hidden = !message;
  }

  function numericValue(element) {
    if (element.value.trim() === '') return NaN;
    return Number(element.value);
  }

  function showCalculatorError(message) {
    const element = document.getElementById('calculator-error');
    element.textContent = message;
    element.hidden = !message;
  }

  function calculatePosition(event) {
    event.preventDefault();
    showCalculatorError('');

    const capital = numericValue(document.getElementById('calc-capital'));
    const riskPercent = numericValue(document.getElementById('calc-risk-percent'));
    const entry = numericValue(document.getElementById('calc-entry'));
    const stop = numericValue(document.getElementById('calc-stop'));
    const pointSize = numericValue(document.getElementById('calc-point-size'));
    const pointValue = numericValue(document.getElementById('calc-point-value'));

    if (![capital, riskPercent, entry, stop, pointSize, pointValue].every(Number.isFinite)
      || capital <= 0 || riskPercent <= 0 || riskPercent > 1 || pointSize <= 0 || pointValue <= 0
      || entry === stop) {
      latestCalculation = null;
      document.getElementById('calculator-result').hidden = true;
      showCalculatorError('Vérifiez les valeurs : capital, risque entre 0 et 1 %, point et valeur du point positifs, et un stop différent de l’entrée.');
      return;
    }

    const riskAmount = capital * riskPercent / 100;
    const stopDistancePoints = Math.abs(entry - stop) / pointSize;
    const size = Number((riskAmount / (stopDistancePoints * pointValue)).toPrecision(12));
    if (!Number.isFinite(size) || size <= 0) {
      latestCalculation = null;
      document.getElementById('calculator-result').hidden = true;
      showCalculatorError('Le calcul n’est pas possible avec ces paramètres. Vérifiez la taille et la valeur du point.');
      return;
    }

    latestCalculation = { capital, riskPercent, entry, stop, riskAmount, stopDistancePoints, size };
    document.getElementById('result-risk').textContent = currencyFormatter.format(riskAmount);
    document.getElementById('result-distance').textContent = `${numberFormatter.format(stopDistancePoints)} points`;
    document.getElementById('result-size').textContent = `${quantityFormatter.format(size)} lot(s) / unité(s)`;
    document.getElementById('calculator-result').hidden = false;
  }

  function applyCalculation() {
    if (!latestCalculation) return;
    fields.entry.value = String(latestCalculation.entry);
    fields.stop.value = String(latestCalculation.stop);
    fields.size.value = String(latestCalculation.size);
    fields.riskAmount.value = String(latestCalculation.riskAmount);
    fields.riskPercent.value = String(latestCalculation.riskPercent);
    fields.entry.focus();
    document.getElementById('journal-title').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function setMessage(message) {
    document.getElementById('form-message').textContent = message;
  }

  function clearForm() {
    document.getElementById('trade-form').reset();
    document.getElementById('trade-id').value = '';
    document.getElementById('trade-date').value = localDate();
    document.getElementById('save-trade').textContent = 'Ajouter au journal';
    document.getElementById('cancel-edit').hidden = true;
    setMessage('');
  }

  function getFormTrade() {
    const trade = {
      id: document.getElementById('trade-id').value || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      date: fields.date.value,
      asset: fields.asset.value.trim(),
      setup: fields.setup.value.trim(),
      entry: numericValue(fields.entry),
      stop: numericValue(fields.stop),
      target: numericValue(fields.target),
      size: numericValue(fields.size),
      riskAmount: numericValue(fields.riskAmount),
      riskPercent: numericValue(fields.riskPercent),
      result: numericValue(fields.result),
      plan: fields.plan.value,
      emotion: fields.emotion.value,
      screenshot: fields.screenshot.value.trim(),
    };

    if (!trade.date || !trade.asset || !trade.setup
      || ![trade.entry, trade.stop, trade.target, trade.size, trade.riskAmount, trade.riskPercent, trade.result].every(Number.isFinite)
      || trade.size <= 0 || trade.riskAmount <= 0 || trade.riskPercent <= 0
      || !['yes', 'no'].includes(trade.plan) || !trade.emotion) {
      throw new Error('Complétez les champs obligatoires avec des valeurs valides. La taille et le montant risqué doivent être positifs.');
    }
    return trade;
  }

  function submitTrade(event) {
    event.preventDefault();
    setMessage('');
    let trade;
    try {
      trade = getFormTrade();
    } catch (error) {
      setMessage(error.message);
      return;
    }

    const existingIndex = trades.findIndex((item) => item.id === trade.id);
    if (existingIndex >= 0) trades[existingIndex] = trade;
    else trades.unshift(trade);

    if (!saveTrades()) return;
    clearForm();
    renderTrades();
    setMessage(existingIndex >= 0 ? 'Trade modifié.' : 'Trade ajouté au journal.');
  }

  function formatDate(date) {
    const parts = date.split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : date;
  }

  function detail(label, value) {
    const wrapper = document.createElement('div');
    wrapper.className = 'trade-detail';
    const name = document.createElement('span');
    name.textContent = label;
    const content = document.createElement('span');
    content.textContent = value;
    wrapper.append(name, content);
    return wrapper;
  }

  function screenshotHref(value) {
    if (/^https?:\/\//i.test(value) || /^file:\/\//i.test(value)) return value;
    if (/^[a-zA-Z]:[\\/]/.test(value)) return `file:///${value.replace(/\\/g, '/')}`;
    if (/^\\\\/.test(value)) return `file:${value.replace(/\\/g, '/')}`;
    return '';
  }

  function createTradeCard(trade) {
    const card = document.createElement('article');
    card.className = 'trade-card';

    const main = document.createElement('div');
    main.className = 'trade-main';
    const titleBlock = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'trade-title';
    const asset = document.createElement('strong');
    asset.textContent = trade.asset;
    const setup = document.createElement('span');
    setup.className = 'trade-setup';
    setup.textContent = trade.setup;
    title.append(asset, setup);
    const date = document.createElement('div');
    date.className = 'trade-date';
    date.textContent = formatDate(trade.date);
    titleBlock.append(title, date);

    const result = document.createElement('span');
    result.className = `result-chip${trade.result < 0 ? ' negative' : trade.result === 0 ? ' zero' : ''}`;
    result.textContent = `${trade.result > 0 ? '+' : ''}${numberFormatter.format(trade.result)} R`;
    main.append(titleBlock, result);

    const details = document.createElement('div');
    details.className = 'trade-details';
    details.append(
      detail('Entrée', numberFormatter.format(trade.entry)),
      detail('Stop', numberFormatter.format(trade.stop)),
      detail('Objectif', numberFormatter.format(trade.target)),
      detail('Taille', quantityFormatter.format(trade.size)),
      detail('Risque', `${currencyFormatter.format(trade.riskAmount)} (${numberFormatter.format(trade.riskPercent)} %) `),
      detail('Émotion', trade.emotion),
    );

    const footer = document.createElement('div');
    footer.className = 'trade-footer';
    const plan = document.createElement('span');
    plan.className = `plan-chip${trade.plan === 'no' ? ' no' : ''}`;
    plan.textContent = trade.plan === 'yes' ? '✓ Plan respecté' : '✕ Hors plan';
    footer.append(plan);
    if (trade.screenshot) {
      const href = screenshotHref(trade.screenshot);
      if (href) {
        const link = document.createElement('a');
        link.className = 'screenshot-link';
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Voir la capture';
        link.title = trade.screenshot;
        footer.append(link);
      } else {
        const path = document.createElement('span');
        path.className = 'screenshot-link';
        path.textContent = trade.screenshot;
        path.title = trade.screenshot;
        footer.append(path);
      }
    }
    const spacer = document.createElement('span');
    spacer.className = 'trade-spacer';
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'small-action';
    edit.textContent = 'Modifier';
    edit.addEventListener('click', () => editTrade(trade.id));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'small-action delete';
    remove.textContent = 'Supprimer';
    remove.addEventListener('click', () => deleteTrade(trade.id));
    footer.append(spacer, edit, remove);
    card.append(main, details, footer);
    return card;
  }

  function renderTrades() {
    const list = document.getElementById('trade-list');
    list.replaceChildren(...trades.map(createTradeCard));
    document.getElementById('empty-state').hidden = trades.length > 0;
    const total = trades.reduce((sum, trade) => sum + trade.result, 0);
    const planCount = trades.filter((trade) => trade.plan === 'yes').length;
    document.getElementById('stat-count').textContent = String(trades.length);
    const totalElement = document.getElementById('stat-total');
    totalElement.textContent = `${total > 0 ? '+' : ''}${numberFormatter.format(total)} R`;
    totalElement.style.color = total > 0 ? 'var(--green)' : total < 0 ? 'var(--red)' : '';
    document.getElementById('stat-plan').textContent = trades.length
      ? `${Math.round(planCount / trades.length * 100)} %`
      : '—';
  }

  function editTrade(id) {
    const trade = trades.find((item) => item.id === id);
    if (!trade) return;
    document.getElementById('trade-id').value = trade.id;
    Object.keys(fields).forEach((key) => { fields[key].value = String(trade[key]); });
    document.getElementById('save-trade').textContent = 'Enregistrer la modification';
    document.getElementById('cancel-edit').hidden = false;
    setMessage('');
    document.getElementById('journal-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
    fields.asset.focus();
  }

  function deleteTrade(id) {
    if (!window.confirm('Supprimer ce trade du journal ? Cette action est définitive.')) return;
    const previousTrades = trades;
    trades = trades.filter((trade) => trade.id !== id);
    if (!saveTrades()) {
      trades = previousTrades;
      return;
    }
    renderTrades();
  }

  const csvColumns = [
    ['Date', 'date'],
    ['Actif', 'asset'],
    ['Setup', 'setup'],
    ['Entrée', 'entry'],
    ['Stop', 'stop'],
    ['Objectif', 'target'],
    ['Taille', 'size'],
    ['Risque montant', 'riskAmount'],
    ['Risque pourcentage', 'riskPercent'],
    ['Résultat R', 'result'],
    ['Plan respecté', 'plan'],
    ['Émotion', 'emotion'],
    ['Capture', 'screenshot'],
  ];

  function csvCell(value) {
    return `"${String(value).replace(/"/g, '""')}"`;
  }

  function exportCsv() {
    if (!trades.length) {
      showStorageError('Ajoutez au moins un trade avant d’exporter le journal.');
      return;
    }
    showStorageError('');
    const rows = [
      csvColumns.map(([label]) => label).join(';'),
      ...trades.map((trade) => csvColumns.map(([, key]) => csvCell(trade[key])).join(';')),
    ];
    const blob = new Blob(['\uFEFF', rows.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal-trading-${localDate()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function setupInstallation() {
    const installButton = document.getElementById('install-app');
    const installHelp = document.getElementById('install-help');

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      installPrompt = event;
      installButton.hidden = false;
      installHelp.hidden = true;
    });

    window.addEventListener('appinstalled', () => {
      installPrompt = null;
      installButton.hidden = true;
      installHelp.hidden = true;
    });

    installButton.addEventListener('click', async () => {
      if (!installPrompt) return;
      await installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      installButton.hidden = true;
    });

    if ('serviceWorker' in navigator && (window.isSecureContext || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {
        installHelp.textContent = 'Installation hors ligne indisponible pour le moment. Rechargez la page depuis l’adresse sécurisée de l’application.';
        installHelp.hidden = false;
      });
    }
  }

  document.getElementById('calculator-form').addEventListener('submit', calculatePosition);
  document.getElementById('apply-calculation').addEventListener('click', applyCalculation);
  document.getElementById('trade-form').addEventListener('submit', submitTrade);
  document.getElementById('cancel-edit').addEventListener('click', clearForm);
  document.getElementById('export-csv').addEventListener('click', exportCsv);

  document.getElementById('trade-date').value = localDate();
  trades = readTrades();
  renderTrades();
  setupInstallation();
})();
