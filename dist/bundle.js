/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(1);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.imageViewer = _index2.default;

exports.default = _index2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});


var _imageData = {};

/**
 * [_initData 数据初始化]
 * @param  {[object]} options [开发配置参数]
 * @return {[object]}         [{}]
 */
var _initData = function _initData(options) {
  return Object.assign({
    rotate: 0, // 旋转角度
    rotateStep: 90, // 旋转步进
    scale: 1, // 缩放比例
    scaleStep: 0.25, // 缩放步进，建议0.25（0.1在加减运算中计算不精确）
    scaleRange: [0.5, 2], // 缩放约束范围
    scalePercent: '', // 缩放比例
    timer: null, // 提示定时
    dragData: { // 拖拽
      draggable: false, // 是否可拖拽
      posX: 0, // 拖拽点相对于图片位置坐标
      posY: 0,
      isRotate: false // 是否已旋转，对调调整图片宽高，再用于与容器宽高比较
    }
  }, options);
};

/**
 * [_initImage 初始化图片]
 * @param  {Object} options
 * {
 * 	  imgDom: 必须，应用图片dom,
 * 	  containerDom: 非必须，图片容器dom, 默认为图片dom父节点
 * 	  options: 非必须，可选配置
 * }
 */
var _initImage = function _initImage(imgDom, containerDom) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (!imgDom) {
    console.error('无待处理图片数据');
    return;
  }

  containerDom = containerDom ? containerDom : imgDom.parentNode;
  _imageData = _initData(Object.assign({
    imgDom: imgDom,
    containerDom: containerDom
  }, options));

  _addListener();
};

/**
 * [事件监听]
 * 1 窗口改变重置图片位置居中
 * 2 mousedown、wheel操作
 */
var _addListener = function _addListener() {
  _addCommonEventListener(window, 'resize', function () {
    _setImage();
  });
  _addCommonEventListener(imgDom, 'mousedown', function (event) {
    _handleMouseDown(event);
  });
  _addCommonEventListener(containerDom, 'wheel', function (event) {
    _handleWheel(event);
  });
};

/**
 * [addCommonEventListener 兼容事件绑定]
 * @param
 * el：绑定dom
 * eventName：绑定事件名
 * handleBack：绑定回调
 * useCapture：是否冒泡
 */
var _addCommonEventListener = function _addCommonEventListener() {
  var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  var eventName = arguments[1];
  var handleBack = arguments[2];
  var useCapture = arguments[3];

  if (el.addEventListener) {
    el.addEventListener(eventName, handleBack, useCapture);
  } else if (el.attachEvent) {
    el.attachEvent(eventName, handleBack, useCapture);
  }
};

/**
 * [setImage 设置图片旋转缩放]
 * 为使操作图片时居中显示，需重置图片position
 */
var _setImage = function _setImage() {
  var _imageData2 = _imageData,
      rotate = _imageData2.rotate,
      scale = _imageData2.scale,
      imgDom = _imageData2.imgDom;

  var transformString = 'rotate(' + rotate + 'deg) scale(' + scale + ')';
  if (imgDom) {
    imgDom.style.left = 0;
    imgDom.style.top = 0;
    imgDom.style.transform = transformString;
    imgDom.style.msTransform = transformString;
  }
};

/**
 * [_handleImage 响应外部操作]
 * @param  {Object} handleOption {
 *     type: 'string' // 操作类型，支持'rotate'、'scale'
 *     inc: Number // 操作增量，1为右旋或放大；-1为左旋或缩小
 * }
 */
var _handleImage = function _handleImage() {
  var handleOption = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  switch (handleOption.type) {
    case 'rotate':
      _handleRotate(handleOption.inc);
      break;
    case 'scale':
      _handleScale(handleOption.inc);
      break;
    default:
      break;
  }
};

/**
 * [handleRotate 设置旋转角度]
 * @param  {[Number]} inc [左右旋转判别 (1 | -1)]
 */
var _handleRotate = function _handleRotate(inc) {
  var _imageData3 = _imageData,
      rotate = _imageData3.rotate,
      rotateStep = _imageData3.rotateStep,
      dragData = _imageData3.dragData;

  rotate += inc * rotateStep;
  dragData.isRotate = !dragData.isRotate;
  _imageData.rotate = rotate;
  _imageData.dragData = dragData;
  _setImage();
};

/**
 * [handleScale 设置缩放值]
 * @param  {[Number]} inc [远近缩放判别 (1 | -1)]
 * 缩放超出限定范围时禁用当前缩放
 */
var _handleScale = function _handleScale(inc) {
  var _imageData4 = _imageData,
      scale = _imageData4.scale,
      scaleStep = _imageData4.scaleStep,
      scaleRange = _imageData4.scaleRange;

  var newScale = scale;
  scale += inc * scaleStep;
  if (scale >= scaleRange[0] && scale <= scaleRange[1]) {
    newScale = scale;
  }
  _imageData.scale = newScale;
  _setImage();
  _calcScalePercent();
};

var _calcScalePercent = function _calcScalePercent() {
  var _imageData5 = _imageData,
      scale = _imageData5.scale,
      timer = _imageData5.timer;

  _imageData.scalePercent = parseInt(scale * 100) + '%';
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(function () {
    _imageData.scalePercent = '';
  }, 2000);
  _imageData.timer = timer;
};

/**
 * [handleWheel 滚轮事件处理，向下滚轮缩小图片尺寸]
 * @param  {[type]} event [description]
 */
var _handleWheel = function _handleWheel(event) {
  event.preventDefault();
  var deta = event.deltaY;
  var scaleInc = deta > 0 ? -1 : 1;
  _handleScale(scaleInc);
};

/**
 * [getImagePos 图片位置信息]
 * @return {[type]} {
 *   scaleWidth: 缩放后图片宽度
 *   scaleHeight
 *   viewerWidth: 图片容器宽度
 *   viewerHeight
 *   top: 图片position top
 *   topMax: 图片上下拖动范围（和topMin）
 *   topMin
 *   left
 *   leftMax
 *   leftMin
 * }
 */
var _getImagePos = function _getImagePos() {
  var _imageData6 = _imageData,
      scale = _imageData6.scale,
      dragData = _imageData6.dragData,
      imgDom = _imageData6.imgDom,
      containerDom = _imageData6.containerDom;

  if (!imgDom) {
    return;
  }
  var imgWidth = dragData.isRotate ? imgDom.height : imgDom.width;
  var imgHeight = dragData.isRotate ? imgDom.width : imgDom.height;
  var imagePos = {
    scaleWidth: parseInt(imgWidth * scale),
    scaleHeight: parseInt(imgHeight * scale),
    viewerWidth: containerDom.clientWidth,
    viewerHeight: containerDom.clientHeight,
    top: parseInt(imgDom.style.top) || 0,
    topMax: 0,
    topMin: 0,
    left: parseInt(imgDom.style.left) || 0,
    leftMax: 0,
    leftMin: 0
  };
  imagePos.topMax = parseInt(imagePos.scaleHeight - imagePos.viewerHeight) / 2;
  imagePos.topMin = -imagePos.topMax;
  imagePos.leftMax = (imagePos.scaleWidth - imagePos.viewerWidth) / 2;
  imagePos.leftMin = -imagePos.leftMax;
  return imagePos;
};

/**
 * [_handleMouseDown 处理鼠标按下事件]
 * 判断dom宽高是否超出容器，超出才可拖动
 * 浏览器默认mouseDown行为为选中拖拽，需阻止
 * 监听mousemove，mouseup等事件，需绑定在document，使鼠标超出img之外也可生效
 * 离开document需等同处理mouseup事件，取消拖动。否则在iframe引用场景下，移出iframe后松开鼠标并未触发mouseup事件，再移入仍有拖动效果
 * @param  {[type]} event
 */
var _handleMouseDown = function _handleMouseDown(event) {
  event.preventDefault();
  var _imageData7 = _imageData,
      dragData = _imageData7.dragData;

  var imagePos = _getImagePos();
  if (imagePos.scaleWidth > imagePos.viewerWidth || imagePos.scaleHeight > imagePos.viewerHeight) {
    dragData.draggable = true;
    dragData.posX = event.clientX - imagePos.left;
    dragData.posY = event.clientY - imagePos.top;

    _addCommonEventListener(document, 'mousemove', function (event) {
      _handleMouseMove(event);
    });
    _addCommonEventListener(document, 'mouseup', function (event) {
      _handleMouseUp(event);
    });
    _addCommonEventListener(document, 'mouseleave', function (event) {
      _handleMouseUp(event);
    });
  }
};

var _handleMouseMove = function _handleMouseMove(event) {
  event.preventDefault();
  var _imageData8 = _imageData,
      dragData = _imageData8.dragData,
      imgDom = _imageData8.imgDom;

  var imagePos = _getImagePos();
  if (dragData.draggable) {
    if (imagePos.scaleWidth > imagePos.viewerWidth) {
      var x = event.clientX - dragData.posX;
      x = x > imagePos.leftMax ? imagePos.leftMax : x < imagePos.leftMin ? imagePos.leftMin : x;
      imgDom.style.left = x + 'px';
    }
    if (imagePos.scaleHeight > imagePos.viewerHeight) {
      var y = event.clientY - dragData.posY;
      y = y > imagePos.topMax ? imagePos.topMax : y < imagePos.topMin ? imagePos.topMin : y;
      imgDom.style.top = y + 'px';
    }
  }
};

var _handleMouseUp = function _handleMouseUp(event) {
  var _imageData9 = _imageData,
      dragData = _imageData9.dragData;

  dragData.draggable = false;
};

exports.default = {
  initImage: _initImage,
  handleImage: _handleImage
};

/***/ })
/******/ ]);