const photos = [
  { id: 1, category: "portrait", label: "Portrait 01", src: "images/20250326_1.jpg" },
  { id: 2, category: "location", label: "Location 01" },
  { id: 3, category: "event", label: "Event 01" },
  { id: 4, category: "portrait", label: "Portrait 02" },
  { id: 5, category: "location", label: "Location 02" },
  { id: 6, category: "event", label: "Event 02" },
  { id: 7, category: "portrait", label: "Portrait 03" },
  { id: 8, category: "location", label: "Location 03" },
  { id: 9, category: "event", label: "Event 03" },
  { id: 10, category: "portrait", label: "Portrait 04" },
  { id: 11, category: "location", label: "Location 04" },
  { id: 12, category: "event", label: "Event 04" },
];

const cameraIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.5"/><path d="M8 5l1.5-2h5L16 5"/></svg>`;

const grid = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");
const lightboxClose = document.getElementById("lightboxClose");

function renderGrid(filter) {
  grid.innerHTML = "";
  photos
    .filter((p) => filter === "all" || p.category === filter)
    .forEach((p) => {
      const div = document.createElement("div");
      div.className = "placeholder-photo";
      div.dataset.label = p.label;
      div.innerHTML = p.src
        ? `<img src="${p.src}" alt="${p.label}" loading="lazy">`
        : `${cameraIcon}<span>${p.label}</span>`;
      div.addEventListener("click", () => openLightbox(p));
      grid.appendChild(div);
    });
}

function openLightbox(p) {
  lightboxContent.innerHTML = p.src
    ? `<img src="${p.src}" alt="${p.label}">`
    : p.label;
  lightbox.classList.add("open");
}

function closeLightbox() {
  lightbox.classList.remove("open");
}

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderGrid(btn.dataset.filter);
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

renderGrid("all");
