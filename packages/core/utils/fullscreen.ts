export function requestFullscreen(el: HTMLElement) {
  el = el || document.body;
  el.requestFullscreen();
}

export function closeFullscreen() {
  document.exitFullscreen();
}

export function toggleFullscreen(el: HTMLElement, toggle = false) {
  el = el || document.body;
  if (toggle || (toggle === undefined && !isFullscreen())) {
    requestFullscreen(el);
  } else {
    closeFullscreen();
  }
}

export function isFullscreen() {
  return !!document.fullscreenElement;
}
