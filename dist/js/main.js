// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
const html = document.documentElement;

// Check if darkModeToggle exists before adding event listener
if (darkModeToggle) {
  // Check system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    html.classList.add("dark");
  }

  // Check saved preference
  if (localStorage.getItem("darkMode") === "true") {
    html.classList.add("dark");
  } else if (localStorage.getItem("darkMode") === "false") {
    html.classList.remove("dark");
  }

  darkModeToggle.addEventListener("click", () => {
    html.classList.toggle("dark");
    localStorage.setItem("darkMode", html.classList.contains("dark"));
  });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

// Check if mobileMenuBtn exists before adding event listener
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// Search Modal
const searchBtn = document.getElementById("searchBtn");
const searchModal = document.getElementById("searchModal");
const closeSearch = document.getElementById("closeSearch");

// Check if searchBtn exists before adding event listener
if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    searchModal.classList.remove("hidden");
    setTimeout(() => {
      searchModal.querySelector("input").focus();
    }, 100);
  });
}

// Check if closeSearch exists before adding event listener
if (closeSearch) {
  closeSearch.addEventListener("click", () => {
    searchModal.classList.add("hidden");
  });
}

// Close modal on outside click
if (searchModal) {
  searchModal.addEventListener("click", (e) => {
    if (e.target === searchModal) {
      searchModal.classList.add("hidden");
    }
  });
}

// Close modal on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && searchModal) {
    searchModal.classList.add("hidden");
  }
});

// Lazy Loading Images dengan blur placeholder
document.addEventListener("DOMContentLoaded", function () {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;

            // Load gambar asli
            if (img.dataset.src) {
              // Buat temporary image untuk memastikan load sempurna
              const tempImage = new Image();

              tempImage.onload = function () {
                img.src = this.src;
                img.classList.remove("lazy", "blur-up");
                img.classList.add("loaded");
              };

              tempImage.src = img.dataset.src;
            }

            // Handle srcset jika ada
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }

            observer.unobserve(img);
          }
        });
      },
      {
        root: null,
        rootMargin: "50px 0px",
        threshold: 0.1,
      }
    );

    lazyImages.forEach((img) => {
      // Gunakan tiny placeholder image dari data-placeholder
      if (img.dataset.placeholder) {
        img.src = img.dataset.placeholder;
        img.classList.add("blur-up");
      }
      imageObserver.observe(img);
    });
  } else {
    // Fallback untuk browser yang tidak support Intersection Observer
    lazyImages.forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
      img.classList.remove("lazy", "blur-up");
      img.classList.add("loaded");
    });
  }
});

// Update dropdown functionality
function initDropdowns() {
  const dropdowns = document.querySelectorAll("[data-dropdown-toggle]");

  dropdowns.forEach((dropdown) => {
    const menu = document.getElementById(
      dropdown.getAttribute("data-dropdown-toggle")
    );
    const arrow = dropdown.querySelector(".dropdown-arrow");
    let isOpen = false;

    // Toggle dropdown on click
    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();

      if (isOpen) {
        closeDropdown();
      } else {
        // Close other open dropdowns
        closeAllDropdowns();
        openDropdown();
      }
    });

    function openDropdown() {
      menu.classList.remove("hidden");
      arrow?.classList.add("rotate-180");
      dropdown.setAttribute("aria-expanded", "true");
      isOpen = true;
    }

    function closeDropdown() {
      menu.classList.add("hidden");
      arrow?.classList.remove("rotate-180");
      dropdown.setAttribute("aria-expanded", "false");
      isOpen = false;
    }

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !menu.contains(e.target)) {
        closeDropdown();
      }
    });
  });

  function closeAllDropdowns() {
    dropdowns.forEach((dropdown) => {
      const menu = document.getElementById(
        dropdown.getAttribute("data-dropdown-toggle")
      );
      const arrow = dropdown.querySelector(".dropdown-arrow");

      menu?.classList.add("hidden");
      arrow?.classList.remove("rotate-180");
      dropdown.setAttribute("aria-expanded", "false");
    });
  }
}

// Initialize dropdowns when DOM is loaded
document.addEventListener("DOMContentLoaded", initDropdowns);

// Add transition styles
const style = document.createElement("style");
style.textContent = `
  .dropdown-menu {
    transition: opacity 150ms ease-in-out, transform 150ms ease-in-out;
    transform-origin: top;
    z-index: 110;
  }
  .dropdown-menu.hidden {
    opacity: 0;
    transform: scaleY(0.95);
    pointer-events: none;
  }
  .dropdown-menu:not(.hidden) {
    opacity: 1;
    transform: scaleY(1);
  }
`;
document.head.appendChild(style);

// Add synopsis expand/collapse functionality
document.addEventListener("DOMContentLoaded", function () {
  const synopsis = document.getElementById("synopsis");
  const synopsisToggle = document.getElementById("synopsisToggle");

  if (synopsis && synopsisToggle) {
    synopsisToggle.addEventListener("click", () => {
      synopsis.classList.toggle("line-clamp-3");

      const expandText = synopsisToggle.querySelector(".expand-text");
      const collapseText = synopsisToggle.querySelector(".collapse-text");
      const arrow = synopsisToggle.querySelector("svg");

      expandText.classList.toggle("hidden");
      collapseText.classList.toggle("hidden");
      arrow.classList.toggle("rotate-180");
    });
  }
});

// Genre dropdown functionality
document.addEventListener("DOMContentLoaded", () => {
  const genreDropdowns = document.querySelectorAll("[data-dropdown-toggle]");

  genreDropdowns.forEach((dropdown) => {
    const menu = dropdown.nextElementSibling;

    // Show menu on hover
    dropdown.addEventListener("mouseenter", () => {
      menu.classList.remove("hidden");
    });

    // Hide menu when mouse leaves dropdown area
    dropdown.parentElement.addEventListener("mouseleave", () => {
      menu.classList.add("hidden");
    });

    // Handle click for mobile
    dropdown.addEventListener("click", (e) => {
      e.preventDefault();
      menu.classList.toggle("hidden");
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-dropdown-toggle]")) {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.classList.add("hidden");
      });
    }
  });
});

const dropdown = document.getElementById("genreDropdown");
const dropdownContent = document.getElementById("genreContent");

dropdown.addEventListener("click", function (event) {
  event.stopPropagation();
  dropdownContent.classList.toggle("show");
});

// Close the dropdown when clicking outside
window.addEventListener("click", function (event) {
  if (!event.target.matches("#genreDropdown")) {
    if (dropdownContent.classList.contains("show")) {
      dropdownContent.classList.remove("show");
    }
  }
});
