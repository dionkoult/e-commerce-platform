import {cart} from '../../data/cart-class.js';

export function renderCheckoutHeader() {
  let cartQuantity = cart.calculateCartQuantity();
  let checkoutHeaderHTML = ``;

  if (cartQuantity === 1) {
    checkoutHeaderHTML = `
      Checkout (<a class="return-to-home-link js-checkout-cart-quantity"
        href="index.html">${cartQuantity} item</a>)
    `;
  } else if (cartQuantity === 0) {
    checkoutHeaderHTML = `
      Checkout
    `;
  } else {
    checkoutHeaderHTML = `
      Checkout (<a class="return-to-home-link js-checkout-cart-quantity"
        href="index.html">${cartQuantity} items</a>)
    `;
  }

  document.querySelector('.checkout-header-middle-section').innerHTML = checkoutHeaderHTML;
}