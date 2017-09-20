'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P009402 extends ZwaveDevice {
	onMeshInit() {
		// this.enableDebug();
		// this.printNode();
		this.registerCapability('onoff', 'SWITCH_BINARY');
		this.registerCapability('alarm_smoke', 'ALARM');	
		this.registerCapability('alarm_tamper', 'ALARM');
		this.registerCapability('alarm_battery', 'BATTERY');
		this.registerCapability('measure_battery', 'BATTERY');
	}

}

module.exports = P009402;
