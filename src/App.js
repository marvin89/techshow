import { Router } from "@vaadin/router";
import slides from "./slides/_slides";

const CONTENT_SLIDES = slides.filter((s) => s.path !== "(.*)");

class App extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.router = new Router();
    this.router.setRoutes(slides);
    this.#setEventListeners();
  }

  connectedCallback() {
    this.render();
    this.router.setOutlet(this.shadowRoot.querySelector("main"));
  }

  disconnectedCallback() {
    this.#cleanEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `<main></main>`;
  }

  #setEventListeners() {
    window.addEventListener("keyup", this.#onKeyUp.bind(this));
  }

  #cleanEventListeners() {
    window.removeEventListener("keyup", this.#onKeyUp.bind(this));
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
}

window.customElements.define("techshow-app", App);
