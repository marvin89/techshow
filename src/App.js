import { Router } from "@vaadin/router";
import slides from "./slides/.generated/_slides";

const CONTENT_SLIDES = slides?.filter((s) => s.path !== "(.*)");

class App extends HTMLElement {
  constructor() {
    super();
    this.router = new Router();
    this.router.setRoutes(slides);
    this.#setEventListeners();
  }

  connectedCallback() {
    this.render();
    this.router.setOutlet(this.querySelector("main"));
  }

  disconnectedCallback() {
    this.#cleanEventListeners();
  }

  render() {
    this.innerHTML = /* html */ `
      <main></main>
      <footer>
        <span>TechShow</span>
        <span id="slide-number">1</span>
      </footer>
    `;
  }

  #setEventListeners() {
    window.addEventListener("keyup", this.#onKeyUp.bind(this));
    window.addEventListener("vaadin-router-location-changed", this.#onRouteChanged.bind(this));
  }

  #cleanEventListeners() {
    window.removeEventListener("keyup", this.#onKeyUp.bind(this));
    window.addEventListener("vaadin-router-location-changed", this.#onRouteChanged.bind(this));
  }

  #onKeyUp(event) {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;

    if (event.key === "ArrowLeft") {
      this.#changeSlide(false);
    }

    if (event.key === "ArrowRight") {
      this.#changeSlide();
    }
  }

  #changeSlide(forward = true) {
    const currentSlideIndex = CONTENT_SLIDES.findIndex(
      (s) => s.path === this.router.location.pathname
    );

    if (forward && currentSlideIndex < CONTENT_SLIDES.length - 1) {
      Router.go(CONTENT_SLIDES[currentSlideIndex + 1].path);
    }

    if (!forward && currentSlideIndex > 0) {
      Router.go(CONTENT_SLIDES[currentSlideIndex - 1].path);
    }
  }

  #onRouteChanged(event) {
    const slideNumber =
      CONTENT_SLIDES.findIndex((slide) => slide.path === event.detail.location.pathname) + 1;
    this.querySelector("#slide-number").textContent = slideNumber;
  }
}

window.customElements.define("techshow-app", App);
