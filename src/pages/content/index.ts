/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */

// import("./components/Demo");

import { addCustomElement } from "./components/MarkLineHTMLElement";

addCustomElement();

document.addEventListener("selectionchange", selectionHandler);

function selectionHandler(event: Event) {
  const type = event.type;
  let tid = null;
  if (type === "selectionchange") {
    tid = setTimeout(() => {
      document.addEventListener("mouseup", mouseUpHandler);
      clearTimeout(tid);
    }, 100);
  }
}

function mouseUpHandler() {
  const selection = window.getSelection();
  const selectionText = selection.toString();
  const { rangeCount } = selection;
  if (rangeCount && selectionText.trim()) {
    console.log("selected text: ", selectionText);
  }
  document.removeEventListener("mouseup", mouseUpHandler);
}
