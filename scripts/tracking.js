import {cart} from "../data/cart-class.js";
import {getProduct, loadProductsFetch} from "../data/products.js";
import {orders} from "../data/orders.js";
import {estimatedDate} from "../data/deliveryOptions.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';import './search.js';

cart.updateCartQuantity();

async function loadProducts() {
  renderLoadingTracking();

  const minLoadingTime = delay(400);

  await Promise.all([
    loadProductsFetch(),
    minLoadingTime
  ]);

  renderTracking();
}

loadProducts();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function renderLoadingTracking() {
  document.querySelector('.order-tracking').innerHTML = `
    <div class="loading-state">
      Loading order details...
    </div>
  `;
}

function renderTracking() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const order = orders.find(order => order.id === orderId);
  if (!order) {
    console.error('Order not found');
    return;
  }

  const productId = url.searchParams.get('productId');
  const product = order.products.find(product => product.productId === productId);
  if (!product) {
    console.error('Product not found in order');
    return;
  }
  const matchingProduct = getProduct(productId);

  const quantity = product.quantity;

  cart.loadDate();
  const match = cart.date.find(d => d.orderId === order.id);
  const date = match?.date;
  const estimatedDelTime = product.estimatedDeliveryTime;
  if (!date) {
    console.error('Order date not found');
    return;
  }

  const dateFinal = estimatedDate(estimatedDelTime, date);
  
  // Progress Bar  
  const orderDate = dayjs(`${date} ${dayjs().year()}`);
  const currentDate = dayjs();
  const daysBetween1 = currentDate.diff(orderDate, 'day');

  const deliveryTime = dayjs(`${dateFinal} ${dayjs().year()}`);
  const daysBetween2 = deliveryTime.diff(orderDate, 'day');

  let progressBar = (daysBetween1 / daysBetween2) * 100;

  if (progressBar === 0) {
    progressBar = 10;
  }

  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${dateFinal}
    </div>

    <div class="product-info">
      ${matchingProduct.name}
    </div>

    <div class="product-info">
      Quantity: ${quantity}
    </div>

    <img class="product-image" src="${matchingProduct.image}">

    <div class="progress-labels-container">
      <div class="progress-label">
        Preparing
      </div>
      <div class="progress-label">
        Shipped
      </div>
      <div class="progress-label">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progressBar}%;"></div>
    </div>
  `;

  document.querySelector('.order-tracking').innerHTML = trackingHTML;

  // Highlighted Word for Progress
  const words = document.querySelectorAll('.progress-label');

  if (progressBar > 0 && progressBar <= 49) {
    words.forEach((word) => {
      if (word.innerText === 'Preparing') {
        word.classList.add('current-status');
      }
    })
   } else if (progressBar > 49 && progressBar <= 99) {
    words.forEach((word) => {
      if (word.innerText === 'Shipped') {
        word.classList.add('current-status');
      }
    })
   } else {
    words.forEach((word) => {
      if (word.innerText === 'Delivered') {
        word.classList.add('current-status');
      }
    })
   }
}
