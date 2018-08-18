// Canvas and container setting
let container = document.getElementById("container")
let content = document.getElementById("GameCanvas")
let contentWidth = 1280
let contentHeight = 720

// Canvas renderer
let render = function(left, top, zoom) {
	stage.x = -left
	stage.y = -top
}

// // Sample Createjs init
// let cjsinit = function() {
// 	stage = new createjs.Stage("content")
// 	let backShape = stage.addChild(new createjs.Shape())
// 	backShape.graphics.beginFill("blue").drawRect(0, 0, contentWidth, contentHeight)
//
// 	let headerBar = stage.addChild(new createjs.Shape())
// 	headerBar.graphics.beginFill("lightgray").drawRect(0, 0, contentWidth, 45)
//
// 	createjs.Ticker.addEventListener("tick", stage)
// 	stage.update()
// }
// cjsinit()

/*
	Fixed Setting for Createjs
 */

// Intialize layout
var clientWidth = 0
var clientHeight = 0

// Initialize Scroller
scroller = new Scroller(render, {
	zooming: false
})

// Reflow handling
var reflow = function() {
	clientWidth = container.clientWidth
	clientHeight = container.clientHeight

	// 追加コード
	// content.width = container.clientWidth
	// content.height = container.clientHeight
	scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight)
}
window.addEventListener("resize", reflow, false)
reflow()

// Ivent setting
if ('ontouchstart' in window) {

	conteiner.addEventListener("touchstart", function(e) {
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

	container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" :  "mousewheel", function(e) {
		scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY)
	}, false)

}

/*
// Test for background activity (slow down scrolling)
setInterval(function() {
	var arr = []
	for (var i=0, l=Math.random()*600; i<l; i++) {
		arr.push.call(arr, document.querySelectorAll(".abc" + i))
	}
}, 50)
*/
