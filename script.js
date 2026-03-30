document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    const amountInput = document.getElementById('amount');
    const expenseChart = document.getElementById('expense-chart');

    let selectedMonth;
    let selectedYear;
    let chart;

    //  Generate years dynamically
    for (let year = 2020; year <= 2040; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    //  Default categories
    const defaultCategories = {
        Housing: 0,
        Food: 0,
        Transportation: 0,
        Bills: 0,
        Miscellaneous: 0
    };

    // Expenses object
    const expenses = {
        January: { ...defaultCategories },
        February: { ...defaultCategories },
        March: { ...defaultCategories },
        April: { ...defaultCategories },
        May: { ...defaultCategories },
        June: { ...defaultCategories },
        July: { ...defaultCategories },
        August: { ...defaultCategories },
        September: { ...defaultCategories },
        October: { ...defaultCategories },
        November: { ...defaultCategories },
        December: { ...defaultCategories }
    };

    // Load from localStorage
    function getExpensesFromLocalStorage(month, year) {
        const key = `${month}-${year}`;
        return JSON.parse(localStorage.getItem(key)) || expenses[month];
    }

    //  Save to localStorage
    function saveExpensesToLocalStorage(month, year) {
        const key = `${month}-${year}`;
        localStorage.setItem(key, JSON.stringify(expenses[month]));
    }

    //  Get selected month/year
    function getSelectedMonthYear() {
        selectedMonth = monthSelect.value;
        selectedYear = yearSelect.value;

        if (!selectedMonth || !selectedYear) {
            alert("Month or Year not selected");
            return false;
        }

        if (!expenses[selectedMonth]) {
            expenses[selectedMonth] = { ...defaultCategories };
        }

        return true;
    }

    //  Update Chart
    function updateChart() {
        if (!getSelectedMonthYear()) return;

        const expenseData = getExpensesFromLocalStorage(selectedMonth, selectedYear);
        const ctx = expenseChart.getContext('2d');

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(expenseData),
                datasets: [{
                    data: Object.values(expenseData),
                    backgroundColor: [
                        '#FF6384',
                        '#4CAF50',
                        '#FFCE56',
                        '#36A2EB',
                        '#FF9F40'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw}`;
                            }
                        }
                    }
                }
            }
        });
    }

    //  Form submit
    function handleSubmit(event) {
        event.preventDefault();
        if (!getSelectedMonthYear()) return;

        const category = event.target.category.value;
        const amount = parseFloat(event.target.amount.value);

        const currentAmount = expenses[selectedMonth][category] || 0;

        if (amount > 0) {
            expenses[selectedMonth][category] = currentAmount + amount;
        } 
        else if (amount < 0 && currentAmount >= Math.abs(amount)) {
            expenses[selectedMonth][category] = currentAmount + amount;
        } 
        else {
            alert("Invalid amount! Cannot go below zero.");
            return;
        }

        saveExpensesToLocalStorage(selectedMonth, selectedYear);
        updateChart();

        event.target.reset(); //  reset form
    }

    //  Events
    expenseForm.addEventListener('submit', handleSubmit);
    monthSelect.addEventListener('change', updateChart);
    yearSelect.addEventListener('change', updateChart);

    //  Set default month/year
    function setDefaultMonthYear() {
        const now = new Date();
        const initialMonth = now.toLocaleString('default', { month: 'long' });
        const initialYear = now.getFullYear();

        monthSelect.value = initialMonth;
        yearSelect.value = initialYear;
    }

    setDefaultMonthYear();
    updateChart();
});