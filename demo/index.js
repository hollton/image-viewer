var imgDom = document.getElementById('img');
var containerDom = document.getElementById('viewer');
var tipDom = document.getElementById('tip');
var timer = null;

imageViewer.initImage(imgDom, containerDom, {
    disableWheel: false
});

imageViewer.handleCallback(function(imageData) {
    calcScalePercent(imageData);
});

var handleImage = function(type, inc) {
    imageViewer.handleImage({
        type,
        inc
    });
};

var calcScalePercent = function(imageData) {
    if (imageData.operateType === 'scale') {
        clearTimeout(timer)
        tipDom.className = '';
        tipDom.innerText = parseInt(imageData.scale * 100) + '%';
        timer = setTimeout(() => {
            tipDom.className = 'hide';
        }, 2000)
    }
};