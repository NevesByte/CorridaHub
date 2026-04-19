const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav ul');

menuBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // evita fechar ao clicar no botão
  nav.classList.toggle('active');
});

// evita fechar ao clicar dentro do menu
nav.addEventListener('click', (e) => {
  e.stopPropagation();
});

// clicar fora fecha
document.addEventListener('click', () => {
  nav.classList.remove('active');
});