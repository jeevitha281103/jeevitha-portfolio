const galleries = document.querySelectorAll(".project-gallery");

galleries.forEach(gallery => {
  const track = gallery.querySelector(".project-gallery-track");
  const prevButton = gallery.querySelector(".gallery-prev");
  const nextButton = gallery.querySelector(".gallery-next");
  const dotsContainer = gallery.querySelector(".gallery-dots");
  const viewport = gallery.querySelector(".project-gallery-viewport");

  if (!track || !dotsContainer) return;

  let slides = [...gallery.querySelectorAll(".project-gallery-slide")];
  let currentIndex = 0;
  let touchStartX = 0;
  let touchDeltaX = 0;
  let isDragging = false;

  function removeSlide(slide) {
    slide.remove();
    slides = [...gallery.querySelectorAll(".project-gallery-slide")];
    buildDots();
    updateGallery();
  }

  slides.forEach(slide => {
    const image = slide.querySelector("img");
    if (!image) {
      removeSlide(slide);
      return;
    }

    image.addEventListener("error", () => removeSlide(slide), { once: true });
  });

  function buildDots() {
    dotsContainer.innerHTML = "";
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery-dot";
      dot.setAttribute("aria-label", `Show image ${index + 1}`);
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  function getDots() {
    return [...dotsContainer.querySelectorAll(".gallery-dot")];
  }

  function setControlsVisible(visible) {
    const display = visible ? "" : "none";
    prevButton.style.display = display;
    nextButton.style.display = display;
    dotsContainer.style.display = display;
  }

  function updateGallery() {
    if (slides.length === 0) return;

    currentIndex = Math.max(0, Math.min(currentIndex, slides.length - 1));
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentIndex);
    });

    getDots().forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
      dot.setAttribute("aria-current", index === currentIndex ? "true" : "false");
    });

    const hasMultipleSlides = slides.length > 1;
    setControlsVisible(hasMultipleSlides);
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;
  }

  function goToSlide(index) {
    currentIndex = index;
    updateGallery();
  }

  function moveSlide(step) {
    goToSlide(currentIndex + step);
  }

  function finishDrag() {
    if (!isDragging) return;
    isDragging = false;

    if (touchDeltaX > 50) moveSlide(-1);
    else if (touchDeltaX < -50) moveSlide(1);

    touchDeltaX = 0;
  }

  buildDots();
  updateGallery();

  prevButton.addEventListener("click", () => moveSlide(-1));
  nextButton.addEventListener("click", () => moveSlide(1));

  viewport.addEventListener("touchstart", event => {
    if (slides.length <= 1) return;
    touchStartX = event.touches[0].clientX;
    touchDeltaX = 0;
    isDragging = true;
  }, { passive: true });

  viewport.addEventListener("touchmove", event => {
    if (!isDragging) return;
    touchDeltaX = event.touches[0].clientX - touchStartX;
  }, { passive: true });

  viewport.addEventListener("touchend", finishDrag);

  viewport.addEventListener("mousedown", event => {
    if (slides.length <= 1 || event.button !== 0) return;
    touchStartX = event.clientX;
    touchDeltaX = 0;
    isDragging = true;
  });

  window.addEventListener("mousemove", event => {
    if (!isDragging) return;
    touchDeltaX = event.clientX - touchStartX;
  });

  window.addEventListener("mouseup", finishDrag);

  gallery.addEventListener("keydown", event => {
    if (slides.length <= 1) return;
    if (event.key === "ArrowLeft") moveSlide(-1);
    if (event.key === "ArrowRight") moveSlide(1);
  });
});
