'use strict';

var chokidar = require( 'chokidar' );
var gutil = require( 'gulp-util' );
var yargs = require( 'yargs' );

module.exports = {

    config: null,
    pkg: null,
    bwr: null,
    gulp: null,
    initialized: false,

    /**
     * Banner package
     * @type {Array}
     */
    banner: [ '/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        '' ].join( '\n' ),

    init: function ( gulp, config, pkg, bwr ) {
        console.info( '[bowboosh-tools]--> init' );
        this.gulp = gulp;
        this.config = config || {};
        this.pkg = config || {};
        this.bwr = config || {};
        this.initialized = true;
    },

    /**
     * Watch function with chokidar plugin
     * @param {Array} files
     * @param {Array} tasks
     */
    watch: function ( files, tasks, callback ) {
        console.info( '[bowboosh-tools]--> watch' );
        chokidar.watch( files, {
                ignoreInitial: true,
                // awaitWriteFinish: true,
                ignorePermissionErrors: true
            }
        ).on( 'all', function ( event, path ) {
                // console.log( event, path );
                this.gulp.start( tasks );
            }.bind( this )
        ).on( 'error', function ( error ) {
                // plugins.throwError( 'plugins.spy', error.message, true );
                console.log( "error" );
            }.bind( this )
        );
    },

    /**
     * Write a file
     * @param filename
     * @param string
     * @returns {*}
     */
    stringSrc: function ( filename, string ) {
        console.info( '[bowboosh-tools]--> stringSrc' );
        var src = require( 'stream' ).Readable( { objectMode: true } );
        src._read = function () {
            this.push( new gutil.File( { cwd: "", base: "", path: filename, contents: new Buffer( string ) } ) )
            this.push( null )
        };
        return src;
    },

    /**
     * Handle errors in underlying streams and output them to console.
     * @param err
     */
    errorHandler: function ( err ) {
        console.info( '[bowboosh-tools]--> errorHandler' );
        gutil.log( gutil.colors.red.inverse.bold( '| ERROR-HANDLER |' + err.message ) );
        gutil.beep();
        this.emit( 'end' );
    },

    /**
     * Error Throwing
     * @param taskName
     * @param msg
     */
    throwError: function ( taskName, msg, forceOnError ) {
        console.info( '[bowboosh-tools]--> throwError' );
        gutil.beep();
        if ( !forceOnError ) {
            throw new gutil.PluginError( {
                    plugin: taskName.toString(),
                    message: msg.toString()
                }
            );
        }
        else {
            gutil.log( gutil.colors.bgRed.inverse.bold( taskName.toString() + ' | ' + msg ) );
        }
        this.gulp.emit( 'end' );
    },

    /**
     *
     * @param config
     * @returns {{}}
     */
    getEnv: function ( config ) {
        console.info( '[bowboosh-tools]--> getEnv' );

        /*
         console.log( "ARGS - dev : ", yargs.argv.dev );
         console.log( "ARGS - prod : ", yargs.argv.prod );

         console.log( "CONFIG - dev : ", config.env.dev );
         console.log( "CONFIG - prod : ", config.env.prod );
         */

        var env = {};

        // No command line arguments
        if ( !yargs.argv.dev && !yargs.argv.prod ) {
            console.log( " - No environment define in command line" );
            //console.log( config.env.dev, config.env.prod );

            // No config in parameters
            if ( !config.env.dev && !config.env.prod ) {
                console.log( " - No environment define in config" );

                // No information at all
                if ( !env.dev && !env.prod ) {
                    gutil.log( gutil.colors.bgRed.inverse.bold( 'No target environment found, program will choose by default a prod environment' ) );
                    env.dev = false;
                }

            }
            // Config in parameter
            else if ( config.env.dev || config.env.prod ) {
                console.log( " - Found parameters in config" );
                if ( config.env.dev && config.env.prod ) {
                    this.throwError( 'bowboosh-tools.getEnv', 'You can\'t build for production and development environments at the same time !' );
                }
                else {
                    if ( config.env.dev ) {
                        env.dev = true;
                    }
                    else if ( config.env.prod ) {
                        env.dev = false;
                    }
                }
            }

        }
        // Command line argumentss
        else if ( yargs.argv.dev || yargs.argv.prod ) {
            console.log( " - Found parameters in command line" );
            if ( yargs.argv.dev && yargs.argv.prod ) {
                this.throwError( 'bowboosh-tools.getEnv', 'You can\'t build for production and development environments at the same time !' );
            }
            else {
                if ( yargs.argv.dev ) {
                    env.dev = true;
                }
                else if ( yargs.argv.prod ) {
                    env.dev = false;
                }
            }
        }


        env.prod = !env.dev;

        console.log( "[bowboosh-tools] => dev=", env.dev, " => prod=", env.prod );
        return env;

        /*

         // var config = config || { env: {} };
         env.dev = yargs.argv.dev || config.env.dev || !config.env.prod;
         env.prod = yargs.argv.prod || config.env.prod || false;

         console.log( "bowboosh-tools :: dev: ", env.dev, " - prod: ", env.prod );


         if ( env.prod && env.dev ) {
         this.throwError( 'bowboosh-tools.getEnv', 'You can\'t build for production and development environments at the same time !' );
         }

         return env;
         */

    }
};
