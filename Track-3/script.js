/**
 * ExpenseFlow Client-Side Script
 * Handles theme toggling, form validations, interactive charts, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modular scripts
  initTheme();
  initSidebar();
  initFormValidation();
  initDeleteConfirmation();
  initFlashDismissal();
  initCharts();
  initShortcuts();
  initLiveSearch();
  initBudgetTracker();
  initAIChat();
});

/* ==========================================
   1. Theme Management (Light / Dark Mode)
   ========================================== */
let currentTheme = 'light';
let chartsInstance = { category: null, monthly: null };

function initTheme() {
  const themeToggleBtn = document.querySelector('[data-theme-toggle]');
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  themeToggleBtn.addEventListener('click', () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (window.expenseChartData) {
      recreateCharts();
    }
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const systemTheme = e.matches ? 'dark' : 'light';
      setTheme(systemTheme);
      if (window.expenseChartData) recreateCharts();
    }
  });
}

function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  const toggleBtn = document.querySelector('[data-theme-toggle]');
  if (toggleBtn) {
    if (theme === 'dark') {
      toggleBtn.setAttribute('aria-label', 'Switch to light mode');
      toggleBtn.setAttribute('title', 'Switch to light mode');
    } else {
      toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
      toggleBtn.setAttribute('title', 'Switch to dark mode');
    }
  }
}

/* ==========================================
   2. Responsive Navigation Drawer
   ========================================== */
function initSidebar() {
  const toggleBtn = document.querySelector('[data-nav-toggle]');
  const closeBtns = document.querySelectorAll('[data-nav-close]');
  
  if (!toggleBtn) return;

  const openDrawer = () => {
    document.body.classList.add('nav-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    document.body.classList.remove('nav-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', openDrawer);
  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeDrawer();
    }
  });
}

/* ==========================================
   3. Server & Client Validation, Char Counters
   ========================================== */
function initFormValidation() {
  const form = document.querySelector('[data-expense-form]');
  const descInput = document.querySelector('[data-description-input]');
  const descCounter = document.querySelector('[data-description-count]');

  if (descInput && descCounter) {
    const updateCounter = () => {
      const length = descInput.value.length;
      descCounter.textContent = `${length} / 500`;
      if (length >= 500) {
        descCounter.style.color = 'var(--accent-red)';
      } else if (length >= 450) {
        descCounter.style.color = 'var(--accent-orange)';
      } else {
        descCounter.style.color = 'var(--text-secondary)';
      }
    };
    descInput.addEventListener('input', updateCounter);
    updateCounter();
  }

  if (!form) return;

  const fields = {
    title: {
      input: form.querySelector('#title'),
      fieldEl: form.querySelector('#title')?.closest('.field'),
      errorEl: form.querySelector('[data-error-for="title"]'),
      validate() {
        const val = this.input.value.trim();
        if (!val) return 'Please enter an expense title.';
        if (val.length > 100) return 'The expense title must be 100 characters or fewer.';
        return '';
      }
    },
    amount: {
      input: form.querySelector('#amount'),
      fieldEl: form.querySelector('#amount')?.closest('.field'),
      errorEl: form.querySelector('[data-error-for="amount"]'),
      validate() {
        const val = this.input.value.trim();
        if (!val) return 'Enter an amount greater than zero.';
        const num = parseFloat(val);
        if (isNaN(num) || num <= 0) return 'Enter an amount greater than zero.';
        return '';
      }
    },
    expense_date: {
      input: form.querySelector('#expense_date'),
      fieldEl: form.querySelector('#expense_date')?.closest('.field'),
      errorEl: form.querySelector('[data-error-for="expense_date"]'),
      validate() {
        const val = this.input.value.trim();
        if (!val) return 'Choose a valid expense date.';
        if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return 'Choose a valid expense date.';
        return '';
      }
    },
    category: {
      input: form.querySelector('#category'),
      fieldEl: form.querySelector('#category')?.closest('.field'),
      errorEl: form.querySelector('[data-error-for="category"]'),
      validate() {
        const val = this.input.value;
        if (!val) return 'Choose a valid category.';
        return '';
      }
    },
    payment_mode: {
      input: form.querySelector('#payment_mode'),
      fieldEl: form.querySelector('#payment_mode')?.closest('.field'),
      errorEl: form.querySelector('[data-error-for="payment_mode"]'),
      validate() {
        const val = this.input.value;
        if (!val) return 'Choose a valid payment mode.';
        return '';
      }
    },
    description: {
      input: form.querySelector('#description'),
      fieldEl: form.querySelector('#description')?.closest('.field'),
      errorEl: form.querySelector('[data-error-for="description"]'),
      validate() {
        const val = this.input?.value || '';
        if (val.length > 500) return 'The description must be 500 characters or fewer.';
        return '';
      }
    }
  };

  const validateField = (fieldKey) => {
    const f = fields[fieldKey];
    if (!f.input) return true;
    const err = f.validate();
    if (err) {
      f.fieldEl.classList.add('has-error');
      f.errorEl.textContent = err;
      return false;
    } else {
      f.fieldEl.classList.remove('has-error');
      f.errorEl.textContent = '';
      return true;
    }
  };

  Object.keys(fields).forEach(key => {
    const f = fields[key];
    if (!f.input) return;
    f.input.addEventListener('input', () => validateField(key));
    f.input.addEventListener('blur', () => validateField(key));
  });

  form.addEventListener('submit', (e) => {
    let isValid = true;
    Object.keys(fields).forEach(key => {
      const fieldValid = validateField(key);
      if (!fieldValid) isValid = false;
    });

    if (!isValid) {
      e.preventDefault();
      const firstError = form.querySelector('.field.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}

/* ==========================================
   4. Action Confirmations (Delete Form)
   ========================================== */
function initDeleteConfirmation() {
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-delete-form]');
    if (!form) return;
    const expenseName = form.getAttribute('data-expense-name') || 'this expense';
    const msg = `Are you sure you want to delete "${expenseName}"?\nThis action cannot be undone.`;
    if (!confirm(msg)) {
      e.preventDefault();
    }
  });
}

/* ==========================================
   5. Notification (Flash) Dismissals
   ========================================== */
function initFlashDismissal() {
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-dismiss-flash]');
    if (!closeBtn) return;
    const messageEl = closeBtn.closest('.flash-message');
    if (!messageEl) return;

    messageEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    messageEl.style.opacity = '0';
    messageEl.style.transform = 'translateY(-10px)';

    setTimeout(() => messageEl.remove(), 250);
  });
}

/* ==========================================
   6. Chart.js Configurations & Adaptivity
   ========================================== */
/* ==========================================
   6. Chart.js Configurations (FinSet Redesign)
   ========================================== */
function initCharts() {
  if (typeof Chart === 'undefined') return;
  recreateCharts();
}

function recreateCharts() {
  const brandPrimary = '#7D5CFF';
  const brandPrimaryLight = 'rgba(125, 92, 255, 0.5)';
  const brandPrimaryBg = 'rgba(125, 92, 255, 0.15)';
  const borderLight = '#E5E7EB';
  const textMuted = '#9CA3AF';

  // --- Area Chart (Total balance overview) ---
  const areaCtx = document.getElementById('areaChart');
  if (areaCtx) {
    const ctx = areaCtx.getContext('2d');
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 220);
    gradientFill.addColorStop(0, brandPrimaryBg);
    gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0)');

    new Chart(areaCtx, {
      type: 'line',
      data: {
        labels: ['1 Jul', '4 Jul', '8 Jul', '12 Jul', '16 Jul', '19 Jul'],
        datasets: [{
          label: 'This month',
          data: [2500, 4800, 3200, 7500, 5200, 11000],
          borderColor: brandPrimary,
          borderWidth: 2,
          backgroundColor: gradientFill,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#fff',
          pointBorderColor: brandPrimary,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Same period last month',
          data: [1500, 3000, 2800, 5000, 4800, 8000],
          borderColor: '#D1D5DB', // light gray
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: textMuted, font: { size: 11, family: 'Inter' } } },
          y: { grid: { color: borderLight }, border: { display: false }, ticks: { color: textMuted, font: { size: 11, family: 'Inter' }, callback: val => '$' + val } }
        }
      }
    });
  }

  // --- Bar Chart (Comparing budget and expence) ---
  const barCtx = document.getElementById('barChart');
  if (barCtx) {
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Budget',
          data: [3500, 3000, 4000, 4500, 3200, 5000, 3800],
          backgroundColor: '#E0E7FF',
          borderRadius: 8,
          barPercentage: 0.6,
          categoryPercentage: 0.6
        },
        {
          label: 'Expense',
          data: [2200, 1800, 3800, 2500, 2100, 3500, 2800],
          backgroundColor: brandPrimary,
          borderRadius: 8,
          barPercentage: 0.6,
          categoryPercentage: 0.6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: textMuted, font: { size: 11, family: 'Inter' } } },
          y: { grid: { color: borderLight }, border: { display: false }, ticks: { color: textMuted, font: { size: 11, family: 'Inter' }, callback: val => '$' + val } }
        }
      }
    });
  }

  // --- Doughnut Chart (Statistics) ---
  const donutCtx = document.getElementById('donutChart');
  if (donutCtx) {
    const dataNode = document.getElementById('dashboard-data');
    let labels = ['Rent', 'Education', 'Food & Groceries', 'Others'];
    let values = [40, 20, 25, 15];
    if (dataNode) {
      try {
        const parsed = JSON.parse(dataNode.textContent);
        if (parsed.categories && parsed.categoryTotals && parsed.categories.length > 0) {
          labels = parsed.categories;
          values = parsed.categoryTotals;
        }
      } catch(e) {}
    }

    const categoryColors = [
      brandPrimary, // 1
      '#FF61A6', // 2 pink
      '#FF9351', // 3 orange
      '#E5E7EB', // 4 border-color
      '#9CA3AF', // 5 gray
      '#1F2937'  // 6 dark
    ];

    new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: categoryColors.slice(0, values.length),
          borderWidth: 2,
          borderColor: '#ffffff',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: { legend: { display: false } }
      }
    });
  }
}

/* ==========================================
   7. Keyboard Shortcuts Menu & Triggers
   ========================================== */
function initShortcuts() {
  const toggleBtn = document.querySelector('[data-shortcuts-toggle]');
  const closeBtn = document.querySelector('[data-shortcuts-close]');
  const modal = document.querySelector('[data-shortcuts-modal]');

  if (!modal) return;

  const openModal = () => {
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.setAttribute('hidden', '');
    modal.setAttribute('aria-hidden', 'true');
  };

  const toggleModal = () => {
    if (modal.hasAttribute('hidden')) openModal();
    else closeModal();
  };

  if (toggleBtn) toggleBtn.addEventListener('click', toggleModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    const activeTag = document.activeElement.tagName.toLowerCase();
    const isTyping = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

    if (e.key === 'Escape') {
      closeModal();
      document.body.classList.remove('nav-open');
      const navToggle = document.querySelector('[data-nav-toggle]');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      return;
    }

    if (isTyping) return;

    const key = e.key.toLowerCase();

    if (key === '?') {
      e.preventDefault();
      toggleModal();
    } else if (key === 'n' || key === 'a') {
      e.preventDefault();
      window.location.href = '/add-expense';
    } else if (key === 'd') {
      e.preventDefault();
      window.location.href = '/';
    } else if (key === 'e') {
      e.preventDefault();
      window.location.href = '/expenses';
    } else if (key === 'i') {
      e.preventDefault();
      window.location.href = '/summary';
    } else if (key === 's') {
      const searchBox = document.querySelector('.search-field input');
      if (searchBox) {
        e.preventDefault();
        searchBox.focus();
      }
    }
  });
}

/* ==========================================
   8. Live Search, Filter & Sort Interactivity
   ========================================== */
function initLiveSearch() {
  const filterForm = document.querySelector('.filter-form');
  if (!filterForm) return;

  const searchInput = filterForm.querySelector('input[name="q"]');
  const categorySelect = filterForm.querySelector('select[name="category"]');
  const sortSelect = filterForm.querySelector('select[name="sort"]');
  const tablePanel = document.querySelector('.table-panel');

  if (!tablePanel) return;

  let debounceTimeout;

  const performSearch = () => {
    const q = searchInput ? searchInput.value.trim() : '';
    const category = categorySelect ? categorySelect.value : '';
    const sort = sortSelect ? sortSelect.value : '';

    const url = new URL(window.location.href);
    url.searchParams.set('q', q);
    url.searchParams.set('category', category);
    url.searchParams.set('sort', sort);

    const tbody = tablePanel.querySelector('tbody');
    if (tbody) tbody.classList.add('is-loading');

    fetch(url.toString())
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newTablePanel = doc.querySelector('.table-panel');
        
        if (newTablePanel && tablePanel) {
          tablePanel.innerHTML = newTablePanel.innerHTML;
        }

        const oldReset = filterForm.querySelector('.filter-reset');
        const newReset = doc.querySelector('.filter-reset');
        if (oldReset && !newReset) {
          oldReset.remove();
        } else if (!oldReset && newReset) {
          filterForm.appendChild(newReset);
        } else if (oldReset && newReset) {
          oldReset.replaceWith(newReset);
        }

        history.pushState(null, '', url.toString());
      })
      .catch(err => console.error('Error during search fetch:', err))
      .finally(() => {
        if (tbody) tbody.classList.remove('is-loading');
      });
  };

  if (categorySelect) categorySelect.addEventListener('change', performSearch);
  if (sortSelect) sortSelect.addEventListener('change', performSearch);

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(performSearch, 250);
    });

    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearTimeout(debounceTimeout);
      performSearch();
    });
  }

  window.addEventListener('popstate', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (searchInput) searchInput.value = urlParams.get('q') || '';
    if (categorySelect) categorySelect.value = urlParams.get('category') || '';
    if (sortSelect) sortSelect.value = urlParams.get('sort') || 'date_desc';
    performSearch();
  });
}

/* ==========================================
   9. Monthly Budget Util Tracking Card
   ========================================== */
function initBudgetTracker() {
  const budgetCard = document.querySelector('[data-budget-card]');
  if (!budgetCard) return;

  const limitTextEl = budgetCard.querySelector('[data-budget-limit-text]');
  const editBtn = budgetCard.querySelector('[data-edit-budget]');
  const progressFill = budgetCard.querySelector('[data-budget-progress-fill]');
  const footEl = budgetCard.querySelector('[data-budget-foot]');
  const totalValueEl = budgetCard.querySelector('[data-monthly-total]');

  if (!totalValueEl) return;

  const monthlyTotal = parseFloat(totalValueEl.getAttribute('data-monthly-total') || 0);

  const getStoredBudget = () => {
    const b = localStorage.getItem('monthly_budget');
    return b ? parseFloat(b) : 20000;
  };

  const updateBudgetUI = (budget) => {
    limitTextEl.textContent = `₹${budget.toLocaleString('en-IN')}`;
    
    const percentage = budget > 0 ? (monthlyTotal / budget) * 100 : 0;
    const cappedPercentage = Math.min(percentage, 100);
    
    progressFill.style.width = `${cappedPercentage}%`;
    progressFill.classList.remove('budget-fill-green', 'budget-fill-orange', 'budget-fill-red');

    if (percentage >= 100) {
      progressFill.classList.add('budget-fill-red');
      const overAmt = monthlyTotal - budget;
      footEl.innerHTML = `<span style="color: var(--accent-red); font-weight: 700;">Over budget by ₹${overAmt.toLocaleString('en-IN')}!</span>`;
    } else if (percentage >= 80) {
      progressFill.classList.add('budget-fill-orange');
      footEl.innerHTML = `<span style="color: var(--accent-orange); font-weight: 700;">Approaching limit (${percentage.toFixed(0)}% spent)</span>`;
    } else {
      progressFill.classList.add('budget-fill-green');
      footEl.textContent = `${percentage.toFixed(0)}% of monthly budget spent`;
    }
  };

  let currentBudget = getStoredBudget();
  updateBudgetUI(currentBudget);

  editBtn.addEventListener('click', () => {
    const input = prompt('Enter your monthly budget amount in ₹:', currentBudget);
    if (input === null) return;

    const newBudget = parseFloat(input.trim());
    if (isNaN(newBudget) || newBudget <= 0) {
      alert('Please enter a valid positive number.');
      return;
    }

    localStorage.setItem('monthly_budget', newBudget);
    currentBudget = newBudget;
    updateBudgetUI(newBudget);
  });
}

/* ==========================================
   10. Floating AI Advisor Chat Widget
   ========================================== */
function initAIChat() {
  const widget = document.querySelector('[data-ai-widget]');
  if (!widget) return;

  const trigger = widget.querySelector('[data-ai-trigger]');
  const windowEl = widget.querySelector('[data-ai-window]');
  const closeBtn = widget.querySelector('[data-ai-close]');
  const messagesContainer = widget.querySelector('[data-ai-messages]');
  const chatForm = widget.querySelector('[data-ai-form]');
  const chatInput = widget.querySelector('[data-ai-input]');
  const suggestions = widget.querySelectorAll('[data-ai-suggest]');

  if (!trigger || !windowEl || !messagesContainer) return;

  const toggleChat = () => {
    const isHidden = windowEl.hasAttribute('hidden');
    if (isHidden) {
      windowEl.removeAttribute('hidden');
      scrollToBottom();
      chatInput.focus();
    } else {
      windowEl.setAttribute('hidden', '');
    }
  };

  trigger.addEventListener('click', toggleChat);
  if (closeBtn) closeBtn.addEventListener('click', () => windowEl.setAttribute('hidden', ''));

  const scrollToBottom = () => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const renderMessageHtml = (text) => {
    let html = text;
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    const lines = html.split('\n');
    let inList = false;
    let result = [];

    lines.forEach(line => {
      let trimmed = line.trim();
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
        if (!inList) {
          result.push('<ul>');
          inList = true;
        }
        let itemText = trimmed.replace(/^[•\-\*]\s*/, '');
        result.push(`<li>${itemText}</li>`);
      } else {
        if (inList) {
          result.push('</ul>');
          inList = false;
        }
        if (trimmed) {
          result.push(`<p>${trimmed}</p>`);
        }
      }
    });

    if (inList) result.push('</ul>');
    return result.join('');
  };

  const addMessage = (text, sender) => {
    const msgEl = document.createElement('div');
    msgEl.className = `ai-message ai-message-${sender}`;
    if (sender === 'received') {
      msgEl.innerHTML = renderMessageHtml(text);
    } else {
      msgEl.textContent = text;
    }
    messagesContainer.appendChild(msgEl);
    scrollToBottom();
  };

  const showTypingIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.setAttribute('data-typing-indicator', '');
    indicator.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    messagesContainer.appendChild(indicator);
    scrollToBottom();
    return indicator;
  };

  const submitQuery = (queryText) => {
    addMessage(queryText, 'sent');
    const indicator = showTypingIndicator();
    const storedBudget = localStorage.getItem('monthly_budget') || 20000;

    fetch('/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: queryText,
        budget: parseFloat(storedBudget)
      })
    })
      .then(res => res.json())
      .then(data => {
        indicator.remove();
        addMessage(data.response, 'received');
      })
      .catch(err => {
        console.error('AI chat failed:', err);
        indicator.remove();
        addMessage('Sorry, I encountered a connection issue. Please try again shortly.', 'received');
      });
  };

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = chatInput.value.trim();
      if (!val) return;
      submitQuery(val);
      chatInput.value = '';
    });
  }

  suggestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const suggestQuery = btn.getAttribute('data-ai-suggest');
      if (suggestQuery) submitQuery(suggestQuery);
    });
  });
}
