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
        _.merge( _conf, DateJs._defaults, o );
        DateJs._conf.set( _conf );
        // be verbose if asked for
        if( _conf.verbosity & DateJs.C.Verbose.CONFIGURE ){
            console.log( 'pwix:date configure() with', o );
        }
    }
    // also acts as a getter
    return DateJs._conf.get();
}

_.merge( _conf, DateJs._defaults );
DateJs._conf.set( _conf );
