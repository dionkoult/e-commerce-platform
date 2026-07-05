import {cart} from '../../data/cart-class.js';
import {products, getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions, getDeliveryOption, calculateDeliveryDate} from '../../data/deliveryOptions.js';
import {renderPaymentSummary} from './paymentSummary.js';
import {renderCheckoutHeader} from './checkoutHeader.js';

export function renderOrderSummary() {

  let cartSummaryHTML = '';

  if (cart.cartItems.length === 0) {
    document.querySelector('.js-checkout-clear-btn').classList.add('clear-button-inactive');

    document.querySelector('.js-order-summary').innerHTML =
      '<div class="empty-cart-cont">Your cart is empty.</div>';
    return;
  }

  cart.cartItems.forEach((cartItem) => {

    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container 
      js-cart-item-container
      js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name js-product-name-${matchingProduct.id}">
              ${matchingProduct.name}
            </div>
            <div class="product-price js-product-price-${matchingProduct.id}">
              ${matchingProduct.getPrice()}
            </div>
            <div class="product-quantity product-quantity-id-${matchingProduct.id} js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: <span class="quantity-label quantity-label-id-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input type="number" min="1" max="99" step="1" oninput="this.value = Math.max(1, Math.min(99, this.value));" class="quantity-input input-id-${matchingProduct.id}" data-quantity-id="${matchingProduct.id}">
              <span class="save-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" 
              data-product-id="${matchingProduct.id}">
                Delete
              </span>
              <span class="message-invalid">Available</span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `${formatCurrency(deliveryOption.priceCents)} -`;

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        html += `
        <div class="delivery-option js-delivery-option js-delivery-element-${matchingProduct.id}-${deliveryOption.id}"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input js-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `
    });

    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        cart.removeFromCart(productId);

        renderOrderSummary();
        renderPaymentSummary();
        renderCheckoutHeader();
      });
    });

  const clearBtn = document.querySelector('.js-checkout-clear-btn');

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cart.clear();
      renderOrderSummary();
      renderPaymentSummary();
      renderCheckoutHeader();
    });
  }

  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        
        const cartContainer = document.querySelector(`.js-cart-item-container-${productId}`);
        cartContainer.classList.add('is-editing-quantity');

        const message = document.querySelector(`.product-quantity-id-${productId}`);
        message.classList.add('quantity-info');

      });
    });


  function saveQuantityButton(productId) {
    const cartContainer = document.querySelector(`.js-cart-item-container-${productId}`);
    cartContainer.classList.remove('is-editing-quantity');

    const input = document.querySelector(`.input-id-${productId}`);
    const inputQuantity = Number(input.value);

    cart.updateQuantity(productId, inputQuantity);

    renderCheckoutHeader();

    renderPaymentSummary();

    renderOrderSummary();

    const message = document.querySelector(`.product-quantity-id-${productId}`);
    message.classList.remove('quantity-info');
  }


  document.querySelectorAll('.save-quantity-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        saveQuantityButton(productId);
        cart.calculateCartQuantity();
      });
    });


  document.querySelectorAll('.quantity-input')
  .forEach((link) => {
    link.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const productId = link.dataset.quantityId;
        saveQuantityButton(productId);
      }
    });
  });

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        cart.updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      })
    });
}