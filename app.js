function Product(name, filePath) {
  this.name = name;
  this.filePath = filePath;
  this.timesShown = 0;
  this.timesClicked = 0;
}

Product.allProducts = [];
Product.totalRounds = 25;
Product.currentRound = 0;
Product.lastDisplayed = []; // Keep track of the last displayed products

Product.initializeProducts = function(imageList) {
  for (let imageName of imageList) {
    let filePath = `images/${imageName}`;
    filePath += imageName === 'sweep' ? '.png' : '.jpg';
    Product.allProducts.push(new Product(imageName, filePath));
  }
};

Product.pickThree = function() {
  let chosen = [];
  while (chosen.length < 3) {
    let randomIndex = Math.floor(Math.random() * Product.allProducts.length);
    let product = Product.allProducts[randomIndex];
    if (!chosen.includes(product) && !Product.lastDisplayed.includes(product)) {
      product.timesShown++;
      chosen.push(product);
    }
  }
  Product.lastDisplayed = [...chosen]; // Update the last displayed products
  return chosen;
};

Product.displayThree = function() {
  const productSection = document.getElementById('product-section');
  productSection.innerHTML = '';

  const threeProducts = Product.pickThree();
  threeProducts.forEach(product => {
    const imgElement = document.createElement('img');
    imgElement.src = product.filePath;
    imgElement.alt = product.name;
    imgElement.title = product.name;
    imgElement.addEventListener('click', Product.handleClickOnProduct);
    productSection.appendChild(imgElement);
  });

  Product.currentRound++;
  if (Product.currentRound === Product.totalRounds) {
    Product.endVotingSession();
  }
};

Product.handleClickOnProduct = function(event) {
  const clickedProductName = event.target.title;
  const clickedProduct = Product.allProducts.find(product => product.name === clickedProductName);
  if (clickedProduct) {
    clickedProduct.timesClicked++;
  }
  Product.displayThree();
};

Product.endVotingSession = function() {
  const productSection = document.getElementById('product-section');
  productSection.innerHTML = '';
  const viewResultsButton = document.createElement('button');
  viewResultsButton.textContent = 'View Results';
  viewResultsButton.addEventListener('click', Product.displayResults);
  productSection.appendChild(viewResultsButton);
};

Product.displayResults = function() {
  // Hide the product section
  document.getElementById('product-section').style.display = 'none';

  // Create and display results in the results section
  const resultsSection = document.getElementById('results-section');
  resultsSection.innerHTML = '';

  Product.allProducts.forEach(product => {
    const result = document.createElement('p');
    result.textContent = `${product.name} had ${product.timesClicked} votes, and was seen ${product.timesShown} times.`;
    resultsSection.appendChild(result);
  });

  // Call to display the chart after the results
  Product.displayChart();
};

Product.displayChart = function() {
  const ctx = document.getElementById('resultsChart').getContext('2d');
  const labels = Product.allProducts.map(product => product.name);
  const voteData = Product.allProducts.map(product => product.timesClicked);
  const viewsData = Product.allProducts.map(product => product.timesShown);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Votes',
        data: voteData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }, {
        label: 'Views',
        data: viewsData,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

// Initialize the products and start the first display
Product.initializeProducts([
  'bag', 'banana', 'bathroom', 'boots', 'breakfast',
  'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon',
  'pen', 'pet-sweep', 'scissors', 'shark', 'sweep',
  'tauntaun', 'unicorn', 'water-can', 'wine-glass'
]);

window.onload = function() {
  Product.displayThree();
};
