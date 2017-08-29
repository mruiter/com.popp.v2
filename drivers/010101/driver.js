'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// Get the driver object
var driver = findWhere(Homey.manifest.drivers, { id: path.basename(__dirname) });
// Get the wakeUpInterval from the driver object (in order to set the pollInterval to the same value)
var wakeUpInterval = driver.zwave.wakeUpInterval * 1000;
Homey.log("Will set pollInterval to the same value as wakeUpInterval, which is: " + wakeUpInterval + " ms");

module.exports = new ZwaveDriver(path.basename(__dirname), {
	debug: false,
	capabilities: {
		measure_battery: {
			getOnWakeUp: true,
			command_class: 'COMMAND_CLASS_BATTERY',
			command_get: 'BATTERY_GET',
			command_report: 'BATTERY_REPORT',
			command_report_parser: (report, node) => {

				// If prev value is not empty and new value is empty
				if (node && node.state && node.state.measure_battery !== 1 && report['Battery Level'] === "battery low warning") {

					// Trigger device flow
					Homey.manager('flow').triggerDevice('battery_alarm', {}, {}, node.device_data, err => {
						if (err) console.error('Error triggerDevice -> battery_alarm', err);
					});
				}
				if (report['Battery Level (Raw)'][0] == 255) return 1;
					return report['Battery Level (Raw)'][0];
            },
			pollInterval: wakeUpInterval
		},
		alarm_battery: {
				'command_class': 'COMMAND_CLASS_BATTERY',
				'command_get': 'BATTERY_GET',
				'command_report': 'BATTERY_REPORT',
				'command_report_parser': (report, node) => {
					if(report.hasOwnProperty('Battery Level (Raw)')) {
						if (report['Battery Level (Raw)'][0] == 255) {
							return true
							}
						return false
								}
					},
			pollInterval: wakeUpInterval
		},
		measure_temperature: {
			command_class: 'COMMAND_CLASS_SENSOR_MULTILEVEL',
			command_get: 'SENSOR_MULTILEVEL_GET',
			command_get_parser: () => {
				return {
					'Sensor Type': 'Temperature (version 1)',
					'Properties1': {
						'Scale': 0
					}
				};
			},
			command_report: 'SENSOR_MULTILEVEL_REPORT',
			command_report_parser: report => {
				return Math.round (report['Sensor Value (Parsed)'] * 10) / 10;
			},
			pollInterval: wakeUpInterval
		},
		target_temperature: {
			command_class: 'COMMAND_CLASS_THERMOSTAT_SETPOINT',
			command_get: 'THERMOSTAT_SETPOINT_GET',
			command_get_parser: () => {
				return {
					'Level': {
						'Setpoint Type': 'Heating 1',
					}
				};
			},
			command_report: 'THERMOSTAT_SETPOINT_REPORT',
			command_report_parser: report => {	
				if (report.hasOwnProperty('Level2') &&
					report.Level2.hasOwnProperty('Precision') &&
					report.Level2.hasOwnProperty('Size')) {
						const scale = Math.pow(10, report.Level2['Precision']);
						return report['Value'].readUIntBE(0, report.Level2['Size']) / scale;
						//console.log(report['Value'].readUIntBE(0, report.Level2['Size']) / scale);
					}					
			},
			command_set: 'THERMOSTAT_SETPOINT_SET',
			command_set_parser: value => {
				// make temperature a whole number
				let temp = Math.round(value*10);

				// create 2 byte buffer of the value
				const tempByte1 = Math.floor(temp/255);
				const tempByte2 = Math.round(temp-(255*tempByte1));
				temp = new Buffer([tempByte1, tempByte2]);

				return {
					'Level': new Buffer([1]), // Reserved = 0 (bits: 000), Setpoint Type = 1 (Heating)(bits: 00001)
					'Level2': new Buffer([34]), // Precision = 1 (bits: 001), Scale = 0 (bits: 00), Size = 2 (bits: 010)
					'Value': temp
				};
			},
			pollInterval: wakeUpInterval
		}
	}
});

/**
 * Plain js implementation of underscore's findWhere.
 * @param array
 * @param criteria
 * @returns {*}
 */
function findWhere(array, criteria) {
	return array.find(item => Object.keys(criteria).every(key => item[key] === criteria[key]));
}
