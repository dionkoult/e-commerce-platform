import {formatCurrency} from '../scripts/utils/money.js'

export function getProduct(productId) {
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  return matchingProduct;
}

export class Product {
  id;
  image;
  name;
  rating;
  priceCents;
  keywords;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return '';
  }

  extraInfoAppliance() {
    return '';
  }
}

export class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    return `
      <a href="${this.sizeChartLink}" target="_blank">
        Size chart
      </a>
    `;
  }
}

export class Appliance extends Product {
  instructionsLink;
  warrantyLink;

  extraInfoAppliance() {
    return `
      <a href="${this.instructionsLink}" target="_blank">
        Instractions
      </a>
      <a href="${this.warrantyLink}" target="_blank">
        Warranty
      </a>
    `;
  }
}

export let products = [];

export function loadProductsFetch() {
  const promise = fetch(
    'https://supersimplebackend.dev/products'
  ).then((response) => {
    return response.json();
  }).then((productsData) => {
    products = productsData.map((productDetails) => {
      if (productDetails.type === 'clothing') {
        return new Clothing(productDetails);
      } else if (productDetails.type === 'appliance') {
        return new Appliance(productDetails);
      }
      return new Product(productDetails);
    });
  }).catch((error) => {
    console.log('Unexpected error. Please try again later.');
  });

  return promise;
}

export function loadProducts(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    products = JSON.parse(xhr.response).map((productDetails) => {
      if (productDetails.type === 'clothing') {
        return new Clothing(productDetails);
      } else if (productDetails.type === 'appliance') {
        return new Appliance(productDetails);
      }
      return new Product(productDetails);
    });

    fun();
  });

  xhr.addEventListener('error', (error) => {
    console.log('Unexpected error. Please try again later.');
  });

  xhr.open('GET', 'https://supersimplebackend.dev/products');
  xhr.send();
}

const timeouts = new Map();

export function addedMessage(message) {
  message.classList.add('added-to-cart-activated');

  clearTimeout(timeouts.get(message));

  const timeoutId = setTimeout(() => {
    message.classList.remove('added-to-cart-activated');
    timeouts.delete(message);
  }, 2000);

  timeouts.set(message, timeoutId);
}