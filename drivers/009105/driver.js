"use strict";

const path			= require('path');
const ZwaveDriver	= require('homey-zwavedriver');


module.exports = new ZwaveDriver(path.basename(__dirname), {
		debug : false,
		capabilities : {
			'onoff' : {
					'command_class': 'COMMAND_CLASS_SWITCH_BINARY',
					'command_get': 'SWITCH_BINARY_GET',
					'command_set': 'SWITCH_BINARY_SET',
					'command_set_parser': value => ({
						'Switch Value': (value) ? 'on/enable' : 'off/disable'
					}),
					'command_report': 'SWITCH_BINARY_REPORT',
					'command_report_parser': report => report.Value === 'on/enable'
				}
		},
		settings : {
		"led_indication_mode": {
			"index": 1,
			"size": 1,
		},
		"auto_switch_off": {
			"index": 2,
			"size": 2,
		},
		"state_after_powerloss": {
			"index": 5,
			"size": 1,
		},
			"led_off_color": {
			"index": 21,
			"size": 1,
		},
			"led_on_color": {
			"index": 22,
			"size": 1,
		}
	}
	})
