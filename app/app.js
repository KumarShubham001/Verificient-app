const os = require('os');
const si = require('systeminformation');

function formatBytes(a, b = 2) { if (0 === a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d] }
// uses
// formatBytes(bytes,decimals)

// formatBytes(1024);     1 KB
// formatBytes('1024');   1 KB
// formatBytes(1234);     1.21 KB
// formatBytes(1234, 3);  1.205 KB

$(() => {
    si.diskLayout((data) => {
        $('#osHardDisk').text(formatBytes(data[0].size));
    });

    $('#osName').text(os.type());
    $('#osArch').text(os.arch());
    $('#osVersion').text(os.release());
    $('#osRam').text("Total " + formatBytes(os.freemem()) + " free of " + formatBytes(os.totalmem()));
});

document.getElementById('afterScreenshot').style.display = 'none';

document.getElementById("trigger").addEventListener("click", function () {
    fullscreenScreenshot(function (image) {
        document.getElementById("screenshot_preview").setAttribute("src", image.src);
        document.getElementById("afterScreenshot").style.display = 'block';
        $('#appTitle').text(image.name);
    }, 'image/png');
}, false);

document.getElementById("saveScreenshotBtn").addEventListener("click", function () {
    saveScreenshot();
}, false);

cancelScreenshot = () => {
    $('#screenshot_preview').attr('src', '');
    document.getElementById('afterScreenshot').style.display = 'none';
}