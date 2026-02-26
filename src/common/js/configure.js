/*
 * pwix:date/src/common/js/configure.js
 */

import _ from 'lodash';

import { Logger } from 'meteor/pwix:logger';
import { ReactiveVar } from 'meteor/reactive-var';

const logger = Logger.get();

let _conf = {};
DateJs._conf = new ReactiveVar( _conf );

DateJs._defaults = {
    verbosity: DateJs.C.Verbose.CONFIGURE
};

/**
 * @summary Get/set the package configuration
 *  Should be called *in same terms* both by the client and the server.
 * @param {Object} o configuration options
 * @returns {Object} the package configuration
 */
DateJs.configure = function( o ){
    if( o && _.isObject( o )){
        // check that keys exist
        let built_conf = {};
        Object.keys( o ).forEach(( it ) => {
            if( Object.keys( DateJs._defaults ).includes( it )){
                built_conf[it] = o[it];
            } else {
                logger.warn( 'configure() ignore unmanaged key \''+it+'\'' );
            }
        });
        if( Object.keys( built_conf ).length ){
            _conf = _.merge( DateJs._defaults, _conf, built_conf );
            DateJs._conf.set( _conf );
            logger.verbose({ verbosity: _conf.verbosity, against: DateJs.C.Verbose.CONFIGURE }, 'configure() with', built_conf );
        }
    }
    // also acts as a getter
    return DateJs._conf.get();
}

_conf = _.merge( {}, DateJs._defaults );
DateJs._conf.set( _conf );
