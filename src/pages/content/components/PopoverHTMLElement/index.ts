import styleText from "@pages/content/components/PopoverHTMLElement/Popover.css";

const template = `
  <div class="popover">
    <div class="popover-container">
      <header class="popover-header">
        <h1 class="popover-title">$title</h1>
      </header>
      <footer class="popover-footer">
        $foot
      </footer>
    </div>
  </div>
`;

const stringToHTML = (string: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(string, "text/html");
  return doc.body.querySelector(".popover");
};

export default class PopoverHTMLElement extends HTMLElement {
  shadowRoot: ShadowRoot;
  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: "open" });
    this.render();
  }

  addStyle() {
    const styleNode = document.createElement("style");
    styleNode.textContent = styleText;
    this.shadowRoot.appendChild(styleNode);
  }

  render() {
    this.addStyle();
    const doc = stringToHTML(template);
    console.log(doc);
    this.shadowRoot.appendChild(doc);
  }
}
