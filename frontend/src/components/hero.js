// ============================================================
// VI CITY — Hero Section
// ============================================================
import { RELEASE_DATE, PLATFORMS } from "../data/catalog.js";
import { startCountdown, renderCountdownUnits } from "../utils/ui.js";
import { navigate } from "../router.js";

export function renderHero() {
  const html = `
    <section class="hero">
      <div class="hero__bg"><div class="hero__art"></div></div>
      <div class="hero__content container">
        <span class="hero__kicker"><span class="pulse"></span> Preventa oficial abierta</span>
        <h1 class="hero__title">Grand the auto <span class="vice">VI</span></h1>
        <p class="hero__tag">profe listo. Dos protagonistas. Un mundo vivo que nunca duerme. Reserva tu copia y asegura bonus exclusivos.</p>
        <div class="countdown" id="hero-countdown"></div>
        <div class="hero__cta">
          <button class="btn btn-primary" id="hero-cta">Reservar ahora</button>
          <button class="btn btn-ghost" id="hero-trailer">▶ Ver Video</button>
        </div>
        <div class="hero__platforms">
          ${PLATFORMS.map((p) => `<span class="badge badge-accent">${p.icon} ${p.short}</span>`).join("")}
          <span class="badge badge-cyan">HDR · Ray Tracing · 4K</span>
        </div>
      </div>
    </section>`;

  const mount = (root) => {
    root.insertAdjacentHTML("beforeend", html);
    const cdEl = root.querySelector("#hero-countdown");
    const stop = startCountdown(RELEASE_DATE, (c) => {
      cdEl.innerHTML = c.done
        ? '<span class="badge badge-ok">¡Lanzamiento disponible!</span>'
        : renderCountdownUnits(c);
    });
    root
      .querySelector("#hero-cta")
      .addEventListener("click", () => navigate("/customizer"));
    root
      .querySelector("#hero-trailer")
      .addEventListener("click", () => navigate("/"));
    return stop;
  };

  return mount;
}
