# image-viewer
>JavaScript image viewer, support rotation, zoom and drag.

>图片操作，支持旋转，缩放及拖动

## 使用
`import imageViewer from 'xxx'` 或 `window.imageViewer`

## API

### initImage(imgDom, containerDom, options)
图片初始化

#### 参数
* imgDom: 必须，操作图片dom
* containerDom: 非必须，图片容器dom, 默认为图片dom父节点。用于计算与限制图片拖动范围
* options: 非必须，可选配置
* {
    - disableWheel: bool, // 禁用滚轮缩放，默认false
    - rotateStep: Number, // 旋转角度步进，默认90
    - scaleStep: Number, // 缩放步进，默认0.25（0.1在加减运算中计算不精确）
    - scaleRange: Array // 缩放约束范围，默认[0.5, 2]
* }

#### 返回: undefined
#### 实例
``` javascript
var imgDom = document.getElementById('img');
var containerDom = document.getElementById('viewer');
imageViewer.initImage(imgDom, containerDom, {
    disableWheel: true
});
```

### handleImage({type: 'string', inc: Number})
响应图片旋转，缩放操作

#### 参数
* {
    - type: string, // 操作类型，支持'rotate'、'scale'
    - inc: Number // 操作增量，1为右旋或放大；-1为左旋或缩小
* }

#### 返回: undefined
#### 实例
``` javascript
// 右旋转
imageViewer.handleImage({
    type: 'rotate',
    inc: 1
});
```

### handleCallback(callbackFunc)
图片旋转，缩放操作回调

#### 参数
* callbackFunc: function //回调执行函数

#### 返回
* imageData 
* {
    - operateType: 'string', // 操作类型 'rotate' || 'scale'
    - rotate: Number, // 图片旋转角度
    - scale: Number, // 图片缩放比例
* }

#### 实例
``` javascript
imageViewer.handleCallback(function (imageData) {
    console.log(imageData);
    // { operateType: 'rotate', rotate: 90, scale: 1}
})
```
