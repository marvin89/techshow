
    import defaultThemeCSS from "../../../public/themes/default.css";

    window.customElements.define(
      "slide-1",
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({mode: 'open'});
          const defaultTheme = new CSSStyleSheet();
          defaultTheme.replaceSync(defaultThemeCSS);
          this.shadowRoot.adoptedStyleSheets = [defaultTheme];
        }
        connectedCallback() {
          this.shadowRoot.innerHTML = `<h1>Slide 1</h1>
<section>
  <p>Section 1</p>
</section>
<section>
  <p>Section 2</p>
</section>

<style>
  h1 {
    color: #147;
  }
</style>
`;
        }
      }
    );