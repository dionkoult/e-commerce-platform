document.querySelector('.search-button')
  .addEventListener('click', () => {
    const value = document.querySelector('.search-bar').value;
    window.location.href = `index.html?search=${encodeURIComponent(value)}`;
  });

document.querySelector('.search-bar')
.addEventListener('keydown', (event) => {
  const value = document.querySelector('.search-bar').value;
  if (event.key === 'Enter') {
    window.location.href = `index.html?search=${encodeURIComponent(value)}`;
  }
});