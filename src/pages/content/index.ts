/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */

// import("./components/Demo");

import "@webcomponents/custom-elements";
import MarkLineHTMLElement from "./components/MarkLineHTMLElement";
import PopoverHTMLElement from "./components/PopoverHTMLElement";

interface IRect {
  x: number;
  y: number;
  top: number;
  bottom: number;
}

const POPOVER_TAG_NAME = "niaoer-popover";

if (!customElements.get("niaoer-markline")) {
  customElements.define("niaoer-markline", MarkLineHTMLElement);
}

function initialPopover() {
  if (!customElements.get(POPOVER_TAG_NAME)) {
    customElements.define(POPOVER_TAG_NAME, PopoverHTMLElement);
  }
}

function createPopover() {
  if (document.querySelector(POPOVER_TAG_NAME)) {
    return document.querySelector(POPOVER_TAG_NAME);
  }
  return document.createElement(POPOVER_TAG_NAME);
}

function createPopoverWrapper() {
  const node = document.createElement("div");
  node.id = "__niaoer__markline__";
  node.style.all = "initial";
  return node;
}

function setPopoverPosition(rect: DOMRect, isForward: boolean) {
  const niaoerPopoverNode: HTMLElement = document.querySelector(
    "#__niaoer__markline__ > niaoer-popover"
  );
  const pageY = window.pageYOffset;
  const rootRect = document.documentElement.getBoundingClientRect();

  const maxRight =
    rootRect.width - niaoerPopoverNode.getBoundingClientRect().width;

  console.log(maxRight, "max right...");

  niaoerPopoverNode.style.zIndex = "99999999";
  niaoerPopoverNode.style.opacity = "1";

  if (isForward) {
    niaoerPopoverNode.style.right = `${Math.min(rect.right, maxRight)}px`;
    niaoerPopoverNode.style.left = `${Math.min(rect.left, maxRight)}px`;
  } else {
    niaoerPopoverNode.style.left = `${Math.min(rect.left, maxRight)}px`;
    niaoerPopoverNode.style.right = `${Math.min(rect.right, maxRight)}px`;
  }
  console.log("isForward", isForward);
  console.log(rect, "rect");

  niaoerPopoverNode.style.top = `${rect.top + rect.height + pageY}px`;
}

function addPopover() {
  initialPopover();
  let niaoerWrapper = document.querySelector("#__niaoer__markline__");
  const niaoerPopoverNode = createPopover();
  if (!niaoerPopoverNode.getAttribute("style")) {
    niaoerPopoverNode.setAttribute(
      "style",
      `position: absolute; width: 300px; left: inherit; right: inherit; top: inherit; opacity: 0; transition: all .2s linear; z-index: -99999;`
    );
  }

  if (!niaoerWrapper) {
    niaoerWrapper = createPopoverWrapper();
  }
  niaoerWrapper.appendChild(niaoerPopoverNode);
  document.body.appendChild(niaoerWrapper);
}

function insertMarkline(text: string): HTMLElement | null {
  let niaoerNode = null;
  if (!customElements.get("niaoer-markline")) {
    customElements.define("niaoer-markline", MarkLineHTMLElement);
  }
  niaoerNode = document.createElement("niaoer-markline");
  niaoerNode.textContent = text;
  return niaoerNode;
}

document.addEventListener("selectstart", selectionHandler);

function transitionEnd() {
  const niaoerPopoverNode: HTMLElement = document.querySelector(
    "#__niaoer__markline__ > niaoer-popover"
  );
  if (!Number(niaoerPopoverNode.style.opacity)) {
    niaoerPopoverNode.style.zIndex = "-9999999";
  }
  niaoerPopoverNode.removeEventListener("transitionend", transitionEnd);
}

function hidePopoverHandler(event: Event) {
  const currentNode = event.target as HTMLElement;
  const niaoerWrapper = currentNode.closest("#__niaoer__markline__");
  if (!niaoerWrapper) {
    const niaoerPopoverNode: HTMLElement = document.querySelector(
      "#__niaoer__markline__ > niaoer-popover"
    );
    niaoerPopoverNode.style.opacity = "0";
    niaoerPopoverNode.addEventListener("transitionend", transitionEnd);
    document.removeEventListener("mousedown", hidePopoverHandler);
  }
}

function showPopover(range: Range) {
  addPopover();
  const isForward = isSelectionForward(window.getSelection());
  const rect = getClientRects(range, isForward);
  setPopoverPosition(rect, isForward);
  document.addEventListener("mousedown", hidePopoverHandler);
}

function selectionHandler(event: Event) {
  const type = event.type;
  let tid = null;
  if (type === "selectstart") {
    tid = setTimeout(() => {
      document.addEventListener("mouseup", mouseUpHandler);
      clearTimeout(tid);
    }, 10);
  }
}

function isSelectionForward(selection: Selection) {
  if (!selection.isCollapsed) {
    const position = selection.anchorNode.compareDocumentPosition(
      selection.focusNode
    );
    if (!position) {
      return selection.anchorOffset < selection.focusOffset;
    }

    return position > 0;
  }
  return selection.isCollapsed;
}

function getClientRects(range: Range, isForward: boolean) {
  const clientRects = Array.from(range.getClientRects());
  const rect = isForward ? clientRects[clientRects.length - 1] : clientRects[0];
  return {
    bottom: Math.min(...clientRects.map((rect) => rect.bottom)),
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: Math.max(...clientRects.map((rect) => rect.top)),
    width: rect.width,
    x: rect.x,
    y: rect.y,
  } as DOMRect;
}

function mouseUpHandler() {
  const selection = window.getSelection();
  const selectionText = selection.toString();
  const { rangeCount } = selection;
  if (rangeCount && selectionText.trim()) {
    const range = selection.getRangeAt(0);
    const isWrap =
      range.endContainer.parentElement.tagName.toLocaleLowerCase() ===
      "niaoer-markline";
    if (!isWrap) {
      showPopover(range);
    }
  }
  document.removeEventListener("mouseup", mouseUpHandler);
}
