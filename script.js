// Assuming you have corrected your class names in the HTML and CSS
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("addField").addEventListener("click", moveFields);
  document.getElementById("removeField").addEventListener("click", moveFields);
  document.getElementById("nextButton").addEventListener("click", previewData);
});

function moveFields(event) {
  const sourceSelect =
    event.target.id === "addField"
      ? document.getElementById("availableFields")
      : document.getElementById("displayFields");
  const targetSelect =
    event.target.id === "addField"
      ? document.getElementById("displayFields")
      : document.getElementById("availableFields");

  Array.from(sourceSelect.selectedOptions).forEach((option) => {
    targetSelect.appendChild(option);
  });
}

async function previewData() {
  try {
    const response = await fetch(
      "https://s3.amazonaws.com/open-to-cors/assignment.json"
    );
    const json = await response.json();
    const productsObject = json.products;

    // Convert the products object into an array
    const productsArray = Object.keys(productsObject).map((key) => {
      return {
        id: key, // Include the product ID if needed
        ...productsObject[key],
      };
    });

    // Sort the array by descending popularity
    productsArray.sort(
      (a, b) => parseInt(b.popularity) - parseInt(a.popularity)
    );

    // Clear existing table content
    const table = document.getElementById("data-preview");
    table.innerHTML = "";
    const thead = table.createTHead();
    const headerRow = thead.insertRow();

    // Assuming selected fields are the fields to display in the table
    const selectedFields = Array.from(
      document.getElementById("displayFields").options
    ).map((opt) => opt.value);

    // Create table headers
    selectedFields.forEach((field) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = field.charAt(0).toUpperCase() + field.slice(1); // Capitalize field names
      headerRow.appendChild(headerCell);
    });

    // Create table body and populate rows
    const tbody = document.createElement("tbody");
    productsArray.forEach((product) => {
      const row = tbody.insertRow();
      selectedFields.forEach((field) => {
        const cell = row.insertCell();
        cell.textContent = product[field];
      });
    });
    table.appendChild(tbody);
  } catch (error) {
    console.error("Error fetching or displaying data:", error);
  }
}

// Call this function when the page loads to populate the available fields
function populateAvailableFields() {
  // These should exactly match the keys in your data, including case
  const fields = ["subcategory", "title", "price", "popularity"];

  const availableFieldsSelect = document.getElementById("availableFields");
  availableFieldsSelect.innerHTML = ""; // Clear existing options

  fields.forEach((field) => {
    const option = new Option(field, field);
    availableFieldsSelect.add(option);
  });
}

populateAvailableFields();
