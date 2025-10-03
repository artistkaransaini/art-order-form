const githubUser = "artistkaransaini";
const repo = "art-order-form";
const branch = "void";
// Swiper carousel initialization for artworks collage (3 rows, maintain aspect ratio)
const artCount = 16;
const carouselWrapper = document.querySelector('.art-carousel');
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
     img.style.cursor = 'pointer';
     img.onclick = (e) => {
       showArtworkPopup(img.src, img.alt);
     };
  };
}

function initSwiper() {
  
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
