import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {renderCheckoutHeader} from './checkout/checkoutHeader.js';
import {loadProducts, loadProductsFetch} from '../data/products.js';
import {loadCart, loadCartFetch} from '../data/cart.js';

async function loadPage() {
  try {
    await Promise.all([
      loadProductsFetch(),
      loadCartFetch()
    ])

      renderOrderSummary();
      renderPaymentSummary();
      renderCheckoutHeader();
      
  } catch (error) {
    console.log('Unexpected error. Please try again later.');
  }
}

loadPage();