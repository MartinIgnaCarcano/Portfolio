function smoothScrollTo(target, duration) {
  const startY = window.scrollY;
  const targetY = target.getBoundingClientRect().top + window.scrollY;
  const distance = targetY - startY;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    const ease =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startY + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const destino = document.querySelector(this.getAttribute("href"));
    if (!destino) return;
    smoothScrollTo(destino, 800);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const carrusel = document.querySelector(".proyectos-grid-carrusel");
  if (!carrusel) return;

  const btnPrev = document.querySelectorAll(".proyectos-grid-btns")[0];
  const btnNext = document.querySelectorAll(".proyectos-grid-btns")[1];
  const dotsContainer = document.querySelector(".proyectos-dots");

  const originalCards = Array.from(
    carrusel.querySelectorAll(".proyectos-card")
  );

  const track = document.createElement("div");
  track.classList.add("proyectos-track");
  originalCards.forEach((card) => track.appendChild(card));
  carrusel.appendChild(track);

  let itemsPerView = 2;
  let slidesCount = 1;
  let currentSlide = 0;
  let dots = [];

  function getItemsPerView() {
    return window.innerWidth < 768 ? 1 : 2;
  }

  function crearDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    dots = [];

    for (let i = 0; i < slidesCount; i++) {
      const dot = document.createElement("span");
      dot.className = "proyectos-dot";
      if (i === currentSlide) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentSlide = i;
        actualizarSlide(true);
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }
  }

  function actualizarDots() {
    dots.forEach((d, i) =>
      d.classList.toggle("active", i === currentSlide)
    );
  }

  function actualizarSlide(conTransicion) {
    const viewportWidth = carrusel.clientWidth;
    const offset = currentSlide * viewportWidth;
    track.style.transition = conTransicion ? "transform 0.6s ease" : "none";
    track.style.transform = `translateX(${-offset}px)`;
    actualizarDots();
  }

  function recalcularLayout() {
    itemsPerView = getItemsPerView();
    slidesCount = Math.max(
      1,
      Math.ceil(originalCards.length / itemsPerView)
    );

    if (currentSlide >= slidesCount) {
      currentSlide = slidesCount - 1;
    }

    crearDots();
    actualizarSlide(false);
  }

  function irSiguiente() {
    currentSlide = (currentSlide + 1) % slidesCount;
    actualizarSlide(true);
  }

  function irAnterior() {
    currentSlide = (currentSlide - 1 + slidesCount) % slidesCount;
    actualizarSlide(true);
  }

  if (btnPrev) btnPrev.addEventListener("click", irAnterior);
  if (btnNext) btnNext.addEventListener("click", irSiguiente);

  let startX = null;

  carrusel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  carrusel.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    const UMBRAL = 50;

    if (Math.abs(diff) > UMBRAL) {
      if (diff < 0) irSiguiente();
      else irAnterior();
    }
    startX = null;
  });

  recalcularLayout();
  window.addEventListener("resize", recalcularLayout);
});
