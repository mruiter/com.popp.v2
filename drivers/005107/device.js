'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P005107 extends ZwaveDevice {
	onMeshInit() {
		this.enableDebug();
		this.printNode();
		this.registerCapability('onoff', 'SWITCH_BINARY');
		this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
		this.registerCapability('alarm_tamper', 'SENSOR_BINARY');	
		this.registerCapability('alarm_battery', 'BATTERY');
		this.registerCapability('measure_battery', 'BATTERY');
	}

}

module.exports = P005107;
