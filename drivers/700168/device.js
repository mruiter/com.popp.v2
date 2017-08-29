'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P700168 extends ZwaveDevice {
	onMeshInit() {
		this.enableDebug();
		this.printNode();
		this.registerCapability('alarm_rain', 'BASIC');
		this.registerCapability('meter_rain', 'METER');
		this.registerCapability('measure_rain', 'METER');
		this.registerCapability('measure_battery', 'BATTERY');
		this.registerCapability('alarm_battery', 'BATTERY');
	}

}

module.exports = P700168;
