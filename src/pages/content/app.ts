// import MarkLineHTMLElement from "./components/MarkLineHTMLElement";
import PopoverHTMLElement from "./components/PopoverHTMLElement";

const ZINDEX = "2147483647";
const POPOVER_TAG_NAME = "niaoer-popover";
const POPOVER_WRAPPER = "__niaoer__markline__";

const POPOVER_DEFAULT_STYLE = `position: absolute; width: 40px; left: 0; right: 0; top: 0; opacity: 0; transition: all .2s linear; z-index: -${ZINDEX};`;

let selection: Selection;
let range: Range;

function createPopover() {
  let node: HTMLElement;
  if (document.querySelector(POPOVER_TAG_NAME)) {
    node = document.querySelector(POPOVER_TAG_NAME);
  }
  node = document.createElement(POPOVER_TAG_NAME);
  if (node.getAttribute("style")) return node;
  node.style.cssText = POPOVER_DEFAULT_STYLE;
  return node;
}

export function initialPopover() {
  if (!customElements.get(POPOVER_TAG_NAME)) {
    customElements.define(POPOVER_TAG_NAME, PopoverHTMLElement);
  }
  if (!customElements.get(POPOVER_TAG_NAME)) {
    customElements.define(POPOVER_TAG_NAME, PopoverHTMLElement);
  }
  const popoverWrapperNode = document.createElement("div");
  popoverWrapperNode.id = POPOVER_WRAPPER;
  popoverWrapperNode.style.all = "initial";

  const popoverNode = createPopover();

  popoverWrapperNode.appendChild(popoverNode);

  document.documentElement.appendChild(popoverWrapperNode);
}

/* Events */

function selectionchangeHandler() {
  selection = document.getSelection();
  const hasContent = selection.rangeCount > 0 && !!selection.toString().trim();
  if (hasContent) {
    range = selection.getRangeAt(0);
    if (
      range.startContainer.nodeType === 3 &&
      range.endContainer.nodeType === 3
    ) {
      document.addEventListener("mouseup", mouseUpHandler);
    } else {
      document.removeEventListener("mouseup", mouseUpHandler);
    }
  } else {
    document.removeEventListener("mouseup", mouseUpHandler);
  }
}

function mouseUpHandler(event: MouseEvent) {
  selectionHandler();
  console.log(event.clientX, event.clientY);
  selection = null;
  range = null;
  document.removeEventListener("mouseup", mouseUpHandler);
}

/* Selection */
function isSelectionForward() {
  if (selection.isCollapsed) return true;

  const comparedPositions = selection.anchorNode.compareDocumentPosition(
    selection.focusNode
  );
  if (!comparedPositions) {
    return selection.anchorOffset < selection.focusOffset;
  }

  return (comparedPositions & 4) > 0;
}

function hidePopoverHandler(event: Event) {
  const currentNode = event.target as HTMLElement;
  const niaoerWrapper = currentNode.closest(`#${POPOVER_WRAPPER}`);
  if (!niaoerWrapper) {
    const niaoerPopoverNode = document.querySelector(
      "#__niaoer__markline__ > niaoer-popover"
    ) as HTMLElement;
    niaoerPopoverNode.style.opacity = "0";
    niaoerPopoverNode.addEventListener("transitionend", transitionEnd);
    document.removeEventListener("mousedown", hidePopoverHandler);
  }
}

function transitionEnd() {
  const niaoerPopoverNode = document.querySelector(
    "#__niaoer__markline__ > niaoer-popover"
  ) as HTMLElement;
  if (!Number(niaoerPopoverNode.style.opacity)) {
    niaoerPopoverNode.style.zIndex = `-${ZINDEX}`;
  }
  niaoerPopoverNode.removeEventListener("transitionend", transitionEnd);
}

function getRangeRect(rects: DOMRectList) {
  const _rects = Array.from(rects);
  if (isSelectionForward()) {
    return {
      left: Math.max(..._rects.map((rect) => rect.left)),
      right: Math.max(..._rects.map((rect) => rect.right)),
      top: Math.max(..._rects.map((rect) => rect.top)),
      bottom: Math.max(..._rects.map((rect) => rect.bottom)),
      width: Math.max(..._rects.map((rect) => rect.width)),
      height: Math.max(..._rects.map((rect) => rect.height)),
      x: Math.max(..._rects.map((rect) => rect.x)),
      y: Math.max(..._rects.map((rect) => rect.y)),
    };
  } else {
    return {
      left: Math.min(..._rects.map((rect) => rect.left)),
      right: Math.min(..._rects.map((rect) => rect.right)),
      top: Math.min(..._rects.map((rect) => rect.top)),
      bottom: Math.min(..._rects.map((rect) => rect.bottom)),
      width: Math.min(..._rects.map((rect) => rect.width)),
      height: Math.min(..._rects.map((rect) => rect.height)),
      x: Math.min(..._rects.map((rect) => rect.x)),
      y: Math.min(..._rects.map((rect) => rect.y)),
    };
  }
}

function selectionHandler() {
  const clientRects = range.getClientRects();
  // const clientRect = getRangeRect(clientRects) as DOMRect;
  setPopoverPosition(range.getBoundingClientRect());
  document.addEventListener("mousedown", hidePopoverHandler);
  console.log("ClientRects:", clientRects);
}

/* set style */
function setPopoverPosition(rect: DOMRect) {
  try {
    const niaoerPopoverNode = document.querySelector(
      POPOVER_TAG_NAME
    ) as HTMLElement;
    console.log(selection.focusNode.nodeValue, selection, range);
    if (isSelectionForward()) {
      niaoerPopoverNode.style.left = `${rect.right}px`;
    } else {
      niaoerPopoverNode.style.left = `${rect.left}px`;
    }
    niaoerPopoverNode.style.top = `${
      window.pageYOffset + rect.top + rect.height
    }px`;
    niaoerPopoverNode.style.zIndex = ZINDEX;
    niaoerPopoverNode.style.opacity = "1";
  } catch (error) {
    initialPopover();
    console.log(error);
  }
}

document.addEventListener("selectionchange", selectionchangeHandler);
