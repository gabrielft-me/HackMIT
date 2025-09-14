"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
var image_1 = require("next/image");
var page_module_css_1 = require("./page.module.css");
function Home() {
    return (<div className={page_module_css_1.default.page}>
      <main className={page_module_css_1.default.main}>
        <image_1.default className={page_module_css_1.default.logo} src="/next.svg" alt="Next.js logo" width={180} height={38} priority/>
        <ol>
          <li>
            Get started by editing <code>src/app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={page_module_css_1.default.ctas}>
          <a className={page_module_css_1.default.primary} href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
            <image_1.default className={page_module_css_1.default.logo} src="/vercel.svg" alt="Vercel logomark" width={20} height={20}/>
            Deploy now
          </a>
          <a href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer" className={page_module_css_1.default.secondary}>
            Read our docs
          </a>
        </div>
      </main>
      <footer className={page_module_css_1.default.footer}>
        <a href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          <image_1.default aria-hidden src="/file.svg" alt="File icon" width={16} height={16}/>
          Learn
        </a>
        <a href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          <image_1.default aria-hidden src="/window.svg" alt="Window icon" width={16} height={16}/>
          Examples
        </a>
        <a href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          <image_1.default aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16}/>
          Go to nextjs.org →
        </a>
      </footer>
    </div>);
}
//# sourceMappingURL=page.js.map