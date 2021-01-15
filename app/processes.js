const childProcess = require('child_process');
const processExists = require('process-exists');
const fkill = require('fkill');

appsNotAllowed = ['SnippingTool', 'vlc', 'quicktime'];
intervalToCheckApps = 1000;

const isRunning = (query, cb) => {
    let platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32': cmd = `tasklist`; break;
        case 'darwin': cmd = `ps -ax | grep ${query}`; break;
        case 'linux': cmd = `ps -A`; break;
        default: break;
    }
    childProcess.exec(cmd, (err, stdout, stderr) => {
        stdout = stdout.toLowerCase().replace(/\s/g, '');
        cb(stdout.indexOf(query.toLowerCase()) > -1);
    });
}

const killProcess = (pName) => {
    console.log('Killing ' + pName + '...');

    (async () => {

        // remove this async call to remove the 2-way checking of the running app
        if (await processExists(pName)) {
            (async () => {
                await fkill(pName, { force: true, ignoreCase: true });
                console.log(pName + ' killed');
                alert(pName + ' not allowed!')
            })();
        } else {
            console.warn('Process not found');
        }
    })();
}

const processChecker = () => {
    for (i = 0; i < appsNotAllowed.length; i++) {
        const appName = appsNotAllowed[i];

        isRunning(appsNotAllowed[i], (status) => {
            // uncomment below line to see the live status of the black listed apps
            // console.log(appName, status);

            if(status) {
                killProcess(appName);
            }
        });
    }
}

// check if black-listed app are running or not, if running close them
$(() => {
    if (process.platform == 'win32') {
        appsNotAllowed = appsNotAllowed.map((e) => {
            return e + '.exe';
        });
    }

    processChecker();

    setInterval(function () {
        processChecker();
    }, intervalToCheckApps);
});