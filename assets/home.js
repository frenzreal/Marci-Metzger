const mobileMenu = document.getElementById('mobile-menu');
const navRight = document.querySelector('.nav-right');

mobileMenu.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  navRight.classList.toggle('active');
});

document.addEventListener('click', function(e) {
  if (e.target.closest('.call-cta')) {
    e.stopPropagation();
    e.preventDefault();
    document.querySelectorAll('.active').forEach(function(el) {
      el.classList.remove('active');
    });
    document.querySelector('.call-cta').classList.add('active');
    document.querySelector('.maps-call').classList.add('active');
  }

  if (e.target.closest('.visit-cta')) {
    e.stopPropagation();
    e.preventDefault();
    document.querySelectorAll('.active').forEach(function(el) {
      el.classList.remove('active');
    });
    document.querySelector('.visit-cta').classList.add('active');
    document.querySelector('.maps-visit').classList.add('active');
  }
});
