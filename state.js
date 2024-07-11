// state.js
export let activeView = null;
export let mouseMoveListenerAdded = false;

export function setActiveView(view) {
  activeView = view;
  console.log(`Active view set to: ${activeView}`);
}

export function setMouseMoveListenerAdded(status) {
  mouseMoveListenerAdded = status;
}
