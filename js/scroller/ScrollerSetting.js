// Canvas and container setting
let container = document.getElementById("container")
let content = document.getElementById("mainCanvas")
let sidebar = document.getElementById("sidebarCanvas")
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
  zooming: false
})

// Reflow handling
var reflow = function() {
  clientWidth = content.clientWidth
  clientHeight = content.clientHeight

  // canvasのwidthは自動調節されないのでここで手動調節
  if (container.clientWidth * 0.2 < 200) {
    content.setAttribute("width", container.clientWidth)
    content.setAttribute("height", container.clientHeight * 0.6)
    sidebar.setAttribute("width", container.clientWidth)
    sidebar.setAttribute("height", container.clientHeight * 0.4)
  } else {
    content.setAttribute("width", container.clientWidth * 0.8)
    content.setAttribute("height", container.clientHeight)
    sidebar.setAttribute("width", container.clientWidth * 0.2)
    sidebar.setAttribute("height", container.clientHeight)
  }

  scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight)

  if (stage.reflow) stage.reflow(content.clientWidth, content.clientHeight)
  if (sidebarStage.reflow) sidebarStage.reflow(sidebar.clientWidth, sidebar.clientHeight)
  // for (let s of [stage, sidebarStage]) if (s.reflow) s.reflow()
}
window.addEventListener("resize", reflow, false)
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
    scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY)
  }, false)

}
