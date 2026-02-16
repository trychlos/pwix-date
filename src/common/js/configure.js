/*
 * pwix:date/src/common/js/configure.js
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';

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
                console.warn( 'pwix:date configure() ignore unmanaged key \''+it+'\'' );
            }
        });
        if( Object.keys( built_conf ).length ){
            _conf = _.merge( DateJs._defaults, _conf, built_conf );
            DateJs._conf.set( _conf );
            // be verbose if asked for
            if( _conf.verbosity & DateJs.C.Verbose.CONFIGURE ){
                console.log( 'pwix:date configure() with', built_conf );
            }
        }
    }
    // also acts as a getter
    return DateJs._conf.get();
}

_conf = _.merge( {}, DateJs._defaults );
DateJs._conf.set( _conf );
