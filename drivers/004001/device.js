'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P004001 extends ZwaveDevice {
	onMeshInit() {
		this.enableDebug();
		this.printNode();
		this.registerCapability('onoff', 'SWITCH_BINARY');
		this.registerCapability('alarm_tamper', 'SENSOR_BINARY');	
		this.registerCapability('alarm_tamper', 'BATTERY');
		this.registerCapability('measure_battery', 'BATTERY');
	}

}

module.exports = P004001;
