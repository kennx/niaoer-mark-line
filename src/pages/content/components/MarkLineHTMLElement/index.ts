import "@webcomponents/custom-elements";

class MarkLineHTMLElement extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    const styleNode = document.createElement("style");
    const slotNode = document.createElement("slot");
    styleNode.textContent = `:host {
      all: inherit;
      display: inline;
      text-decoration-line: underline;
      text-decoration-style: wavy;
      text-decoration-thickness: 2px;
      text-decoration-color: red;
      text-decoration-skip-ink: none;
    }`;
    shadowRoot.appendChild(styleNode);
    shadowRoot.appendChild(slotNode);
  }
}

export function addCustomElement() {
  customElements.define("niaoer-mark-line", MarkLineHTMLElement, {
    extends: "span",
  });
}
