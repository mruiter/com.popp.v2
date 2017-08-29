'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

module.exports = new ZwaveDriver(path.basename(__dirname), {
	debug: false,
	capabilities: {
		onoff: [
			{
				command_class: 'COMMAND_CLASS_SWITCH_MULTILEVEL',
				command_set: 'SWITCH_MULTILEVEL_SET',
				command_set_parser: value => ({
					'Value': (value) ? 'on/enable' : 'off/disable',
					'Dimming Duration': 255,
				}),
			},
			{
				command_class: 'COMMAND_CLASS_BASIC',
				command_get: 'BASIC_GET',
				command_report: 'BASIC_REPORT',
				command_report_parser: report => {
					if (report.hasOwnProperty('Current Value')) return report['Current Value'] !== 0;
					if (report.hasOwnProperty('Value')) return report['Value'] !== 0;
					return null;
				},
			},
		],
		dim: [
			{
				command_class: 'COMMAND_CLASS_SWITCH_MULTILEVEL',
				command_set: 'SWITCH_MULTILEVEL_SET',
				command_set_parser: value => {
					if (value >= 1) value = 0.99;

					return {
						'Value': value * 100,
						'Dimming Duration': 255,
					};
				},
			},
			{
				command_class: 'COMMAND_CLASS_BASIC',
				command_get: 'BASIC_GET',
				command_report: 'BASIC_REPORT',
				command_report_parser: report => {
					if (report.hasOwnProperty('Current Value') && !isNaN(report['Value'])) {
						return report['Current Value'] / 100;
					}
					if (report.hasOwnProperty('Value')) {
						return report['Value'] / 100;
					}
					return null;
				},
			},
		]
	},
	settings: {
		1: {
			index: 1,
			size: 1,
		},
		2: {
			index: 2,
			size: 2,
		},
		3: {
			index: 3,
			size: 1,
		},
		4: {
			index: 4,
			size: 1,
		},
		5: {
			index: 5,
			size: 1,
		},
		6: {
			index: 6,
			size: 1,
		},
		7: {
			index: 7,
			size: 1,
		},
	}
});
