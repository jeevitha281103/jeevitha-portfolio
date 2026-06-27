const navLinks = document.querySelectorAll(".main-nav a");
const sections = document.querySelectorAll("main section[id]");
const skillItems = document.querySelectorAll(".skill-item");
const certificateImages = document.querySelectorAll(".certificate-card img");
const certificateCards = document.querySelectorAll(".certificate-card");
const certFilters = document.querySelectorAll(".cert-filter");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox img");
const closeLightbox = document.querySelector(".lightbox-close");
const zoomIn = document.querySelector(".zoom-in");
const zoomOut = document.querySelector(".zoom-out");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

let certificateZoom = 1;

const navObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
);

sections.forEach(section => navObserver.observe(section));

const skillObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const level = entry.target.dataset.level || "0";
      const progress = entry.target.querySelector(".progress span");
      progress.style.width = `${level}%`;
      skillObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.35 }
);

skillItems.forEach(item => skillObserver.observe(item));

certFilters.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    certFilters.forEach(item => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    certificateCards.forEach(card => {
      const category = card.dataset.category;
      const show = filter === "all" || category === filter;
      card.classList.toggle("hidden", !show);
    });
  });
});

certificateImages.forEach(image => {
  image.addEventListener("click", () => {
    certificateZoom = 1;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.style.setProperty("--zoom", certificateZoom);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function hideLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

closeLightbox.addEventListener("click", hideLightbox);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) hideLightbox();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    hideLightbox();
  }
});

zoomIn.addEventListener("click", () => {
  certificateZoom = Math.min(certificateZoom + 0.2, 2.4);
  lightbox.style.setProperty("--zoom", certificateZoom);
});

zoomOut.addEventListener("click", () => {
  certificateZoom = Math.max(certificateZoom - 0.2, 0.6);
  lightbox.style.setProperty("--zoom", certificateZoom);
});

if (contactForm) {
  contactForm.addEventListener("submit", async event => {
    event.preventDefault();

    const accessKey = typeof CONTACT_FORM_CONFIG !== "undefined"
      ? CONTACT_FORM_CONFIG.accessKey
      : "";

    if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
      formStatus.textContent = "Add your Web3Forms access key in contact-config.js to enable email delivery.";
      return;
    }

    formStatus.textContent = "Sending message...";

    const formData = new FormData(contactForm);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: CONTACT_FORM_CONFIG.subject,
          from_name: "Jeevitha Portfolio",
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          botcheck: formData.get("botcheck") ? true : false
        })
      });

      const result = await response.json();

      if (result.success) {
        formStatus.textContent = "Message sent successfully.";
        contactForm.reset();
      } else {
        formStatus.textContent = result.message || "Message could not be sent. Please email directly.";
      }
    } catch (error) {
      formStatus.textContent = "Message could not be sent. Please email jeevitharaja2811@gmail.com directly.";
    }
  });
}
