(() => {
  'use strict'
  const forms = document.querySelectorAll('.needs-validation')
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
      form.classList.add('was-validated')
    }, false)
  })
})();


// Navbar toggler margin fix
let navCollaps = document.querySelector(".navbar-toggler");
let container = document.querySelector(".container.mt-2");

document.addEventListener("DOMContentLoaded", () => {
  if (navCollaps && container) {
    container.style.transition = "margin-top 0.4s ease";

    navCollaps.addEventListener("click", () => {
      const currentMargin = container.style.marginTop;
      if (currentMargin === "130px") {
        container.style.setProperty("margin-top", "5px", "important");
      } else {
        container.style.setProperty("margin-top", "130px", "important");
      }
    });
  }
});
