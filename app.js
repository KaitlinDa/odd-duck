function Product(name, filePath) {
  this.name = name;
  this.filePath = filePath;
  this.timesShown = 0;
  this.timesClicked = 0;
}

Product.allProducts = [];
Product.totalRounds = 25;
Product.currentRound = 0;

Product.initializeProducts = function(imageList) {
  Product.allProducts = [];
  for (let imageName of imageList) {
    let filePath = `images/${imageName}`;
    if (imageName === 'sweep') {
      filePath += '.png';
    } else {
      filePath += '.jpg';
    }
    Product.allProducts.push(new Product(imageName, filePath));
  }
};

Product.pickThree = function() {
  const chosen = [];
  while (chosen.length < 3) {
    const randomIndex = Math.floor(Math.random() * Product.allProducts.length);
    const product = Product.allProducts[randomIndex];
    if (!chosen.includes(product)) {
      product.timesShown++;
      chosen.push(product);
    }
  }
  return chosen;
};

Product.displayThree = function() {
  if (Product.currentRound < Product.totalRounds) {
    const productSection = document.getElementById('product-section');
    if (!productSection) return; 
    productSection.innerHTML = '';

    const threeProducts = Product.pickThree();
    for (let product of threeProducts) {
      const imgElement = document.createElement('img');
      imgElement.src = product.filePath;
      imgElement.alt = product.name;
      imgElement.title = product.name;
      imgElement.addEventListener('click', Product.handleClickOnProduct);
      productSection.appendChild(imgElement);
    }
    Product.currentRound++;
  } else {
    Product.endVotingSession();
  }
};

Product.handleClickOnProduct = function(event) {
  const clickedProductName = event.target.title;
  for (let product of Product.allProducts) {
    if (product.name === clickedProductName) {
      product.timesClicked++;
      break;
    }
  }
  Product.displayThree();
};

Product.endVotingSession = function() {
  const productSection = document.getElementById('product-section');
  if (!productSection) return; 
  productSection.innerHTML = '';
  const viewResultsButton = document.createElement('button');
  viewResultsButton.textContent = 'View Results';
  viewResultsButton.addEventListener('click', Product.displayResults);
  productSection.appendChild(viewResultsButton);
};

Product.displayResults = function() {
  const resultsSection = document.getElementById('results-section');
  if (!resultsSection) return; 
  resultsSection.innerHTML = '';

  for (let product of Product.allProducts) {
    const result = document.createElement('p');
    result.textContent = `${product.name} had ${product.timesClicked} votes, and was seen ${product.timesShown} times.`;
    resultsSection.appendChild(result);
  }
};

Product.initializeProducts([
  'bag', 'banana', 'bathroom', 'boots', 'breakfast',
  'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon',
  'pen', 'pet-sweep', 'scissors', 'shark', 'sweep',
  'tauntaun', 'unicorn', 'water-can', 'wine-glass'
]);

window.onload = function() {
  Product.displayThree();
};
