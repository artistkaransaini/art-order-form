const githubUser = "artistkaransaini";
const repo = "art-order-form";
const branch = "void";
// Swiper carousel initialization for artworks collage (3 rows, maintain aspect ratio)
const artCount = 17;
const carouselWrapper = document.querySelector('.art-carousel .swiper-wrapper');
let loadedCount = 0;
let slideCount = 0;
 for (let i = 1; i <= artCount; i++) {
  const img = document.createElement('img');
  img.src = `https://raw.githubusercontent.com/${githubUser}/${repo}/${branch}/art/art${i}.jpg`;
  img.alt = `Artwork ${i}`;
  img.className = 'carousel-art-image';
  img.style.aspectRatio = '4/5';
  img.onload = function() {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.appendChild(img);
    carouselWrapper.appendChild(slide);
    slideCount++;
    if (slideCount === 1) {
      // Only initialize Swiper after at least one image is loaded
      initSwiper();
    }
     // Attach click handler as soon as image is loaded and in DOM
     img.style.cursor = 'pointer';
     img.onclick = (e) => {
       showArtworkPopup(img.src, img.alt);
     };
  };
}

function initSwiper() {
  window.swiper = new Swiper('.art-carousel', {
    slidesPerView: 7,
    slidesPerGroup: 3,
    spaceBetween: 0,
    loop: true,
    speed: 400,
    freeMode: false,
    grid: {
      rows: 3,
      fill: 'row',
    },
    breakpoints: {
      1400: { slidesPerView: 7, grid: { rows: 3 } },
      1100: { slidesPerView: 5, grid: { rows: 3 } },
      800: { slidesPerView: 4, grid: { rows: 3 } },
      500: { slidesPerView: 2, grid: { rows: 3 } },
      0: { slidesPerView: 1, grid: { rows: 1 } }, // On phones, single row
    },
  });
  window.swiper.update();
}

// Popup logic for artwork images
function showArtworkPopup(imgSrc, imgAlt) {
  // Remove any existing popup
  document.querySelectorAll('.artwork-popup-overlay').forEach(e => e.remove());
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'artwork-popup-overlay';
  overlay.onclick = function(e) {
    if (e.target === overlay) overlay.remove();
  };
  // Create card
  const card = document.createElement('div');
  card.className = 'artwork-popup-card';
  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'artwork-popup-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = () => overlay.remove();
  card.appendChild(closeBtn);
  // Image
  const img = document.createElement('img');
  img.src = imgSrc;
  img.alt = imgAlt;
  card.appendChild(img);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}
