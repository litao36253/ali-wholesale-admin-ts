'use strict'

export const on = (() => {
  if (document.addEventListener) {
    return (element, event, handler) => {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return (element, event, handler) => {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

export const off = (() => {
  if (document.removeEventListener) {
    return (element, event, handler) => {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return (element, event, handler) => {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

export const once = (el, event, fn) => {
  const listener = function () {
    if (fn) {
      fn.apply(this, arguments)
    }
    off(el, event, listener)
  }
  on(el, event, listener)
}

export const getStyles = (elem) => {
  let view = elem.ownerDocument.defaultView
  if (!view || !view.opener) {
    view = window
  }
  return view.getComputedStyle(elem)
}

export const getStyle = (elem, name, styles) => {
  const computed = styles || getStyles(elem)
  return computed ? (computed.getPropertyValue(name) || computed[name] || '') : ''
}
