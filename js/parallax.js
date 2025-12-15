document.addEventListener("scroll", () => {
  const y = window.scrollY * 0.5; // velocidad del parallax
  document.documentElement.style.setProperty("--scroll", `${y}px`);
});
