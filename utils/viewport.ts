/**
 * Fixe le problème des 100vh sur mobile (Safari iOS) en calculant 
 * la hauteur réelle disponible et en l'injectant dans une variable CSS --vh.
 */
export const initViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize', () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
};