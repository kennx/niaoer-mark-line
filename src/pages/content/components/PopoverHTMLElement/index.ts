import styleText from "@pages/content/components/PopoverHTMLElement/Popover.css";

const template = `
  <div class="popover">
    cc
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
    const _document = stringToHTML(template);
    this.shadowRoot.appendChild(_document);
  }
}
