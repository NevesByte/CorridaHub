// Menu Mobile - Funcionalidade centralizada
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav ul');

  if (!menuBtn || !nav) return;

  // Abrir/fechar menu ao clicar no botão
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('active');
    menuBtn.classList.toggle('active');
  });

  // Evitar fechar ao clicar dentro do menu
  nav.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Fechar menu ao clicar em um link
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      menuBtn.classList.remove('active');
    });
  });

  // Fechar menu ao clicar fora
  document.addEventListener('click', () => {
    nav.classList.remove('active');
    menuBtn.classList.remove('active');
  });

  // Fechar menu ao redimensionar para desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      nav.classList.remove('active');
      menuBtn.classList.remove('active');
    }
  });
});
