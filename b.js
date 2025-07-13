let selectedESG = 0;
const esgIcons = document.querySelectorAll('#esgSelector i');
const productGrid = document.getElementById('productGrid');
const avgESGDisplay = document.getElementById('avgESG');
const totalProductsDisplay = document.getElementById('totalProducts');
const products = [];

// Handle ESG selection
esgIcons.forEach(icon => {
  icon.addEventListener('click', () => {
    selectedESG = parseInt(icon.getAttribute('data-value'));
    esgIcons.forEach(i => i.classList.remove('active'));
    for (let i = 0; i < selectedESG; i++) {
      esgIcons[i].classList.add('active');
    }
  });
});

// Add Product
function addProduct() {
  const name = document.getElementById('productName').value.trim();
  const desc = document.getElementById('productDesc').value.trim();
  const discount = document.getElementById('productDiscount').value;
  const images = document.getElementById('productImage').files;

  if (!name || !desc || !discount || !selectedESG || images.length === 0) {
    alert('Please fill all fields and add an image.');
    return;
  }

  const imageURL = URL.createObjectURL(images[0]);
  const product = { 
    name, 
    desc, 
    discount, 
    esg: selectedESG, 
    image: imageURL 
  };
  products.push(product);
  renderProducts();
  updateESG();

  // Reset form
  document.getElementById('productForm').reset();
  esgIcons.forEach(i => i.classList.remove('active'));
  selectedESG = 0;
}

// Render Products
function renderProducts() {
  productGrid.innerHTML = '';
  products.forEach((p, index) => {
    let leaves = '';
    for (let i = 0; i < 5; i++) {
      leaves += `<i class="fas fa-leaf" style="color:${i < p.esg ? '#3D8361' : '#ccc'}"></i>`;
    }
    
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <p>Discount: ${p.discount}%</p>
      <div class="esg-rating">${leaves}</div>
      <button onclick="deleteProduct(${index})">Delete</button>
    `;
    productGrid.appendChild(productCard);
  });
}

// Delete Product
function deleteProduct(index) {
  // Revoke the image URL to prevent memory leaks
  URL.revokeObjectURL(products[index].image);
  products.splice(index, 1);
  renderProducts();
  updateESG();
}

// Update ESG Stats
function updateESG() {
  const totalLeaves = products.reduce((sum, p) => sum + parseInt(p.esg), 0);
  const avg = products.length ? (totalLeaves / products.length).toFixed(1) : 0;
  avgESGDisplay.textContent = `Average ESG: ${avg} 🌿`;
  totalProductsDisplay.textContent = `Total Products: ${products.length}`;
}