const topBar = document.querySelector("#top-bar");
const exteriorColorSection = document.querySelector("#exterior-buttons");
const interiorColorSection = document.querySelector("#interior-buttons");
const exteriorImage = document.querySelector("#exterior-image");
const interiorImage = document.querySelector("#interior-image");
const wheelButtonsSection = document.querySelector("#wheel-buttons");
const paymentElement = document.querySelector("#payment");
const paymentBreakdownItems = document.querySelector(
  "#payment-breakdown-items"
);
const performanceBtn = document.querySelector("#performance-btn");

const basePrice = 2800000; // PKR 28 lacs base price
let totalPrice = basePrice;

// Track current selections
let currentExteriorColor = "Pearl White";
let currentInteriorColor = "Light";

const selectedOptions = {
  "Performance Wheels": false,
  "Performance Package": false,
  accessories: [],
};

// Image Mapping
const exteriorImages = {
  "Pearl White": "/alto-white.jpg",
  "Quick Silver": "/alto-silver.jpg",
  "Solid Black": "/alto-black.jpg",
};

const interiorImages = {
  Light: "/interior-white.png",
  Dark: "/interior-black.png",
};

// Handle Color Selection - both exterior & interior
const handleColorButtonClick = (event) => {
  let button;
  if (event.target.tagName === "IMG") {
    button = event.target.closest("BUTTON");
  } else if (event.target.tagName === "BUTTON") {
    button = event.target;
  }
  if (button) {
    const buttons = event.currentTarget.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.remove("btn-selected"));
    button.classList.add("btn-selected");
  }

  // Change Exterior Image
  if (event.currentTarget === exteriorColorSection) {
    currentExteriorColor = button.querySelector("img").alt;
    updateExteriorImage();
  }

  // Change Interior Image
  if (event.currentTarget === interiorColorSection) {
    currentInteriorColor = button.querySelector("img").alt;
    interiorImage.src = interiorImages[currentInteriorColor];
  }
};

// Update exterior image based on colors & wheels
const updateExteriorImage = () => {
  // If performance wheels are selected, show the performance image
  // Otherwise show the correct color image
  if (selectedOptions["Performance Wheels"]) {
    exteriorImage.src = "/perfomance-wheels.png"; // Could be expanded to have different colored performance wheels
  } else {
    exteriorImage.src = exteriorImages[currentExteriorColor];
  }
};

// Format price in PKR
const formatPrice = (price) => {
  if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)} Lacs`;
  } else {
    return `PKR ${price.toLocaleString()}`;
  }
};

// Make sure accessory handling is global
window.handleAccessoryCheckbox = function (checkbox) {
  const price = parseInt(checkbox.dataset.price);
  const name = checkbox.dataset.name;

  console.log("Checkbox changed:", name, price, checkbox.checked);

  if (checkbox.checked) {
    selectedOptions.accessories.push({
      name,
      price,
    });
  } else {
    selectedOptions.accessories = selectedOptions.accessories.filter(
      (item) => item.name !== name
    );
  }

  console.log("Current accessories:", selectedOptions.accessories);
  updatePriceBreakdown();
};

// Update price breakdown
const updatePriceBreakdown = () => {
  let price = basePrice;
  let breakdownHTML = "";

  // Add performance wheels cost if selected
  if (selectedOptions["Performance Wheels"]) {
    price += 250000; // PKR 2.5 lacs
    breakdownHTML += `
      <div class="flex justify-between py-1">
        <span>Performance Wheels:</span>
        <span>PKR 2.50 Lacs</span>
      </div>
    `;
  }

  // Add performance package cost if selected
  if (selectedOptions["Performance Package"]) {
    price += 500000; // PKR 5 lacs
    breakdownHTML += `
      <div class="flex justify-between py-1">
        <span>Performance Package:</span>
        <span>PKR 5.00 Lacs</span>
      </div>
    `;
  }

  // Add cost of selected accessories
  selectedOptions.accessories.forEach((accessory) => {
    price += accessory.price;
    breakdownHTML += `
      <div class="flex justify-between py-1">
        <span>${accessory.name}:</span>
        <span>${formatPrice(accessory.price)}</span>
      </div>
    `;
  });

  // If no options selected, show a message and remove borders
  if (!breakdownHTML) {
    breakdownHTML = `
      <div class="py-1 text-gray-500 italic">
        <span>No additional options selected</span>
      </div>
    `;
    paymentBreakdownItems.classList.remove("border-t", "border-b");
  } else {
    // Add borders when options are selected
    paymentBreakdownItems.classList.add("border-t", "border-b");
  }

  // Update breakdown container
  paymentBreakdownItems.innerHTML = breakdownHTML;

  totalPrice = price;
  console.log("Updated total price to:", formatPrice(price));

  // Now only update the payment element
  paymentElement.textContent = formatPrice(price);
};

// Wheel Selection
const handleWheelButtonClick = (event) => {
  const button = event.target.closest("button");
  if (button) {
    const buttons = wheelButtonsSection.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.classList.remove("bg-gray-700", "text-white");
    });
    // Add selected styles to clicked button
    button.classList.add("bg-gray-700", "text-white");

    const selectedWheel = button.textContent.includes("Performance");
    selectedOptions["Performance Wheels"] = selectedWheel;

    // Use the updateExteriorImage function to set the correct image
    updateExteriorImage();

    updatePriceBreakdown();
  }
};

// Performance package selection
const handlePerformanceClick = () => {
  selectedOptions["Performance Package"] =
    !selectedOptions["Performance Package"];

  if (selectedOptions["Performance Package"]) {
    performanceBtn.classList.remove("bg-gray-200");
    performanceBtn.classList.add("bg-gray-700", "text-white");
  } else {
    performanceBtn.classList.remove("bg-gray-700", "text-white");
    performanceBtn.classList.add("bg-gray-200");
  }

  updatePriceBreakdown();
};

// Event Listeners
exteriorColorSection.addEventListener("click", handleColorButtonClick);
interiorColorSection.addEventListener("click", handleColorButtonClick);
wheelButtonsSection.addEventListener("click", handleWheelButtonClick);
performanceBtn.addEventListener("click", handlePerformanceClick);

// Initialize price display
updatePriceBreakdown();
