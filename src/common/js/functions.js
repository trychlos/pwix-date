/*
 * pwix:date/src/common/js/date.js
 */

import _ from 'lodash';
import strftime from 'strftime';
import printf from 'printf';

import { Logger } from 'meteor/pwix:logger';
import { pwixI18n } from 'meteor/pwix:i18n';

const logger = Logger.get();

_.merge( DateJs, {

    // default formats used by this
    format: {
        strftime: '%Y-%m-%d',
    },

    // infinite constants
    infinite: {
        end: 8640000000000000,
        start: -8640000000000000
    },

    /**
     * @summary Dates comparison
     * @locus Anywhere
     * @param {Date|String|unset} a a date, infinite if unset or not valid
     * @param {Date|String|unset} b another date, infinite if unset or not valid
     * @param {Object} opts an optional options object with following keys:
     *  - start: whether an undefined, or null, or invalid date is considered to be the infinite start, defaulting to true.
     *           set false to consider an infinite end
     * @returns {Integer} -1 if a < b, +1 if a > b, 0 if a = b
     * Note: an undefined, or null, or invalid date is considered to be the infinite start, and so lesser than any other valid date.
     */
    compare( a, b, opts={} ){
        let infinite = new Date( this.infinite.start );
        if( opts.start === false ){
            infinite = new Date( this.infinite.end );
        }
        const aa = this.sanitize( a ) || infinite;
        const bb = this.sanitize( b ) ||  infinite;
        const aastr = this.toString( aa );
        const bbstr = this.toString( bb );
        const res = aastr < bbstr ? -1 : ( aastr === bbstr ? 0 : +1 );
        return res;
    },

    /**
     * @locus Anywhere
     * @param {Date|String|unset} date the input date, infinite if unset or not valid
     * @param {Integer} days the count of days to add
     * @returns {Date} date+days
     * Note: an undefined, or null, or invalid date is considered to be an infinite one, and cannot be computed here. We return null in this case.
     */
    compute( date, days ){
        let datesan = this.sanitize( date );
        if( datesan ){
            const timems = datesan.getTime() + ( days * this.dayms );
            datesan.setTime( timems );
        }
        return datesan;
    },

    /**
     * @summary Test for an infinity date
     * @param {Date|String|unset} date
     * @returns {Boolean} whether the date is infinite
     */
    isInfinite( date ){
        const d = this.sanitize( date );
        let infinite = true;
        if( d ){
            const t = new Date( d ).getTime()
            infinite = ( t === this.infinite.start || t === this.infinite.end );
        }
        return infinite;
    },

    /**
     * @summary Test for a valid date string
     * @param {Date|String|unset} date
     * @returns {Boolean} whether the string represents a valid date according to us
     */
    isValid( date ){
        let d = null;
        if( date instanceof Date ){
            d = new Date( date );
        } else if( _.isString( date )){
            const parts = date.split( '-' );
            if( parts.length !== 3 ){
                d = new Date( date );
                return this.isValid( d );
            }
            if( Number( parts[2] < 1 )){
                return false;
            }
            d = new Date( date );
        }
        return Boolean( d ? !isNaN( d.getTime()) : false );
    },

    /**
     * @summary Try to convert a ms value to a human-readable string
     * @param {Number} value
     * @returns {String} a human-readable string
     */
    msToHuman( value ){
        const min = 60*1000;
        const hour = 60*min;
        const day = 24*hour;
        if( value < min ){
            return printf( '%.1f %s', value / 1000, pwixI18n.label( I18N, 'ms_to_human.second_abbr' ));
        }
        if( value < hour ){
            return printf( '%.1f %s', value / min, pwixI18n.label( I18N, 'ms_to_human.minute_abbr' ));
        }
        if( value < day ){
            return printf( '%.1f %s', value / hour, pwixI18n.label( I18N, 'ms_to_human.hour_abbr' ));
        }
        return printf( '%.1f %s', value / day, pwixI18n.label( I18N, 'ms_to_human.day_abbr' ));
    },

    /**
     * @summary Sanitize a date
     * @param {Date|String|unset} date a date, maybe null, unset or undefined
     * @returns {Date|null} either a valid Date object, or null
     */
    sanitize( date ){
        let d = null;
        if( date ){
            if( _.isString( date )){
                d = new Date( date );
            } else if( date instanceof Date ){
                d = new Date( date );
            } else {
                logger.warn( 'neither a Date nor a string', date );
            }
        }
        if( d ){
            if( !this.isValid( d )){
                d = null;
            }
        }
        return d;
    },

    /**
     * @summary Sanitize a date, returning a miliseconds timestamp since Epoch
     * @param {Date|String} date a date, maybe null, unset or undefined
     * @param {Integer} defaultValue if the provided date is not valid
     * @returns {Integer} the milliseconds count since epoch
     */
    toMs( date, defaultValue ){
        return ( this.sanitize( date ) || new Date( defaultValue ) || new Date()).getTime();
    },

    /**
     * @locus Anywhere
     * @param {Date} date
     * @param {Object} opts an option object with following keys
     *  - format: the strftime desired format, defaulting to '%Y-%m-%d'
     *  - default: the string to return if date is not set or empty, defaulting to ''
     * @returns {String} the provided date as a formatted string
     */
    toString( date, opts={} ){
        let str;
        if( this.isValid( date )){
            str = strftime( opts.format || this.format.strftime, new Date( date ));
        } else {
            str = opts.default || '';
        }
        return str;
    },

    /* ***************************** */

    // default formats used by this
    formatx: {
        jQuery: 'yy-mm-dd'
    },

    dayms: 86400000,

    // switch hour
    switchHour: '00:00:00',

    // default timezone
    timeZone: 'UTC',

    /**
     * @summary Returns the current date for the given timezone
     * @param {String} timezone
     * @returns {Date}
     */
    date( timezone ){
        let date = new Date();
        let str = date.toLocaleString( 'en-US', { timeZone: timezone });
        return new Date( str );
    },

    /**
     * @locus Anywhere
     * @returns {Date} the current UTC date with hour-minute-seconds=0
     *
     * Ex:
     *  localtime: Thu Sep  7 09:38:21 PM CEST 2023
     *  new Date(): 2023-09-07T19:38:21.057Z
     *  today.toUTCString(): Thu, 07 Sep 2023 00:00:00 GMT
     */
    UTC(){
        const today = new Date();
        today.setUTCHours( 0, 0, 0, 0 );
        return today;
    }
});
