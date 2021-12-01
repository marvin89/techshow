import fs from "fs";
import path from "path";
import chokidar from "chokidar";

if (fs.existsSync(path.resolve("src/slides/.generated"))) {
  fs.rmSync(path.resolve("src/slides/.generated"), { recursive: true });
}

fs.mkdirSync(path.resolve("src/slides/.generated"));

chokidar.watch("./src/slides/*.html").on("all", () => {
  const tagSuffix = Date.now().toString(36);
  const slideFiles = fs
    .readdirSync(path.resolve("src/slides"), { withFileTypes: true })
    .filter((item) => item.isFile() && item.name.endsWith(".html"))
    .map((f) => `src/slides/${f.name}`);
  const slideRoutes = [];
  let defaultPath = "/";

  slideFiles.forEach((slideFile) => {
    const slideContent = fs.readFileSync(slideFile, "utf-8");
    let slideTagName = slideFile.split("/").pop().split(".").slice(0, -1).join("-");
    slideTagName = slideTagName.includes("-") ? slideTagName : `${slideTagName}-${tagSuffix}`;
    fs.writeFileSync(
      path.resolve(`src/slides/.generated/${slideTagName}.js`),
      getComponentCode(slideTagName, slideContent)
    );
    slideRoutes.push(
      `{ path: "/${slideTagName}", component: "${slideTagName}", action: () => import("./${slideTagName}.js") }`
    );
    if (slideRoutes.length === 1) {
      defaultPath = `/${slideTagName}`;
    }
  });

  slideRoutes.push(`{ path: "(.*)", redirect: "${defaultPath}" }`);

  fs.writeFileSync(
    path.resolve("src/slides/.generated/_slides.js"),
    `export default [${slideRoutes}];`
  );
});

function getComponentCode(slideTagName, slideContent) {
  return `
    import defaultThemeCSS from "../../../public/themes/default.css";

    window.customElements.define(
      "${slideTagName}",
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({mode: 'open'});
          const defaultTheme = new CSSStyleSheet();
          defaultTheme.replaceSync(defaultThemeCSS);
          this.shadowRoot.adoptedStyleSheets = [defaultTheme];
        }
        connectedCallback() {
          this.shadowRoot.innerHTML = \`${slideContent}\`;
        }
      }
    );`;
}
