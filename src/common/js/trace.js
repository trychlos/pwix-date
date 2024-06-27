/*
 * pwix:date/src/common/js/trace.js
 */

_verbose = function( level ){
    if( DateJs.configure().verbosity & level ){
        let args = [ ...arguments ];
        args.shift();
        console.debug( ...args );
    }
};

_trace = function( functionName ){
    _verbose( DateJs.C.Verbose.FUNCTIONS, ...arguments );
};
