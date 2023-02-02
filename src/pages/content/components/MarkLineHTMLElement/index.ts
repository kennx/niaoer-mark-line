export default class MarkLineHTMLElement extends HTMLElement {
  shadowRoot: ShadowRoot;
  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: "open" });
    this.render();
  }

  addStyle() {
    const styleNode = document.createElement("style");
    styleNode.textContent = `:host {
      all: inherit;
      display: inline;
      text-decoration-line: underline;
      text-decoration-style: wavy;
      text-decoration-thickness: 2px;
      text-decoration-color: red;
      text-decoration-skip-ink: none;
    }`;
    this.shadowRoot.appendChild(styleNode);
  }

  render() {
    this.addStyle();
    const slotNode = document.createElement("slot");
    this.shadowRoot.appendChild(slotNode);
  }
}
