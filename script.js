const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("isopen");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("isopen");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");
if (revealItems.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("isvisible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const counters = document.querySelectorAll("[datacounter]");
if (counters.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.counter || 0);
      const duration = 900;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target).toString();
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.35 });

  counters.forEach((item) => counterObserver.observe(item));
}

document.querySelectorAll(".contactform").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    if (!button) return;

    const original = button.textContent;
    button.textContent = "Mensaje preparado";
    setTimeout(() => {
      button.textContent = original;
    }, 1800);
  });
});

let lightbox;

function ensureLightbox() {
  if (lightbox) return lightbox;

  lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <div class="lightboxinner">
      <button class="lightboxclose" type="button" aria-label="Cerrar vista ampliada">×</button>
      <img alt="" />
    </div>
  `;
  document.body.appendChild(lightbox);

  const close = () => {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  };

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target.classList.contains("lightboxclose")) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      close();
    }
  });

  return lightbox;
}

document.querySelectorAll("[datalightbox]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const modal = ensureLightbox();
    const img = modal.querySelector("img");
    img.src = trigger.dataset.lightbox || "";
    img.alt = trigger.dataset.alt || "";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  });
});

function createAmbientScene() {
  if (document.querySelector(".ambient-scene")) return;

  const scene = document.createElement("div");
  scene.className = "ambient-scene";
  scene.setAttribute("aria-hidden", "true");

  const types = ["cup", "bean", "orb", "steam"];
  const count = Math.min(window.innerWidth < 900 ? 6 : 10, 10);

  for (let index = 0; index < count; index += 1) {
    const item = document.createElement("span");
    const type = types[index % types.length];
    const size = type === "steam" ? 72 + Math.random() * 54 : 28 + Math.random() * 72;
    item.className = `ambient-object ${type}`;
    item.style.setProperty("--x", `${Math.round(Math.random() * 100)}vw`);
    item.style.setProperty("--y", `${Math.round(Math.random() * 100)}vh`);
    item.style.setProperty("--size", `${size}px`);
    item.style.setProperty("--opacity", type === "orb" ? `${0.16 + Math.random() * 0.14}` : `${0.22 + Math.random() * 0.18}`);
    item.style.setProperty("--rotate", `${Math.round(-18 + Math.random() * 36)}deg`);
    item.style.setProperty("--duration", `${12 + Math.random() * 16}s`);
    item.style.setProperty("--delay", `${Math.random() * -12}s`);
    item.style.setProperty("--dx", `${Math.round(-18 + Math.random() * 36)}px`);
    item.style.setProperty("--dy", `${Math.round(-24 + Math.random() * 48)}px`);
    scene.appendChild(item);
  }

  document.body.prepend(scene);
}

createAmbientScene();

const tiltTargets = document.querySelectorAll(".postercard, .videocard, .premiumcard");

tiltTargets.forEach((card) => {
  let rafId = 0;

  const reset = () => {
    cancelAnimationFrame(rafId);
    card.style.transform = "";
  };

  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      card.style.transform = `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateY(-2px)`;
    });
  });

  card.addEventListener("mouseleave", reset);
  card.addEventListener("blur", reset);
});
