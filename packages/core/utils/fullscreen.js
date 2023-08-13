export function requestFullscreen(el) {
  el = el || document.body;
  if (el.requestFullScreen) {
    el.requestFullScreen();
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (el.webkitRequestFullScreen) {
    el.webkitRequestFullScreen();
  }
}

export function closeFullscreen() {
  if (document.exitFullScreen) {
    document.exitFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
}

export function toggleFullscreen(el, flag) {
  el = el || document.body;
  if (flag || (flag === undefined && !isFullscreen(el))) {
    requestFullscreen(el);
  } else {
    closeFullscreen();
  }
}

export function isFullscreen(el) {
  return !!document.fullscreenElement;
}
