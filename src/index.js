/**
 * imageViewer
 * Author: holltonliu@163.com
 * github: git@github.com:hollton/image-viewer.git
 */


let _imageData = {};

/**
 * [_initData 数据初始化]
 * @param  {[object]} options [开放配置参数]
 * @return {[object]}         [{}]
 */
const _initData = () => {
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
}

/**
 * [_setImageData] like setState
 * @param  {[object]} data
 */
const _setImageData = data => {
    Object.assign(_imageData, data);
}

/**
 * [_initImage 初始化图片]
 * @param  {Object} options
 * {
 * 	  imgDom: 必须，应用图片dom,
 * 	  containerDom: 非必须，图片容器dom, 默认为图片dom父节点
 * 	  options: 非必须，可选配置
 * }
 */
const _initImage = (imgDom, containerDom, options = {}) => {
    if (!imgDom) {
        console.error('无图片DOM');
        return;
    }

    containerDom = containerDom ? containerDom : imgDom.parentNode;
    _setImageData({
        ..._initData(),
        imgDom: imgDom,
        containerDom: containerDom,
        ...options
    });

    _addListener();

}

/**
 * [事件监听]
 * 1 窗口改变重置图片位置居中
 * 2 mousedown、wheel操作
 */
const _addListener = () => {
    _addCommonEventListener(window, 'resize', () => {
        _setImage();
    })
    _addCommonEventListener(imgDom, 'mousedown', event => {
        _handleMouseDown(event);
    })
    _addCommonEventListener(containerDom, 'wheel', event => {
        _handleWheel(event);
    })
}

/**
 * [addCommonEventListener 兼容事件绑定]
 * @param
 * el：绑定dom
 * eventName：绑定事件名
 * handleBack：绑定回调
 * useCapture：是否冒泡
 */
const _addCommonEventListener = (el = document, eventName, handleBack, useCapture) => {
    if (el.addEventListener) {
        el.addEventListener(eventName, handleBack, useCapture);
    } else if (el.attachEvent) {
        el.attachEvent(eventName, handleBack, useCapture);
    }
}

/**
 * [setImage 设置图片旋转缩放]
 * 为使操作图片时居中显示，需重置图片position
 */
const _setImage = () => {
    let { rotate, scale, imgDom } = _imageData;
    let transformString = `rotate(${rotate}deg) scale(${scale})`;
    if (imgDom) {
        imgDom.style.left = 0;
        imgDom.style.top = 0;
        imgDom.style.transform = transformString;
        imgDom.style.msTransform = transformString;
    }
    _setImageData({
        imgDom
    })
    _handleCallback();
}

/**
 * [_handleImage 响应外部操作]
 * @param  {Object} handleOption {
 *     type: 'string' // 操作类型，支持'rotate'、'scale'
 *     inc: Number // 操作增量，1为右旋或放大；-1为左旋或缩小
 * }
 */
const _handleImage = (handleOption = {}) => {
	let inc = handleOption.inc >= 0 ? 1 : -1;
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
}

/**
 * [handleRotate 设置旋转角度]
 * @param  {[Number]} inc [左右旋转判别 (1 | -1)]
 */
const _handleRotate = inc => {
    let { rotate, rotateStep, dragData } = _imageData;
    rotate += inc * rotateStep;
    dragData.isRotate = !dragData.isRotate;
    _setImageData({
        rotate: rotate % 360,
        dragData,
        operateType: 'rotate'
    })
    _setImage();
}

/**
 * [handleScale 设置缩放值]
 * @param  {[Number]} inc [远近缩放判别 (1 | -1)]
 * 缩放超出限定范围时禁用当前缩放
 */
const _handleScale = inc => {
    let { scale, scaleStep, scaleRange } = _imageData;
    let tempScale = scale + inc * scaleStep;
    if (tempScale >= scaleRange[0] && tempScale <= scaleRange[1]) {
        scale = tempScale;
    }
    _setImageData({
        scale,
        operateType: 'scale'
    })
    _setImage();
}

/**
 * [handleWheel 滚轮事件处理，向下滚轮缩小图片尺寸]
 * @param  {[type]} event [description]
 */
const _handleWheel = event => {
    event.preventDefault();
    let { disableWheel } = _imageData;
    if (disableWheel) {
        return;
    }
    let deta = event.deltaY;
    let scaleInc = deta >= 0 ? -1 : 1;
    _handleScale(scaleInc);
}


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
const _getImagePos = () => {
    let { scale, dragData, imgDom, containerDom } = _imageData;
    if (!imgDom) {
        return;
    }
    let imgWidth = dragData.isRotate ? imgDom.height : imgDom.width;
    let imgHeight = dragData.isRotate ? imgDom.width : imgDom.height;
    let imagePos = {
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
}

/**
 * [_handleMouseDown 处理鼠标按下事件]
 * 判断dom宽高是否超出容器，超出才可拖动
 * 浏览器默认mousedown行为为选中拖拽，需阻止
 * 监听mousemove，mouseup等事件，需绑定在document，使鼠标超出img之外也可生效
 * 离开document需等同处理mouseup事件，取消拖动。否则在iframe引用场景下，移出iframe后松开鼠标并未触发mouseup事件，再移入仍有拖动效果
 * @param  {[type]} event
 */
const _handleMouseDown = event => {
    event.preventDefault();
    let { dragData } = _imageData;
    let imagePos = _getImagePos();
    if (imagePos.scaleWidth > imagePos.containerWidth || imagePos.scaleHeight > imagePos.containerHeight) {
        dragData.draggable = true;
        dragData.posX = event.clientX - imagePos.left;
        dragData.posY = event.clientY - imagePos.top;
        _setImageData({
            dragData
        })

        _addCommonEventListener(document, 'mousemove', event => {
            _handleMouseMove(event);
        });
        _addCommonEventListener(document, 'mouseup', event => {
            _handleMouseUp(event);
        });
        _addCommonEventListener(document, 'mouseleave', event => {
            _handleMouseUp(event);
        });
    }
}

/**
 * [_handleMouseMove 鼠标移动事件]
 * 浏览器默认mousemove行为为选中拖拽，需阻止
 * 图片缩放宽高超出容器时才允许拖动
 * @param  {[type]} event
 */
const _handleMouseMove = event => {
    event.preventDefault();
    let { dragData, imgDom } = _imageData;
    let imagePos = _getImagePos();
    if (dragData.draggable) {
        if (imagePos.scaleWidth > imagePos.containerWidth) {
            var x = event.clientX - dragData.posX;
            x = x > imagePos.leftMax ? imagePos.leftMax : (x < imagePos.leftMin ? imagePos.leftMin : x);
            imgDom.style.left = `${x}px`;
        }
        if (imagePos.scaleHeight > imagePos.containerHeight) {
            var y = event.clientY - dragData.posY;
            y = y > imagePos.topMax ? imagePos.topMax : (y < imagePos.topMin ? imagePos.topMin : y);
            imgDom.style.top = `${y}px`;
        }
        _setImageData({
            imgDom
        })
    }
}

/**
 * [_handleMouseUp 处理鼠标松开事件]
 * 设置不可拖动
 * @param  {[type]} event
 */
const _handleMouseUp = event => {
    let { dragData } = _imageData;
    dragData.draggable = false;
    _setImageData({
        imgDom
    })
}

/**
 * [_handleCallback 旋转，缩放等回调，提供调用方图片操作信息]
 * @return  {[object]} {
 *   operateType: 'string',
 *   rotate: 'string',
 *   scale: 'string'
 * }
 */
let _callbackFunc = () => {};
const _handleCallback = callbackFunc => {
    let { rotate, scale, operateType } = _imageData;
    if (callbackFunc) {
        _callbackFunc = callbackFunc;
    }
    if (operateType) {
        _callbackFunc({
            rotate,
            scale,
            operateType
        })
    }
}

export default {
    initImage: _initImage,
    handleImage: _handleImage,
    handleCallback: _handleCallback
}