// Canvas and container setting
let container = document.getElementById("container")
let mainCanvas = document.getElementById("mainCanvas")
let sideCanvas = document.getElementById("sidebarCanvas")
const contentHeightDefault = 960

// Canvas renderer
let render = function(left, top, zoom) {
  stage.x = -left
  stage.y = -top
}

/*
	Fixed Setting for Createjs
 */

// Intialize layout
let contentWidth = 0
let contentHeight = 0
var clientWidth = 0
var clientHeight = 0

// Initialize Scroller
scroller = new Scroller(render, {
  zooming: true
})

// Reflow handling
var reflow = function() {
  
  let isSP = container.clientWidth * 0.2 < 200
  // canvasのwidthは自動調節されないのでここで手動調節
  if (isSP) {
    sideCanvas.setAttribute("width", container.clientWidth)
    sideCanvas.setAttribute("height", container.clientHeight * 0.4)
    mainCanvas.setAttribute("width", container.clientWidth)
    mainCanvas.setAttribute("height", container.clientHeight * 0.6)
  } else {
    sideCanvas.setAttribute("width", container.clientWidth * 0.2)
    sideCanvas.setAttribute("height", container.clientHeight)
    mainCanvas.setAttribute("width", container.clientWidth * 0.8)
    mainCanvas.setAttribute("height", container.clientHeight)
  }
  
  clientWidth = mainCanvas.clientWidth
  clientHeight = mainCanvas.clientHeight
  scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight)
  if (stage.reflow) stage.reflow(mainCanvas.clientWidth, mainCanvas.clientHeight, isSP)
  if (sidebarStage.reflow) sidebarStage.reflow(sideCanvas.clientWidth, sideCanvas.clientHeight, isSP)
}

let resizeTimer
let handleResize = function() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => reflow(), 20)
}
window.addEventListener("resize", handleResize)
reflow()

// Ivent setting
if ('ontouchstart' in window) {

  container.addEventListener("touchstart", function(e) {
    // Don't react if initial down happens on a form element
    if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
      return
    }

    scroller.doTouchStart(e.touches, e.timeStamp)
    e.preventDefault()
  }, false)

  document.addEventListener("touchmove", function(e) {
    scroller.doTouchMove(e.touches, e.timeStamp, e.scale)
  }, false)

  document.addEventListener("touchend", function(e) {
    scroller.doTouchEnd(e.timeStamp)
  }, false)

  document.addEventListener("touchcancel", function(e) {
    scroller.doTouchEnd(e.timeStamp)
  }, false)

} else {

  var mousedown = false

  container.addEventListener("mousedown", function(e) {
    if (e.target.tagName.match(/input|textarea|select/i)) {
      return
    }

    scroller.doTouchStart([{
      pageX: e.pageX,
      pageY: e.pageY
		}], e.timeStamp)

    mousedown = true
  }, false)

  document.addEventListener("mousemove", function(e) {
    if (!mousedown) {
      return
    }

    scroller.doTouchMove([{
      pageX: e.pageX,
      pageY: e.pageY
		}], e.timeStamp)

    mousedown = true
  }, false)

  document.addEventListener("mouseup", function(e) {
    if (!mousedown) {
      return
    }

    scroller.doTouchEnd(e.timeStamp)

    mousedown = false
  }, false)

  container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" : "mousewheel", function(e) {
    scroller.doMouseZoom(e.detail ? (e.detail * 120) : -e.wheelDelta, e.timeStamp, e.pageX, e.pageY)
  }, false)

}
