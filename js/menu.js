// Script para la navegación
document.addEventListener("DOMContentLoaded", () => {
  // Abrir/cerrar menú móvil
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  // Función para detectar dispositivos táctiles
  const isTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("active");
      menuToggle.setAttribute(
        "aria-expanded",
        mainNav.classList.contains("active")
      );
    });
  }

  // Cerrar menú al hacer clic en un enlace
  const navLinks = document.querySelectorAll(".main-nav a");
  for (const link of navLinks) {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 992) {
        mainNav.classList.remove("active");
        if (menuToggle) {
          menuToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  // Manejar dropdowns en dispositivos táctiles
  const dropdowns = document.querySelectorAll(".dropdown");
  if (isTouchDevice()) {
    for (const dropdown of dropdowns) {
      const dropdownLink = dropdown.querySelector("a");
      const dropdownContent = dropdown.querySelector(".dropdown-content");

      if (dropdownLink && dropdownContent) {
        dropdownLink.addEventListener("click", (e) => {
          // Prevenir la navegación al hacer clic en el enlace principal del dropdown en dispositivos táctiles
          if (window.innerWidth <= 992) {
            return; // En móviles, los dropdowns ya son tratados como acordeones
          }

          // En tablets, prevenir navegación y mostrar el dropdown
          if (!dropdown.classList.contains("touch-active")) {
            e.preventDefault();

            // Cerrar todos los dropdowns activos
            const activeDropdowns = document.querySelectorAll(
              ".dropdown.touch-active"
            );
            for (const active of activeDropdowns) {
              if (active !== dropdown) {
                active.classList.remove("touch-active");
              }
            }

            // Abrir/cerrar este dropdown
            dropdown.classList.toggle("touch-active");
          }
        });
      }
    }

    // Cerrar dropdowns al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".dropdown")) {
        const activeDropdowns = document.querySelectorAll(
          ".dropdown.touch-active"
        );
        for (const dropdown of activeDropdowns) {
          dropdown.classList.remove("touch-active");
        }
      }
    });
  }

  // Cerrar dropdowns cuando el ancho de la ventana cambie (responsive)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992 && mainNav) {
      mainNav.classList.remove("active");
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
      }
    }
  });
});
