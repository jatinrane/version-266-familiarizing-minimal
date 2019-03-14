//*******************************************************************
//          b$l = Beaver $cript Library.
//          Intended to be lite weight JS generic library.
//          Copyright (c) 2018 - 2019 Konstantin Kirillov
//          Licenses: MIT, GPL, GPL2.
//*******************************************************************

// //\\// Super-module of b$l framework. Must be executed first
//        Checks if there is a conflict in global namespace with this library name.
//        Adds ns.$$ - lite weight dom wrap.
//  
//        Creates only one global: window[ APP_NAME ]
//        jQuery can be added with no collision.


( function() {
    var APP_NAME        = 'b$l';

    //.optional property: comment this definition out if not needed
    //.purpose is only to short manual typing for development debug
    window.ccc          = window.console.log;

    var ns = setAppNamespace();
    setDomWrap( ns );
    return;






    function setAppNamespace()
    {
        var uniqueEarthWide = 'iamniquelks8e00w-e9jalknfnaegha;s[snfs=sieuhba;fkleub92784bna';
        var ns = window[ APP_NAME ];
        if( ns ) {
            if( ns[ uniqueEarthWide ] ) { return ns; }
            //.lets community to take care about this app
            throw 'global name collision: the window["' + APP_NAME +
                  '"] already exists in web-browser';
        } else {
            var ns = window[ APP_NAME ] = {};
            ns[ uniqueEarthWide ] = true;
            ns.uniqueEarthWide = uniqueEarthWide;
            ns.sn = sn;
            ns.APP_NAME = APP_NAME;
            ns.CSS_PREFIX = APP_NAME.replace( /\$/g, 's' );
            return ns;
        }

        ///sets namespace
        function sn( subname, parentNS )
        {
            var parentNS = parentNS || ns;
            if( parentNS.hasOwnProperty( subname ) ) {
                return parentNS[ subname ];
            } 
            var sns = parentNS[ subname ] = {};
            return sns;

            /*
            //proposes property conflict detection with JS native objects in 
            //prototype-tree depths
            var sns = parentNS[ subname ];
            if( sns ) {
                if( sns[ uniqueEarthWide ] ) return sns;
                //.lets community to take care about this app
                throw 'object property name collision: the parentNS["' + subname +
                '"] already exists in web-browser';
            }
            var sns = parentNS[ subname ] = {};
            sns[ uniqueEarthWide ] = true;
            return sns;
            */
        }
    }







    //***************************************************************************
    // //\\ ns.$$ ... dom wrapp
    //***************************************************************************
    function setDomWrap( ns )
    {
        // //\\ helpers
        ns.svgNS = "http://www.w3.org/2000/svg";

        ///https://css-tricks.com/snippets/javascript/loop-queryselectorall-matches/
        ns.callOn = function( selector, parent, callback )
        {
            parent = parent || document;
            var els = parent.querySelectorAll( selector );
            for( var ii = 0; ii < els.length; ii++ ) {
                callback( els[ii], ii );
            }
        };

        ///converts event pos to domelem-css-pos
        ns.event_pos_2_css_pos = function ( event, domelem )
        {
            //	https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect
            //	Feature 	Chrome 	Firefox (Gecko) 	Internet Explorer 	Opera 	Safari
            //	Basic support 	1.0 	3.0 (1.9) 	4.0 	(Yes) 	4.0
            var box	= domelem.getBoundingClientRect();
            var loc	= [ Math.round( event.clientX - box.left ), Math.round( event.clientY - box.top ) ];
            return loc;
        };


        // //\\ DOM wrap
        //      for chains
        //      simple replacement of jQuery
        var $$ = ns.$$ =
        ( function() {

            ///syntax sugar to supply object in two forms: wrapped into $$ or naked
            function alt( obj )
            {
                return (typeof obj === 'function' ? obj() : obj);
            }
            
            var gen = function() {
                var ctxEl = null;
                var methods =
                {
                    //.wraps flat-dom-object-into-platform
                    $:      function( obj )                 { ctxEl = obj                                            },

                    c:      function( type )                { ctxEl =                document.createElement( type ); },
                    //.gets single by id
                    g:      function( id )                  { ctxEl =                document.getElementById( id ); },
                    //.gets single
                    q:      function( selector, parent )    { ctxEl =                (parent||document.body).querySelector( selector ); },
                    //.gets array of all
                    qa:     function( selector, parent )    { ctxEl =                (parent||document.body).querySelectorAll( selector ); },
                    cNS:    function( type )                { ctxEl =                document.createElementNS( ns.svgNS, type ); },
                    a:      function( attr, text, obj )     { ctxEl = obj || ctxEl;  ctxEl.setAttribute( attr, text ); },
                    aNS:    function( attr, text, obj )     { ctxEl = obj || ctxEl;  ctxEl.setAttributeNS( null, attr, text ); },
                    to:     function( to, obj )             { ctxEl = obj || ctxEl;  alt( to ).appendChild( ctxEl ); },
                    ch:     function( ch, obj )             { ctxEl = obj || ctxEl;
                                                              //.encourages syntax for alternatively empty list of children
                                                              //.$$.ch( obj ? ... : ... )
                                                              if( !ch ) return;

                                                              if( Array.isArray( ch ) ) {
                                                                ///if array, then adds children in sequence
                                                                ch.forEach( function( child ) {
                                                                    child && ctxEl.appendChild( alt( child ) );
                                                                });
                                                              } else {
                                                                ctxEl.appendChild( alt( ch ) );
                                                              }
                                                            },
                    e:      function( type, callback, obj ) { ctxEl = obj || ctxEl;  ctxEl.addEventListener( type, callback ); },
                    css:    function( name, value, obj )    { ctxEl = obj || ctxEl;  ctxEl.style[ name ] = value; },
                    html:   function( html, obj )           { ctxEl = obj || ctxEl;  ctxEl.innerHTML = html; },


                    //adds class.
                    addClass:   function( text, obj )
                                {   
                                    if( !text ) return; //sugar, saves extra "if"

                                    ctxEl = obj || ctxEl;  
                                    var clss = classes=text.split(/\s+/);
                                    if( clss.length>1 ) {
                                        ////many classes are supplied ...
                                        ////processes each of them
                                        clss.forEach( function( cls ) {
                                            $$.addClass( cls, ctxEl );
                                        });
                                        return;
                                    }

                                    var at = ctxEl.getAttribute( 'class' ); //className is not for SVG
                                    if( !at ) {
                                        //https://stackoverflow.com/questions/41195397/how-to-assign-a-class-to-an-svg-element
                                        //ctxEl.className = text;
                                        ctxEl.setAttribute( 'class', text ); //For SVG
                                        return;
                                    }
                                    var ats = ' ' + at + ' ';
                                    var testee = ' ' + text + ' ';
                                    if( ats.indexOf( testee ) === -1 ) {
                                        //c onsole.log( 'adding=' + text + ' to ' + at);
                                        if( at.length > 0 && text ) {
                                            at += ' ';
                                        }
                                        at += text;
                                        //c onsole.log( 'result of adding=' + at);
                                        //ctxEl.className = at;
                                        ctxEl.setAttribute( 'class', at ); //For SVG
                                    }
                                },

                    //removes class.
                    removeClass: function( text, obj )
                                { 
                                    if( !text ) return; //sugar, saves extra "if"

                                    //c onsole.log( 'removing=' + text );
                                    ctxEl = obj || ctxEl;  
                                    var clss = classes=text.split(/\s+/);
                                    if( clss.length>1 ) {
                                        ////many classes are supplied ...
                                        ////processes each of them
                                        clss.forEach( function( cls ) {
                                            $$.removeClass( cls, ctxEl );
                                        });
                                        return;
                                    }

                                    var at = ctxEl.getAttribute( 'class' );
                                    if( !at ) {
                                        ////nothing to remove ... leaving the task
                                        return;
                                    }
                                    var ats = ' ' + at + ' ';
                                    var testee = ' ' + text + ' ';
                                    if( ats.indexOf( testee ) > -1 ) {
                                        var re = new RegExp( '(?:^|\\s)' + text + '(?:\\s|$)', 'g' );
                                        //var match = at.match( re );
                                        //c onsole.log( 'match=', match );
                                        at = at.replace( re, ' ' );
                                        at = at.replace( /\s+/g, ' ' );
                                        at = at.replace( /(^\s*)|(\s*$)/g, '' );
                                        //at = at.replace( /(\s*)/g, '' );
                                        //c onsole.log( 'removed=' + at );
                                        //ctxEl.className = at;
                                        ctxEl.setAttribute( 'class', at ); //For SVG
                                    }
                                }
                };

                //:here JavaScript writer can look which additional shortcuts do exist
                //:here we can add more dependent shortcuts
                methods.cls = methods.addClass;
                methods.id = function( text, obj ) { methods.a( 'id', text, obj ); }; //.adds id
                methods.src = function( text, obj ) { methods.a( 'src', text, obj ); }; //.adds src
                methods.href = function( text, obj ) { methods.a( 'href', text, obj ); }; //.adds src
                methods.div = function( obj ) { methods.c( 'div', obj ); }; //.creates div
                methods.img = function( obj ) { methods.c( 'img', obj ); }; //.creates img
                methods.span = function( obj ) { methods.c( 'span', obj ); }; //.creates span
                methods.style = function( obj ) { methods.c( 'style', obj ); }; //.creates style
                methods.$ul = function( obj ) { methods.c( 'ul', obj ); }; //.creates ul
                methods.$li = function( obj ) { methods.c( 'li', obj ); }; //.creates li
                methods.$a = function( obj ) { methods.c( 'a', obj ); }; //.creates li

                methods.di = function( id, obj ) { methods.c( 'div', obj ); methods.a( 'id', id ); }; //.creates div, sets id
                methods.dc = function( cls, obj ) { methods.c( 'div', obj ); methods.addClass( cls ); }; //.creates div, sets class
                methods.dic = function( id, cls, obj ) {
                                methods.di( id, obj );
                                methods.addClass( cls );
                }; //.creates div, sets id and class
                methods.dict = function( id, cls, to, obj ) {
                                methods.di( id, obj );
                                methods.addClass( cls );
                                methods.to( to );
                }; //.creates div, sets id and class, and appends to "to"
                methods.dct = function( cls, to, obj ) {
                                methods.dc( cls, obj )
                                methods.to( to );
                }; //.creates div, sets class, and appends to "to"

                var wrap = function() { return ctxEl; };
                Object.keys( methods ).forEach( function( key ) {
                    var method = methods[ key ];
                    wrap[ key ] = function() { method.apply( {}, arguments ); return wrap; };
                });
                return wrap;
            };

            var sample = gen();
            var masterGen = {};
            Object.keys( sample ).forEach( function( key ) { //todm ... works for functions ? not only for objects?
                masterGen[ key ] = function() { return gen()[ key ].apply( {}, arguments ); };
            });
            return masterGen;

        }) ();
        // \\// DOM wrap
    }
    //***************************************************************************
    // \\// ns.$$ ... dom wrapp
    //***************************************************************************



}) ();



// //\\// debugger
//        non-dispensable for mobiles
//        version july 4, 2018
( function () {
	var ns = window.b$l;




    // creates debugger once per application
    ns.createDebugger = function ()
    {
        if( ns.d ) return;
        ///Checks if bsl-debug textarea exists and 
        /// outputs to debug and scrolls to the end.
        /// If debWind-fragment is commented-out, this function does nothing
        /// and in the code it is still safe to use the lines:
        /// Usage: window.b$l.d(text)
        ns.d = function( text )
        {
            //ccc( Date.now().toString().substr( -6 ) + ' ' + text );
            if( !debWind ) return;
            debWind.value +='\n' + text;
            debWind.scrollTop = debWind.scrollHeight;
        };
        var debWind=null;
        ///uncomment debug-block to enable textarea for debug
        /*
        // //\\ debug-block
        var debWind = document.getElementById( 'bsl-debug' );
        if( !debWind ) {
            ////this block is good when one needs to output large data object
            ////into text box in a browser's textarea at the end of web-page
            debWind = document.createElement( 'textarea' );
            debWind.setAttribute( 'id', 'bsl-debug' );
            debWind.setAttribute( 'disabled', 'yes' );
            document.body.appendChild( debWind );
            debWind.style.cssText = 
                    //'height:18%; width:30%; z-index:1111111;' +
                    'height:250px; width:600px; z-index:1111111;' +
                    'position:absolute; top:60%; left:200px; font-size:15px;';
            ns.dd = debWind; //usage: ns.dd.value +='\n' + text;
        }
        // \\// debug-block
        */
    };

}) ();

( function() {
	var ns = window.b$l;




    //=========================================================
    // //\\ ecapes html specials
    //=========================================================
    var amp_re = /&/g;
    var lt_re = /</g;
    var gt_re = />/g;
    var line_feed_re = /\r\n|\r|\n/g;
    ns.htmlesc = function( str )
    {
        return str.replace( amp_re, '&amp;' ).replace( lt_re, '&lt;' ).replace( gt_re, '&gt;' );
    }

    ns.pre2fluid = function( str )
    {
        return str.replace( line_feed_re, '<br>' );
    }
    //=========================================================
    // \\// ecapes html specials
    //=========================================================



    //=========================================================
    // //\\ configures from URL
    //=========================================================
    ns.url2conf = function( conf )
    {  
        //      if supplied, it overrides internal application conf 
        //      format: ...index.html?conf=a.b.c.d=4,a.b.e=5
        var urlPars     = window.location.search || '';
        /*
        var urlPathname = window.location.pathname;
        var urlProtocol = window.location.protocol;
        var urlHostname = window.location.hostname;
        var urlPort     = window.location.port + '';
        */
        var urlConfRe   = /(?:&|\\?)conf=([^&]+)/i;
        var urlConf     = urlPars.match( urlConfRe );
        if( urlConf ) {
            urlConf = urlConf[1].split(',');
            urlConf.forEach( function( opt ) {
                var cc = opt.split('=');
                if( cc[1] ) {
                    //let user to say "yes" or "no"
                    cc[1] = cc[1] === "yes" ? true : ( cc[1] === "no" ? false : cc[1] );
                } else {
                    ////missed parameter p in x=p is ignored
                    return;
                }
                ns.dots2object( cc[0], cc[1], conf )
                //conf.urlConf[cc[0]]=cc[1];
            });
        }
        return conf;
    }
    //=========================================================
    // \\// configures from URL
    //=========================================================

    // //\\ helpers
    ns.prop2prop = function( target, source )
    {
        if( source ) {
            Object.keys( source ).forEach( function( key ) {
                target[ key ] = source[ key ];
            });
        }
        return target;
    };



    ///updates properties of object obj from single key-value
    ///pair "name, value"
    ns.dots2object = function( name, value, obj )
    {
		var tokens	= name.split( '.' );
		var len		= tokens.length;
		var len1	= len - 1;
		if( len1 < 0 ) {
            obj[ name ] = value;
            return obj;
        }
		var prop	= tokens[ 0 ];
		for( var ii = 0; ii < len1; ii++ )
		{
			//:: appends objects if missed
			if( !obj[ prop ] || typeof obj[ prop ] !== 'object' ) obj[ prop ] = {};
			obj = obj[ prop ];
			var prop = tokens[ ii + 1 ];
		}
		obj[ prop ] = value;
        return obj;
    }


    ///sugar for Object.keys( obj ).forEach ...
    ns.eachprop = function( obj, callBack )
    {
        Object.keys( obj ).forEach( function( key ) {
            callBack( obj[ key ], key );
        });
    };

    ///generalizes Array.map() to Object.map()
    ns.eachmap = function( obj, callBack )
    {
        var objReturn = {};
        Object.keys( obj ).forEach( function( key ) {
            objReturn[ key ] = callBack( obj[ key ], key );
        });
        return objReturn;
    };



	///	Purpose:		Cloning object trees by value till refdepth.

    // edge-calse does not work: see below as
    // edge-calse does not work: the only problem is when wall_preserved.length is defined.
    // see other edge cases with token "throw" below

	//					"All existing properties at and below refdepth become common
	//					for operands and result".
	//	Detais:			Makes wall a correct paste of paper when
	//						both wall and paper do not have arrays in their trees till (refdepth+1);
	//					otherwise, ( "arrayflict" case)
	//						non-array obj.W can be overriden with array [] and with A which may
	//						break outside reference w = obj.W which still points to the former W.
	//					Infinite recursion is not protected except by using recdepth.
	//	Comparision:	of arrayflicts with jQuery.extend
	//						wall = {...} paper [...]
	//							in jQuery - this is an obligation of programmer to make wall [...]
	//							in tp	-	wall is brutally replaced with []. Not extended,  //TODM possibly fix
	//										but return result is correct possibly except numerics in wall_preserved.
	//						in deeper levels of arrayflict
	//							in jQuery	- new [] is generated
	//							in tp		- new [] is generated
	//							in jQuery	- numeric and non-numeric properties of wall.....non-arr are "killed"
	//							in tp		- numeric and non-numeric properties of wall.....non-arr are preserved
	//					in jQuery	- all prototype levels are copied
	//					in tp		- only ownProperties are copied
	//					in jQuery	- only two options "deep copy" or "not deep"
	//					in tp		- reference deepness can be controlled
	//							
	//	Input:			All args are optional.
	//					skip_undefined	- omitting it allows copying "wall <- paper.undefined".
	//					recdepth		- stops recursion at level > recdepth

	//	Results in:		changed wall properties.
	//	Returns:		combined clone of paper to wall.
	var paste_non_arrays = ns.paste = ns.paste_non_arrays = function ( wall, paper, level, skip_undefined, refdepth, recdepth )
	{

		level = level || 0;
		var t = typeof paper;

		//.Arguments sugar: pasting nothing does not change wall
		if( !level && (t === 'undefined' || paper === null ) ) return wall;

        //.Returns back non-object-type value
		if( t === 'undefined' || t === 'string' || t === 'boolean' || t === 'number' || t === 'function' || paper === null)
		{
			return paper;
		}

		///Reduces the "deep-copy" to reference copy for leveles beneath reference-depth
		if( refdepth || refdepth === 0 )
		{
			if( level > refdepth ) return paper;
		}

		///Recursion limit is exceeded. Truncates recursion by recdepth value.
		if( ( recdepth || recdepth ===0 ) && level > recdepth ) 
		{
			return '';
		}


		///Paper is non-void array or object. If wall do not "match" the paper, making wall an object.
		if( typeof wall !== 'object' || wall === null )
		{
			wall = {};
		}

        var isArrayPaper = Array.isArray( paper );
        if( isArrayPaper && !Array.isArray( wall ) ) {
            ////Paper is array and wall is not. Morthing wall to array but preserve its properties.
			var wall_preserved = wall;
			wall = [];
            //.Returns preserved wall's properties to wall-as-array.
            if( typeof wall_preserved.length !== 'undefined' ) {
                ////edge-calse does not work: the only problem is when wall_preserved.length is defined.
                ////todm: the only problem is when wall_preserved.length is defined.
                throw "copying array to object with existing object.length property";
            }
			paste_non_arrays( wall, wall_preserved, level, skip_undefined, refdepth, null );
        };

		///Now both wall and paper are objects of the same type. Pasting their properties.
		var hasOwn	= Object.prototype.hasOwnProperty;
		for(var p in paper )
		{
			if( hasOwn.call( paper, p ) ) //when works on arrays, then not fails on 'length'? bs "length" is notOwnProperty
			{
				if( p !== 'length' )
				{
					paper[ p ];
						var theValue = paste_non_arrays( wall[ p ], paper[ p ], level+1, skip_undefined, refdepth, recdepth );

						if( ! ( ( isArrayPaper || skip_undefined ) && typeof theValue === 'undefined' )  )
						{
							wall[ p ]		= theValue;
						}
				} else {
					throw 'The subroutine, paste_non_arrays, does not allow to copy property "length".';
				}
			}
		}
		return wall;
	};// ...paste_non_arrays=function...
	
}) ();




///global css manager;
///gradually adds and updates global css
///as page loads at landing
///keeping css in one html-style-element;
( function() {
 	var ns                  = window.b$l;
    var globalCss           = ns.sn('globalCss');
    var cssText             = '';
    var cssDom$             = null;
    globalCss.update        = update;       
    globalCss.addText       = addText;
    globalCss.getText       = getText;
    globalCss.add8update    = addAndUpdate;
    return; //****************************





    function update( moreText )
    {
        if( !cssDom$ ) {
            cssDom$ = ns.$$.style().to( document.head );
        }
        if( moreText ) { cssText += moreText; }
        cssDom$.html( cssText );
    };
    function addText( text )
    {
        cssText += text;
    };
    ///helps to cooperate with other Css builder
    ///by avoiding creation of extra own style-html
    function getText()
    {
        return cssText;
    };
    function addAndUpdate( text )
    {
        addText( text );
        update();
        ///good place to output assembled css for later static use
    }
})();




(function () {
    var ns = window.b$l;
    ns.loadScript = function( src, onload, type )
    {
        //https://developer.mozilla.org/en-US/docs/Web/HTTP/
        //      Basics_of_HTTP/MIME_types#JavaScript_types
        type = type || 'text/javascript';
        var scrip = document.createElement('script');
        scrip.onload = onload;
        document.head.appendChild( scrip );
        //https://medium.com/@vschroeder/javascript-how-to-execute-code-from-an-
        //asynchronously-loaded-script-although-when-it-is-not-bebcbd6da5ea
        scrip.src = src;
    }
}) ();



(function () {
    var ns = window.b$l;
    ns.createDebugger();
    ns.conf = ns.url2conf( {} );
}) ();



( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var fapp        = ns.fapp           = ns.fapp           || {};

    // //\\ updated automatically. Don't edit these strings.
    fapp.version =  265; //application version
    // \\// updated automatically. Don't edit these strings.

}) ();

/************************************************************
    Beaver $cript Library.
    Lite weight JavaScript Utilities.
    Copyright (c) 2018-2019 Konstantin Kirillov.
    License MIT.
*************************************************************/

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var nheap       = ns.nheap          = ns.nheap          || {};
    var methods     = ns.methods        = ns.methods        || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var ccc         = window.console.log;

    //.API=loadedImages[ listItem.id ] ={ img:img, listItem:listItem };
    imagesRack.loadedImages = {}; 
    methods.loadImages = loadImages;
    methods.getDataURI = getDataURI;
    //0000000000000000000
    return;
    //0000000000000000000





    ///loads images from list and calls callbacks per
    ///image and per list-completion
    function loadImages( lastCb, imgList )
    {
        //:both these arrays contain completionItems
        var completionList = [];
        var completionCount = 0;

        function checkCompletion()
        {
            if( completionCount === imgList.length ) {
                lastCb( completionList );
            }
        }
        imgList.forEach( function( listItem, ix ) {
            var img = new Image();
            var completionItem = { img:img, listItem:listItem };

            completionList.push( completionItem );
            imagesRack.loadedImages[ listItem.id ] = completionItem;

            img.onload = function() {
                completionCount++;
                listItem.cb && listItem.cb( img, ix );
                checkCompletion();
            }
            img.src = listItem.src;
        });
    }

    ///converts images to data-image format
    function getDataURI()
    {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext( '2d' );
        Object.keys( imagesRack.loadedImages ).forEach( function( key ) {
            var rack = imagesRack.loadedImages[ key ];
            var bImg = rack.img;
            canvas.width = bImg.naturalWidth;
            canvas.height = bImg.naturalHeight;
            ctx.drawImage( bImg, 0, 0, canvas.width, canvas.height );
            rack.dataURI = canvas.toDataURL();
        });
    }



})();


/************************************************************
    Beaver $cript Library.
    Lite weight JavaScript Utilities.
    Copyright (c) 2018-2019 Konstantin Kirillov.
    License MIT.
*************************************************************/

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var nheap       = ns.nheap          = ns.nheap          || {};
    var nsmethods     = ns.methods        = ns.methods        || {};
    var ccc         = window.console.log;

    nsmethods.putCommasToBigNumbers = putCommasToBigNumbers;
    //0000000000000000000
    return;
    //0000000000000000000



    ///Converts number to string with decimal commas "," and
    ///optionally, sets the number of digits after period
    ///     for example:
    ///         (123456712345.67, 3) to  123,456,712,345.670
    ///Input: theNumber the number or string to convert
    ///       toFloatDigits - optional, number of after-period-digits
    ///
    ///This function may work for string input, but this feature
    ///     is not tested.
    ///
    function putCommasToBigNumbers( theNumber, toFloatDigits )
    {
        if( typeof theNumber === 'number' )
        {
            var numbStr = typeof toFloatDigits === 'number' ?
                               theNumber.toFixed( toFloatDigits ) :  theNumber + '';
        } else {
             var numbStr = theNumber;
        }
        if( numbStr.indexOf('e') > -1 || numbStr.indexOf('E') > -1 ) return numbStr;

        var decPoint = numbStr.indexOf('.');
        decPoint = decPoint === -1 ? numbStr.length : decPoint;
        if( decPoint < 4 ) return numbStr;
        var result = numbStr.substring( decPoint, numbStr.length );
        for( var ix=0; ix<decPoint; ix++ ) {
            var char = numbStr.charAt( decPoint - ix - 1 );
            if( char!=='-' ) {
                if( !( ix%3 ) && ix !== 0 ) { result = ',' + result; }
            }
            result = char + result;                
        }
        return result;
    }


})();


/************************************************************
    Beaver $cript Library.
    Lite weight JavaScript Utilities.
    Copyright (c) 2018-2019 Konstantin Kirillov.
    License MIT.
*************************************************************/

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var nheap       = ns.nheap          = ns.nheap          || {};
    var methods     = ns.methods        = ns.methods        || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var ccc         = window.console.log;

    //this is a responsibility of caller: var memoizedImages = {};
    //if( memoizedImages.hasOwnProperty( shape ) ) memoizedImages[ shape ];

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext( '2d' );

    methods.getLabelImage = getLabelImage;
    //0000000000000000000
    return;
    //0000000000000000000





    ///creates label as dataURL
    function getLabelImage( imgPars )
    {
        var shape = imgPars.shape;
        var size  = imgPars.size || [200,200];
        var color = imgPars.color;

        canvas.width = size[0];
        canvas.height = size[1];
        switch( imgPars.shape )
        {
            case 'bar':
                ctx.fillStyle = color;
                ctx.rect( 0, 0, canvas.width, canvas.height );
                ctx.fill();
                return canvas.toDataURL();
        }
    }



})();



//https://stackoverflow.com/questions/415160/best-method-of-instantiating-an-xmlhttprequest-object
//It looks like MS started common way since IE7:
//  https://en.wikipedia.org/wiki/Ajax_(programming)#History
//  mdn: supported versions
( function () {
	var ns = window.b$l = window.b$l || {};
    ns.ajax = createAjaxFramework();

    //000000000000000000000000
    return;
    //000000000000000000000000



    

	function createAjaxFramework()
    {
		var ajy = {};
		var xml = null;
		if( typeof XMLHttpRequest === 'undefined' )
        {
            alert( 'no ajax available in the browser' );
            return;
        }
		xml = new XMLHttpRequest();
		if( xml.overrideMimeType )
		{
			xml.overrideMimeType('text/xml'); //for quirky FF or FireBug.
		}

        //API is:
		ajy.xml = xml;
        ajy.send = send;
        return ajy;


        //API is:
		function send( ajaxURL, method, onchange, onerror )
		{
			var flag = true;
			method = method || 'GET';

			var onchangeWrap = function ( ajy ) 
			{
				if ( xml.readyState === 4 ) 
				{
					if( xml.status === 200 )
					{
						onchange( ajy );
					}else{
                        onerror && onerror( 'Ajax problems with URL ' +
                                 ajaxURL );
					}
				}
			};
			var request = function () 
			{
				try{ 
					xml.open( method, ajaxURL, flag );  
					xml.send( null );
				}catch ( e ) {	//	TODM
					//Give up.
					//xml.send(null);
				}
			};
			xml.onreadystatechange = function() { onchangeWrap( ajy ); };
			request();
		};    
	}

})();

( function() {
    var ns          = window.b$l;
    var sn          = ns.sn;    
    var nsmethods     = sn('methods');

    nsmethods.loadAjaxFiles = loadAjaxFiles;
    //000000000000000000000000000000
    return;
    //000000000000000000000000000000







    //===============================================================================
    // //\\ microAPI to load list of files
    //===============================================================================
    function loadAjaxFiles( filesList, lastCb )
    {
        var completionCount = 0;
        var loadedFiles = [];
        var loadedFilesById = {};

        filesList.forEach( function( fileItem, ix ) {

            var xml = new XMLHttpRequest();
			try{ 
				xml.open( 'GET', fileItem.link, true );  
				xml.send( null );
			    xml.onreadystatechange = processIfGood;
			}catch ( e ) {	//	TODM
				//Give up.
                completionCount++;
                checkCompletion( fileItem );
			}
            function processIfGood()
            {
				if ( xml.readyState === 4 ) 
				{
					if( xml.status === 200 )
					{
						fileOnLoad();
					} else {
                        //Give up.
                        completionCount++;
                        checkCompletion( fileItem );
                        //onerror && onerror( 'Ajax problems with URL ' +
                        //         ajaxURL );
					}
				}
            }

            function fileOnLoad()
            {
                var loadedItem = { text:xml.responseText, fileItem:fileItem };
                //ccc( 'success: ', loadedItem );
                loadedFiles.push( loadedItem );
                if( fileItem.id ) {
                    loadedFilesById[ fileItem.id ] = loadedItem;
                }
                completionCount++;
                //ccc( completionCount + ' loaded ' + fileItem.src );
                fileItem.cb && fileItem.cb( loadedItem );
                checkCompletion( fileItem );
            }
        });
        return; //rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr

        function checkCompletion( fileItem )
        {
            if( completionCount === filesList.length ) {
                lastCb && lastCb( loadedFilesById, loadedFiles );
            }
        }
    }
    //===============================================================================
    // \\// microAPI to load list of files
    //===============================================================================

}) ();


( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};

    var fapp        = ns.fapp           = ns.fapp           || {};
    var fconf       = fapp.conf         = fapp.conf         || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var ddCont      = nheap.ddCont      = nheap.ddCont      || [];
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;

    methods.loadCharts = loadCharts;
    methods.makeChartsOptions = makeChartsOptions;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000







    ///prepares options to call Highcharts
    function makeChartsOptions()
    {
        //contCharts.length = 1;
        contCharts.forEach( function( chartRack ) {
            var widgetDef = chartRack.widgetDef;
            var options = chartRack.options;
            if( widgetDef && widgetDef.time ) {
                options.series[0].data =
                    chartRack.dataTable.map( function( row ) {
                        return [ row[ widgetDef.time ], row[ chartRack.fieldName ] ]; 
                    });
                //.outputs assembled chart to html-page nicely formatted
                //$$.c('pre').to( document.body ).ch(
                //    $$.div().html( JSON.stringify( chartRack.options, null, '    ' )));

            }
        });
    }


    function loadCharts( continueAfterChartsLoaded )
    {
        if( contCharts.length === 0 ) {
            continueAfterChartsLoaded();
            return;
        }

        if( fconf.EXPORT_CHARTS_2_IMAGES_LOCALLY ) {
            doProcessExportLocally();
        } else {
            doProcessExportRemotely();
        }
        return;



        



        //===================================
        // //\\ calls local export
        //===================================
        function doProcessExportLocally()
        {
            var counter = 0;
            var arrivedCounter = 0;

            //var myImage = document.createElement('img');
            //document.body.appendChild(myImage);


            //******************************************
            // Attention.
            // This line modifies the legacy code
            // of Highcharts.com.
            // This is the only change and the only
            // place were this change happens in
            // this application.
            Highcharts.downloadURL = downloadURL;
            //******************************************


            ///dataURL is a thing which can be assigned to href in <a href=...
            function downloadURL(dataURL, filename) {
                try{
                    //console.log( filename );
                    var piggyBackCounter = parseInt(filename);
                    insertImage( dataURL, piggyBackCounter )
                    // //\\ good debug
                    //if( piggyBackCounter === 1 ) ccc( dataURL );
                    //myImage.src = dataURL;
                    //ccc( 'chart image ' + piggyBackCounter + ' added to pdfDoc-options' );
                    // \\// good debug
                    arrivedCounter++;
                    if( arrivedCounter >= contCharts.length ) {
                        //ccc( 'all charts are converted' );
                        //not good to reset exporter set this way here: arrivedCounter = 0;

                        //.missing this setTimeout and calling this function directly
                        //.apparently creates repeated calls to exporter in
                        //.case of the function errors and leading to big mess
                        setTimeout( continueAfterChartsLoaded, 1 );
                    }              
                } catch (err) {
                    ccc( 'err in downloadURL=', err );
                }
            };
            callLocalConverter();
            return;

            function callLocalConverter()
            {
                var chartRack = contCharts[counter];
                chartRack.options = ns.paste( chartRack.options,
                {
                    exporting: {
                        filename : ''+counter,
                        fallbackToExportServer: false, //true,
                        error: function() { ccc( 'error in exporting: ', arguments ); },
                        enabled: false // hides button
                    }
                });
                chartRack.options.chart.events =
                {
                    load: function( event ) {
                            //ccc( Date.now() +' after load');
                            if( !this.userOptions.chart.forExport ) {
                                //ccc( Date.now() +' starting export of chart ' + counter +
                                //     ' "' + chartRack.options.title.text + '"');
                                //     chartRack.options );
                                this.exportChartLocal();

                                //.make blob ... why?
                                //this.exportChartLocal({ type: 'image/svg+xml' });

                                //ccc( Date.now() +' exportChartLocal called' );
                            }
                    } 
                };

                //ccc( 'exporting chart ' + counter + ' of ' + ( contCharts.length - 1 ) );
                //if( chartRack.options.chart.type === 'columnpyramid' )
                //    chartRack.options.chart.type = 'column';

                var container = $$.div().to(document.body)
                                .css('position', 'absolute' )
                                .css('left', '-10000px' )
                                ();
                Highcharts.chart( container, chartRack.options );
                counter++;

                if( counter < contCharts.length ) {
                    ////perhaps this is good to split conversion a bit,
                    ////this is why delay is 1 ms
                    setTimeout( callLocalConverter, 1 );
                }              
            }
        }
        //===================================
        // \\// calls local export
        //===================================




        //===================================
        // //\\ calls remote export
        //===================================
        function doProcessExportRemotely()
        {
            //.prevents Highcharts service restriction of
            //.too many requests
            var AJAX_CLOUD_SERVICE_DELAY = 10000;

            //var AJAX_CLOUD_SERVICE_DELAY = 1;

            var ajaxesForPromice = [];
            var counter = 0;
            runNextAjax();
            return;

            //===================================
            // //\\ delayed ajax to cloud-service
            //===================================
            function runNextAjax()
            {
                var chartRack = contCharts[counter];
                ajaxesForPromice.push(
                    $.ajax({
                        type: 'POST',
                        url: 'http://export.highcharts.com/',
                        data: JSON.stringify({
                                infile: chartRack.options,
                                b64: true,
                                constr: 'Chart',
                                scale: 2
                        }),
                        dataType: 'text',
                        contentType: "application/json"
                    })
                );
                //ccc( AJAX_CLOUD_SERVICE_DELAY + ' ' + counter + ' sent ', chartRack );
                counter++;
                if( counter < contCharts.length ) {
                    setTimeout( runNextAjax, AJAX_CLOUD_SERVICE_DELAY );
                } else {
                    runPromise();
                }              
            }
            //===================================
            // \\// delayed ajax to cloud-service
            //===================================


            function runPromise()
            {
                Promise.all( ajaxesForPromice ).then( values => {
                    values.forEach( function( value, vix ) {
                        insertImage( values[vix], vix, 'data:image/png;base64,' );
                    });        
                    continueAfterChartsLoaded();
                });        
            }
        }
        //===================================
        // \\// calls remote export
        //===================================
    }



    //========================================
    // //\\ inserts image into doc def content
    //========================================
    function insertImage( imgData, vix, datImPrefix )
    {
        datImPrefix = datImPrefix || ''
        var chartRack = contCharts[vix];

        if( chartRack.ddContRack ) {
            var insertee = chartRack.ddContRack;
        } else {
            var ix = chartRack.ddContIx;
            var colIx = chartRack.columnIx;
            if( colIx || colIx === 0 ) {
                ////charts in page's columns
                var insertee = ddCont[ ix ].columns[ colIx ];
            } else {
                ////charts in page: outside of columns
                var insertee = ddCont[ ix ];
            }
        }
        if( insertee.image ) {
            ccc( 'incorrect program behaviour: image inserts twice to ' +
                 colIx + ' ' + ix + ' former img=' + insertee.image.substring(0, 100) +
                ' new img= ' + (datImPrefix + imgData).image.substring(0, 100)
            );
        }
        insertee.image = datImPrefix + imgData;
    }
    //========================================
    // \\// inserts image into doc def content
    //========================================

}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var nheap       = ns.nheap          = ns.nheap          || {};
    var ddCont      = nheap.ddCont      = nheap.ddCont      || [];
    var ddDef       = nheap.ddDef       = nheap.ddDef       || {};
    var methods     = ns.methods        = ns.methods        || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var ccc         = window.console.log;

    methods.addTOC = addTOC;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000




    function addTOC( header, subheader )
    {
        if( header ) {
            ddCont.push(
                {   //fake component
                    text: header,
                    margin: [0, 0, 0, 0],
                    fontSize: 1,
                    bold: true,
                    color: '#fff',

			        tocItem: true,
                    //style: 'subheading',
			        tocMargin: [5, 15, 0, 0],
			        //tocStyle: { italics: true },
                    tocStyle: {color: 'black', fontSize: 13},
			        //tocNumberStyle: { italics: true, decoration: 'underline' },
                    tocNumberStyle: {color: 'black', fontSize: 13},
                }
            );
        }

        if( subheader ) {
            ddCont.push(
                {   //fake component
                    text: subheader,
                    margin: [0, 0, 0, 0],
                    fontSize: 1,
                    bold: true,
                    color: '#fff',

			        tocItem: true,
                    //style: 'subheading',
			        tocMargin: [5, 0, 0, 0],
			        //tocStyle: { italics: true },
                    tocStyle: {color: 'grey', fontSize: 13},
			        //tocNumberStyle: { italics: true, decoration: 'underline' },
                    tocNumberStyle: {color: 'grey', fontSize: 13},
                }
            );
        }
    }



}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var ddCont      = nheap.ddCont      = nheap.ddCont      || [];
    var methods     = ns.methods        = ns.methods        || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var ccc         = window.console.log;

    methods.tableTpl_2_content = tableTpl_2_content;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000








    //======================================
    // //\\ calculates main content table
    //======================================
    function prepareTableBody( rack )
    {
        var rows = rack.table;
        var caption = rack.caption;
        var columns = rack.columns;
        var widthPercent = rack.widthPercent || 100;
        var columnsWithTriangleDecoration = rack.columnsWithTriangleDecoration || {};
        var firstCellIncrease = rack.firstCellIncrease || 6;

        // //\\ composing rows
        var captions = [];
        var fieldNames = [];
        columns.forEach( function( column ) {
            var fieldName = Object.keys( column )[0];
            var fieldHeader = column[ fieldName ];
            captions.push( fieldHeader.caption );
            fieldNames.push( fieldName );
        });


        // //\\ removes meta-structure from rows
        var metaRows = [];
        //this makes rows "flat" key-value-JS-objects
        //places meta-structure into metaRows
        //very slow?
        var newBody = rows.map( function( row, ix ) {
            var isArr = Array.isArray(row);
            metaRows[ix] = isArr ? row[0] : {};
            var trueRow = isArr ? row[1] : row;
            return fieldNames.map( function( fieldName ) {
                    return trueRow[ fieldName ];
            });
        });
        // \\// removes meta-structure from rows

        //.attaches captions on top of all rows
        var body = [captions].concat( newBody );
        metaRows = [{}].concat( metaRows );
        //:table row layout
        var decorsInRaw = 3;

        var rowsCount = body.length;
        var rowCellsCount = body[0].length;
        var decorationWidth = 2;
        var rowCellWidth = ( 
            100 -
                    nheap.reportViewConf.pageMargins[3]*
                    0.20 -
                    firstCellIncrease -
                    decorsInRaw * decorationWidth ) / rowCellsCount;
        rowCellWidth *= widthPercent/100;

        var widths = [];


        //:spawning body
        var newBody = [];
        var num2commasStr = methods.putCommasToBigNumbers;
        body.forEach( function( row, ix ) {
            newBody[ ix ] = [];

            row.forEach( function( cell, cix ) {

                //---------------------------------
                // //\\ cuts extra digits after "."
                //---------------------------------
                if( typeof cell === 'number' ) {
                    var cellNumber = cell;
                    //cell = cell.toFixed(2);
                    cell = num2commasStr( cell, 2);
                }
                //---------------------------------
                // \\// cuts extra digits after "."
                //---------------------------------

                if( ix === 0 ) {
                    var newCell = {
                        text:cell,
                        //format: left,top,right,bottom:
                        border: [false, false, false, false],
                        color: '#999'
                    }
                } else if( ix === rowsCount-1 ) {
                    if( cix === 0 || cix === row.length - 1 ) {
                        var newCell = { text:cell, border: [false, false, false, false] }
                    } else {
                        var newCell = { text:cell, border: [true, true, true, false] }
                    }
                } else {
                    if( cix === 0 || cix === row.length - 1 ) {
                        var newCell = { text:cell, border: [false, true, false, true] };
                    } else {
                        var newCell = { text:cell, border: [true, true, true, true] };
                    }
                }
                if( cix === 0 ) {
                    newCell.alignment = 'left';
                } else {
                    newCell.alignment = 'right';
                }
                if( metaRows[ix].bold ) {
                    newCell.bold = true;
                    newCell.fillColor = '#eee';
                }

                newBody[ ix ].push( newCell );
                if( ix === 0 ) {
                    widths.push( rowCellWidth );
                }
                if( columnsWithTriangleDecoration[ cix+'' ] ) {
                    newBody[ ix ][ newBody[ ix ].length-1 ].border[2] = false;
                    if( ix === 0 ) {
                        newCell = {
                            text : ""
                        };
                    } else {
                        newCell = {
                            margin : [0,5.5,0,0],
                            width: 4
                        };
                        if( cellNumber===0 ) {
                            ////makes an extra cell empty
                            newCell.text = '';
                        } else {
                            ////in an extra cell,
                            ////red/green triangles which indicate loss/gain
                            var wImg = cellNumber > 0 ? 'green-triangle' : 'red-triangle';
                            newCell.image = imagesRack.loadedImages[ wImg ].dataURI;
                            newCell.margin = cellNumber > 0 ? [0,6.5,0,0] : [0,7,0,0];
                        }
                    }
                    newCell.border = ix === 0 ?
                                    [false, false, false, false] :
                                    ( cix === row.length - 1 ?
                                      [false, true, false, false] :
                                      [false, true, true, false] );

                    newBody[ ix ].push( newCell );
                    if( ix === 0 ) {
                        widths.push( decorationWidth );
                    }
                } else {
                    if( ix === 0 ) {
                        widths[ widths.length-1 ] += decorationWidth;
                    }
                }
            });
        });
        widths[0] += firstCellIncrease;
        widths = widths.map( function( width ) {
                return width.toFixed(2) + '%';
        });
        return { caption:caption, body:newBody, widths:widths };
    }
    //======================================
    // \\// calculates main content table
    //======================================


    //======================================
    // //\\ builds table content for doc def
    //======================================
    function tableTpl_2_content( tableRack )
    {
        var pholder = tableRack.contentPlaceholderToAttach || ddCont;
        var tableTpl = prepareTableBody( tableRack );
        var widths = tableTpl.widths;
        var captionFontSize = tableRack.captionFontSize || 14;
        var captionBold = !!tableRack.captionBold;

        ///if placeholder is not a stack then
        ///insert stack into it and make
        ///new stack a placeholder
        if( !Array.isArray( pholder ) ) {
            pholder = pholder.stack = [];
        }

        pholder.push(
            {
                text : tableTpl.caption,
                fontSize : captionFontSize,
                margin : tableRack.margin || [0,33, 0, 15 ],
                bold : captionBold
            }
        );

        pholder.push(
            {
                layout: {
                    hLineWidth: () => 0.01,
                    vLineWidth: () => 0.01,
                    hLineColor: '#cdcdcd',
                    vLineColor: '#cdcdcd',
    				paddingLeft: function(i, node) { return 2; },
		            paddingRight: function(i, node) { return 7; },

                    //.combined with heights
                    //.cannot be non-function?
		            paddingTop: function(i, node) {
                                    return tableRack.cellPaddingTop || 8;
                                },
		            paddingBottom: function(i, node) {
                                        return tableRack.cellPaddingBottom ||4;
                                   }
                },
                dontBreakRows: true,
                fontSize: tableRack.cellFontSize || 10,
                lineHeight: 1.4,
                color: '#333',
                table: {
                    headerRows: 1,
                    //.combined with paddingTop and paddingBottom
                    heights: tableRack.cellHeight || 11,
                    dontBreakRows: true,
                    widths : widths,
                    body:tableTpl.body
                }
            }
        );
    }
    //======================================
    // \\// builds table content for doc def
    //======================================

}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var fapp        = ns.fapp           = ns.fapp           || {};
    var fconf       = fapp.conf         = fapp.conf         || {};
    var fmethods    = fapp.methods      = fapp.methods      || {};
    var ccc         = window.console.log;


    fconf.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];


    fmethods.gainLossColor = gainLossColor;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000



    ///returns colors depending on value
    ///Input: colorX - optional: custom color for
    //                 3 colors: gain, zero, loss
    function gainLossColor( value, color1, color2, color3 )
    {
        var gain = arguments[1] || '#00aa00';
        var zero = arguments[2] || '#444444';
        var loss = arguments[3] || '#dd0000';
        if( value > 0 ) {
            return gain;
        } else if( value === 0 ) {
            return zero;
        } else {
            return loss;
        }
    
    }
    //========================================
    // \\// inserts image into doc def content
    //========================================

}) ();

( function() {
    var ns          = window.b$l        = window.b$l || {};
    var $$          = ns.$$;
    var nheap       = ns.nheap          = ns.nheap          || {};
    var methods     = ns.methods        = ns.methods        || {};
    var nsmethods   = ns.sn('methods');

    var fapp        = ns.fapp           = ns.fapp           || {};
    var fconf       = fapp.conf         = fapp.conf         || {};

    nsmethods.readDataIntoApplication = readDataIntoApplication;
    return;






    function readDataIntoApplication()
    {
        //*********************************************************************
        //If data-tree will be found in either of these locations:
        //
        //      window.$invezta_report_data
        //or
        //      nheap.content_data
        //
        //after window.onload event,
        //then no further action is needed to supply the data
        //and no ajax or other load will be performed.
        //The value of "allDataURL" will be not needed and will be ignored.
        //The data will be picked up and application executed.
        //No chages of load code will be required.
        //
        nheap.content_data = nheap.content_data || window.$invezta_report_data;
        //
        //*********************************************************************

        if( nheap.content_data ) {
            ccc( 'OK. data ported by bypassing ajax ... ' );
            ns.reportConf = nheap.content_data[ 'report-config.json' ],
            methods.start_loadImages();
        } else {            
            var fileId = 'app-data-in-one'; //todm move to conf.
            nsmethods.loadAjaxFiles(
                [ { id:fileId , link: fconf.allDataURL } ],
                //on success
                function ( loadedFilesById ) {
                    //for debug
                    //$$.c('pre').to( document.body ).ch(
                    //    $$.div().html( ajy.xml.responseText ));
                    nheap.content_data = JSON.parse( loadedFilesById[ fileId ].text  );
                    ns.reportConf = nheap.content_data[ 'report-config.json' ],
                    methods.start_loadImages();
                }
            );
        }
    }

}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var methods     = ns.methods        = ns.methods        || {};
    var nsmethods   = ns.sn('methods');

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var ddCont      = nheap.ddCont      = nheap.ddCont      || [];
    var ddDef       = nheap.ddDef       = nheap.ddDef       || {};
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];

    var fapp        = ns.fapp           = ns.fapp           || {};
    var fconf       = fapp.conf         = fapp.conf         || {};


    var ccc         = window.console.log;

    var pdfMake_is_in_busy_state = true;
    var pdfCreated = null;

    //is not fired by unknown reason:
    //window.addEventListener( "DOMContentReady", readAppData );

    window.addEventListener( "load", readAppData );
    methods.start_loadImages = start_loadImages;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000



    ///delays data reading until the name
    ///nsmethods.readDataIntoApplication is defined after
    ///"DOMContentReady" event
    function readAppData()
    {
        nsmethods.readDataIntoApplication();
    }



    //======================================
    // //\\ runs application
    //======================================
    function run_app()
    {
        putAppVersionToFrontPage();
        methods.buildDocDef();
        methods.makeChartsOptions();
        //return; //skips sending charts to cloud-service
        methods.loadCharts( function() {
            var button = document.getElementById( 'generate-pdf' );
            if( fconf.setAnOpenButton ) {
                button.addEventListener( 'click', function() {
                    ////solution works without timeout, but
                    ////this timeout does not hurt
                    setTimeout( createDoc, 1 );
                });
                button.style.opacity = "1";
                button.title = "Click to generate document";
                button.innerHTML = "Generate Report";
                pdfMake_is_in_busy_state = false;
            } else {
                pdfMake_is_in_busy_state = false;
                button.innerHTML = "Data loaded";
                button.title = "Generating document ...";
                createDoc();
            }
        })
    }
    //======================================
    // \\// runs application
    //======================================


    function putAppVersionToFrontPage()
    {
        var placeholder = document.getElementById('front-page-version-info');
        placeholder.innerHTML = 'Version 0.' + ns.fapp.version;
    }


    //===============================================
    // //\\ used in immediate load or in button click
    //
    //      can be doc reopen many times?:
    //      https://stackoverflow.com/questions/34001513/
    //           pdfmake-callback-when-export-is-finished
    //
    //===============================================
    function createDoc()
    {
        //ccc( 'knocking ...' )
        if( pdfMake_is_in_busy_state ) return;

        //---------------------------------------
        // //\\ disables button
        //---------------------------------------
        pdfMake_is_in_busy_state = true;
        var button = document.getElementById( 'generate-pdf' );
        if( button ) {
            button.style.opacity = "0.3";
            //button.style.display = 'none'; }
            button.innerHTML = "Please Wait";
        }
        //---------------------------------------
        // \\// disables button
        //---------------------------------------

        //---------------------------------------
        // //\\ doing the job
        //---------------------------------------

        //.this is a key operation which make
        //.multipe button click working
        //.creates a duplicate of document definition
        //.for case if maker will corrupt it ...
        var dup = ns.paste( {}, ddDef );
        pdfCreated = pdfMake.createPdf( dup );
        pdfCreated.open();

        //disabling browser's pop-up blocker may be vital to open() this:
        //pdfMake.createPdf(docDefinition).getDataUrl(function(url) { alert('your pdf is done'); });

        //this approach fails for multiple clicks: images get corrupt
        //pdfCreated = pdfCreated || pdfMake.createPdf( dup );

        //.https://pdfmake.github.io/docs/getting-started/client-side/methods/
        //.open( {}, window );
        //---------------------------------------
        // \\// doing the job
        //---------------------------------------

        ///solution seems works without time out, but
        ///timeout does not hurt ....
        setTimeout( function() {
            //---------------------------------------
            // //\\ enables button
            //---------------------------------------
            if( button ) {
                button.style.opacity = "1";
                button.innerHTML = "Generate Document";
                if( !fconf.setAnOpenButton ) {
                    button.style.display = 'none';
                }
            }
            pdfMake_is_in_busy_state = false;
            //---------------------------------------
            // \\// enables button
            //---------------------------------------
            },
            3000
        );
    }
    //===============================================
    // \\// used in immediate load or in button click
    //===============================================



    //======================================
    // //\\ loads images
    //======================================
    function start_loadImages()
    {
        methods.loadImages(
            function() {
                methods.getDataURI();
                run_app();
            },
            imagesRack.imgList
        );
    }
    //======================================
    // \\// loads images
    //======================================

}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var nheap       = ns.nheap          = ns.nheap          || {};
    var ddCont      = nheap.ddCont      = nheap.ddCont      || [];
    var ddDef       = nheap.ddDef       = nheap.ddDef       || {};
    var methods     = ns.methods        = ns.methods        || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var fapp        = ns.fapp           = ns.fapp           || {};
    var fconf       = fapp.conf         = fapp.conf         || {};

    var ccc         = window.console.log;

    methods.buildDocDef = buildDocDef;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    //======================================
    // //\\ builds doc Definition
    //======================================
    function buildDocDef()
    {
        prepareDocDef();
        // //\\ builds content
        methods.composeFrontPage();
        methods.composeSection1();
        methods.composeSection2();
        methods.composeSection3();
        methods.composeSection4();
        methods.composeSection5();
        methods.composeSection8();

        /*
        */
        methods.composeBottomPage();
        ddDef.content = ddCont;
        // \\//  builds content
    }
    //======================================
    // \\// builds doc Definition
    //======================================





    function prepareDocDef()
    {
        //=======================================
        // //\\ establishes app-wide current date
        //=======================================
        var tiimeStamp = new Date();
        var day = tiimeStamp.getDate();
        var fullYear = tiimeStamp.getFullYear();
        var monthNumber = tiimeStamp.getMonth();

        if( ns.reportConf[ "day-month-year" ] ) {
            ns.nheap.dateStampStr = ns.reportConf[ "day-month-year" ];
        } else {
            var month = '00' + ( monthNumber + 1 );
            month = month.substring( month.length - 2, month.length );
            ns.nheap.dateStampStr = day + '.' + month + '.' + fullYear;
        }

        var ww = ns.reportConf[ "date-monthLetters-fullYear" ];
        if( ww ) {
            ns.nheap.date_mLetters_fullY = ww;
        } else {
            ns.nheap.date_mLetters_fullY =
                day + ' ' +
                fconf.monthNames[ monthNumber ] + ' ' +
                fullYear;
        }
        //=======================================
        // \\// establishes app-wide current date
        //=======================================




        var dateFooter =
        {
            stack:
            [
                /*
                {
                    text : ns.reportConf.frontPageTitle + '. Report' + '-' +
                           ns.nheap.dateStampStr + '.',
                    fontSize : 9,
                    margin : [5,8,0,0],
                    color: "#999"
                },
                */
                {
                    text : 'RGVersion 0.' +
                           fapp.version + '.',
                    fontSize : 9,
                    margin : [5,18,0,0],
                    color: "#999"
                }
            ]
        };



        ns.prop2prop( ddDef, 
        {
            pageOrientation: 'landscape',
            pageSize: 'A4',
            pageMargins: nheap.reportViewConf.pageMargins,
            footer: function( currentPage, pageCount )
            {
                //currentPage counts from 1 ...
                if( currentPage > 1 && currentPage < pageCount ) {
                    var footer =
                    {
                      columns:
                      [
                            dateFooter,
                            {
                                text : ''+currentPage,
                                fontSize : 13,
                                alignment: 'right', margin: [20, 10],
                                color: "#555"
                            }
                      ],
                      margin : [20,0,0,15]
                    };
                } else {
                    var footer =
                    {
                    };
                }
                return footer;
            }
        });
    }

}) ();

//==========================================
// //\\ CONFIGURATION
//      we are not sure how config
//      is set up on the server
//      side, so resorted to
//      this hard-coded config
//      file
//==========================================

( function() {
    var ns          = window.b$l        = window.b$l || {};
    var $$          = ns.$$;
    var nheap       = ns.nheap          = ns.nheap          || {};
    var methods     = ns.methods        = ns.methods        || {};
    var nsmethods   = ns.sn('methods');

    var fapp        = ns.fapp           = ns.fapp           || {};
    var fconf       = fapp.conf         = fapp.conf         || {};


    //options: comment / uncomment "option" alternatively:
    fconf.setAnOpenButton = !false;
    //var option = 'run immediately';


    //******************************************************************
    // data URL configuration
    //==================================================================
    //
    //1.
    //gets all the data in one file from folder-tree
    //uses PHP script and folder traverser
    fconf.allDataURL = 'app-data-in-folder/app-data-in-one-file.php';
    //
    //2.
    //uses preassembled single JSON file
    //fconf.allDataURL = 'app-data-in-one-file/app-data-in-one-file.json';
    //******************************************************************

    //need ns.ajax for this if "false"
    fconf.EXPORT_CHARTS_2_IMAGES_LOCALLY = true;

}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var nheap       = ns.nheap          = ns.nheap          || {};
    var fapp        = ns.fapp           = ns.fapp           || {};
    var fmethods    = fapp.methods      = fapp.methods      || {};

    var ccc         = window.console.log;

    fmethods.layt = layt;
    fmethods.initTopPaneCell = initTopPaneCell;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000






    //==============================        
    // //\\ tablifier
    //==============================
    ///Input: see API below
    function layt( lpars )
    {
        // //\\ API
        var margin  = lpars.margin || [0,0,0,0];
        var widths  = lpars.widths;
        var pads    = lpars.pads || { left:0, top:0, right:0, bottom:0 };
        var borders = lpars.borders;
        var borderPattern = lpars.borderPattern; 
        var aligns  = lpars.aligns;
        var alignment = lpars.alignment || 'left';
        var cols    = lpars.cols || 1;
        var rows    = lpars.rows || 1;
        var bordCol = lpars.bordCol || '#aaa';
        var color   = lpars.color || 'black';
        var body    = lpars.body;
        var fontSize = lpars.fontSize;

        //.vital parameter: can prevent cell height to shrink
        var heights = lpars.heights || 50;

        // \\// API
        var noBorders = [false, false, false, false];
        body = body || [];
        for( var rix=0; rix<rows; rix++ ) {
            body[rix] = body[rix] || [];
            for( var cix=0; cix<cols; cix++ ) {
                var bb = body[rix][cix] = body[rix][cix] || {};
                bb.border = ( borders && borders[rix][cix] ) || borderPattern || noBorders;
                bb.alignment = ( aligns && aligns[rix][cix] ) || alignment;
            }
        }

        var tblRack = {
            cells : cellsIterator,
            tbl : {
                layout: {
                    hLineWidth: () => 0.01,
                    vLineWidth: () => 0.01,
                    hLineColor: bordCol,
                    vLineColor: bordCol,
				    paddingLeft: function(i, node) { return pads.left; },
	                paddingRight: function(i, node) { return pads.right; },

                    //.mixes with heights
                    //.cannot be non-function?
	                paddingTop: function(i, node) { return pads.top;},

	                paddingBottom: function(i, node) {return pads.bottom;}
                },
                dontBreakRows: true,
                fontSize: fontSize,
                lineHeight: 1.4,
                color: color,
                margin: margin,
                table: {
                    headerRows: 1,
                    heights: heights,
                    dontBreakRows: true,
                    widths: widths,
                    body: body
                }
            },
            body:body
        }
        return tblRack;

        function cellsIterator( fun )
        {
            for( var rix=0; rix<rows; rix++ ) {
                for( var cix=0; cix<cols; cix++ ) {
                    fun( body[rix][cix], rix, cix, lpars );
                }
            }
            return tblRack;
        }
    }
    //==============================        
    // \\// tablifier
    //==============================


    //==============================        
    // //\\ master cell
    //==============================
    function initTopPaneCell( title )
    {
        return [
            {
                text: title
                ,bold: true
                ,fontSize: 14
                ,margin: [16,15,0,0]
                ,color: nheap.companyColors.blue_master
            }
        ];
    }
    //==============================        
    // \\// master cell
    //==============================



}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var nheap       = ns.nheap          = ns.nheap          || {};

    nheap.reportViewConf = { pageMargins: [ 0, 15, 0, 0 ] };
    nheap.companyColors =
    {
        blue_master : '#1d1f42'
        ,orange_master : '#e67437'
        ,violet_master : '#443895'
        ,orange : '#e67028'
        ,yellow : '#ffc709'
        ,orange_grey : '#b18731'
        ,green : '#5a853b'

        //ring chart colors
        ,pink_liter : '#fdd2b9'
        ,pink_lite : '#f3ba8f'

        //table colors
        ,red : '#c5283d'
    };

}) ();


( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};


    //================================================
    // //\\ images to import from computer file system
    //================================================
    imagesRack.imgList =
    [
        {
            src:"img/title-page-1000x.png",
            id:'front-page-image'
        }
        ,{ 
            src:"img/bottom-page-no-text-1000x.png",
            id:'bottom-page'
        }
        ,{ 
            src:"img/page-header.png",
            id:'page-header'
        }
        ,{ 
            src:"img/summary-table00.png",
            id:'summary-table00'
        }
    ];
    //================================================
    // \\// images to import from computer file system
    //================================================

}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var ddCont      = nheap.ddCont      = nheap.ddCont      || [];
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;

    methods.composeFrontPage = composeFrontPage;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeFrontPage()
    {
        buildFrontImage();
        ddCont[ ddCont.length - 1 ].pageBreak = 'after';
    }    



    //==============================        
    // //\\ 
    //==============================
    function buildFrontImage()
    {
        ddCont.push(
            {
                image: imagesRack.loadedImages[ 'front-page-image' ].dataURI,
                //fit: [877.0, 900.0],
                width: 844,
                absolutePosition: {
                  x: 0,
                  y: 0
                }
            }
        );
        ddCont.push(
        {
            columns :
            [
                {
                    stack: [
                        {   text: ns.reportConf["report-time-span"],
                            margin: [ 30, 0, 0, 0 ],
                            fontSize: 11
                        },
                        {   text: "Print Date: " + ns.nheap.date_mLetters_fullY,
                            margin: [ 30, 4, 0, 0 ],
                            fontSize: 11
                        },

                        {   text: ns.reportConf.frontPageTitle,
                            fontSize: 22,
                            margin: [ 30, 55, 0, 0 ],
                            color: '#fa0',
                            bold: true
                        }
                    ],
                    margin: [ 77, 210, 0, 0 ],
                    color: '#fff'
                }
            ]
        });
    }
    //==============================        
    // \\// 
    //==============================


}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var ddCont      = nheap.ddCont      = nheap.ddCont      || [];
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;

    methods.composeBottomPage = composeBottomPage;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeBottomPage()
    {
        buildBottomPage();
        //ddCont[ ddCont.length - 1 ].pageBreak = 'after';
    }    



    //==============================        
    // //\\ 
    //==============================
    function buildBottomPage()
    {
        ddCont.push(
            {
                image: imagesRack.loadedImages[ 'bottom-page' ].dataURI,
                //fit: [877.0, 900.0],
                width: 844,
                absolutePosition: {
                  x: 0,
                  y: 0
                }
            }
        );

        var contentLines = ns.reportConf[ "final-page-text" ]
                //needed if not yet split: .split(/\r\n|\n|\r/)
                .map( str => {
                    str = str.replace( /^\s*|\s*$/g, '' );
                    return {
                        text:str,
                        margin: [ 30, 2, 0, 0 ]
                    };
                });        
        ddCont.push(
        {
            stack : contentLines,
            margin: [ 184, 368, 0, 0 ],
            fontSize: 9,
            color: '#fff'
        });
    }
    //==============================        
    // \\// 
    //==============================


}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};

    var fapp        = ns.fapp           = ns.fapp           || {};
    var fm          = fapp.methods      = fapp.methods      || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var ddCont      = nheap.ddCont      = nheap.ddCont      || [];
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;


    methods.composeSection1 = composeSection1;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection1()
    {


        // //\\ config
        var tconf =
        {
            compCol :
            {
                "Equity" : nheap.companyColors['orange_master'],
                "Debt"   : nheap.companyColors['yellow'],
                "Cash & Cash Equivalents" : nheap.companyColors['green'],
                "Real Estate" : nheap.companyColors['blue_master'],
            }
        };
        // \\// config



        methods.addTOC( "Portfolio Summary", "Overall Summary" )
        addHeader( 'Portfolio Snapshot' );

        //==============================        
        // //\\ master placeholder
        //==============================
        ddCont.push(
            fm.layt({
                margin  : [ 0,15,0,0 ],
                widths  : [ '50%', '50%' ],
                pads    : { left:2, top:8, right:7, bottom:4 },
                borders :
                [
                    [ [false, false, true, true ], [true, false, false, false] ],
                    [ [false, true, true, false ], [true, true, false, false] ]
                ],
                cols    : 2,
                rows    : 2,
                bordCol : '#aaa',
                color: nheap.companyColors.blue_master,
                body :
                [
                    [fm.section1LeftTop(),      fm.section1RightTop( null, tconf )],
                    [fm.section1LeftBottom(),   fm.section1RightBottom( null, tconf )]
                ]
            }).tbl
        );
        ddCont[ ddCont.length - 1 ].pageBreak = 'after';
        //==============================        
        // \\// master placeholder
        //==============================
    }




    //==============================        
    // //\\ header
    //==============================
    function addHeader( ptitle )
    {
        ddCont.push(
            {
                image: imagesRack.loadedImages[ 'page-header' ].dataURI,
                width: 844,
                absolutePosition: {
                  x: 0,
                  y: 0
                }
            }
        );

        ddCont.push(
            //header: no dice for classic header:
            {   
                text: ptitle,
                margin: [20, 0, 40, 30],
                color: '#fff',
                fontSize: 26,
                bold: true
            }
        );
    }
    //==============================        
    // \\// header
    //==============================



}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};
    var fapp        = ns.fapp           = ns.fapp           || {};
    var fmethods    = fapp.methods      = fapp.methods      || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;

    fmethods.section1LeftTop = section1LeftTop;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000



    ///==============================        
    /// //\\ cell 00
    ///==============================
    function section1LeftTop( placeholder )
    {
        var ph = placeholder || {};

        ph.stack = fmethods.initTopPaneCell( "Summary" );
        ph.stack[1] = {
                image: imagesRack.loadedImages[ 'summary-table00' ].dataURI
                //fit: [444.0, 333.0],
                ,width: 400
                ,margin: [10,10,20,0]
        };
        ///just a filler ... poor design
        ph.stack[2] = {
                text: " "
                ,margin: [0,0,0, 0]

        };

        ///table00-contents
        var JSONrecord = nheap.content_data
                    [ "Page 1" ]
                    [ "OverallPortfolio.txt" ]
                    [ "OverAllPortfolio" ]
                    [ 0 ];
        /*
        :[
        {
         "CURRENT_VALUE":1124.081205,
         "INVESTED_AMOUNT":1013.564488,
         "GAINLOSS":112.48128,
         "UNREALISEDGAINLOSS":110.516716,
         "REALISEDGAINLOSS":3.7530829183,
         "DIVIDEND":-1.788519752,
         "IRR":148.7088080024194,
         "BMIRR":-84.87343195817056
        }
        */
        var num2commasStr = methods.putCommasToBigNumbers;

        [ "INVESTED_AMOUNT", "CURRENT_VALUE", "GAINLOSS", "IRR", "BMIRR" ].forEach( ( fieldName, ix ) => {
            var guiRow = Math.floor( ix/3 );
            var cell = ph.stack[3+ix] = {
                    text: methods.putCommasToBigNumbers( JSONrecord[ fieldName ], 2 ) +
                          ( guiRow ? '%' : '' )
                    ,fontSize: 20
                    ,bold: true
                    //,margin: [0,10,0, 0]
                    ,absolutePosition: {
                      x: 45 + (ix%3)*142 + (ix===2 ? -4 : 0),
                      y: 80 + Math.floor( ix/3 )*73
                    }
            };
            if( "GAINLOSS" === fieldName ) {
                cell.color = fmethods.gainLossColor( JSONrecord[ fieldName ] );
            }
        });

        var fValue = JSONrecord[ "REALISEDGAINLOSS" ];
        ph.stack[8] =
        {
            text: methods.putCommasToBigNumbers( fValue, 2 )
            ,fontSize: 7
            ,color: fmethods.gainLossColor( fValue, null, '#888' )
            ,bold: false
            ,absolutePosition: {
              x: 45 + 325,
              y: 80 + 62
            }
        };


        var fValue = JSONrecord[ "UNREALISEDGAINLOSS" ];
        ph.stack[9] =
        {
            text: methods.putCommasToBigNumbers( fValue, 2 )
            ,fontSize: 7
            ,color: '#888'
            ,bold: false
            ,absolutePosition: {
              x: 45 + 333,
              y: 80 + 74
            }
        };

        var fValue = JSONrecord[ "DIVIDEND" ];
        ph.stack[10] =
        {
            text: methods.putCommasToBigNumbers( fValue, 2 )
            ,fontSize: 7
            ,color: fmethods.gainLossColor( fValue, null, '#888' )
            ,bold: false
            ,absolutePosition: {
              x: 45 + 319,
              y: 80 + 85
            }
        };
        return ph;
    }
    ///==============================        
    /// \\// cell 00
    ///==============================


}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};
    var fapp        = ns.fapp           = ns.fapp           || {};
    var fmethods    = fapp.methods      = fapp.methods      || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;

    fmethods.section1RightTop = section1RightTop;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000







    ///==============================        
    /// //\\ pane 01
    ///==============================
    function section1RightTop( placeholder, tconf )
    {
        placeholder = placeholder || {};
        placeholder.stack = fmethods.initTopPaneCell( "Asset Allocation" );

        var JSONrecord = nheap.content_data
                    [ "Page 1" ]
                    [ "OverallAllocation.txt" ]
                    [ "OVERALL_ALLOCATION" ];


        //------------------
        // //\\ chart legend
        //------------------
        var compCol = tconf.compCol;
        var colors    = JSONrecord.map( row => compCol[ row.ASSET ] );
        var chartData = JSONrecord.map( row => ({ name:row.ASSET, y:row.WEIGHT }) );
        var tBody = [];
        JSONrecord.forEach( (row,rix) => {
            var ix = rix%2;
            var iy = ( rix - ix ) /2;
            tBody[iy] = tBody[iy] || [];

            //----------------------------------------
            // //\\ tedious alignments of legend cells
            //----------------------------------------
            tBody[iy][2*ix] = { image:methods.getLabelImage({
                                    shape:'bar', color:compCol[ row.ASSET ]
                                }),
                                fit:[8,8],
                                alignment:'left',
                                //.second row top margin for even vert. layout
                                margin:[ 0, iy?6:6, 0, 0]
                              };
            tBody[iy][2*ix+1] = [
                { text:row.WEIGHT.toFixed(2)+'%', fontSize:11, color:'black', bold:true,
                  alignment:'left',
                  //.second row top margin for even vert. layout
                  margin:[ 0, iy?0:0, 0, 0],
                  lineHeight:1
                },
                { text:row.ASSET.substring(0,14), color:'#666', alignment:'left', margin:[0,0,0,0], 
                  lineHeight:1
                }
            ];
            //----------------------------------------
            // \\// tedious alignments of legend cells
            //----------------------------------------

        });
        //------------------
        // \\// chart legend
        //------------------



        //==============================
        // //\\ chart
        //==============================
        var chartPlaceholder = {
                //image: will come from export 
                fit:[110,110],
                margin: [10,5,0,0]
        };

        placeholder.stack[1] = fmethods.layt({
            margin  : [0,0,0,0],
            widths  : [ '37%', '63%' ],
            pads    : { left:0, top:20, right:0, bottom:0 },
            cols    : 2,
            body    : [[ 
                          chartPlaceholder,
                          fmethods.layt({
                            margin  : [20,20,0,0],
                            widths: [ '10%', '30%', '10%', '40%' ],
                            cols    : 4,
                            rows    : 2,
                            fontSize: 9,
                            bordCol : '#fff',
                            body    : tBody
                         }).tbl
                      ]]
        }).tbl;

        contCharts.push({ 
            ddContRack  : chartPlaceholder,
            //---------------------------
            // //\\ chart options
            //---------------------------
            options :
            {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                    ,width: 460
                    ,height: 460
                },

                "exporting": {
                    "enabled": false
                },
                "credits": {
                    "enabled": false
                },
    
               legend: {
                    enabled: false,
                },

                title: {
                    text: ''
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: false
                        },
                        colors : colors,
                        showInLegend: true
                    },
                    series: {
                        animation: false
                    }
                },
                series: [{
                    colorByPoint: true,
                    type: 'pie',
                    innerSize: '83%',
                    data: chartData
                }]
            }
            //---------------------------
            // \\// chart options
            //---------------------------
        });
        //==============================
        // \\// chart
        //==============================



        return placeholder;
    }
    ///==============================        
    /// \\// pane 01
    ///==============================



}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};
    var fapp        = ns.fapp           = ns.fapp           || {};
    var fconf       = fapp.conf         = fapp.conf         || {};
    var fmethods    = fapp.methods      = fapp.methods      || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;

    fmethods.section1LeftBottom = section1LeftBottom;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000







    ///==============================        
    /// //\\ pane
    ///==============================
    function section1LeftBottom( placeholder )
    {
        placeholder = placeholder || {};
        placeholder.stack = fmethods.initTopPaneCell( "Portfolio Timelines" );

        var JSONrecords = nheap.content_data
                [ "Page 1" ]
                [ "PortfolioTimeline.txt" ]
                [ "EvolutionOfPortfolio" ];
        /*
           "EvolutionOfPortfolio":[
            {
                 "FAMILY_ID":5851,
                 "DATE":"08/12/17",
                 "MARKET_VALUE":73.82,
                 "BMXIRR":0,
                 "PXIRR":15.07
            }
        */

        //------------------------------
        // //\\ prepares data and labels
        //------------------------------
        var xAxis_categories = [];
        //.first column
        portfolioData = JSONrecords.map( (row,rix) => {
            var dt = new Date( row[ "DATE" ] );
            xAxis_categories.push( fconf.monthNames[ dt.getMonth() ] + '-' + 
                                   ( dt.getFullYear()%100 ) );
            return [ rix, row.PXIRR ];
        });
        //.second column
        benchmarkData = JSONrecords.map( (row,rix) => [ rix, row.BMXIRR ] );
        //.spline
        marketValueData = JSONrecords.map( (row,rix) => [ rix, row.MARKET_VALUE ] );
        var wwc = nheap.companyColors;
        var colors = [wwc.blue_master, wwc.yellow, wwc.orange_master];
        //------------------------------
        // \\// prepares data and labels
        //------------------------------







        //==============================
        // //\\ chart
        //==============================
        var chartPlaceholder = {
                //image: will come from export 
                //width: 350,
                fit:[ 380, 190 ],
                margin: [10,0,0,0]
        };
        placeholder.stack[1] = chartPlaceholder;

        contCharts.push({ 
            ddContRack  : chartPlaceholder,
            //---------------------------
            // //\\ chart options
            //---------------------------
            options :
            {
                chart: {
                    plotBackgroundColor: null
                    ,plotBorderWidth: null
                    ,plotShadow: false
                    ,width: 720
                    ,height: 360
                },
                "exporting": {
                    "enabled": false
                },
                "credits": {
                    "enabled": false
                },
                colors : colors,
    
                legend: {
                    enabled: true,
                    layout: 'horizontal',
                    backgroundColor: '#FFFFFF',
                    align: 'center',
                    verticalAlign: 'top',
                    symbolHeight: 12,
                    symbolWidth: 12,
                    symbolRadius: 0
                },

                title: {
                    text: ''
                },
                plotOptions: {
                    spline: {
                        dataLabels: {
                            enabled: true
                        },
                        showInLegend: true
                    },
                    column: {
                        dataLabels: {
                            enabled: true
                        },
                        showInLegend: true
                    },
                    series: {
                        animation: false
                    }
                },
                xAxis : {
                    visible:true,
                    tickLength: 0,
                    categories: xAxis_categories,
                    labels: {
                        enabled:true
                    },
                    title: {
                        enabled:true
                    }
                },
                yAxis : [
                    {
                        visible: true,
                        title: {
                            text : 'Returns',
                            enabled:true
                        }
                    },
                    {
                        visible: true,
                        opposite: true,
                        title: {
                            text : 'Market Value',
                            enabled:true
                        }
                    }
                ],

                series: [
                    {
                        name: 'Portfolio',
                        type: 'column',
                        yAxis: 0,
                        data: portfolioData
                    },
                    {
                        name: 'Benchmark',
                        type: 'column',
                        data: benchmarkData
                    },
                    {
                        name: 'Market Value',
                        type: 'spline',
                        yAxis: 1,
                        //no dice: does not make symbol a bar: legendIndex:2,
                        data: marketValueData
                    }
                ]
            }
            //---------------------------
            // \\// chart options
            //---------------------------
        });
        //==============================
        // \\// chart
        //==============================
        return placeholder;
    }
    ///==============================        
    /// \\// pane
    ///==============================



}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};
    var fapp        = ns.fapp           = ns.fapp           || {};
    var fconf       = fapp.conf         = fapp.conf         || {};
    var fmethods    = fapp.methods      = fapp.methods      || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;

    fmethods.section1RightBottom = section1RightBottom;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000







    ///==============================        
    /// //\\ pane
    ///==============================
    function section1RightBottom( placeholder, tconf )
    {
        placeholder = placeholder || {};
        placeholder.stack = fmethods.initTopPaneCell( "Quarter Wise Allocation" );
        var compCol = tconf.compCol;

        var JSONrecords = nheap.content_data
                [ "Page 1" ]
                [ "QuarterWiseAllocation.txt" ]
                [ "PortfolioChanges" ];


        //------------------------------
        // //\\ prepares data and labels
        //------------------------------
        var assNames = JSONrecords.map ( rec => rec.ASSET );
        var xAxis_categories = JSONrecords[0].data.map( rec => rec[0] );
        var wwc = nheap.companyColors;
        var colors = assNames.map( aname => compCol[ aname ] ); 
        //------------------------------
        // \\// prepares data and labels
        //------------------------------




        //==============================
        // //\\ chart
        //==============================
        var chartPlaceholder = {
                //image: will come from export 
                //width: 350,
                fit:[ 380, 190 ],
                margin: [10,0,0,0]
        };
        placeholder.stack[1] = chartPlaceholder;

        contCharts.push({ 
            ddContRack  : chartPlaceholder,
            //---------------------------
            // //\\ chart options
            //---------------------------
            options :
            {
                chart: {
                    plotBackgroundColor: null
                    ,plotBorderWidth: null
                    ,plotShadow: false
                    ,width: 720
                    ,height: 360
                },
                "exporting": {
                    "enabled": false
                },
                "credits": {
                    "enabled": false
                },
                colors : colors,
    
                legend: {
                    enabled: true,
                    layout: 'horizontal',
                    backgroundColor: '#FFFFFF',
                    align: 'center',
                    verticalAlign: 'top',
                    symbolHeight: 12,
                    symbolWidth: 12,
                    symbolRadius: 0
                },

                title: {
                    text: ''
                },
                plotOptions: {
                    spline: {
                        dataLabels: {
                            enabled: true
                        },
                        showInLegend: true
                    },
                    column: {
                        dataLabels: {
                            enabled: true
                        },
                        showInLegend: true
                    },
                    series: {
                        animation: false
                    }
                },
                xAxis : {
                    visible:true,
                    tickLength: 0,
                    categories: xAxis_categories,
                    labels: {
                        enabled:true
                    },
                    title: {
                        enabled:true
                    }
                },
                yAxis : [
                    {
                        visible: true,
                        title: {
                            text : 'Returns',
                            enabled:true
                        }
                    },
                    {
                        visible: true,
                        opposite: true,
                        title: {
                            text : 'Market Value',
                            enabled:true
                        }
                    }
                ],

                series: [
                    {
                        name: assNames[0],
                        type: 'bar',
                        yAxis: 0,
                        data: JSONrecords[0].data
                    },
                    {
                        name: assNames[1],
                        type: 'bar',
                        data: JSONrecords[1].data
                    },
                    {
                        name: assNames[2],
                        type: 'bar',
                        yAxis: 1,
                        data: JSONrecords[2].data
                    },
                    {
                        name: assNames[3],
                        type: 'bar',
                        yAxis: 1,
                        data: JSONrecords[3].data
                    }
                ]
            }
            //---------------------------
            // \\// chart options
            //---------------------------
        });
        //==============================
        // \\// chart
        //==============================
        return placeholder;
    }
    ///==============================        
    /// \\// pane
    ///==============================



}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};

    var fapp        = ns.fapp           = ns.fapp           || {};
    var fm          = fapp.methods      = fapp.methods      || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var ddCont      = nheap.ddCont      = nheap.ddCont      || [];
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;


    methods.composeSection2 = composeSection2;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000






    ///==============================        
    /// composer
    ///==============================
    function composeSection2()
    {

        methods.addTOC( "Portfolio Summary", "Top5" )
        addHeader( 'Portfolio Summary' );

        //==============================        
        // //\\ master placeholder
        //==============================
        var built = 
            fm.layt({
                margin  : [ 0,0,0,0 ],
                widths  : [ '50%', '50%' ],
                pads    : { left:10, top:8, right:7, bottom:4 },
                borders :
                [
                    [ [false, false, true, true ], [true, false, false, false] ],
                    [ [false, true, true, false ], [true, true, false, false] ]
                ],
                cols    : 2,
                rows    : 2,
                bordCol : '#aaa',
                color: nheap.companyColors.blue_master,
                body: null
                /* 
                [
                    //:good test
                    // [ { text:'tt' }, { text:'tt' } ],
                    // [ { text:'tt' }, { text:'tt' } ]

                    [ {},   {} ],
                    [ {},   { text:'tt' }]
                ]
                */
            }).tbl;
        ddCont.push( built );

        buildTopLeftTable( built.table.body[0][0] );
        buildTopRightTable( built.table.body[0][1] )
        buildBottomLeftTable( built.table.body[1][0] )
        buildBottomRightTable( built.table.body[1][1] )


        ddCont[ ddCont.length - 1 ].pageBreak = 'after';
        //==============================        
        // \\// master placeholder
        //==============================
    }




    function buildBottomRightTable( ownPlaceholder )
    {

        var stack = ownPlaceholder.stack = [{},{}];

        // //\\ upper table
        var clmNames = [ "Issuer", "Contribution", "IRR", "Benchmark IRR", "Benchmark" ];
        var keyNames = [ "EQUITY", "CONTRIBUTION", "PIRR", "BMIRR", "INDEX_NAME" ];
        var JSONrecords = nheap.content_data
                [ "Page 2" ]
                [ "EquityPerformers&DebtPerformaers.txt" ]
                [ "TopBottomPerformerTopTenFixedIncome" ].concat([]);
        JSONrecords.length = 3;
        var columnsMeta = keyNames.map( (kn,kix) => {
                var mt = {};
                mt[kn] = { caption:clmNames[kix] };
                return mt;
        });

        methods.tableTpl_2_content({
                contentPlaceholderToAttach : stack[0],
                table : JSONrecords,
                caption : "Debt Performers. Top 3.",
                cellPaddingTop : 1,
                cellPaddingBottom : 1,
                cellFontSize:7,
                widthPercent: 85,
                margin : [0, 0, 0, 0], //above caption
                firstCellIncrease : 23, //%
                captionFontSize : 12,
                captionBold : true,
                columns : columnsMeta
        });
        // \\// upper table


        // //\\ lower table
        var clmNames = [ "Issuer", "Contribution", "IRR", "Benchmark IRR", "Benchmark" ];
        var keyNames = [ "EQUITY", "CONTRIBUTION", "PIRR", "BMIRR", "INDEX_NAME" ];
        var JSONrecords = nheap.content_data
                [ "Page 2" ]
                [ "EquityPerformers&DebtPerformaers.txt" ]
                [ "TopBottomPerformerBottomTenFixedIncome" ].concat([]);
        JSONrecords.length = 3;
        var columnsMeta = keyNames.map( (kn,kix) => {
                var mt = {};
                mt[kn] = { caption:clmNames[kix] };
                return mt;
        });

        methods.tableTpl_2_content({
                contentPlaceholderToAttach : stack[1],
                table : JSONrecords,
                caption : "Debt Performers. Bottom 3.",
                cellPaddingTop : 1,
                cellPaddingBottom : 1,
                cellFontSize:7,
                widthPercent: 85,
                margin : [0, 0, 0, 0], //above caption
                firstCellIncrease : 23, //%
                captionFontSize : 12,
                captionBold : true,
                columns : columnsMeta
        });
        // \\// lower table
    }





    function buildBottomLeftTable( ownPlaceholder )
    {

        var stack = ownPlaceholder.stack = [{},{}];

        // //\\ upper table
        var clmNames = [ "Issuer", "Contribution", "IRR", "Benchmark IRR", "Benchmark" ];
        var keyNames = [ "EQUITY", "CONTRIBUTION", "PIRR", "BMIRR", "INDEX_NAME" ];
        var JSONrecords = nheap.content_data
                [ "Page 2" ]
                [ "EquityPerformers&DebtPerformaers.txt" ]
                [ "TopBottomPerformerTopTenEquity" ].concat([]);
        JSONrecords.length = 3;
        var columnsMeta = keyNames.map( (kn,kix) => {
                var mt = {};
                mt[kn] = { caption:clmNames[kix] };
                return mt;
        });

        methods.tableTpl_2_content({
                contentPlaceholderToAttach : stack[0],
                table : JSONrecords,
                caption : "Equity Performers. Top 3.",
                cellPaddingTop : 1,
                cellPaddingBottom : 1,
                cellFontSize:7,
                widthPercent: 85,
                margin : [0, 0, 0, 0], //above caption
                firstCellIncrease : 23, //%
                captionFontSize : 12,
                captionBold : true,
                columns : columnsMeta
        });
        // \\// upper table


        // //\\ lower table
        var clmNames = [ "Issuer", "Contribution", "IRR", "Benchmark IRR", "Benchmark" ];
        var keyNames = [ "EQUITY", "CONTRIBUTION", "PIRR", "BMIRR", "INDEX_NAME" ];
        var JSONrecords = nheap.content_data
                [ "Page 2" ]
                [ "EquityPerformers&DebtPerformaers.txt" ]
                [ "TopBottomPerformerBottomTenEquity" ].concat([]);
        JSONrecords.length = 3;
        var columnsMeta = keyNames.map( (kn,kix) => {
                var mt = {};
                mt[kn] = { caption:clmNames[kix] };
                return mt;
        });

        methods.tableTpl_2_content({
                contentPlaceholderToAttach : stack[1],
                table : JSONrecords,
                caption : "Equity Performers. Bottom 3.",
                cellPaddingTop : 1,
                cellPaddingBottom : 1,
                cellFontSize:7,
                widthPercent: 85,
                margin : [0, 0, 0, 0], //above caption
                firstCellIncrease : 23, //%
                captionFontSize : 12,
                captionBold : true,
                columns : columnsMeta
        });
        // \\// lower table
    }




    function buildTopRightTable( ownPlaceholder )
    {
        var clmNames = [ "Issuer", "Amount", "Weight %" ];
        var keyNames = [ "ISSUER", "Amount", "Weight" ];
        var JSONrecords = nheap.content_data
                [ "Page 2" ]
                [ "TopAMC&FundManagers&TopIssuers.txt" ]
                [ "TopTIssuer" ];
        var columnsMeta = keyNames.map( (kn,kix) => {
                var mt = {};
                mt[kn] = { caption:clmNames[kix] };
                return mt;
        });

        methods.tableTpl_2_content({
                contentPlaceholderToAttach : ownPlaceholder,
                table : JSONrecords,
                caption : "Top 5 Issuers",
                cellPaddingTop : 1,
                cellPaddingBottom : 1,
                cellFontSize:7,
                widthPercent: 85,
                margin : [0, 0, 0, 0], //above caption
                firstCellIncrease : 23, //%
                captionFontSize : 12,
                captionBold : true,
                columns : columnsMeta
        });
    }



    function buildTopLeftTable( ownPlaceholder )
    {
        var clmNames = [ "Fund Manager/AMC", "Equity %", "Debt %",
                         "Real Estate %", "Amount", "Weight %" ];
        var keyNames = [ "ADVISOR", "Equity", "Debt", "RealEstate",
                         "Amount", "Weight" ];
        var JSONrecords = nheap.content_data
                [ "Page 2" ]
                [ "TopAMC&FundManagers&TopIssuers.txt" ]
                [ "TopTAmc" ];
        var columnsMeta = keyNames.map( (kn,kix) => {
                var mt = {};
                mt[kn] = { caption:clmNames[kix] };
                return mt;
        });

        methods.tableTpl_2_content({
                contentPlaceholderToAttach : ownPlaceholder,
                table : JSONrecords,
                caption : "Top 5 AMC/Fund Managers",
                cellPaddingTop : 1,
                cellPaddingBottom : 1,
                cellFontSize:7,
                widthPercent: 85,
                margin : [0, 0, 0, 0], //above caption
                firstCellIncrease : 23, //%
                captionFontSize : 12,
                captionBold : true,
                columns : columnsMeta
        });


        //===============================
        // //\\ alternative table usage
        //===============================
        /*
        //fails: ?bs of data
        var captionsRow = clmNames.map( cell => ({ text:cell }) );
        var bodyRows    = JSONrecords.map( rec =>
                            keyNames.map( kname => ({ text:''+rec[ kname ] }) )
                        );
        var widths = clmNames.map( cell => (100/clmNames.length).toFixed(2) + '%' );
        var rows = [captionsRow].concat( bodyRows );
        //ccc("rows=", rows )
        var tbBuilt = fm.layt({
                margin  : [ 0,15,0,0 ],
                //widths  : widths,
                pads    : { left:2, top:8, right:7, bottom:4 },
                borders : null,
                borderPattern : [true, true, true, true],
                cols    : clmNames.length,
                rows    : rows.length,
                bordCol : '#aaa',
                color: nheap.companyColors.blue_master,
                body : rows
        }).tbl;
        ccc( 'tbBuilt=', tbBuilt );
        //return tbBuilt;
        */
        //===============================
        // \\// alternative table usage
        //===============================
    }







    //==============================        
    // //\\ header
    //==============================
    function addHeader( ptitle )
    {
        ddCont.push(
            {
                image: imagesRack.loadedImages[ 'page-header' ].dataURI,
                width: 844,
                absolutePosition: {
                  x: 0,
                  y: 0
                }
            }
        );

        ddCont.push(
            //header: no dice for classic header:
            {   
                text: ptitle,
                margin: [20, 0, 40, 30],
                color: '#fff',
                fontSize: 26,
                bold: true
            }
        );
    }
    //==============================        
    // \\// header
    //==============================



}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};

    var fapp        = ns.fapp           = ns.fapp           || {};
    var fm          = fapp.methods      = fapp.methods      || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var ddCont      = nheap.ddCont      = nheap.ddCont      || [];
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;


    methods.composeSection3 = composeSection3;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000






    ///==============================        
    /// composer
    ///==============================
    function composeSection3()
    {

        methods.addTOC( "Equity Portfolio", "Four panes" )
        addHeader( 'Equity Portfolio' );

        //==============================        
        // //\\ master placeholders
        //==============================
        var built = 
            fm.layt({
                margin  : [ 0,0,0,0 ],
                widths  : [ '70%', '30%' ],
                pads    : { left:10, top:8, right:7, bottom:4 },
                borders :
                [
                    [ [false, false, true, true ], [true, false, false, false] ]
                ],
                cols    : 2,
                bordCol : '#aaa',
                color: nheap.companyColors.blue_master,
                body: null
            }).tbl;
        ddCont.push( built );

        buildTopLeftTable( built.table.body[0][0] );
        buildTopRightTable( built.table.body[0][1] )


        var built = 
            fm.layt({
                margin  : [ 0,0,0,0 ],
                widths  : [ '30%', '70%' ],
                pads    : { left:10, top:8, right:7, bottom:4 },
                borders :
                [
                    [ [false, false, true, true ], [true, false, false, false] ]
                ],
                cols    : 2,
                bordCol : '#aaa',
                color: nheap.companyColors.blue_master,
                body: null
            }).tbl;
        ddCont.push( built );
        buildBottomLeftTable( built.table.body[0][0] )
        buildBottomRightTable( built.table.body[0][1] )

        ddCont[ ddCont.length - 1 ].pageBreak = 'after';
        //==============================        
        // \\// master placeholders
        //==============================
    }




    function buildBottomRightTable( ownPlaceholder )
    {
        var clmNames = [ "Sector Name", "Direct Eq", "Manual Funds", "Managed Accounts",
                         "% of Portfolio", "% of Benchmark" ];
        var keyNames = [ "SECTOR_NAME", "DE", "MF", "MG", "PORTFOLIO", "Nifty" ];

        var JSONrecords = nheap.content_data
                [ "Page 3" ]
                [ "Top5Sectors.txt" ]
                [ "TopTSectorsEquity" ].concat([]);
        JSONrecords.length = 5;

        var columnsMeta = keyNames.map( (kn,kix) => {
                var mt = {};
                mt[kn] = { caption:clmNames[kix] };
                return mt;
        });

        methods.tableTpl_2_content({
                contentPlaceholderToAttach : ownPlaceholder,
                table : JSONrecords,
                caption : "Top 5 Sectors",
                cellPaddingTop : 1,
                cellPaddingBottom : 1,
                cellFontSize:7,
                widthPercent: 85,
                margin : [0, 0, 0, 0], //above caption
                firstCellIncrease : 23, //%
                captionFontSize : 12,
                captionBold : true,
                columns : columnsMeta
        });
    }





    function buildBottomLeftTable( ownPlaceholder )
    {
        var clmNames = [ "Stock Name", "Amount", "Weight %" ];
        var keyNames = [ "instrument_name", "Amount", "weight" ];

        var JSONrecords = nheap.content_data
                [ "Page 3" ]
                [ "Top5Stocks.txt" ]
                [ "EquityTopTen" ].concat([]);
        JSONrecords.length = 5;

        var columnsMeta = keyNames.map( (kn,kix) => {
                var mt = {};
                mt[kn] = { caption:clmNames[kix] };
                return mt;
        });

        methods.tableTpl_2_content({
                contentPlaceholderToAttach : ownPlaceholder,
                table : JSONrecords,
                caption : "Top 5 Stocks",
                cellPaddingTop : 1,
                cellPaddingBottom : 1,
                cellFontSize:7,
                widthPercent: 85,
                margin : [0, 0, 0, 0], //above caption
                firstCellIncrease : 23, //%
                captionFontSize : 12,
                captionBold : true,
                columns : columnsMeta
        });
    }




    function buildTopRightTable( ownPlaceholder )
    {
        fm.section3RightTop( ownPlaceholder )
    }



    function buildTopLeftTable( ownPlaceholder )
    {
        var clmNames = [ "Asset Category", "Current Value", "Weight %",
                         "Gain/Loss", "IRR", "Benchmark IRR" ];
        var keyNames = [ "PRODUCT", "MARKETVALUE", "WEIGHT",
                         "GAINLOSS", "XIRR", "BMXIRR" ];


        var JSONrecords = nheap.content_data
                [ "Page 3" ]
                [ "summary.txt" ]
                [ "EquityPortFolioSummary" ];
        var columnsMeta = keyNames.map( (kn,kix) => {
                var mt = {};
                mt[kn] = { caption:clmNames[kix] };
                return mt;
        });

        methods.tableTpl_2_content({
                contentPlaceholderToAttach : ownPlaceholder,
                table : JSONrecords,
                caption : "Summary",
                cellPaddingTop : 1,
                cellPaddingBottom : 1,
                cellFontSize:7,
                widthPercent: 85,
                margin : [0, 0, 0, 0], //above caption
                firstCellIncrease : 23, //%
                captionFontSize : 12,
                captionBold : true,
                columns : columnsMeta
        });
    }







    //==============================        
    // //\\ header
    //==============================
    function addHeader( ptitle )
    {
        ddCont.push(
            {
                image: imagesRack.loadedImages[ 'page-header' ].dataURI,
                width: 844,
                absolutePosition: {
                  x: 0,
                  y: 0
                }
            }
        );

        ddCont.push(
            //header: no dice for classic header:
            {   
                text: ptitle,
                margin: [20, 0, 40, 30],
                color: '#fff',
                fontSize: 26,
                bold: true
            }
        );
    }
    //==============================        
    // \\// header
    //==============================



}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};
    var fapp        = ns.fapp           = ns.fapp           || {};
    var fmethods    = fapp.methods      = fapp.methods      || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;

    fmethods.section3RightTop = section3RightTop;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000







    ///==============================        
    /// //\\
    ///==============================
    function section3RightTop( placeholder )
    {
        // //\\ config
        compCol =
        {
             "SMALL CAP":   "#eeaa44",
             "MID CAP":     "#ccaa33",
             "LARGE CAP":   "#bb6600",
             "DEBT & CASH": "#ffbb99"
        }
        // \\// config

        placeholder.stack = fmethods.initTopPaneCell( "Asset Allocation" );
        //placeholder.margin = [0,0,0,0]; //todm no dice ... chart is too low ...

        var JSONrecord = nheap.content_data
                    [ "Page 3" ]
                    [ "EquityMarketCap&DebtCreditRatingBreakup.txt" ]
                    [ "EquityMarketCap" ][0];

        //------------------
        // //\\ chart legend
        //------------------
        //var seriesData = Object.keys( JSONrecord ).map( prop => [ prop, JSONrecord[ prop ]] );
        var chartData  = Object.keys( JSONrecord ).map( prop => ({ name:prop, y:JSONrecord[ prop ] }) );
        var colors     = chartData.map( serie => compCol[ serie.name ] );
        var tBody = [];
        chartData.forEach( (row,rix) => {
            var ix = rix%2;
            var iy = ( rix - ix ) /2;
            tBody[iy] = tBody[iy] || [];

            //----------------------------------------
            // //\\ tedious alignments of legend cells
            //----------------------------------------
            tBody[iy][2*ix] = { image:methods.getLabelImage({
                                    shape:'bar', color:compCol[ row.name ]
                                }),
                                fit:[8,8],
                                alignment:'left',
                                //.second row top margin for even vert. layout
                                margin:[ 0, iy?6:6, 0, 0]
                              };
            tBody[iy][2*ix+1] = [
                { text:row.y.toFixed(2)+'%', fontSize:11, color:'black', bold:true,
                  alignment:'left',
                  //.second row top margin for even vert. layout
                  margin:[ 0, iy?0:0, 0, 0],
                  lineHeight:1
                },
                { text:row.name.substring(0,14), color:'#666', alignment:'left', margin:[0,0,0,0], 
                  lineHeight:1
                }
            ];
            //----------------------------------------
            // \\// tedious alignments of legend cells
            //----------------------------------------

        });
        //------------------
        // \\// chart legend
        //------------------



        //==============================
        // //\\ chart
        //==============================
        var chartPlaceholder = {
                //image: will come from export 
                fit:[110,110],
                margin: [45,0,0,0]
        };

        placeholder.stack[1] = fmethods.layt({
            margin  : [0,0,0,0],
            widths  : [ '100%', '100%' ],
            pads    : { left:0, top:20, right:0, bottom:0 },
            rows    : 2,
            body    : [
                        ////layout is vertical: one column
                        //.first column
                        [   chartPlaceholder ],
                        //.second column
                        [
                              fmethods.layt({
                                margin  : [20,0,0,0],
                                widths: [ '10%', '30%', '10%', '40%' ],
                                cols    : 4,
                                rows    : 2,
                                fontSize: 9,
                                bordCol : '#fff',
                                body    : tBody
                             }).tbl
                        ]
                      ]
        }).tbl;

        contCharts.push({ 
            ddContRack  : chartPlaceholder,
            //---------------------------
            // //\\ chart options
            //---------------------------
            options :
            {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                    ,width: 460
                    ,height: 460
                },

                "exporting": {
                    "enabled": false
                },
                "credits": {
                    "enabled": false
                },
    
               legend: {
                    enabled: false,
                },

                title: {
                    text: ''
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: false
                        },
                        colors : colors,
                        showInLegend: true
                    },
                    series: {
                        animation: false
                    }
                },
                series: [{
                    colorByPoint: true,
                    type: 'pie',
                    innerSize: '83%',
                    data: chartData
                }]
            }
            //---------------------------
            // \\// chart options
            //---------------------------
        });
        //==============================
        // \\// chart
        //==============================



        return placeholder;
    }
    ///==============================        
    /// \\//
    ///==============================



}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};

    var fapp        = ns.fapp           = ns.fapp           || {};
    var fm          = fapp.methods      = fapp.methods      || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var ddCont      = nheap.ddCont      = nheap.ddCont      || [];
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;


    methods.composeSection4 = composeSection4;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000






    ///==============================        
    /// composer
    ///==============================
    function composeSection4()
    {

        methods.addTOC( "Debt Portfolio", "Panes" )
        addHeader( 'Debt Portfolio' );

        //==============================        
        // //\\ master placeholders
        // //\\ top master layout table
        //----------------------------------
        var built = 
            fm.layt({
                margin  : [ 0,0,0,0 ],
                widths  : [ '70%', '30%' ],
                pads    : { left:10, top:8, right:7, bottom:4 },
                borders :
                [
                    [ [false, false, true, true ], [true, false, false, false] ]
                ],
                cols    : 2,
                bordCol : '#aaa',
                color: nheap.companyColors.blue_master,
                body: null
            }).tbl;
        ddCont.push( built );

        buildTopLeftTable( built.table.body[0][0] );
        buildTopRightTable( built.table.body[0][1] )
        //----------------------------------
        // \\// top master layout table
        //----------------------------------




        //----------------------------------
        // //\\ bottom master layout table
        //----------------------------------
        var built = 
            fm.layt({
                margin  : [ 0,0,0,0 ],
                widths  : [ '40%', '25%', '35%' ],
                pads    : { left:10, top:8, right:7, bottom:4 },
                borders :
                [
                    [ [false, false, false, false ], [true, false, false, false], [true, false, false, false] ]
                ],
                cols    : 3,
                bordCol : '#aaa',
                color: nheap.companyColors.blue_master,
                body: null
            }).tbl;
        ddCont.push( built );
        buildBottomLeftTable( built.table.body[0][0] );
        fm.section4MiddleBottom( built.table.body[0][1] );
        fm.section4RightBottom( built.table.body[0][2] );
        //buildBottomRightTable( built.table.body[0][1] );
        //built.table.body[0][2].text = 'in progress';

        ddCont[ ddCont.length - 1 ].pageBreak = 'after';
        //----------------------------------
        // \\// bottom master layout table
        // \\// master placeholders
        //==============================
    }








    function buildBottomLeftTable( ownPlaceholder )
    {
        fm.section4LeftBottom( ownPlaceholder )
    }



    function buildTopRightTable( ownPlaceholder )
    {
        var JSONrecords = nheap.content_data
                [ "Page 4" ]
                [ "DebtKeyRatio.txt" ]
                [ "DebtKeyRatio" ];

        var timeLength = JSONrecords[0].data.length;
        var rows = JSONrecords.map( rec => ({ KEY_RATIO:rec.KEY_RATIO, dvalue:rec.data[ rec.data.length-1 ][1] }) );

        var columnsMeta =
        [
            { KEY_RATIO: { caption: "Noms" } },
            { dvalue: { caption: JSONrecords[0].data[ timeLength-1 ][0] } }
        ];            

        methods.tableTpl_2_content({
                contentPlaceholderToAttach : ownPlaceholder,
                table : rows,
                caption : "Key Ratios",
                cellPaddingTop : 1,
                cellPaddingBottom : 1,
                cellFontSize:7,
                widthPercent: 85,
                margin : [0, 0, 0, 0], //above caption
                firstCellIncrease : 23, //%
                captionFontSize : 12,
                captionBold : true,
                columns : columnsMeta
        });
    }



    function buildTopLeftTable( ownPlaceholder )
    {
        var JSONrecords = nheap.content_data
                [ "Page 4" ]
                [ "summary.txt" ]
                [ "EquityPortFolioSummary" ];

        var clmNames = [ "Asset Category", "Current Value", "Weight %",
                         "Gain/Loss", "IRR", "Benchmark IRR" ];
        var keyNames = [ "PRODUCT", "MARKETVALUE", "WEIGHT",
                         "GAINLOSS", "XIRR", "BMXIRR" ];


        var columnsMeta = keyNames.map( (kn,kix) => {
                var mt = {};
                mt[kn] = { caption:clmNames[kix] };
                return mt;
        });

        methods.tableTpl_2_content({
                contentPlaceholderToAttach : ownPlaceholder,
                table : JSONrecords,
                caption : "Summary",
                cellPaddingTop : 1,
                cellPaddingBottom : 1,
                cellFontSize:7,
                widthPercent: 85,
                margin : [0, 0, 0, 0], //above caption
                firstCellIncrease : 23, //%
                captionFontSize : 12,
                captionBold : true,
                columns : columnsMeta
        });
    }







    //==============================        
    // //\\ header
    //==============================
    function addHeader( ptitle )
    {
        ddCont.push(
            {
                image: imagesRack.loadedImages[ 'page-header' ].dataURI,
                width: 844,
                absolutePosition: {
                  x: 0,
                  y: 0
                }
            }
        );

        ddCont.push(
            //header: no dice for classic header:
            {   
                text: ptitle,
                margin: [20, 0, 40, 30],
                color: '#fff',
                fontSize: 26,
                bold: true
            }
        );
    }
    //==============================        
    // \\// header
    //==============================



}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};
    var fapp        = ns.fapp           = ns.fapp           || {};
    var fconf       = fapp.conf         = fapp.conf         || {};
    var fmethods    = fapp.methods      = fapp.methods      || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;

    fmethods.section4LeftBottom = section4LeftBottom;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000







    ///==============================        
    /// //\\ pane
    ///==============================
    function section4LeftBottom( placeholder )
    {
        placeholder = placeholder || {};
        placeholder.stack = fmethods.initTopPaneCell( "Modified Duration & YTM" );

        /*
          "AssetTypeAttribution":[
          {
             "Date":"2017-12-08T00:00:00",
             "YTM":6.312486,
             "MOD":0.839712
          },
        */

        var JSONrecords = nheap.content_data
                [ "Page 4" ]
                [ "YMT&ModifiedDuration.txt" ]
                [ "AssetTypeAttribution" ];

        //------------------------------
        // //\\ prepares data and labels
        //------------------------------
        var xAxis_categories = [];
        //.first column
        YTMData = JSONrecords.map( (row,rix) => {
            var dt = new Date( row[ "Date" ] );
            xAxis_categories.push( fconf.monthNames[ dt.getMonth() ] + '-' + 
                                   ( dt.getFullYear()%100 ) );
            return [ rix, row.YTM ];
        });
        //.spline
        MODData = JSONrecords.map( (row,rix) => [ rix, row.MOD ] );
        var wwc = nheap.companyColors;
        var colors = [wwc.blue_master, wwc.yellow];
        //------------------------------
        // \\// prepares data and labels
        //------------------------------







        //==============================
        // //\\ chart
        //==============================
        var chartPlaceholder = {
                //image: will come from export 
                //width: 350,
                fit:[ 370, 160 ],
                margin: [10,0,0,0]
        };
        placeholder.stack[1] = chartPlaceholder;

        contCharts.push({ 
            ddContRack  : chartPlaceholder,
            //---------------------------
            // //\\ chart options
            //---------------------------
            options :
            {
                chart: {
                    plotBackgroundColor: null
                    ,plotBorderWidth: null
                    ,plotShadow: false
                    ,width: 680
                    ,height: 400
                },
                "exporting": {
                    "enabled": false
                },
                "credits": {
                    "enabled": false
                },
                colors : colors,
    
                legend: {
                    enabled: true,
                    layout: 'horizontal',
                    backgroundColor: '#FFFFFF',
                    align: 'center',
                    verticalAlign: 'top',
                    symbolHeight: 12,
                    symbolWidth: 12,
                    symbolRadius: 0
                },

                title: {
                    text: ''
                },
                plotOptions: {
                    spline: {
                        dataLabels: {
                            enabled: true
                        },
                        showInLegend: true
                    },
                    column: {
                        dataLabels: {
                            enabled: true
                        },
                        showInLegend: true
                    },
                    series: {
                        animation: false
                    }
                },
                xAxis : {
                    visible:true,
                    tickLength: 0,
                    categories: xAxis_categories,
                    labels: {
                        enabled:true
                    },
                    title: {
                        enabled:true
                    }
                },
                yAxis : [
                    {
                        visible: true,
                        title: {
                            text : 'Returns',
                            enabled:true
                        }
                    },
                    {
                        visible: true,
                        opposite: true,
                        title: {
                            text : 'Market Value',
                            enabled:true
                        }
                    }
                ],

                series: [
                    {
                        name: 'Portfolio',
                        type: 'column',
                        yAxis: 0,
                        data: YTMData
                    },
                    {
                        name: 'Market Value',
                        type: 'spline',
                        yAxis: 1,
                        //no dice: does not make symbol a bar: legendIndex:2,
                        data: MODData
                    }
                ]
            }
            //---------------------------
            // \\// chart options
            //---------------------------
        });
        //==============================
        // \\// chart
        //==============================
        return placeholder;
    }
    ///==============================        
    /// \\// pane
    ///==============================



}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};
    var fapp        = ns.fapp           = ns.fapp           || {};
    var fconf       = fapp.conf         = fapp.conf         || {};
    var fmethods    = fapp.methods      = fapp.methods      || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;

    fmethods.section4RightBottom = section4RightBottom;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000







    ///==============================        
    /// //\\ pane
    ///==============================
    function section4RightBottom( placeholder )
    {
        placeholder = placeholder || {};
        placeholder.stack = fmethods.initTopPaneCell( "Average Maturity" );

        /*
           "DebtMaturity":[
              {
                 "DURATION":"LESS THAN 3 MONTHS",
                 "WEIGHT":0,
                 "id":1
              },
        */

        var JSONrecords = nheap.content_data
                [ "Page 4" ]
                [ "AverageMaturity.txt" ]
                [ "DebtMaturity" ];

        //------------------------------
        // //\\ prepares data and labels
        //------------------------------
        var xAxis_categories = [];
        //.first column
        weightData = JSONrecords.map( (row,rix) => {
            xAxis_categories.push( row.DURATION );
            return [ rix, row.WEIGHT ];
        });
        var wwc = nheap.companyColors;
        var colors = [wwc.orange_master];
        //------------------------------
        // \\// prepares data and labels
        //------------------------------







        //==============================
        // //\\ chart
        //==============================
        var chartPlaceholder = {
                //image: will come from export 
                //width: 350,
                fit:[ 300, 160 ],
                margin: [10,0,0,0]
        };
        placeholder.stack[1] = chartPlaceholder;

        contCharts.push({ 
            ddContRack  : chartPlaceholder,
            //---------------------------
            // //\\ chart options
            //---------------------------
            options :
            {
                chart: {
                    plotBackgroundColor: null
                    ,plotBorderWidth: null
                    ,plotShadow: false
                    ,width: 720
                    ,height: 500
                },
                "exporting": {
                    "enabled": false
                },
                "credits": {
                    "enabled": false
                },
                colors : colors,
    
                legend: {
                    enabled: true,
                    layout: 'horizontal',
                    backgroundColor: '#FFFFFF',
                    align: 'center',
                    verticalAlign: 'top',
                    symbolHeight: 12,
                    symbolWidth: 12,
                    symbolRadius: 0
                },

                title: {
                    text: ''
                },
                plotOptions: {
                    spline: {
                        dataLabels: {
                            enabled: true
                        },
                        showInLegend: true
                    },
                    column: {
                        dataLabels: {
                            enabled: true
                        },
                        showInLegend: true
                    },
                    series: {
                        animation: false
                    }
                },
                xAxis : {
                    visible:true,
                    tickLength: 0,
                    categories: xAxis_categories,
                    labels: {
                        enabled:true
                    },
                    title: {
                        enabled:true
                    }
                },
                yAxis : [
                    {
                        visible: true,
                        title: {
                            text : 'Returns',
                            enabled:true
                        }
                    },
                    {
                        visible: true,
                        opposite: true,
                        title: {
                            text : 'Market Value',
                            enabled:true
                        }
                    }
                ],

                series: [
                    {
                        name: 'Portfolio',
                        type: 'column',
                        yAxis: 0,
                        data: weightData
                    }
                ]
            }
            //---------------------------
            // \\// chart options
            //---------------------------
        });
        //==============================
        // \\// chart
        //==============================
        return placeholder;
    }
    ///==============================        
    /// \\// pane
    ///==============================



}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};
    var fapp        = ns.fapp           = ns.fapp           || {};
    var fmethods    = fapp.methods      = fapp.methods      || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;

    fmethods.section4MiddleBottom = section4MiddleBottom;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000







    ///==============================        
    /// //\\
    ///==============================
    function section4MiddleBottom( placeholder )
    {
        // //\\ config
        compCol =
        {
             "SMALL CAP":   "#eeaa44",
             "MID CAP":     "#ccaa33",
             "LARGE CAP":   "#bb6600",
             "DEBT & CASH": "#ffbb99"
        }
        // \\// config


        placeholder.stack = fmethods.initTopPaneCell( "Credit Rating Breakup" );
        //placeholder.margin = [0,0,0,0]; //todm no dice ... chart is too low ...

        var JSONrecord = nheap.content_data
                    [ "Page 4" ]
                    [ "EquityMarketCap&DebtCreditRatingBreakup.txt" ]
                    [ "EquityMarketCap" ][0];

        //------------------
        // //\\ chart legend
        //------------------
        //var seriesData = Object.keys( JSONrecord ).map( prop => [ prop, JSONrecord[ prop ]] );
        var chartData  = Object.keys( JSONrecord ).map( prop => ({ name:prop, y:JSONrecord[ prop ] }) );
        var colors     = chartData.map( serie => compCol[ serie.name ] );
        var tBody = [];
        chartData.forEach( (row,rix) => {
            var ix = rix%2;
            var iy = ( rix - ix ) /2;
            tBody[iy] = tBody[iy] || [];

            //----------------------------------------
            // //\\ tedious alignments of legend cells
            //----------------------------------------
            tBody[iy][2*ix] = { image:methods.getLabelImage({
                                    shape:'bar', color:compCol[ row.name ]
                                }),
                                fit:[8,8],
                                alignment:'left',
                                //.second row top margin for even vert. layout
                                margin:[ 0, iy?6:6, 0, 0]
                              };
            tBody[iy][2*ix+1] = [
                { text:row.y.toFixed(2)+'%', fontSize:11, color:'black', bold:true,
                  alignment:'left',
                  //.second row top margin for even vert. layout
                  margin:[ 0, iy?0:0, 0, 0],
                  lineHeight:1
                },
                { text:row.name.substring(0,14), color:'#666', alignment:'left', margin:[0,0,0,0], 
                  lineHeight:1
                }
            ];
            //----------------------------------------
            // \\// tedious alignments of legend cells
            //----------------------------------------

        });
        //------------------
        // \\// chart legend
        //------------------



        //==============================
        // //\\ chart
        //==============================
        var chartPlaceholder = {
                //image: will come from export 
                fit:[110,110],
                margin: [25,0,0,0]
        };

        placeholder.stack[1] = fmethods.layt({
            margin  : [0,0,0,0],
            widths  : [ '100%', '100%' ],
            pads    : { left:0, top:20, right:0, bottom:0 },
            rows    : 2,
            body    : [
                        ////layout is vertical: one column
                        //.first column
                        [   chartPlaceholder ],
                        //.second column
                        [
                              fmethods.layt({
                                margin  : [20,0,0,0],
                                widths: [ '10%', '30%', '10%', '40%' ],
                                cols    : 4,
                                rows    : 2,
                                fontSize: 9,
                                bordCol : '#fff',
                                body    : tBody
                             }).tbl
                        ]
                      ]
        }).tbl;

        contCharts.push({ 
            ddContRack  : chartPlaceholder,
            //---------------------------
            // //\\ chart options
            //---------------------------
            options :
            {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                    ,width: 460
                    ,height: 460
                },

                "exporting": {
                    "enabled": false
                },
                "credits": {
                    "enabled": false
                },
    
               legend: {
                    enabled: false,
                },

                title: {
                    text: ''
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: false
                        },
                        colors : colors,
                        showInLegend: true
                    },
                    series: {
                        animation: false
                    }
                },
                series: [{
                    colorByPoint: true,
                    type: 'pie',
                    innerSize: '83%',
                    data: chartData
                }]
            }
            //---------------------------
            // \\// chart options
            //---------------------------
        });
        //==============================
        // \\// chart
        //==============================



        return placeholder;
    }
    ///==============================        
    /// \\//
    ///==============================



}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};

    var fapp        = ns.fapp           = ns.fapp           || {};
    var fm          = fapp.methods      = fapp.methods      || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var ddCont      = nheap.ddCont      = nheap.ddCont      || [];
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;


    methods.composeSection5 = composeSection5;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000






    ///==============================        
    /// composer
    ///==============================
    function composeSection5()
    {

        methods.addTOC( "Portfolio Guidelines : Family XYZ", "Panes" )
        addHeader( 'Portfolio Guidelines : Family XYZ' );

        //==============================        
        // //\\ master placeholders
        // //\\ top master layout table
        //----------------------------------
        var borders = Array(6).fill([false, false, true, false ]);
        var widths = Array(6).fill( '16.66%' );
        borders[5][2] = false;
        var built = 
            fm.layt({
                margin  : [ 0,0,0,0 ],
                widths  : widths,
                pads    : { left:10, top:8, right:7, bottom:4 },
                borders : borders,
                cols    : 6,
                bordCol : '#aaa',
                color: nheap.companyColors.blue_master,
                body: null
            }).tbl;
        ddCont.push( built );

        widths.forEach( (val, ix) => fm.section5TopChart( built.table.body[0][ix] ) );
        //----------------------------------
        // \\// top master layout table
        //----------------------------------




        //----------------------------------
        // //\\ bottom master layout table
        //----------------------------------
        var built = 
            fm.layt({
                margin  : [ 0,0,0,0 ],
                widths  : [ '40%', '25%', '35%' ],
                pads    : { left:10, top:8, right:7, bottom:4 },
                borders :
                [
                    [ [false, false, false, false ], [true, false, false, false], [true, false, false, false] ]
                ],
                cols    : 3,
                bordCol : '#aaa',
                color: nheap.companyColors.blue_master,
                body: null
            }).tbl;
        ddCont.push( built );

        buildBottomLeftTable( built.table.body[0][0] );
        built.table.body[0][1].text = 'in progress';
        built.table.body[0][2].text = 'in progress';

        ddCont[ ddCont.length - 1 ].pageBreak = 'after';
        //----------------------------------
        // \\// bottom master layout table
        // \\// master placeholders
        //==============================
    }






    //=============================================
    // //\\ pane in master cell
    //=============================================
    function buildBottomLeftTable( ownPlaceholder )
    {
        var JSONrecords = nheap.content_data
                [ "Page 5" ]
                [ "AssetLimt(PortfolioGuidelinesFamily XYZ).txt" ]
                [ "ASSET_LIMIT" ];

        /*
        var JSONrecords =
        [
           //"ASSET_LIMIT":[

              {

                 "TYPE":"CLI-21886",

                 "RULEGROUP":1,

                 "ID":4136,

                 "RISK_ID":1,

                 "RISK_PROFILE":"Aggressive",

                 "ASSET":"Alternative",

                 "LIMITVALUE_MIN":0,

                 "LIMITVALUE_MAX":10,

                 "LIMITRESULT":0,

                 "Comments":1,

                 "Row_Number":1

              }

        ];
        */

        JSONrecords.length = 12;
        var rows = JSONrecords.map( rec => (
            { ASSET: rec.ASSET,
              LIMITRANGE: rec.LIMITVALUE_MIN == 0 && rec.LIMITVALUE_MAX==10  && rec.LIMITRESULT <= rec.LIMITVALUE_MAX ?
                        "0-10%" : "<" + rec.LIMITVALUE_MAX + '%',
              ACTUAL: rec.LIMITRESULT
            }));

        var clmNames = [ "FRN_6980 Asset Class", "Limits", "Balanced Actual Portfolio" ];
        var keyNames = [ "ASSET", "LIMITRANGE", "ACTUAL" ];

        var columnsMeta = keyNames.map( (kn,kix) => {
                var mt = {};
                mt[kn] = { caption:clmNames[kix] };
                return mt;
        });

        methods.tableTpl_2_content({
                contentPlaceholderToAttach : ownPlaceholder,
                table : rows,
                caption : "Asset Allocation Guidelines",
                cellPaddingTop : 1,
                cellPaddingBottom : 1,
                cellFontSize:7,
                widthPercent: 85,
                margin : [0, 0, 0, 0], //above caption
                firstCellIncrease : 23, //%
                captionFontSize : 12,
                captionBold : true,
                columns : columnsMeta
        });
    }
    //=============================================
    // \\// pane in master cell
    //=============================================



    function buildTopRightTable( ownPlaceholder )
    {
        var JSONrecords = nheap.content_data
                [ "Page 4" ]
                [ "DebtKeyRatio.txt" ]
                [ "DebtKeyRatio" ];

        var timeLength = JSONrecords[0].data.length;
        var rows = JSONrecords.map( rec => ({ KEY_RATIO:rec.KEY_RATIO, dvalue:rec.data[ rec.data.length-1 ][1] }) );

        var columnsMeta =
        [
            { KEY_RATIO: { caption: "Noms" } },
            { dvalue: { caption: JSONrecords[0].data[ timeLength-1 ][0] } }
        ];            

        methods.tableTpl_2_content({
                contentPlaceholderToAttach : ownPlaceholder,
                table : rows,
                caption : "Key Ratios",
                cellPaddingTop : 1,
                cellPaddingBottom : 1,
                cellFontSize:7,
                widthPercent: 85,
                margin : [0, 0, 0, 0], //above caption
                firstCellIncrease : 23, //%
                captionFontSize : 12,
                captionBold : true,
                columns : columnsMeta
        });
    }



    function buildTopLeftTable( ownPlaceholder )
    {
        var JSONrecords = nheap.content_data
                [ "Page 4" ]
                [ "summary.txt" ]
                [ "EquityPortFolioSummary" ];

        var clmNames = [ "Asset Category", "Current Value", "Weight %",
                         "Gain/Loss", "IRR", "Benchmark IRR" ];
        var keyNames = [ "PRODUCT", "MARKETVALUE", "WEIGHT",
                         "GAINLOSS", "XIRR", "BMXIRR" ];


        var columnsMeta = keyNames.map( (kn,kix) => {
                var mt = {};
                mt[kn] = { caption:clmNames[kix] };
                return mt;
        });

        methods.tableTpl_2_content({
                contentPlaceholderToAttach : ownPlaceholder,
                table : JSONrecords,
                caption : "Summary",
                cellPaddingTop : 1,
                cellPaddingBottom : 1,
                cellFontSize:7,
                widthPercent: 85,
                margin : [0, 0, 0, 0], //above caption
                firstCellIncrease : 23, //%
                captionFontSize : 12,
                captionBold : true,
                columns : columnsMeta
        });
    }







    //==============================        
    // //\\ header
    //==============================
    function addHeader( ptitle )
    {
        ddCont.push(
            {
                image: imagesRack.loadedImages[ 'page-header' ].dataURI,
                width: 844,
                absolutePosition: {
                  x: 0,
                  y: 0
                }
            }
        );

        ddCont.push(
            //header: no dice for classic header:
            {   
                text: ptitle,
                margin: [20, 0, 40, 30],
                color: '#fff',
                fontSize: 26,
                bold: true
            }
        );
    }
    //==============================        
    // \\// header
    //==============================



}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};
    var fapp        = ns.fapp           = ns.fapp           || {};
    var fmethods    = fapp.methods      = fapp.methods      || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;

    fmethods.section5TopChart = section5TopChart;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000







    ///==============================        
    /// //\\
    ///==============================
    function section5TopChart( placeholder )
    {
        placeholder.text = 'cannot find data for chart';
        placeholder.fontSize = 7;
        return;

        // //\\ config
        compCol =
        {
             "SMALL CAP":   "#eeaa44",
             "MID CAP":     "#ccaa33",
             "LARGE CAP":   "#bb6600",
             "DEBT & CASH": "#ffbb99"
        }
        // \\// config


        placeholder.stack = fmethods.initTopPaneCell( "Credit Rating Breakup" );
        //placeholder.margin = [0,0,0,0]; //todm no dice ... chart is too low ...

        var JSONrecord = nheap.content_data
                    [ "Page 5" ]
                    [ "EquityMarketCap&DebtCreditRatingBreakup.txt" ]
                    [ "EquityMarketCap" ][0];

        //------------------
        // //\\ chart legend
        //------------------
        //var seriesData = Object.keys( JSONrecord ).map( prop => [ prop, JSONrecord[ prop ]] );
        var chartData  = Object.keys( JSONrecord ).map( prop => ({ name:prop, y:JSONrecord[ prop ] }) );
        var colors     = chartData.map( serie => compCol[ serie.name ] );
        var tBody = [];
        chartData.forEach( (row,rix) => {
            var ix = rix%2;
            var iy = ( rix - ix ) /2;
            tBody[iy] = tBody[iy] || [];

            //----------------------------------------
            // //\\ tedious alignments of legend cells
            //----------------------------------------
            tBody[iy][2*ix] = { image:methods.getLabelImage({
                                    shape:'bar', color:compCol[ row.name ]
                                }),
                                fit:[8,8],
                                alignment:'left',
                                //.second row top margin for even vert. layout
                                margin:[ 0, iy?6:6, 0, 0]
                              };
            tBody[iy][2*ix+1] = [
                { text:row.y.toFixed(2)+'%', fontSize:11, color:'black', bold:true,
                  alignment:'left',
                  //.second row top margin for even vert. layout
                  margin:[ 0, iy?0:0, 0, 0],
                  lineHeight:1
                },
                { text:row.name.substring(0,14), color:'#666', alignment:'left', margin:[0,0,0,0], 
                  lineHeight:1
                }
            ];
            //----------------------------------------
            // \\// tedious alignments of legend cells
            //----------------------------------------

        });
        //------------------
        // \\// chart legend
        //------------------



        //==============================
        // //\\ chart
        //==============================
        var chartPlaceholder = {
                //image: will come from export 
                fit:[110,110],
                margin: [25,0,0,0]
        };

        placeholder.stack[1] = fmethods.layt({
            margin  : [0,0,0,0],
            widths  : [ '100%', '100%' ],
            pads    : { left:0, top:20, right:0, bottom:0 },
            rows    : 2,
            body    : [
                        ////layout is vertical: one column
                        //.first column
                        [   chartPlaceholder ],
                        //.second column
                        [
                              fmethods.layt({
                                margin  : [20,0,0,0],
                                widths: [ '10%', '30%', '10%', '40%' ],
                                cols    : 4,
                                rows    : 2,
                                fontSize: 9,
                                bordCol : '#fff',
                                body    : tBody
                             }).tbl
                        ]
                      ]
        }).tbl;

        contCharts.push({ 
            ddContRack  : chartPlaceholder,
            //---------------------------
            // //\\ chart options
            //---------------------------
            options :
            {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                    ,width: 460
                    ,height: 460
                },

                "exporting": {
                    "enabled": false
                },
                "credits": {
                    "enabled": false
                },
    
               legend: {
                    enabled: false,
                },

                title: {
                    text: ''
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: false
                        },
                        colors : colors,
                        showInLegend: true
                    },
                    series: {
                        animation: false
                    }
                },
                series: [{
                    colorByPoint: true,
                    type: 'pie',
                    innerSize: '83%',
                    data: chartData
                }]
            }
            //---------------------------
            // \\// chart options
            //---------------------------
        });
        //==============================
        // \\// chart
        //==============================



        return placeholder;
    }
    ///==============================        
    /// \\//
    ///==============================



}) ();

( function() {
    var ns          = window.b$l        = window.b$l        || {};
    var $$          = ns.$$;
    var methods     = ns.methods        = ns.methods        || {};

    var fapp        = ns.fapp           = ns.fapp           || {};
    var fm          = fapp.methods      = fapp.methods      || {};

    var nheap       = ns.nheap          = ns.nheap          || {};
    var imagesRack  = nheap.imagesRack  = nheap.imagesRack  || {};
    var ddCont      = nheap.ddCont      = nheap.ddCont      || [];
    var contCharts  = nheap.contCharts  = nheap.contCharts  || [];
    var ccc         = window.console.log;


    methods.composeSection8 = composeSection8;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000






    ///==============================        
    /// composer
    ///==============================
    function composeSection8()
    {

        methods.addTOC( "Notes to MIS", "Panes" )
        addHeader( 'Notes to MIS' );




        //==============================        
        // //\\ master placeholders
        // //\\ top master layout table
        //----------------------------------
        var borders = Array(4).fill([[false, true, false, false ]]);
        //borders[0][1] = false; //fails why?
        borders[0] = [false, false, false, false];

        var built = 
            fm.layt({
                margin  : [ 10,15,0,10 ],
                widths  : [ '95%' ],
                heights : 2,
                pads    : { left:10, top:5, right:10, bottom:1 },
                borders : borders,
                rows    : 4,
                bordCol : '#aaa',
                color: nheap.companyColors.blue_master,
                body: null
            }).tbl;
        ddCont.push( built );
        var JSONrecords = nheap.content_data
                [ "Mis.txt" ];

        built.table.body[0][0].text = "Client Selected: " + JSONrecords.Mis[0].CLIENTSELECTED;

        built.table.body[1][0].text = "Portfolio Selected:" + JSONrecords.Table1[0].PORTFOLIOSELECTED;

        built.table.body[2][0].text = JSONrecords.Table2[0].RM;

        built.table.body[3][0].text = JSONrecords[ "$*report-report-generator" ][0].DATA_SOURCE;
        built.table.body[3][0].fontSize = 8;
        //----------------------------------
        // \\// top master layout table
        //----------------------------------




        //----------------------------------
        // //\\ bottom master layout table
        //----------------------------------
        var built = 
            fm.layt({
                margin  : [ 0,0,0,0 ],
                widths  : [ '95%' ],
                pads    : { left:10, top:8, right:7, bottom:4 },
                borders :
                [
                    [ [false, false, false, false ] ]
                ],
                bordCol : '#aaa',
                color: nheap.companyColors.blue_master,
                body: null
            }).tbl;
        ddCont.push( built );
        buildBottomTable( built.table.body[0][0] )

        ddCont[ ddCont.length - 1 ].pageBreak = 'after';
        //----------------------------------
        // \\// bottom master layout table
        // \\// master placeholders
        //==============================
    }






    //=============================================
    // //\\ pane in master cell
    //=============================================
    function buildBottomTable( ownPlaceholder )
    {
        var JSONrecords = nheap.content_data
                [ "final-doc-info.txt" ]
                [ "final_info" ];

        var clmNames = [ "Widget Name", "Description", "Comments / Exclusions" ];
        var keyNames = [ "widget_name", "description","comments_exclusions" ];
        var columnsMeta = keyNames.map( (kn,kix) => {
                var mt = {};
                mt[kn] = { caption:clmNames[kix] };
                return mt;
        });

        methods.tableTpl_2_content({
                contentPlaceholderToAttach : ownPlaceholder,
                table : JSONrecords,
                caption : "",
                cellPaddingTop : 1,
                cellPaddingBottom : 1,
                cellFontSize:7,
                widthPercent: 85,
                margin : [0, 0, 0, 0], //above caption
                firstCellIncrease : 23, //%
                captionFontSize : 12,
                captionBold : true,
                columns : columnsMeta
        });
    }
    //=============================================
    // \\// pane in master cell
    //=============================================






    //==============================        
    // //\\ header
    //==============================
    function addHeader( ptitle )
    {
        ddCont.push(
            {
                image: imagesRack.loadedImages[ 'page-header' ].dataURI,
                width: 844,
                absolutePosition: {
                  x: 0,
                  y: 0
                }
            }
        );

        ddCont.push(
            //header: no dice for classic header:
            {   
                text: ptitle,
                margin: [20, 0, 40, 30],
                color: '#fff',
                fontSize: 26,
                bold: true
            }
        );
    }
    //==============================        
    // \\// header
    //==============================



}) ();

