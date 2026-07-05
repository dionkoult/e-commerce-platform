import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export const deliveryOptions = [{
  id: '1',
  deliveryDays: 7,
  priceCents: 0
}, {
  id: '2',
  deliveryDays: 3,
  priceCents: 499
}, {
  id: '3',
  deliveryDays: 1,
  priceCents: 999
}];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  return deliveryOption || deliveryOptions[0];
}

export function calculateDeliveryDate(deliveryOption, format = 3) {
  const today = dayjs();
  let dateString = '';
  let i = 1;

  let days = deliveryOption.deliveryDays;
  
  while (days > 0) {
    const deliveryDate = today.add(i, 'days');

    if (format === 3) {
      dateString = deliveryDate.format('dddd, MMMM D');
    } else if (format === 2) {
      dateString = deliveryDate.format('MMMM D');
    }
    
    const dateDay = deliveryDate.format('dddd');

    if (dateDay === 'Saturday' || dateDay === 'Sunday') {
      days += 1;
    }

    days -= 1;
    i += 1;
  }

  return dateString;
}

export function estimatedDate(estimatedDelTime, date) {
  const end = dayjs(estimatedDelTime).startOf('day');
  const start = dayjs(date, 'MMMM D')
    .year(end.year())
    .startOf('day');

  let days = end.diff(start, 'day');
  let current = start;

  while (days > 0) {
    current = current.add(1, 'day');
    const dateDay = current.format('dddd');

    if (dateDay !== 'Saturday' && dateDay !== 'Sunday') {
      days -= 1;
    }
  }

  return current.format('MMMM D');
}

export function dateNow() {
  const currentDate = dayjs();

  const currentDateF = currentDate.format('MMMM D');

  return currentDateF;
}
