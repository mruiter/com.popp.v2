"use strict";

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

module.exports = new ZwaveDriver(path.basename(__dirname), {
	debug: false,
	capabilities: {
		'locked': {
			'command_class': 'COMMAND_CLASS_DOOR_LOCK',
			'command_get': 'DOOR_LOCK_OPERATION_GET',
			'command_set': 'DOOR_LOCK_OPERATION_SET',
			'command_set_parser': function (value) {
				return {
					'Door Lock Mode': ( value ) ? 'Door Secured' : 'Door Unsecured'
				}
			},
			'command_report': 'DOOR_LOCK_OPERATION_REPORT',
			'command_report_parser': function (report) {
				return report['Door Lock Mode'] === 'Door Secured';

			}
		},
		'alarm_battery': { 
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
   				}		
		},
		'measure_battery': { 
    		getOnWakeUp: true,
    		'command_class': 'COMMAND_CLASS_BATTERY',
	    	'command_get': 'BATTERY_GET',
    		'command_report': 'BATTERY_REPORT',
    		'command_report_parser': (report, node) => { 
    			if(report.hasOwnProperty('Battery Level (Raw)')) {
    				if(report['Battery Level (Raw)'][0] == 255) return 1;
        			return report['Battery Level (Raw)'][0];
					}
				return null;
    		}
		}
	},
	settings: {
		ffm: {
			index: 5,
			size: 1,
		},
	}
});
