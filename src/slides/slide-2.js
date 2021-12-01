class Slide extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.root.innerHTML = /* html */ `<h1>Slide 2</h1>`;
  }
}

window.customElements.define("slide-2", Slide);
