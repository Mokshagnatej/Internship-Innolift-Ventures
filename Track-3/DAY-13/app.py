"""Personal Expense Tracker built with Flask, SQLite, and Jinja templates."""

from __future__ import annotations

import os
import sqlite3
from datetime import date, datetime
from decimal import Decimal, InvalidOperation

from flask import (
    Flask,
    abort,
    current_app,
    flash,
    g,
    redirect,
    render_template,
    request,
    url_for,
)


CATEGORIES = (
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Education",
    "Health",
    "Others",
)

PAYMENT_MODES = ("Cash", "UPI", "Debit Card", "Credit Card", "Net Banking")

SCHEMA = """
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount REAL NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL,
    payment_mode TEXT NOT NULL,
    expense_date TEXT NOT NULL,
    description TEXT
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
"""


app = Flask(__name__)
app.config.from_mapping(
    SECRET_KEY=os.environ.get("SECRET_KEY", "expense-tracker-local-key"),
    DATABASE=os.path.join(app.root_path, "expense.db"),
)


def get_db() -> sqlite3.Connection:
    """Return one SQLite connection for the current request."""
    if "db" not in g:
        g.db = sqlite3.connect(current_app.config["DATABASE"])
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(_error: BaseException | None = None) -> None:
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db() -> None:
    """Create the expense table and indexes when the application starts."""
    db = get_db()
    db.executescript(SCHEMA)
    db.commit()


@app.context_processor
def inject_form_options() -> dict[str, object]:
    return {"categories": CATEGORIES, "payment_modes": PAYMENT_MODES, "today": date.today().isoformat()}


@app.template_filter("currency")
def format_currency(value: float | int | None) -> str:
    return f"₹{float(value or 0):,.2f}"


@app.template_filter("friendly_date")
def format_date(value: str | None) -> str:
    if not value:
        return "—"
    try:
        return datetime.strptime(value, "%Y-%m-%d").strftime("%d %b %Y")
    except ValueError:
        return value


def validate_expense_form() -> tuple[dict[str, object], list[str]]:
    """Normalize and validate the add/edit form on the server side."""
    form_data: dict[str, object] = {
        "title": " ".join(request.form.get("title", "").split()),
        "amount": request.form.get("amount", "").strip(),
        "category": request.form.get("category", "").strip(),
        "payment_mode": request.form.get("payment_mode", "").strip(),
        "expense_date": request.form.get("expense_date", "").strip(),
        "description": request.form.get("description", "").strip(),
    }
    errors: list[str] = []

    if not form_data["title"]:
        errors.append("Please enter an expense title.")
    elif len(str(form_data["title"])) > 100:
        errors.append("The expense title must be 100 characters or fewer.")

    try:
        amount = Decimal(str(form_data["amount"]))
        if not amount.is_finite() or amount <= 0:
            raise InvalidOperation
        form_data["amount"] = float(amount.quantize(Decimal("0.01")))
    except (InvalidOperation, ValueError):
        errors.append("Enter an amount greater than zero.")

    if form_data["category"] not in CATEGORIES:
        errors.append("Choose a valid category.")

    if form_data["payment_mode"] not in PAYMENT_MODES:
        errors.append("Choose a valid payment mode.")

    try:
        datetime.strptime(str(form_data["expense_date"]), "%Y-%m-%d")
    except ValueError:
        errors.append("Choose a valid expense date.")

    if len(str(form_data["description"])) > 500:
        errors.append("The description must be 500 characters or fewer.")

    return form_data, errors


def get_expense_or_404(expense_id: int) -> sqlite3.Row:
    expense = get_db().execute("SELECT * FROM expenses WHERE id = ?", (expense_id,)).fetchone()
    if expense is None:
        abort(404)
    return expense


@app.route("/")
def index():
    db = get_db()
    overview = db.execute(
        "SELECT COUNT(*) AS expense_count, COALESCE(SUM(amount), 0) AS total FROM expenses"
    ).fetchone()
    current_month = date.today().strftime("%Y-%m")
    monthly_total = db.execute(
        "SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE substr(expense_date, 1, 7) = ?",
        (current_month,),
    ).fetchone()["total"]
    category_stats = db.execute(
        """
        SELECT category, COUNT(*) AS expense_count, ROUND(SUM(amount), 2) AS total
        FROM expenses
        GROUP BY category
        ORDER BY total DESC, category ASC
        """
    ).fetchall()
    recent_expenses = db.execute(
        "SELECT * FROM expenses ORDER BY expense_date DESC, id DESC LIMIT 5"
    ).fetchall()

    return render_template(
        "index.html",
        overview=overview,
        monthly_total=monthly_total,
        top_category=category_stats[0] if category_stats else None,
        category_stats=category_stats,
        recent_expenses=recent_expenses,
        current_month_label=date.today().strftime("%B %Y"),
    )


@app.route("/add-expense", methods=("GET", "POST"))
def add_expense():
    form_data: dict[str, object] = {
        "title": "",
        "amount": "",
        "category": "",
        "payment_mode": "",
        "expense_date": date.today().isoformat(),
        "description": "",
    }

    if request.method == "POST":
        form_data, errors = validate_expense_form()
        if errors:
            return render_template("add_expense.html", form_data=form_data, form_errors=errors), 400

        db = get_db()
        db.execute(
            """
            INSERT INTO expenses (title, amount, category, payment_mode, expense_date, description)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                form_data["title"],
                form_data["amount"],
                form_data["category"],
                form_data["payment_mode"],
                form_data["expense_date"],
                form_data["description"],
            ),
        )
        db.commit()
        flash("Expense added successfully.", "success")
        return redirect(url_for("expenses"))

    return render_template("add_expense.html", form_data=form_data, form_errors=[])


@app.route("/expenses")
def expenses():
    search_query = request.args.get("q", "").strip()
    selected_category = request.args.get("category", "").strip()
    selected_sort = request.args.get("sort", "date_desc")

    if selected_category not in CATEGORIES:
        selected_category = ""

    sort_sql = {
        "date_desc": "expense_date DESC, id DESC",
        "date_asc": "expense_date ASC, id ASC",
        "amount_desc": "amount DESC, id DESC",
        "amount_asc": "amount ASC, id ASC",
        "title_asc": "title COLLATE NOCASE ASC, id DESC",
    }
    if selected_sort not in sort_sql:
        selected_sort = "date_desc"

    clauses: list[str] = []
    params: list[str] = []
    if search_query:
        clauses.append("title LIKE ? COLLATE NOCASE")
        params.append(f"%{search_query}%")
    if selected_category:
        clauses.append("category = ?")
        params.append(selected_category)

    where_clause = f" WHERE {' AND '.join(clauses)}" if clauses else ""
    db = get_db()
    expense_rows = db.execute(
        f"SELECT * FROM expenses{where_clause} ORDER BY {sort_sql[selected_sort]}", params
    ).fetchall()
    filtered_total = sum(float(expense["amount"]) for expense in expense_rows)

    return render_template(
        "expenses.html",
        expenses=expense_rows,
        filtered_total=filtered_total,
        search_query=search_query,
        selected_category=selected_category,
        selected_sort=selected_sort,
    )


@app.route("/edit/<int:expense_id>", methods=("GET", "POST"))
def edit_expense(expense_id: int):
    expense = get_expense_or_404(expense_id)
    form_data: dict[str, object] = dict(expense)

    if request.method == "POST":
        form_data, errors = validate_expense_form()
        if errors:
            form_data["id"] = expense_id
            return render_template(
                "edit_expense.html", expense=form_data, form_errors=errors
            ), 400

        db = get_db()
        db.execute(
            """
            UPDATE expenses
            SET title = ?, amount = ?, category = ?, payment_mode = ?, expense_date = ?, description = ?
            WHERE id = ?
            """,
            (
                form_data["title"],
                form_data["amount"],
                form_data["category"],
                form_data["payment_mode"],
                form_data["expense_date"],
                form_data["description"],
                expense_id,
            ),
        )
        db.commit()
        flash("Expense updated successfully.", "success")
        return redirect(url_for("expenses"))

    return render_template("edit_expense.html", expense=form_data, form_errors=[])


@app.post("/delete/<int:expense_id>")
def delete_expense(expense_id: int):
    get_expense_or_404(expense_id)
    db = get_db()
    db.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
    db.commit()
    flash("Expense deleted.", "success")
    return redirect(url_for("expenses"))


@app.route("/summary")
def summary():
    db = get_db()
    overview = db.execute(
        "SELECT COUNT(*) AS expense_count, COALESCE(SUM(amount), 0) AS total FROM expenses"
    ).fetchone()
    category_stats = db.execute(
        """
        SELECT category, COUNT(*) AS expense_count, ROUND(SUM(amount), 2) AS total
        FROM expenses
        GROUP BY category
        ORDER BY total DESC, category ASC
        """
    ).fetchall()
    highest_expense = db.execute(
        "SELECT * FROM expenses ORDER BY amount DESC, expense_date DESC, id DESC LIMIT 1"
    ).fetchone()
    recent_expenses = db.execute(
        "SELECT * FROM expenses ORDER BY expense_date DESC, id DESC LIMIT 6"
    ).fetchall()
    monthly_totals = db.execute(
        """
        SELECT substr(expense_date, 1, 7) AS month, ROUND(SUM(amount), 2) AS total
        FROM expenses
        GROUP BY substr(expense_date, 1, 7)
        ORDER BY month DESC
        LIMIT 6
        """
    ).fetchall()
    monthly_totals = list(reversed(monthly_totals))

    return render_template(
        "summary.html",
        overview=overview,
        category_stats=category_stats,
        top_category=category_stats[0] if category_stats else None,
        highest_expense=highest_expense,
        recent_expenses=recent_expenses,
        monthly_totals=monthly_totals,
    )


@app.route("/ai-chat", methods=["POST"])
def ai_chat():
    data = request.get_json() or {}
    message = data.get("message", "").lower().strip()
    client_budget = float(data.get("budget", 20000))

    db = get_db()
    # Fetch database stats to power context-rich replies
    stats = db.execute(
        "SELECT COUNT(*) AS count, COALESCE(SUM(amount), 0) AS total FROM expenses"
    ).fetchone()
    expense_count = stats["count"]
    total_spent = stats["total"]

    current_month = date.today().strftime("%Y-%m")
    month_total = db.execute(
        "SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE substr(expense_date, 1, 7) = ?",
        (current_month,),
    ).fetchone()["total"]

    top_cat_row = db.execute(
        "SELECT category, SUM(amount) as total FROM expenses GROUP BY category ORDER BY total DESC LIMIT 1"
    ).fetchone()

    recent_rows = db.execute(
        "SELECT title, amount, category FROM expenses ORDER BY expense_date DESC, id DESC LIMIT 3"
    ).fetchall()

    # Formulate response based on user inquiry keywords
    response_text = ""

    if not message:
        response_text = "Hello! I am your ExpenseFlow AI Advisor. How can I help you analyze your finances today?"
    elif "budget" in message or "limit" in message or "threshold" in message:
        pct = (month_total / client_budget * 100) if client_budget > 0 else 0
        rem = client_budget - month_total
        if pct >= 100:
            response_text = f"🚨 **Alert:** You have exceeded your monthly budget of **₹{client_budget:,.2f}**! You've spent **₹{month_total:,.2f}** ({pct:.1f}%). You are over budget by **₹{abs(rem):,.2f}**."
        elif pct >= 80:
            response_text = f"⚠️ **Caution:** You have utilized **{pct:.1f}%** of your **₹{client_budget:,.2f}** monthly budget. You've spent **₹{month_total:,.2f}** and have **₹{rem:,.2f}** remaining. Consider dialing back non-essential purchases."
        else:
            response_text = f"✅ **Looking Good:** You've spent **₹{month_total:,.2f}** this month, which is **{pct:.1f}%** of your **₹{client_budget:,.2f}** budget. You still have **₹{rem:,.2f}** safe allowance left."
    elif "top" in message or "category" in message or "breakdown" in message or "most" in message:
        if top_cat_row:
            cat_pct = (top_cat_row["total"] / total_spent * 100) if total_spent > 0 else 0
            response_text = f"📊 Your highest spending category is **{top_cat_row['category']}** with a total of **₹{top_cat_row['total']:,.2f}** spent, making up **{cat_pct:.1f}%** of your all-time transactions. \n\n"
            # Add secondary category if exists
            all_cats = db.execute("SELECT category, SUM(amount) as total FROM expenses GROUP BY category ORDER BY total DESC LIMIT 3").fetchall()
            if len(all_cats) > 1:
                response_text += "Here is your top list:\n"
                for i, row in enumerate(all_cats):
                    response_text += f"{i+1}. **{row['category']}**: ₹{row['total']:,.2f}\n"
        else:
            response_text = "I don't see any logged expenses yet. Once you add some transactions, I will analyze your category breakdown here!"
    elif "recent" in message or "latest" in message or "transaction" in message or "history" in message:
        if recent_rows:
            response_text = "🔍 Here are your 3 most recently logged transactions:\n\n"
            for r in recent_rows:
                response_text += f"• **{r['title']}** in *{r['category']}* — **₹{r['amount']:,.2f}**\n"
        else:
            response_text = "Your transaction timeline is currently clear! Start logging expenses to build your history."
    elif "save" in message or "tips" in message or "advice" in message or "reduce" in message:
        if top_cat_row:
            cat = top_cat_row["category"]
            custom_tip = ""
            if cat == "Food":
                custom_tip = "Try meal prepping or buying ingredients in bulk. Cooking at home typically reduces food spending by 40-50% compared to dining out."
            elif cat == "Transport":
                custom_tip = "Consider public transit, carpooling, or getting a monthly pass. If commuting daily, public options save substantial fuel costs."
            elif cat == "Shopping":
                custom_tip = "Implement a '24-hour rule' before making purchases. If you still want the item after 24 hours, check if there are discount codes or sales."
            elif cat == "Bills":
                custom_tip = "Check for unused recurring subscriptions. Streaming and subscription services left on auto-pay are the easiest items to prune."
            else:
                custom_tip = "Track your small, daily variable cash transactions. Coffee runs and snack purchases add up significantly over the month."

            response_text = f"💡 **Savings Recommendations:**\n\n" \
                            f"1. **Audit your top focus**: Your biggest category is **{cat}**. {custom_tip}\n" \
                            f"2. **Set a hard buffer**: Set aside 10% of your target budget directly on payday before loggin daily expenses.\n" \
                            f"3. **Use cash rules**: For high-volume shopping categories, allocate physical cash envelopes. When the cash is gone, stop spending in that category."
        else:
            response_text = "💡 **General Financial Tips:**\n\n1. Set aside 10% of your earnings to savings on day 1.\n2. Set up automated alerts for high bill items.\n3. Make room for essential expenses first before variable items."
    else:
        response_text = f"🤖 **Financial Summary:**\n\n" \
                        f"You have logged **{expense_count}** transactions totaling **₹{total_spent:,.2f}** in spending all-time. " \
                        f"This month, you have spent **₹{month_total:,.2f}**.\n\n" \
                        f"Is there a specific category or budget metric you'd like me to analyze? Ask me about **'budget status'**, **'top category'**, or **'savings tips'**!"

    return {"response": response_text}


@app.errorhandler(404)
def page_not_found(_error):
    return render_template("404.html"), 404


with app.app_context():
    init_db()


if __name__ == "__main__":
    app.run(debug=True)
