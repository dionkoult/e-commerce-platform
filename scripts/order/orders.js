import {orders, addOrder, removeFromOrders, saveToStorage} from "../../data/orders.js";
import {cart} from '../../data/cart-class.js';
import {products, getProduct, loadProductsFetch, addedMessage} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions, getDeliveryOption, calculateDeliveryDate, dateNow, estimatedDate} from '../../data/deliveryOptions.js';
import {renderPaymentSummary} from "../checkout/paymentSummary.js";
import {renderOrderHeader} from "./ordersHeader.js";
import '../search.js';

renderOrderHeader();
cart.updateCartQuantity();

async function loadProducts() {
  await loadProductsFetch();

  renderOrder();
}

loadProducts();

export function renderOrder() {
  let orderHTML = '';

  if (orders.length === 0) {
    document.querySelector('.js-clear-button').classList.add('clear-button-inactive');

    orderHTML = `
      <div class="no-orders-text">
        No orders yet...
        <img class="gif" src="images/triste.gif">
      </div>
    `;
    document.querySelector('.orders-grid').innerHTML = orderHTML;
    return;
  }

  cart.loadDate();

  orders.forEach((order) => {
    const orderId = order.id;

    const orderCost = order.totalCostCents;
    const totalCost = formatCurrency(orderCost);

    const products = order.products;
    const match = cart.date.find(d => d.orderId === order.id);
    const date = match?.date;

    orderHTML += `
      <div class="order-container">
        
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${date}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${totalCost}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${orderId}</div>
          </div>
          <button class="cancel-button js-cancel-button" data-order-id="${orderId}">
            Cancel
          </button>
        </div>
          
    `;

    products.forEach((product) => {
      const productId = product.productId;
      const matchingProduct = getProduct(productId);
      if (!matchingProduct) {
        console.warn('Invalid product in cart:', productId);
        return;
      }
      
      const quantity = product.quantity;

      const estimatedDelTime = product.estimatedDeliveryTime;
      const dateFinal = estimatedDate(estimatedDelTime, date);

      orderHTML += `
        <div class="order-details-grid">
          <div class="product-image-container">
            <img src="${matchingProduct.image}">
          </div>

          <div class="product-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-delivery-date">
              Arriving on: ${dateFinal}
            </div>
            <div class="product-quantity">
              Quantity: ${quantity}
            </div>
            <div class="buy-again-container js-buy-again-${orderId}">
              <button class="buy-again-button button-primary js-buy-again-button" data-order-id="${orderId}" data-product-id="${productId}">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
              <div class="added-to-cart js-added-to-cart-${productId}">
                <img src="images/icons/checkmark.png">
                  Added
              </div>
            </div>
          </div>

          <div class="product-actions">
            <a href="tracking.html?orderId=${orderId}&productId=${productId}">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        </div>
      `;
    });

    orderHTML += `
      </div>
    `;
  });

  document.querySelector('.orders-grid').innerHTML = orderHTML;

  document.querySelectorAll('.js-cancel-button')
    .forEach((button) => {
      button.addEventListener('click', () => {
        removeFromOrders(button.dataset.orderId);
        saveToStorage();
        renderOrder();
      });
    });

  document.querySelectorAll('.js-buy-again-button')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const orderId = button.dataset.orderId;
        cart.addToCart(productId, 1);
        renderOrderHeader();
        const message = document.querySelector(`.js-buy-again-${orderId} .js-added-to-cart-${productId}`);
        addedMessage(message);
      });
    });
}


document.querySelector('.js-clear-button')
  .addEventListener('click', () => {
    localStorage.removeItem('orders');
    orders.length = 0;
    renderOrder();
  });
