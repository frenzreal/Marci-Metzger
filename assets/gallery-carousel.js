  const stageEl = document.getElementById('stage');
  const trackEl = document.getElementById('track');
  
  const images = [
    "assets/images/photo-1.webp",
    "assets/images/photo-2.webp",
    "assets/images/photo-3.webp",
    "assets/images/photo-4.webp",
    "assets/images/photo-5.webp",
    "assets/images/photo-6.webp",
    "assets/images/photo-7.webp",
  ];

  const n = images.length;
  const trackImages = [images[n - 1], ...images, images[0]];

  let current = 0;
  let trackIndex = 1;
  let animating = false;

  const thumbsEl  = document.getElementById('thumbs');
  const counterEl = document.getElementById('counter');

  function buildTrack(){
    trackImages.forEach((src, i) => {
      const img = document.createElement('img');
      img.className = 'slide';
      img.src = src;
      img.alt = '';
      img.addEventListener('click', () => {
        if (i !== trackIndex) {
          const realIndex = ((i - 1) % n + n) % n;
          goToIndex(realIndex);
        }
      });
      trackEl.appendChild(img);
    });
  }

  function slideWidthPx(){
    const slide = trackEl.children[0];
    const gap = 10;
    return slide.getBoundingClientRect().width + gap;
  }

  function positionTrack(withTransition){
    const stageW = stageEl.getBoundingClientRect().width;
    const slideW = trackEl.children[0].getBoundingClientRect().width;
    const centerOffset = (stageW - slideW) / 2;
    const step = slideWidthPx();

    trackEl.style.transition = withTransition ? '' : 'none';
    trackEl.style.transform = `translateX(${centerOffset - trackIndex * step}px)`;

    if (!withTransition) {
      void trackEl.offsetWidth;
      trackEl.style.transition = '';
    }
  }

  function centerThumb(el){
    if (!el) return;
    const containerRect = thumbsEl.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const delta = (elRect.left + elRect.width / 2) - (containerRect.left + containerRect.width / 2);
    thumbsEl.scrollBy({ left: delta, behavior: 'smooth' });
  }

  function updateUI(){
    [...trackEl.children].forEach((el, i) => {
      el.classList.toggle('current', i === trackIndex);
    });
    counterEl.textContent = (current + 1) + " / " + n;
    [...thumbsEl.children].forEach((t, i) => {
      t.classList.toggle('active', i === current);
    });
    centerThumb(thumbsEl.children[current]);
  }

  function step(direction){
    if (animating) return;
    animating = true;

    trackIndex += direction;
    current = ((current + direction) % n + n) % n;

    positionTrack(true);
    updateUI();
  }

  function goToIndex(targetReal){
    if (animating) return;
    animating = true;
    trackIndex = targetReal + 1;
    current = targetReal;
    positionTrack(true);
    updateUI();
  }

  trackEl.addEventListener('transitionend', () => {
    animating = false;
    if (trackIndex === 0) {
      trackIndex = n;
      positionTrack(false);
      updateUI();
    } else if (trackIndex === n + 1) {
      trackIndex = 1;
      positionTrack(false);
      updateUI();
    }
  });

  document.getElementById('prevBtn').addEventListener('click', () => step(-1));
  document.getElementById('nextBtn').addEventListener('click', () => step(1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  // basic swipe support
  let touchStartX = null;
  stageEl.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
  stageEl.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) step(dx > 0 ? -1 : 1);
    touchStartX = null;
  });

  function buildThumbs(){
    images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Thumbnail ' + (i + 1);
      img.addEventListener('click', () => goToIndex(i));
      thumbsEl.appendChild(img);
    });
  }

  const AUTOPLAY_MS = 4000;
  let autoplayTimer = null;

  function startAutoplay(){
    stopAutoplay();
    autoplayTimer = setInterval(() => step(1), AUTOPLAY_MS);
  }
  function stopAutoplay(){
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  stageEl.addEventListener('mouseenter', stopAutoplay);
  stageEl.addEventListener('mouseleave', startAutoplay);
  thumbsEl.addEventListener('mouseenter', stopAutoplay);
  thumbsEl.addEventListener('mouseleave', startAutoplay);

  window.addEventListener('resize', () => positionTrack(false));

  buildTrack();
  buildThumbs();
  positionTrack(false);
  updateUI();
  startAutoplay();
