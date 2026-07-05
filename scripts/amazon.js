import {cart} from '../data/cart-class.js';
import {products, loadProducts, addedMessage} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
import './search.js';

loadProducts(renderProductsGrid);

function renderProductsGrid() {
  const search = new URLSearchParams(window.location.search).get('search');
  let selector = true;

  if (!search) {
    selector = false;
  }

  let productsHTML = '';

  products.forEach((product) => {
    const productName = product.name.toLowerCase();
    const keywords = product.keywords.map(keyword => keyword.toLowerCase());

    if (!selector || productName.includes(search.toLowerCase()) || keywords.includes(search.toLowerCase())) {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStarsUrl()}">
          <div class="product-rating-${product.rating.count}} link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}
        ${product.extraInfoAppliance()}

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  }
  });

  if (productsHTML === ``) {
    productsHTML += `
      <div class="unmatched-product-message">
        No products matched your search.
      </div>
    `;
  }

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  cart.updateCartQuantity(); 

  document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const {productId} = button.dataset;
        const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
        const quantity = Number(quantitySelector.value);
        const message = document.querySelector(`.js-added-to-cart-${productId}`);

        cart.addToCart(productId, quantity);
        cart.updateCartQuantity();
        addedMessage(message);
      });
    });
}

const banner = document.querySelector('.banner');
const okButton = document.querySelector('.ok');
const pageContent = document.querySelector('.page-content');

function hideBanner() {
  banner.style.display = 'none';
  pageContent.classList.remove('hidden');
  sessionStorage.setItem('bannerClosed', 'true');
}

if (sessionStorage.getItem('bannerClosed') === 'true') {
  banner.style.display = 'none';
} else {
  pageContent.classList.add('hidden');
}

okButton.addEventListener('click', hideBanner);