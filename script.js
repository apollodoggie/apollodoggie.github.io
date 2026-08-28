const photos = [
  "/images/gallery/doggie-01.jpg",
  "/images/gallery/doggie-02.jpg",
  "/images/gallery/doggie-03.jpg",
  "/images/gallery/doggie-04.jpg",
  "/images/gallery/doggie-05.jpg",
  "/images/gallery/doggie-06.jpg",
  "/images/gallery/doggie-07.jpg",
  "/images/gallery/doggie-08.jpg",
  "/images/gallery/doggie-09.jpg",
  "/images/gallery/doggie-10.jpg",
  "/images/gallery/doggie-11.jpg",
  "/images/gallery/doggie-12.jpg",
  "/images/gallery/doggie-13.jpg",
  "/images/gallery/doggie-14.jpg",
  "/images/gallery/doggie-15.jpg",
  "/images/gallery/doggie-16.jpg",
  "/images/gallery/doggie-17.jpg",
  "/images/gallery/doggie-18.jpg",
  "/images/gallery/doggie-19.jpg",
];

const grid = document.getElementById("galleryGrid");
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
