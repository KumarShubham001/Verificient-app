const { desktopCapturer } = require('electron');
const electron = require("electron");

const electronWin = electron.remote.BrowserWindow.getFocusedWindow();

var screenshot, appName;

/**
 * @param callback {Function} callback receives as first parameter the base64 string of the image
 * @param imageFormat {String} Format of the image to generate ('image/jpeg' or 'image/png')
 **/

function fullscreenScreenshot(callback, imageFormat) {
    electronWin.setOpacity(0);

    var _this = this;
    this.callback = callback;
    imageFormat = imageFormat || 'image/jpeg';

    this.handleStream = (stream) => {
        // Create hidden video tag
        var video = document.createElement('video');
        video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';

        // Event connected to stream
        video.onloadedmetadata = function () {
            // Set video ORIGINAL height (screenshot)
            video.style.height = this.videoHeight + 'px'; // videoHeight
            video.style.width = this.videoWidth + 'px'; // videoWidth

            video.play();

            // Create canvas
            var canvas = document.createElement('canvas');
            canvas.width = this.videoWidth;
            canvas.height = this.videoHeight;
            var ctx = canvas.getContext('2d');
            // Draw video on canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            if (_this.callback) {
                // Save screenshot to base64
                _this.callback({ src: canvas.toDataURL(imageFormat), name: appName });
                screenshot = canvas.toDataURL(imageFormat);
            } else {
                console.log('Need callback!');
            }

            // Remove hidden video tag
            video.remove();
            electronWin.setOpacity(1);
            try {
                // Destroy connect to stream
                stream.getTracks()[0].stop();
            } catch (e) { }
        }

        video.srcObject = stream;
        document.body.appendChild(video);
    };

    this.handleError = function (e) {
        console.log(e);
    };

    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {

        // save the name of the screen whose screenshot is taken
        if (sources.length > 2)
            appName = sources[2].name;
        else
            appName = sources[sources.length - 1].name;

        for (const source of sources) {
            // Filter: main screen
            if ((source.name == "Entire Screen") || (source.name === "Screen 1") || (source.name === "Screen 2")) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: source.id,
                                minWidth: 1280,
                                maxWidth: 4000,
                                minHeight: 720,
                                maxHeight: 4000
                            }
                        }
                    });

                    _this.handleStream(stream);
                } catch (e) {
                    _this.handleError(e);
                }
            }
        }
    });
}


// function to save a screenshot
const dialog = electron.remote.dialog;

const path = require("path");
const fs = require("fs");

function saveScreenshot() {
    const img = screenshot;
    dialog
        .showSaveDialog({
            title: "Select the File Path to save",

            // Default path to assets folder 
            defaultPath: path.join(__dirname,
                "../assets/image.png"),

            // defaultPath: path.join(__dirname, '../assets/image.jpeg'), 
            buttonLabel: "Save",

            // Restricting the user to only Image Files. 
            filters: [
                {
                    name: "Image Files",
                    extensions: ["png", "jpeg", "jpg"],
                },
            ],
            properties: [],
        })
        .then((file) => {
            // Stating whether dialog operation was cancelled or not. 
            console.log(file.canceled);

            if (!file.canceled) {
                console.log(file.filePath.toString());

                // Creating and Writing to the image.png file

                fs.writeFile(file.filePath.toString(), img.substring('data:image/png;base64,'.length), "base64", function (err) {
                    if (err) throw err;
                    console.log("Saved!");
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
}