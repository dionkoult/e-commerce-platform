import {cart} from '../../data/cart-class.js';

export function renderOrderHeader() {
  let cartQuantity = cart.calculateCartQuantity();

  const orderHTML = `${cartQuantity}`;

  document.querySelector('.js-cart-quantity').innerHTML = orderHTML;
}