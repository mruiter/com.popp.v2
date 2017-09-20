'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P005206 extends ZwaveDevice {
	onMeshInit() {
		// this.enableDebug();
		// this.printNode();
		this.registerCapability('measure_wind_strenght', 'SENSOR_MULTILEVEL');
		this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
		this.registerCapability('measure_luminance', 'SENSOR_MULTILEVEL');
		this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL');
		this.registerCapability('measure_pressure', 'SENSOR_MULTILEVEL');
		this.registerCapability('measure_dewpoint', 'SENSOR_MULTILEVEL');
		this.registerCapability('alarm_tamper', 'SENSOR_BINARY');	
		this.registerCapability('measure_battery', 'BATTERY');
	}

}

module.exports = P005206;
