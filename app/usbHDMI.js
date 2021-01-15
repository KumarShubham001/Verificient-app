const shell = require('node-powershell');

intervalToCheckDevice = 5000;
deviceList = ['usb', 'hdmi'];

totalMonitorConnected = 1;
USBConnected = false;

const Checker = (device) => {
    let ps = new shell({
        executionPolicy: 'Bypass',
        noProfile: true
    });

    switch (device) {
        case deviceList[0]:
            ps.addCommand('wmic logicaldisk where drivetype=2 get deviceid');
            break;
        case deviceList[1]:
            ps.addCommand('(Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorBasicDisplayParams | where {$_.Active -like "True"}).Active.Count');
            break;
        default: break;
    }

    ps.invoke()
        .then(output => {
            if (device == deviceList[1]) {
                if (Number(output) != totalMonitorConnected) {
                    console.log('Total connected device: ' + Number(output));
                    const str = (Number(output) < Number(totalMonitorConnected)) ? ' disconnected' : ' connected';
                    alert(deviceList[1] + str);

                    // update the total number of monitors connected
                    totalMonitorConnected = Number(output);
                }
            } else {
                if(!USBConnected) {
                    console.log('USB connected at ' + output);
                    alert(deviceList[0] + ' connected at ' + output);
                    USBConnected = true;
                }
            }
        })
        .catch(err => {
            if(device == deviceList[0]) {
                if(USBConnected) {
                    console.log('USB disconnected');
                    USBConnected = false;
                }
            }

            console.log(err);
            ps.dispose();
        });
}

const invokeChecker = () => {
    deviceList.forEach(device => {
        Checker(device);
    });
}

$(() => {
    // check at startup
    invokeChecker();

    // check after certain time
    setInterval(() => {
        // invokeChecker();
    }, intervalToCheckDevice);
});