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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * imageViewer v 1.0.0
 * Author: holltonliu@163.com
 * github: git@github.com:hollton/image-viewer.git
 */

var _imageData = {};

/**
 * [_initData 数据初始化]
 * @param  {[object]} options [开放配置参数]
 * @return {[object]}         [{}]
 */
var _initData = function _initData() {
    return {
        imgDom: null, // 操作元素
        containerDom: null, // 容器元素，默认为父容器，用于限制imgDom拖动范围
        disableWheel: false, // 禁用滚轮缩放
        operateType: '', // 操作类型，'rotate' || 'scale'
        rotate: 0, // 旋转角度
        rotateStep: 90, // 旋转步进
        scale: 1, // 缩放比例
        scaleStep: 0.25, // 缩放步进，建议0.25（0.1在加减运算中计算不精确）
        scaleRange: [0.5, 2], // 缩放约束范围
        dragData: { // 拖拽
            draggable: false, // 是否可拖拽
            posX: 0, // 拖拽点相对于图片位置坐标
            posY: 0,
            isRotate: false // 是否已旋转，对调调整图片宽高，再用于与容器宽高比较
        }
    };
};

/**
 * [_setImageData] like setState
 * @param  {[object]} data
 */
var _setImageData = function _setImageData(data) {
    Object.assign(_imageData, data);
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
        console.error('无图片DOM');
        return;
    }

    containerDom = containerDom ? containerDom : imgDom.parentNode;
    _setImageData(_extends({}, _initData(), {
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
    var rotate = _imageData.rotate,
        scale = _imageData.scale,
        imgDom = _imageData.imgDom;

    var transformString = 'rotate(' + rotate + 'deg) scale(' + scale + ')';
    if (imgDom) {
        imgDom.style.left = 0;
        imgDom.style.top = 0;
        imgDom.style.transform = transformString;
        imgDom.style.msTransform = transformString;
    }
    _setImageData({
        imgDom: imgDom
    });
    _handleCallback();
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

    var inc = handleOption.inc >= 0 ? 1 : -1;
    switch (handleOption.type) {
        case 'rotate':
            _handleRotate(inc);
            break;
        case 'scale':
            _handleScale(inc);
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
    var rotate = _imageData.rotate,
        rotateStep = _imageData.rotateStep,
        dragData = _imageData.dragData;

    rotate += inc * rotateStep;
    dragData.isRotate = !dragData.isRotate;
    _setImageData({
        rotate: rotate % 360,
        dragData: dragData,
        operateType: 'rotate'
    });
    _setImage();
};

/**
 * [handleScale 设置缩放值]
 * @param  {[Number]} inc [远近缩放判别 (1 | -1)]
 * 缩放超出限定范围时禁用当前缩放
 */
var _handleScale = function _handleScale(inc) {
    var scale = _imageData.scale,
        scaleStep = _imageData.scaleStep,
        scaleRange = _imageData.scaleRange;

    var tempScale = scale + inc * scaleStep;
    if (tempScale >= scaleRange[0] && tempScale <= scaleRange[1]) {
        scale = tempScale;
    }
    _setImageData({
        scale: scale,
        operateType: 'scale'
    });
    _setImage();
};

/**
 * [handleWheel 滚轮事件处理，向下滚轮缩小图片尺寸]
 * @param  {[type]} event [description]
 */
var _handleWheel = function _handleWheel(event) {
    event.preventDefault();
    var disableWheel = _imageData.disableWheel;

    if (disableWheel) {
        return;
    }
    var deta = event.deltaY;
    var scaleInc = deta >= 0 ? -1 : 1;
    _handleScale(scaleInc);
};

/**
 * [getImagePos 图片位置信息]
 * @return {[type]} {
 *   scaleWidth: 缩放后图片宽度
 *   scaleHeight
 *   containerWidth: 图片容器宽度
 *   containerHeight
 *   top: 图片position top
 *   topMax: 图片上下拖动范围（和topMin）
 *   topMin
 *   left
 *   leftMax
 *   leftMin
 * }
 */
var _getImagePos = function _getImagePos() {
    var scale = _imageData.scale,
        dragData = _imageData.dragData,
        imgDom = _imageData.imgDom,
        containerDom = _imageData.containerDom;

    if (!imgDom) {
        return;
    }
    var imgWidth = dragData.isRotate ? imgDom.height : imgDom.width;
    var imgHeight = dragData.isRotate ? imgDom.width : imgDom.height;
    var imagePos = {
        scaleWidth: parseInt(imgWidth * scale),
        scaleHeight: parseInt(imgHeight * scale),
        containerWidth: containerDom.clientWidth,
        containerHeight: containerDom.clientHeight,
        top: parseInt(imgDom.style.top) || 0,
        topMax: 0,
        topMin: 0,
        left: parseInt(imgDom.style.left) || 0,
        leftMax: 0,
        leftMin: 0
    };
    imagePos.topMax = parseInt(imagePos.scaleHeight - imagePos.containerHeight) / 2;
    imagePos.topMin = -imagePos.topMax;
    imagePos.leftMax = (imagePos.scaleWidth - imagePos.containerWidth) / 2;
    imagePos.leftMin = -imagePos.leftMax;
    return imagePos;
};

/**
 * [_handleMouseDown 处理鼠标按下事件]
 * 判断dom宽高是否超出容器，超出才可拖动
 * 浏览器默认mousedown行为为选中拖拽，需阻止
 * 监听mousemove，mouseup等事件，需绑定在document，使鼠标超出img之外也可生效
 * 离开document需等同处理mouseup事件，取消拖动。否则在iframe引用场景下，移出iframe后松开鼠标并未触发mouseup事件，再移入仍有拖动效果
 * @param  {[type]} event
 */
var _handleMouseDown = function _handleMouseDown(event) {
    event.preventDefault();
    var dragData = _imageData.dragData;

    var imagePos = _getImagePos();
    if (imagePos.scaleWidth > imagePos.containerWidth || imagePos.scaleHeight > imagePos.containerHeight) {
        dragData.draggable = true;
        dragData.posX = event.clientX - imagePos.left;
        dragData.posY = event.clientY - imagePos.top;
        _setImageData({
            dragData: dragData
        });

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

/**
 * [_handleMouseMove 鼠标移动事件]
 * 浏览器默认mousemove行为为选中拖拽，需阻止
 * 图片缩放宽高超出容器时才允许拖动
 * @param  {[type]} event
 */
var _handleMouseMove = function _handleMouseMove(event) {
    event.preventDefault();
    var dragData = _imageData.dragData,
        imgDom = _imageData.imgDom;

    var imagePos = _getImagePos();
    if (dragData.draggable) {
        if (imagePos.scaleWidth > imagePos.containerWidth) {
            var x = event.clientX - dragData.posX;
            x = x > imagePos.leftMax ? imagePos.leftMax : x < imagePos.leftMin ? imagePos.leftMin : x;
            imgDom.style.left = x + 'px';
        }
        if (imagePos.scaleHeight > imagePos.containerHeight) {
            var y = event.clientY - dragData.posY;
            y = y > imagePos.topMax ? imagePos.topMax : y < imagePos.topMin ? imagePos.topMin : y;
            imgDom.style.top = y + 'px';
        }
        _setImageData({
            imgDom: imgDom
        });
    }
};

/**
 * [_handleMouseUp 处理鼠标松开事件]
 * 设置不可拖动
 * @param  {[type]} event
 */
var _handleMouseUp = function _handleMouseUp(event) {
    var dragData = _imageData.dragData;

    dragData.draggable = false;
    _setImageData({
        imgDom: imgDom
    });
};

/**
 * [_handleCallback 旋转，缩放等回调，提供调用方图片操作信息]
 * @return  {[object]} {
 *   operateType: 'string',
 *   rotate: 'string',
 *   scale: 'string'
 * }
 */
var _callbackFunc = function _callbackFunc() {};
var _handleCallback = function _handleCallback(callbackFunc) {
    var rotate = _imageData.rotate,
        scale = _imageData.scale,
        operateType = _imageData.operateType;

    if (callbackFunc) {
        _callbackFunc = callbackFunc;
    }
    if (operateType) {
        _callbackFunc({
            rotate: rotate,
            scale: scale,
            operateType: operateType
        });
    }
};

exports.default = {
    initImage: _initImage,
    handleImage: _handleImage,
    handleCallback: _handleCallback
};

/***/ })
/******/ ]);