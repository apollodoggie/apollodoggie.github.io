const photos = [
  "images/studio/studio-01.jpg",
  "images/studio/studio-02.jpg",
  "images/studio/studio-03.jpg",
];

const grid = document.getElementById("studioGrid");
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");
const lightboxClose = document.getElementById("lightboxClose");

function renderGrid() {
  grid.innerHTML = "";
  photos.forEach((src) => {
    const div = document.createElement("div");
    div.className = "placeholder-photo";
    div.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
    div.addEventListener("click", () => openLightbox(src));
    grid.appendChild(div);
  });
}

function openLightbox(src) {
  lightboxContent.innerHTML = `<img src="${src}" alt="">`;
  lightbox.classList.add("open");
}

function closeLightbox() {
  lightbox.classList.remove("open");
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

renderGrid();
