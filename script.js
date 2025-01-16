const descriptionInput=document.getElementById('description');
const priceInput=document.getElementById('price'); 
const categoryInput=document.getElementById('categories');
const expenseTable = document.getElementById("expenseTable")
const addBtn=document.getElementById('addExpense');
const total=document.getElementById("total");
const expenseChartCanvas = document.getElementById("expenseChart");

let totalAmount=0;
const categoryTotals = { Food: 0, Transportation: 0, Entertainment: 0,Shopping:0,Bills:0,Others:0 };

const categoryColors = {
  Food: "#FF6384",
  Transportation: "#36A2EB",
  Entertainment: "#FFCE56",
  Shopping:"#E7E247",
  Bills:"#020122",
  Others:"#227C9D"

};

// Initialize the pie chart
const expenseChart = new Chart(expenseChartCanvas, {
  type: "pie",
  data: {
    labels: ["Food", "Transportation", "Entertainment","Shopping","Bills","Others"], // Initial labels
    datasets: [
      {
        label: "Expenses by Category",
        data: [0, 0, 0,0,0,0], // Initial data
        backgroundColor: [
          categoryColors["Food"],
          categoryColors["Transportation"],
          categoryColors["Entertainment"],
          categoryColors["Shopping"],
          categoryColors["Bills"],
          categoryColors["Others"],
        ],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(2);
            return `${context.label}: ₹${value} (${percentage}%)`;
          },
        },
      },
      legend: {
        position: "top",
      },
    },
  },
});

function updatePieChartOnDelete(category, amount) {
  // Deduct the amount from the respective category total
  categoryTotals[category] -= amount;

  // Ensure no negative values (safety check)
  categoryTotals[category] = Math.max(0, categoryTotals[category]);

  // Redraw the pie chart with updated data
  updateChart();
}




addBtn.addEventListener("click",()=>{
    const description=descriptionInput.value.trim();
    const amount=parseFloat(priceInput.value);
    const category=categoryInput.value;
    total.innerHTML=amount;

    if(!description || isNaN(amount) || amount <= 0){
        alert("Please enter valid expense details");
        return;
    }

    const currentDate=new Date().toLocaleDateString();

    const newRow =document.createElement("tr");


    const dateCell=document.createElement("td");
    dateCell.textContent=currentDate;

    const descriptionCell=document.createElement("td");
    descriptionCell.textContent=description;

    const categoryCell=document.createElement("td");
    categoryCell.textContent=category;

    const amountCell=document.createElement("td");
    amountCell.textContent=amount;

    const actionCell=document.createElement("td");
    const deleteBtn=document.createElement("button");
    deleteBtn.textContent="Delete";
    deleteBtn.style.width="104px";
    deleteBtn.style.backgroundColor="#2563EB";
    deleteBtn.style.color="#fff";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.addEventListener("click", () => {
        // Remove the row from the table
        expenseTable.removeChild(newRow);
        updatePieChartOnDelete(category, amount);
  totalAmount -=amount;

  updateTotalAmount();




        
      });
      actionCell.appendChild(deleteBtn);
   

    newRow.appendChild(dateCell);
  newRow.appendChild(descriptionCell);
  newRow.appendChild(categoryCell);
  newRow.appendChild(amountCell);
  newRow.appendChild(actionCell);

  expenseTable.appendChild(newRow);

  totalAmount +=amount;
  categoryTotals[category] -= amount;
  updateTotalAmount();
  updateChart();

  descriptionInput.value = "";
  priceInput.value = "";
  categoryInput.value = "Food";


})

function updateTotalAmount(){
    total.textContent="₹"+totalAmount.toFixed(2);
}

function updateChart() {
  expenseChart.data.datasets[0].data = [
    categoryTotals["Food"],
    categoryTotals["Transportation"],
    categoryTotals["Entertainment"],
    categoryTotals["Shopping"],
    categoryTotals["Bills"],
    categoryTotals["Others"],
  ];
  expenseChart.update();
}



