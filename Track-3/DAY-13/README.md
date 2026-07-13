# ExpenseFlow — Personal Expense Tracker (DAY-13)

ExpenseFlow is a sleek, professional, and full-featured web application designed to help users track their daily transactions, visualize their spending patterns, and make mindfully informed financial decisions. Built on top of **Flask**, **SQLite**, and **Jinja templates**, it features interactive dashboards, advanced filtering options, responsive layouts, and an embedded **AI Financial Advisor**.

---

## 📁 Directory Structure

The project is structured according to the standard Flask application architecture for clean separation of concerns:

```text
DAY-13/
├── app.py                  # Main Flask application and server logic
├── expense.db              # SQLite Database storing transaction records
├── README.md               # Project documentation and guide
│
├── templates/              # Jinja2 HTML Templates
│   ├── base.html           # Core layout containing sidebar, AI widget, and modals
│   ├── index.html          # Dashboard (analytics, balance overview, canvas charts)
│   ├── add_expense.html    # Log new expense page
│   ├── edit_expense.html   # Refine existing expense page
│   ├── expenses.html       # Expense library (with advanced search, filters, and tables)
│   ├── summary.html        # Insights page (trends, history, and breakdowns)
│   ├── _expense_form.html  # Reusable form component for adding/editing
│   └── 404.html            # Custom page not found error handler
│
└── static/                 # Static Assets
    ├── css/
    │   └── style.css       # Premium stylesheets (dark mode, glassmorphism, animations)
    ├── js/
    │   └── script.js       # Core interactivity, charts setup, and AI chat widget logic
    └── images/             # Image resources and icons
```

---

## 🌟 Key Features

### 1. Unified Dashboard (Analytics)
- **Visual Balance Overview**: Check your overall balance, monthly expenditures, and top spending categories at a glance.
- **Interactive Data Visualization**: Powered by **Chart.js**, featuring:
  - *Area Chart*: Visualizing total balance trends.
  - *Bar Chart*: Comparing monthly budgets against actual expenses.
  - *Doughnut Chart*: Detailed statistical breakdown of category distributions.

### 2. Comprehensive Expense Library
- **Advanced Filtering**: Instantly search by expense name, filter by specific category, or sort records by oldest first, newest first, highest/lowest amount, or alphabetical order.
- **Full CRUD Management**: Create, Read, Update, and Delete transactions easily with responsive forms and server-side validation.

### 3. AI Financial Advisor Widget
- A floating chat helper that acts as an offline, rule-based AI financial advisor.
- Understands natural queries like:
  - *"How is my budget status?"* / *"Show limit"*
  - *"What is my top spending category?"*
  - *"Show my latest transactions"*
  - *"Give me savings tips"*
- Provides customized financial suggestions based on your highest expenditure category.

### 4. Interactive Keyboard Shortcuts
Pressing `?` brings up a shortcuts menu to navigate the application at lightning speed:
- `N` / `A` — Go to Add Expense
- `D` — Go to Dashboard
- `E` — Go to Expenses Library
- `I` — Go to Insights (Analytics)
- `S` — Focus Search bar (when on the Library page)
- `Esc` — Close modals or cancel actions

---

## 🛠️ Setup & Execution

### 1. Prerequisites
Make sure you have **Python 3.x** and **Flask** installed on your system:
```bash
pip install Flask
```

### 2. Run the Application
Start the Flask development server from the `DAY-13` root directory:
```bash
python3 app.py
```

### 3. Open in Browser
Once running, navigate to:
```url
http://127.0.0.1:5000/
```

---

## 📊 Database Schema

The application uses an SQLite database (`expense.db`) with the following relational schema:

```sql
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount REAL NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL,
    payment_mode TEXT NOT NULL,
    expense_date TEXT NOT NULL,
    description TEXT
);

-- Optimization indexes for high-speed querying:
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
```
