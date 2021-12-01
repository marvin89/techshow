import fs from "fs";
import path from "path";

const customElementTagRE = /(?<=customElements\.define\(["']).+(?=['"])/gm;
let defaultPath = "/";

if (fs.existsSync(path.resolve("src/slides/_slides.js"))) {
  fs.rmSync(path.resolve("src/slides/_slides.js"));
}
const slideFiles = fs.readdirSync(path.resolve("src/slides"));

const slideRoutes = slideFiles.map((fileName, index) => {
  const fileContent = fs.readFileSync(path.resolve(`src/slides/${fileName}`), "utf-8");
  const [tagName] = fileContent.match(customElementTagRE);
  if (index === 0) defaultPath = `/${tagName}`;
  return `{
    path: "/${tagName}",
    component: "${tagName}",
    action: () => import("./${fileName}"),
  }`;
});

slideRoutes.push(`{ path: "(.*)", redirect: "${defaultPath}" }`);

fs.writeFileSync(path.resolve("src/slides/_slides.js"), `export default [${slideRoutes}];`);
