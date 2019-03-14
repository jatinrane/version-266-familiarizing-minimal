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


(function () {
    var APP_NAME = 'b$l';

    //.optional property: comment this definition out if not needed
    //.purpose is only to short manual typing for development debug
    window.ccc = window.console.log;

    var ns = setAppNamespace();
    setDomWrap(ns);
    return;






    function setAppNamespace() {
        var uniqueEarthWide = 'iamniquelks8e00w-e9jalknfnaegha;s[snfs=sieuhba;fkleub92784bna';
        var ns = window[APP_NAME];
        if (ns) {
            if (ns[uniqueEarthWide]) { return ns; }
            //.lets community to take care about this app
            throw 'global name collision: the window["' + APP_NAME +
            '"] already exists in web-browser';
        } else {
            var ns = window[APP_NAME] = {};
            ns[uniqueEarthWide] = true;
            ns.uniqueEarthWide = uniqueEarthWide;
            ns.sn = sn;
            ns.APP_NAME = APP_NAME;
            ns.CSS_PREFIX = APP_NAME.replace(/\$/g, 's');
            return ns;
        }

        ///sets namespace
        function sn(subname, parentNS) {
            var parentNS = parentNS || ns;
            if (parentNS.hasOwnProperty(subname)) {
                return parentNS[subname];
            }
            var sns = parentNS[subname] = {};
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
    function setDomWrap(ns) {
        // //\\ helpers
        ns.svgNS = "http://www.w3.org/2000/svg";

        ///https://css-tricks.com/snippets/javascript/loop-queryselectorall-matches/
        ns.callOn = function (selector, parent, callback) {
            parent = parent || document;
            var els = parent.querySelectorAll(selector);
            for (var ii = 0; ii < els.length; ii++) {
                callback(els[ii], ii);
            }
        };

        ///converts event pos to domelem-css-pos
        ns.event_pos_2_css_pos = function (event, domelem) {
            //	https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect
            //	Feature 	Chrome 	Firefox (Gecko) 	Internet Explorer 	Opera 	Safari
            //	Basic support 	1.0 	3.0 (1.9) 	4.0 	(Yes) 	4.0
            var box = domelem.getBoundingClientRect();
            var loc = [Math.round(event.clientX - box.left), Math.round(event.clientY - box.top)];
            return loc;
        };


        // //\\ DOM wrap
        //      for chains
        //      simple replacement of jQuery
        var $$ = ns.$$ =
            (function () {

                ///syntax sugar to supply object in two forms: wrapped into $$ or naked
                function alt(obj) {
                    return (typeof obj === 'function' ? obj() : obj);
                }

                var gen = function () {
                    var ctxEl = null;
                    var methods =
                    {
                        //.wraps flat-dom-object-into-platform
                        $: function (obj) { ctxEl = obj },

                        c: function (type) { ctxEl = document.createElement(type); },
                        //.gets single by id
                        g: function (id) { ctxEl = document.getElementById(id); },
                        //.gets single
                        q: function (selector, parent) { ctxEl = (parent || document.body).querySelector(selector); },
                        //.gets array of all
                        qa: function (selector, parent) { ctxEl = (parent || document.body).querySelectorAll(selector); },
                        cNS: function (type) { ctxEl = document.createElementNS(ns.svgNS, type); },
                        a: function (attr, text, obj) { ctxEl = obj || ctxEl; ctxEl.setAttribute(attr, text); },
                        aNS: function (attr, text, obj) { ctxEl = obj || ctxEl; ctxEl.setAttributeNS(null, attr, text); },
                        to: function (to, obj) { ctxEl = obj || ctxEl; alt(to).appendChild(ctxEl); },
                        ch: function (ch, obj) {
                            ctxEl = obj || ctxEl;
                            //.encourages syntax for alternatively empty list of children
                            //.$$.ch( obj ? ... : ... )
                            if (!ch) return;

                            if (Array.isArray(ch)) {
                                ///if array, then adds children in sequence
                                ch.forEach(function (child) {
                                    child && ctxEl.appendChild(alt(child));
                                });
                            } else {
                                ctxEl.appendChild(alt(ch));
                            }
                        },
                        e: function (type, callback, obj) { ctxEl = obj || ctxEl; ctxEl.addEventListener(type, callback); },
                        css: function (name, value, obj) { ctxEl = obj || ctxEl; ctxEl.style[name] = value; },
                        html: function (html, obj) { ctxEl = obj || ctxEl; ctxEl.innerHTML = html; },


                        //adds class.
                        addClass: function (text, obj) {
                            if (!text) return; //sugar, saves extra "if"

                            ctxEl = obj || ctxEl;
                            var clss = classes = text.split(/\s+/);
                            if (clss.length > 1) {
                                ////many classes are supplied ...
                                ////processes each of them
                                clss.forEach(function (cls) {
                                    $$.addClass(cls, ctxEl);
                                });
                                return;
                            }

                            var at = ctxEl.getAttribute('class'); //className is not for SVG
                            if (!at) {
                                //https://stackoverflow.com/questions/41195397/how-to-assign-a-class-to-an-svg-element
                                //ctxEl.className = text;
                                ctxEl.setAttribute('class', text); //For SVG
                                return;
                            }
                            var ats = ' ' + at + ' ';
                            var testee = ' ' + text + ' ';
                            if (ats.indexOf(testee) === -1) {
                                //c onsole.log( 'adding=' + text + ' to ' + at);
                                if (at.length > 0 && text) {
                                    at += ' ';
                                }
                                at += text;
                                //c onsole.log( 'result of adding=' + at);
                                //ctxEl.className = at;
                                ctxEl.setAttribute('class', at); //For SVG
                            }
                        },

                        //removes class.
                        removeClass: function (text, obj) {
                            if (!text) return; //sugar, saves extra "if"

                            //c onsole.log( 'removing=' + text );
                            ctxEl = obj || ctxEl;
                            var clss = classes = text.split(/\s+/);
                            if (clss.length > 1) {
                                ////many classes are supplied ...
                                ////processes each of them
                                clss.forEach(function (cls) {
                                    $$.removeClass(cls, ctxEl);
                                });
                                return;
                            }

                            var at = ctxEl.getAttribute('class');
                            if (!at) {
                                ////nothing to remove ... leaving the task
                                return;
                            }
                            var ats = ' ' + at + ' ';
                            var testee = ' ' + text + ' ';
                            if (ats.indexOf(testee) > -1) {
                                var re = new RegExp('(?:^|\\s)' + text + '(?:\\s|$)', 'g');
                                //var match = at.match( re );
                                //c onsole.log( 'match=', match );
                                at = at.replace(re, ' ');
                                at = at.replace(/\s+/g, ' ');
                                at = at.replace(/(^\s*)|(\s*$)/g, '');
                                //at = at.replace( /(\s*)/g, '' );
                                //c onsole.log( 'removed=' + at );
                                //ctxEl.className = at;
                                ctxEl.setAttribute('class', at); //For SVG
                            }
                        }
                    };

                    //:here JavaScript writer can look which additional shortcuts do exist
                    //:here we can add more dependent shortcuts
                    methods.cls = methods.addClass;
                    methods.id = function (text, obj) { methods.a('id', text, obj); }; //.adds id
                    methods.src = function (text, obj) { methods.a('src', text, obj); }; //.adds src
                    methods.href = function (text, obj) { methods.a('href', text, obj); }; //.adds src
                    methods.div = function (obj) { methods.c('div', obj); }; //.creates div
                    methods.img = function (obj) { methods.c('img', obj); }; //.creates img
                    methods.span = function (obj) { methods.c('span', obj); }; //.creates span
                    methods.style = function (obj) { methods.c('style', obj); }; //.creates style
                    methods.$ul = function (obj) { methods.c('ul', obj); }; //.creates ul
                    methods.$li = function (obj) { methods.c('li', obj); }; //.creates li
                    methods.$a = function (obj) { methods.c('a', obj); }; //.creates li

                    methods.di = function (id, obj) { methods.c('div', obj); methods.a('id', id); }; //.creates div, sets id
                    methods.dc = function (cls, obj) { methods.c('div', obj); methods.addClass(cls); }; //.creates div, sets class
                    methods.dic = function (id, cls, obj) {
                        methods.di(id, obj);
                        methods.addClass(cls);
                    }; //.creates div, sets id and class
                    methods.dict = function (id, cls, to, obj) {
                        methods.di(id, obj);
                        methods.addClass(cls);
                        methods.to(to);
                    }; //.creates div, sets id and class, and appends to "to"
                    methods.dct = function (cls, to, obj) {
                        methods.dc(cls, obj)
                        methods.to(to);
                    }; //.creates div, sets class, and appends to "to"

                    var wrap = function () { return ctxEl; };
                    Object.keys(methods).forEach(function (key) {
                        var method = methods[key];
                        wrap[key] = function () { method.apply({}, arguments); return wrap; };
                    });
                    return wrap;
                };

                var sample = gen();
                var masterGen = {};
                Object.keys(sample).forEach(function (key) { //todm ... works for functions ? not only for objects?
                    masterGen[key] = function () { return gen()[key].apply({}, arguments); };
                });
                return masterGen;

            })();
        // \\// DOM wrap
    }
    //***************************************************************************
    // \\// ns.$$ ... dom wrapp
    //***************************************************************************



})();



// //\\// debugger
//        non-dispensable for mobiles
//        version july 4, 2018
(function () {
    var ns = window.b$l;




    // creates debugger once per application
    ns.createDebugger = function () {
        if (ns.d) return;
        ///Checks if bsl-debug textarea exists and 
        /// outputs to debug and scrolls to the end.
        /// If debWind-fragment is commented-out, this function does nothing
        /// and in the code it is still safe to use the lines:
        /// Usage: window.b$l.d(text)
        ns.d = function (text) {
            //ccc( Date.now().toString().substr( -6 ) + ' ' + text );
            if (!debWind) return;
            debWind.value += '\n' + text;
            debWind.scrollTop = debWind.scrollHeight;
        };
        var debWind = null;
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

})();

(function () {
    var ns = window.b$l;




    //=========================================================
    // //\\ ecapes html specials
    //=========================================================
    var amp_re = /&/g;
    var lt_re = /</g;
    var gt_re = />/g;
    var line_feed_re = /\r\n|\r|\n/g;
    ns.htmlesc = function (str) {
        return str.replace(amp_re, '&amp;').replace(lt_re, '&lt;').replace(gt_re, '&gt;');
    }

    ns.pre2fluid = function (str) {
        return str.replace(line_feed_re, '<br>');
    }
    //=========================================================
    // \\// ecapes html specials
    //=========================================================



    //=========================================================
    // //\\ configures from URL
    //=========================================================
    ns.url2conf = function (conf) {
        //      if supplied, it overrides internal application conf 
        //      format: ...index.html?conf=a.b.c.d=4,a.b.e=5
        var urlPars = window.location.search || '';
        /*
        var urlPathname = window.location.pathname;
        var urlProtocol = window.location.protocol;
        var urlHostname = window.location.hostname;
        var urlPort     = window.location.port + '';
        */
        var urlConfRe = /(?:&|\\?)conf=([^&]+)/i;
        var urlConf = urlPars.match(urlConfRe);
        if (urlConf) {
            urlConf = urlConf[1].split(',');
            urlConf.forEach(function (opt) {
                var cc = opt.split('=');
                if (cc[1]) {
                    //let user to say "yes" or "no"
                    cc[1] = cc[1] === "yes" ? true : (cc[1] === "no" ? false : cc[1]);
                } else {
                    ////missed parameter p in x=p is ignored
                    return;
                }
                ns.dots2object(cc[0], cc[1], conf)
                //conf.urlConf[cc[0]]=cc[1];
            });
        }
        return conf;
    }
    //=========================================================
    // \\// configures from URL
    //=========================================================

    // //\\ helpers
    ns.prop2prop = function (target, source) {
        if (source) {
            Object.keys(source).forEach(function (key) {
                target[key] = source[key];
            });
        }
        return target;
    };



    ///updates properties of object obj from single key-value
    ///pair "name, value"
    ns.dots2object = function (name, value, obj) {
        var tokens = name.split('.');
        var len = tokens.length;
        var len1 = len - 1;
        if (len1 < 0) {
            obj[name] = value;
            return obj;
        }
        var prop = tokens[0];
        for (var ii = 0; ii < len1; ii++) {
            //:: appends objects if missed
            if (!obj[prop] || typeof obj[prop] !== 'object') obj[prop] = {};
            obj = obj[prop];
            var prop = tokens[ii + 1];
        }
        obj[prop] = value;
        return obj;
    }


    ///sugar for Object.keys( obj ).forEach ...
    ns.eachprop = function (obj, callBack) {
        Object.keys(obj).forEach(function (key) {
            callBack(obj[key], key);
        });
    };

    ///generalizes Array.map() to Object.map()
    ns.eachmap = function (obj, callBack) {
        var objReturn = {};
        Object.keys(obj).forEach(function (key) {
            objReturn[key] = callBack(obj[key], key);
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
    var paste_non_arrays = ns.paste = ns.paste_non_arrays = function (wall, paper, level, skip_undefined, refdepth, recdepth) {

        level = level || 0;
        var t = typeof paper;

        //.Arguments sugar: pasting nothing does not change wall
        if (!level && (t === 'undefined' || paper === null)) return wall;

        //.Returns back non-object-type value
        if (t === 'undefined' || t === 'string' || t === 'boolean' || t === 'number' || t === 'function' || paper === null) {
            return paper;
        }

        ///Reduces the "deep-copy" to reference copy for leveles beneath reference-depth
        if (refdepth || refdepth === 0) {
            if (level > refdepth) return paper;
        }

        ///Recursion limit is exceeded. Truncates recursion by recdepth value.
        if ((recdepth || recdepth === 0) && level > recdepth) {
            return '';
        }


        ///Paper is non-void array or object. If wall do not "match" the paper, making wall an object.
        if (typeof wall !== 'object' || wall === null) {
            wall = {};
        }

        var isArrayPaper = Array.isArray(paper);
        if (isArrayPaper && !Array.isArray(wall)) {
            ////Paper is array and wall is not. Morthing wall to array but preserve its properties.
            var wall_preserved = wall;
            wall = [];
            //.Returns preserved wall's properties to wall-as-array.
            if (typeof wall_preserved.length !== 'undefined') {
                ////edge-calse does not work: the only problem is when wall_preserved.length is defined.
                ////todm: the only problem is when wall_preserved.length is defined.
                throw "copying array to object with existing object.length property";
            }
            paste_non_arrays(wall, wall_preserved, level, skip_undefined, refdepth, null);
        };

        ///Now both wall and paper are objects of the same type. Pasting their properties.
        var hasOwn = Object.prototype.hasOwnProperty;
        for (var p in paper) {
            if (hasOwn.call(paper, p)) //when works on arrays, then not fails on 'length'? bs "length" is notOwnProperty
            {
                if (p !== 'length') {
                    paper[p];
                    var theValue = paste_non_arrays(wall[p], paper[p], level + 1, skip_undefined, refdepth, recdepth);

                    if (!((isArrayPaper || skip_undefined) && typeof theValue === 'undefined')) {
                        wall[p] = theValue;
                    }
                } else {
                    throw 'The subroutine, paste_non_arrays, does not allow to copy property "length".';
                }
            }
        }
        return wall;
    };// ...paste_non_arrays=function...

})();




///global css manager;
///gradually adds and updates global css
///as page loads at landing
///keeping css in one html-style-element;
(function () {
    var ns = window.b$l;
    var globalCss = ns.sn('globalCss');
    var cssText = '';
    var cssDom$ = null;
    globalCss.update = update;
    globalCss.addText = addText;
    globalCss.getText = getText;
    globalCss.add8update = addAndUpdate;
    return; //****************************





    function update(moreText) {
        if (!cssDom$) {
            cssDom$ = ns.$$.style().to(document.head);
        }
        if (moreText) { cssText += moreText; }
        cssDom$.html(cssText);
    };
    function addText(text) {
        cssText += text;
    };
    ///helps to cooperate with other Css builder
    ///by avoiding creation of extra own style-html
    function getText() {
        return cssText;
    };
    function addAndUpdate(text) {
        addText(text);
        update();
        ///good place to output assembled css for later static use
    }
})();




(function () {
    var ns = window.b$l;
    ns.loadScript = function (src, onload, type) {
        //https://developer.mozilla.org/en-US/docs/Web/HTTP/
        //      Basics_of_HTTP/MIME_types#JavaScript_types
        type = type || 'text/javascript';
        var scrip = document.createElement('script');
        scrip.onload = onload;
        document.head.appendChild(scrip);
        //https://medium.com/@vschroeder/javascript-how-to-execute-code-from-an-
        //asynchronously-loaded-script-although-when-it-is-not-bebcbd6da5ea
        scrip.src = src;
    }
})();



(function () {
    var ns = window.b$l;
    ns.createDebugger();
    ns.conf = ns.url2conf({});
})();



(function () {
    var ns = window.b$l = window.b$l || {};
    var fapp = ns.fapp = ns.fapp || {};

    // //\\ updated automatically. Don't edit these strings.
    fapp.version = 265; //application version
    // \\// updated automatically. Don't edit these strings.

})();

/************************************************************
    Beaver $cript Library.
    Lite weight JavaScript Utilities.
    Copyright (c) 2018-2019 Konstantin Kirillov.
    License MIT.
*************************************************************/

(function () {
    var ns = window.b$l = window.b$l || {};
    var nheap = ns.nheap = ns.nheap || {};
    var methods = ns.methods = ns.methods || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ccc = window.console.log;

    //.API=loadedImages[ listItem.id ] ={ img:img, listItem:listItem };
    imagesRack.loadedImages = {};
    methods.loadImages = loadImages;
    methods.getDataURI = getDataURI;
    //0000000000000000000
    return;
    //0000000000000000000





    ///loads images from list and calls callbacks per
    ///image and per list-completion
    function loadImages(lastCb, imgList) {
        //:both these arrays contain completionItems
        var completionList = [];
        var completionCount = 0;

        function checkCompletion() {
            if (completionCount === imgList.length) {
                lastCb(completionList);
            }
        }
        imgList.forEach(function (listItem, ix) {
            var img = new Image();
            var completionItem = { img: img, listItem: listItem };

            completionList.push(completionItem);
            imagesRack.loadedImages[listItem.id] = completionItem;

            img.onload = function () {
                completionCount++;
                listItem.cb && listItem.cb(img, ix);
                checkCompletion();
            }
            img.src = listItem.src;
        });
    }

    ///converts images to data-image format
    function getDataURI() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        Object.keys(imagesRack.loadedImages).forEach(function (key) {
            var rack = imagesRack.loadedImages[key];
            var bImg = rack.img;
            canvas.width = bImg.naturalWidth;
            canvas.height = bImg.naturalHeight;
            ctx.drawImage(bImg, 0, 0, canvas.width, canvas.height);
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

(function () {
    var ns = window.b$l = window.b$l || {};
    var nheap = ns.nheap = ns.nheap || {};
    var nsmethods = ns.methods = ns.methods || {};
    var ccc = window.console.log;

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
    function putCommasToBigNumbers(theNumber, toFloatDigits) {
        if (typeof theNumber === 'number') {
            var numbStr = typeof toFloatDigits === 'number' ?
                theNumber.toFixed(toFloatDigits) : theNumber + '';
        } else {
            var numbStr = theNumber;
        }
        if (numbStr.indexOf('e') > -1 || numbStr.indexOf('E') > -1) return numbStr;

        var decPoint = numbStr.indexOf('.');
        decPoint = decPoint === -1 ? numbStr.length : decPoint;
        if (decPoint < 4) return numbStr;
        var result = numbStr.substring(decPoint, numbStr.length);
        for (var ix = 0; ix < decPoint; ix++) {
            var char = numbStr.charAt(decPoint - ix - 1);
            if (char !== '-') {
                if (!(ix % 3) && ix !== 0) { result = ',' + result; }
            }
            result = char + result;
        }
        return result;
    }


})();



//https://stackoverflow.com/questions/415160/best-method-of-instantiating-an-xmlhttprequest-object
//It looks like MS started common way since IE7:
//  https://en.wikipedia.org/wiki/Ajax_(programming)#History
//  mdn: supported versions
(function () {
    var ns = window.b$l = window.b$l || {};
    ns.ajax = createAjaxFramework();

    //000000000000000000000000
    return;
    //000000000000000000000000





    function createAjaxFramework() {
        var ajy = {};
        var xml = null;
        if (typeof XMLHttpRequest === 'undefined') {
            alert('no ajax available in the browser');
            return;
        }
        xml = new XMLHttpRequest();
        if (xml.overrideMimeType) {
            xml.overrideMimeType('text/xml'); //for quirky FF or FireBug.
        }

        //API is:
        ajy.xml = xml;
        ajy.send = send;
        return ajy;


        //API is:
        function send(ajaxURL, method, onchange, onerror) {
            var flag = true;
            method = method || 'GET';

            var onchangeWrap = function (ajy) {
                if (xml.readyState === 4) {
                    if (xml.status === 200) {
                        onchange(ajy);
                    } else {
                        onerror && onerror('Ajax problems with URL ' +
                            ajaxURL);
                    }
                }
            };
            var request = function () {
                try {
                    xml.open(method, ajaxURL, flag);
                    xml.send(null);
                } catch (e) {	//	TODM
                    //Give up.
                    //xml.send(null);
                }
            };
            xml.onreadystatechange = function () { onchangeWrap(ajy); };
            request();
        };
    }

})();

(function () {
    var ns = window.b$l;
    var sn = ns.sn;
    var nsmethods = sn('methods');

    nsmethods.loadAjaxFiles = loadAjaxFiles;
    //000000000000000000000000000000
    return;
    //000000000000000000000000000000







    //===============================================================================
    // //\\ microAPI to load list of files
    //===============================================================================
    function loadAjaxFiles(filesList, lastCb) {
        var completionCount = 0;
        var loadedFiles = [];
        var loadedFilesById = {};

        filesList.forEach(function (fileItem, ix) {

            var xml = new XMLHttpRequest();
            try {
                xml.open('GET', fileItem.link, true);
                xml.send(null);
                xml.onreadystatechange = processIfGood;
            } catch (e) {	//	TODM
                //Give up.
                completionCount++;
                checkCompletion(fileItem);
            }
            function processIfGood() {
                if (xml.readyState === 4) {
                    if (xml.status === 200) {
                        fileOnLoad();
                    } else {
                        //Give up.
                        completionCount++;
                        checkCompletion(fileItem);
                        //onerror && onerror( 'Ajax problems with URL ' +
                        //         ajaxURL );
                    }
                }
            }

            function fileOnLoad() {
                var loadedItem = { text: xml.responseText, fileItem: fileItem };
                //ccc( 'success: ', loadedItem );
                loadedFiles.push(loadedItem);
                if (fileItem.id) {
                    loadedFilesById[fileItem.id] = loadedItem;
                }
                completionCount++;
                //ccc( completionCount + ' loaded ' + fileItem.src );
                fileItem.cb && fileItem.cb(loadedItem);
                checkCompletion(fileItem);
            }
        });
        return; //rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr

        function checkCompletion(fileItem) {
            if (completionCount === filesList.length) {
                lastCb && lastCb(loadedFilesById, loadedFiles);
            }
        }
    }
    //===============================================================================
    // \\// microAPI to load list of files
    //===============================================================================

})();


(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var fapp = ns.fapp = ns.fapp || {};
    var fconf = fapp.conf = fapp.conf || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.loadCharts = loadCharts;
    methods.makeChartsOptions = makeChartsOptions;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000







    ///prepares options to call Highcharts
    function makeChartsOptions() {
        //contCharts.length = 1;
        contCharts.forEach(function (chartRack) {
            var widgetDef = chartRack.widgetDef;
            var options = chartRack.options;
            if (widgetDef && widgetDef.time) {
                options.series[0].data =
                    chartRack.dataTable.map(function (row) {
                        return [row[widgetDef.time], row[chartRack.fieldName]];
                    });
                //.outputs assembled chart to html-page nicely formatted
                //$$.c('pre').to( document.body ).ch(
                //    $$.div().html( JSON.stringify( chartRack.options, null, '    ' )));

            }
        });
    }


    function loadCharts(continueAfterChartsLoaded) {
        if (contCharts.length === 0) {
            continueAfterChartsLoaded();
            return;
        }

        if (fconf.EXPORT_CHARTS_2_IMAGES_LOCALLY) {
            doProcessExportLocally();
        } else {
            doProcessExportRemotely();
        }
        return;







        //===================================
        // //\\ calls local export
        //===================================
        function doProcessExportLocally() {
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
                try {
                    //console.log( filename );
                    var piggyBackCounter = parseInt(filename);
                    insertImage(dataURL, piggyBackCounter)
                    // //\\ good debug
                    //if( piggyBackCounter === 1 ) ccc( dataURL );
                    //myImage.src = dataURL;
                    //ccc( 'chart image ' + piggyBackCounter + ' added to pdfDoc-options' );
                    // \\// good debug
                    arrivedCounter++;
                    if (arrivedCounter >= contCharts.length) {
                        //ccc( 'all charts are converted' );
                        //not good to reset exporter set this way here: arrivedCounter = 0;

                        //.missing this setTimeout and calling this function directly
                        //.apparently creates repeated calls to exporter in
                        //.case of the function errors and leading to big mess
                        setTimeout(continueAfterChartsLoaded, 1);
                    }
                } catch (err) {
                    ccc('err in downloadURL=', err);
                }
            };
            callLocalConverter();
            return;

            function callLocalConverter() {
                var chartRack = contCharts[counter];
                chartRack.options = ns.paste(chartRack.options,
                    {
                        exporting: {
                            filename: '' + counter,
                            fallbackToExportServer: false, //true,
                            error: function () { ccc('error in exporting: ', arguments); },
                            enabled: false // hides button
                        }
                    });
                chartRack.options.chart.events =
                    {
                        load: function (event) {
                            //ccc( Date.now() +' after load');
                            if (!this.userOptions.chart.forExport) {
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
                    .css('position', 'absolute')
                    .css('left', '-10000px')
                    ();
                Highcharts.chart(container, chartRack.options);
                counter++;

                if (counter < contCharts.length) {
                    ////perhaps this is good to split conversion a bit,
                    ////this is why delay is 1 ms
                    setTimeout(callLocalConverter, 1);
                }
            }
        }
        //===================================
        // \\// calls local export
        //===================================




        //===================================
        // //\\ calls remote export
        //===================================
        function doProcessExportRemotely() {
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
            function runNextAjax() {
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
                if (counter < contCharts.length) {
                    setTimeout(runNextAjax, AJAX_CLOUD_SERVICE_DELAY);
                } else {
                    runPromise();
                }
            }
            //===================================
            // \\// delayed ajax to cloud-service
            //===================================


            function runPromise() {
                Promise.all(ajaxesForPromice).then(values => {
                    values.forEach(function (value, vix) {
                        insertImage(values[vix], vix, 'data:image/png;base64,');
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
    function insertImage(imgData, vix, datImPrefix) {
        datImPrefix = datImPrefix || ''
        var chartRack = contCharts[vix];

        if (chartRack.ddContRack) {
            var insertee = chartRack.ddContRack;
        } else {
            var ix = chartRack.ddContIx;
            var colIx = chartRack.columnIx;
            if (colIx || colIx === 0) {
                ////charts in page's columns
                var insertee = ddCont[ix].columns[colIx];
            } else {
                ////charts in page: outside of columns
                var insertee = ddCont[ix];
            }
        }
        if (insertee.image) {
            ccc('incorrect program behaviour: image inserts twice to ' +
                colIx + ' ' + ix + ' former img=' + insertee.image.substring(0, 100) +
                ' new img= ' + (datImPrefix + imgData).image.substring(0, 100)
            );
        }
        insertee.image = datImPrefix + imgData;
    }
    //========================================
    // \\// inserts image into doc def content
    //========================================

})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var nheap = ns.nheap = ns.nheap || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var ddDef = nheap.ddDef = nheap.ddDef || {};
    var methods = ns.methods = ns.methods || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ccc = window.console.log;

    methods.addTOC = addTOC;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000




    function addTOC(header, subheader) {
        if (header) {
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
                    tocStyle: { color: 'black', fontSize: 13 },
                    //tocNumberStyle: { italics: true, decoration: 'underline' },
                    tocNumberStyle: { color: 'black', fontSize: 13 },
                }
            );
        }

        if (subheader) {
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
                    tocStyle: { color: 'grey', fontSize: 13 },
                    //tocNumberStyle: { italics: true, decoration: 'underline' },
                    tocNumberStyle: { color: 'grey', fontSize: 13 },
                }
            );
        }
    }



})();

(function () {
    var ns = window.b$l = window.b$l || {};

    var nheap = ns.nheap = ns.nheap || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var methods = ns.methods = ns.methods || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ccc = window.console.log;

    methods.tableTpl_2_content = tableTpl_2_content;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000








    //======================================
    // //\\ calculates main content table
    //======================================
    function prepareTableBody(rack) {
        var rows = rack.table;
        var caption = rack.caption;
        var columns = rack.columns;
        var widthPercent = rack.widthPercent || 100;
        var columnsWithTriangleDecoration = rack.columnsWithTriangleDecoration || {};

        // //\\ composing rows
        var captions = [];
        var fieldNames = [];
        columns.forEach(function (column) {
            var fieldName = Object.keys(column)[0];
            var fieldHeader = column[fieldName];
            captions.push(fieldHeader.caption);
            fieldNames.push(fieldName);
        });


        // //\\ removes meta-structure from rows
        var metaRows = [];
        //this makes rows "flat" key-value-JS-objects
        //places meta-structure into metaRows
        //very slow?
        var newBody = rows.map(function (row, ix) {
            var isArr = Array.isArray(row);
            metaRows[ix] = isArr ? row[0] : {};
            var trueRow = isArr ? row[1] : row;
            return fieldNames.map(function (fieldName) {
                return trueRow[fieldName];
            });
        });
        // \\// removes meta-structure from rows

        //.attaches captions on top of all rows
        var body = [captions].concat(newBody);
        metaRows = [{}].concat(metaRows);
        //:table row layout
        var decorsInRaw = 3;

        var rowsCount = body.length;
        var rowCellsCount = body[0].length;
        var decorationWidth = 2;
        var firstCellIncrease = 6;
        var rowCellWidth = (
            100 -
            nheap.reportViewConf.pageMargins[3] *
            0.20 -
            firstCellIncrease -
            decorsInRaw * decorationWidth) / rowCellsCount;
        rowCellWidth *= widthPercent / 100;

        var widths = [];


        //:spawning body
        var newBody = [];
        var num2commasStr = methods.putCommasToBigNumbers;
        body.forEach(function (row, ix) {
            newBody[ix] = [];

            row.forEach(function (cell, cix) {

                //---------------------------------
                // //\\ cuts extra digits after "."
                //---------------------------------
                if (typeof cell === 'number') {
                    var cellNumber = cell;
                    //cell = cell.toFixed(2);
                    cell = num2commasStr(cell, 2);
                }
                //---------------------------------
                // \\// cuts extra digits after "."
                //---------------------------------

                if (ix === 0) {
                    var newCell = {
                        text: cell,
                        //format: left,top,right,bottom:
                        border: [false, false, false, false],
                        color: '#999'
                    }
                } else if (ix === rowsCount - 1) {
                    if (cix === 0 || cix === row.length - 1) {
                        var newCell = { text: cell, border: [false, false, false, false] }
                    } else {
                        var newCell = { text: cell, border: [true, true, true, false] }
                    }
                } else {
                    if (cix === 0 || cix === row.length - 1) {
                        var newCell = { text: cell, border: [false, true, false, true] };
                    } else {
                        var newCell = { text: cell, border: [true, true, true, true] };
                    }
                }
                if (cix === 0) {
                    newCell.alignment = 'left';
                } else {
                    newCell.alignment = 'left';
                }
                if (metaRows[ix].bold) {
                    newCell.bold = true;
                    newCell.fillColor = '#eee';
                }

                newBody[ix].push(newCell);
                if (ix === 0) {
                    widths.push(rowCellWidth);
                }
                if (columnsWithTriangleDecoration[cix + '']) {
                    newBody[ix][newBody[ix].length - 1].border[2] = false;
                    if (ix === 0) {
                        newCell = {
                            text: ""
                        };
                    } else {
                        newCell = {
                            margin: [0, 5.5, 0, 0],
                            width: 4
                        };
                        if (cellNumber === 0) {
                            ////makes an extra cell empty
                            newCell.text = '';
                        } else {
                            ////in an extra cell,
                            ////red/green triangles which indicate loss/gain
                            var wImg = cellNumber > 0 ? 'green-triangle' : 'red-triangle';
                            newCell.image = imagesRack.loadedImages[wImg].dataURI;
                            newCell.margin = cellNumber > 0 ? [0, 6.5, 0, 0] : [0, 7, 0, 0];
                        }
                    }
                    newCell.border = ix === 0 ?
                        [false, false, false, false] :
                        (cix === row.length - 1 ?
                            [false, true, false, false] :
                            [false, true, true, false]);

                    newBody[ix].push(newCell);
                    if (ix === 0) {
                        widths.push(decorationWidth);
                    }
                } else {
                    if (ix === 0) {
                        widths[widths.length - 1] += decorationWidth;
                    }
                }
            });
        });
        widths[0] += firstCellIncrease;
        widths = widths.map(function (width) {
            return width.toFixed(2) + '%';
        });
        return { caption: caption, body: newBody, widths: widths };
    }
    //======================================
    // \\// calculates main content table
    //======================================


    //======================================
    // //\\ builds table content for doc def
    //======================================
    function tableTpl_2_content(tableRack) {
        var pholder = tableRack.contentPlaceholderToAttach || ddCont;
        var tableTpl = prepareTableBody(tableRack);
        var widths = tableTpl.widths;

        ///if placeholder is not a stack then
        ///insert stack into it and make
        ///new stack a placeholder
        if (!Array.isArray(pholder)) {
            pholder = pholder.stack = [];
        }

        pholder.push(
            {
                text: tableTpl.caption,
                fontSize: 14,
                margin: tableRack.margin || [0, 33, 0, 15]
            }
        );

        pholder.push(
            {
                layout: {
                    hLineWidth: () => 0.01,
                    vLineWidth: () => 0.01,
                    hLineColor: '#cdcdcd',
                    vLineColor: '#cdcdcd',
                    paddingLeft: function (i, node) { return 2; },
                    paddingRight: function (i, node) { return 7; },

                    //.combined with heights
                    //.cannot be non-function?
                    paddingTop: function (i, node) {
                        return tableRack.cellPaddingTop || 8;
                    },
                    paddingBottom: function (i, node) {
                        return tableRack.cellPaddingBottom || 4;
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
                    widths: widths,
                    body: tableTpl.body
                }
            }
        );
    }
    //======================================
    // \\// builds table content for doc def
    //======================================

})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var fapp = ns.fapp = ns.fapp || {};
    var fconf = fapp.conf = fapp.conf || {};
    var fmethods = fapp.methods = fapp.methods || {};
    var ccc = window.console.log;


    fconf.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


    fmethods.gainLossColor = gainLossColor;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000



    ///returns colors depending on value
    ///Input: colorX - optional: custom color for
    //                 3 colors: gain, zero, loss
    function gainLossColor(value, color1, color2, color3) {
        var gain = arguments[1] || '#00aa00';
        var zero = arguments[2] || '#444444';
        var loss = arguments[3] || '#dd0000';
        if (value > 0) {
            return gain;
        } else if (value === 0) {
            return zero;
        } else {
            return loss;
        }

    }
    //========================================
    // \\// inserts image into doc def content
    //========================================

})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var nheap = ns.nheap = ns.nheap || {};
    var methods = ns.methods = ns.methods || {};
    var nsmethods = ns.sn('methods');

    var fapp = ns.fapp = ns.fapp || {};
    var fconf = fapp.conf = fapp.conf || {};

    nsmethods.readDataIntoApplication = readDataIntoApplication;
    return;






    function readDataIntoApplication() {
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

        if (nheap.content_data) {
            ccc('OK. data ported by bypassing ajax ... ');
            ns.reportConf = nheap.content_data['report-config.json'],
                methods.start_loadImages();
        } else {
            var fileId = 'app-data-in-one'; //todm move to conf.
            nsmethods.loadAjaxFiles(
                [{ id: fileId, link: fconf.allDataURL }],
                //on success
                function (loadedFilesById) {
                    //for debug
                    //$$.c('pre').to( document.body ).ch(
                    //    $$.div().html( ajy.xml.responseText ));
                    nheap.content_data = JSON.parse(loadedFilesById[fileId].text);
                    ns.reportConf = nheap.content_data['report-config.json'],
                        methods.start_loadImages();
                }
            );
        }
    }

})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var methods = ns.methods = ns.methods || {};
    var nsmethods = ns.sn('methods');

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var ddDef = nheap.ddDef = nheap.ddDef || {};
    var contCharts = nheap.contCharts = nheap.contCharts || [];

    var fapp = ns.fapp = ns.fapp || {};
    var fconf = fapp.conf = fapp.conf || {};


    var ccc = window.console.log;

    var pdfMake_is_in_busy_state = true;
    var pdfCreated = null;

    //is not fired by unknown reason:
    //window.addEventListener( "DOMContentReady", readAppData );

    window.addEventListener("load", readAppData);
    methods.start_loadImages = start_loadImages;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000



    ///delays data reading until the name
    ///nsmethods.readDataIntoApplication is defined after
    ///"DOMContentReady" event
    function readAppData() {
        nsmethods.readDataIntoApplication();
    }



    //======================================
    // //\\ runs application
    //======================================
    function run_app() {
        putAppVersionToFrontPage();
        methods.buildDocDef();
        methods.makeChartsOptions();
        //return; //skips sending charts to cloud-service
        methods.loadCharts(function () {
            var button = document.getElementById('generate-pdf');
            if (fconf.setAnOpenButton) {
                button.addEventListener('click', function () {
                    ////solution works without timeout, but
                    ////this timeout does not hurt
                    setTimeout(createDoc, 1);
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


    function putAppVersionToFrontPage() {
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
    function createDoc() {
        //ccc( 'knocking ...' )
        if (pdfMake_is_in_busy_state) return;

        //---------------------------------------
        // //\\ disables button
        //---------------------------------------
        pdfMake_is_in_busy_state = true;
        var button = document.getElementById('generate-pdf');
        if (button) {
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
        var dup = ns.paste({}, ddDef);
        pdfCreated = pdfMake.createPdf(dup);
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
        setTimeout(function () {
            //---------------------------------------
            // //\\ enables button
            //---------------------------------------
            if (button) {
                button.style.opacity = "1";
                button.innerHTML = "Generate Document";
                if (!fconf.setAnOpenButton) {
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
    function start_loadImages() {
        methods.loadImages(
            function () {
                methods.getDataURI();
                run_app();
            },
            imagesRack.imgList
        );
    }
    //======================================
    // \\// loads images
    //======================================

})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var nheap = ns.nheap = ns.nheap || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var ddDef = nheap.ddDef = nheap.ddDef || {};
    var methods = ns.methods = ns.methods || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var fapp = ns.fapp = ns.fapp || {};
    var fconf = fapp.conf = fapp.conf || {};

    var ccc = window.console.log;

    methods.buildDocDef = buildDocDef;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    //======================================
    // //\\ builds doc Definition
    //======================================
    function buildDocDef() {
        prepareDocDef();
        // //\\ builds content
        methods.composeFrontPage();
        methods.composeSection_table_of_contents();
        methods.composeSection2();
        methods.composeSection3();
        methods.composeSection4();
        methods.composeSection5();
        methods.composeSection6();
        methods.composeSection7();
        methods.composeSection9();
        methods.composeSection10();
        methods.composeSection11();
        methods.composeSection12();
        methods.composeSection13();
        methods.composeSection14();
        methods.composeSection15();
        methods.composeSection16();
        methods.composeSection17();
        methods.composeSection_glossaryOfTerms();
        methods.composeSectionFinal();
        ddDef.content = ddCont;
        // \\//  builds content
    }
    //======================================
    // \\// builds doc Definition
    //======================================





    function prepareDocDef() {
        // //\\ gets current date
        if (ns.reportConf["day-month-year"]) {
            ns.nheap.dateStampStr = ns.reportConf["day-month-year"];
        } else {
            var tiimeStamp = new Date();
            var day = tiimeStamp.getDate();
            var month = '00' + (tiimeStamp.getMonth() + 1);
            month = month.substring(month.length - 2, month.length);
            var fullYear = tiimeStamp.getFullYear();
            ns.nheap.dateStampStr = day + '.' + month + '.' + fullYear;
        }
        // \\// gets current date







        var dateFooter =
        {
            stack:
                [
                    {
                        text: ns.reportConf.frontPageTitle + '. Report' + '-' +
                            ns.nheap.dateStampStr + '.',
                        fontSize: 9,
                        margin: [5, 8, 0, 0],
                        color: "#999"
                    },
                    // {
                    //     text: 'Report generator version 0.' +
                    //         fapp.version + '.',
                    //     fontSize: 9,
                    //     margin: [5, 0, 0, 0],
                    //     color: "#999"
                    // }
                ]
        };



        ns.prop2prop(ddDef,
            {
                pageOrientation: 'landscape',
                pageSize: 'A4',
                pageMargins: nheap.reportViewConf.pageMargins,
                footer: function (currentPage, pageCount) {
                    //currentPage counts from 1 ...
                    if (currentPage > 1) {
                        var footer =
                        {
                            columns:
                                [
                                    {
                                        image: imagesRack.loadedImages['brand-logo'].dataURI,
                                        width: 60
                                    },
                                    dateFooter,
                                    {
                                        text: '' + currentPage,
                                        fontSize: 13,
                                        alignment: 'right', margin: [20, 10],
                                        color: "#555"
                                    }
                                ],
                            margin: [20, 0, 0, 15]
                        };
                    } else {
                        var footer =
                        {
                            /*
                            //no sense to output this if front page has this:
                            columns:
                            [
                              dateFooter
                            ],
                            margin : [20,0,0,15]
                            */
                        };
                    }
                    return footer;
                }
            });
    }

})();

//==========================================
// //\\ CONFIGURATION
//      we are not sure how config
//      is set up on the server
//      side, so resorted to
//      this hard-coded config
//      file
//==========================================

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var nheap = ns.nheap = ns.nheap || {};
    var methods = ns.methods = ns.methods || {};
    var nsmethods = ns.sn('methods');

    var fapp = ns.fapp = ns.fapp || {};
    var fconf = fapp.conf = fapp.conf || {};


    //options: comment / uncomment "option" alternatively:
    fconf.setAnOpenButton = true;
    //var option = 'run immediately';


    //******************************************************************
    // data URL configuration
    //==================================================================
    //
    //1.
    //gets all the data in one file from folder-tree
    //uses PHP script and folder traverser
    //fconf.allDataURL = 'app-data-in-folder/app-data-in-one-file.php';
    //
    //2.
    //uses preassembled single JSON file
    fconf.allDataURL = 'app-data-in-one-file/app-data-in-one-file.json';
    //******************************************************************

    //need ns.ajax for this if "false"
    fconf.EXPORT_CHARTS_2_IMAGES_LOCALLY = true;

})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var nheap = ns.nheap = ns.nheap || {};

    nheap.reportViewConf = { pageMargins: [30, 20, 30, 40] };
    nheap.companyColors =
        {
            dB_neutralDark: '#29335d',
            dBlue_grey: '#646e7d',
            dBlue_neurtralLite: '#9fb2c7',
            blue_neutralLite: '#cde4e8',

            greenLight_grey: '#d4e1b6',
            green_neutral: '#a5ae84',
            green_neutralLite: '#b8c7a7',

            violet_neutral: '#7f7fac',
            pink_neutralLite: '#e3c8cc',
            pink_grey: '#d78f89',

            orange_neutral: '#f6c975',

            greyish: '#e3d9c6',
            black_weak: '#211f1f'
        };
    nheap.dataLabelsColor = '#aaa';

})();


(function () {
    var ns = window.b$l = window.b$l || {};
    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};


    //================================================
    // //\\ images to import from computer file system
    //================================================
    imagesRack.imgList =
        [
            /*
            //for debug ... small image
            { src:"img/brand-logo-WF-22.png",
              id:'front-page-image'
            },
            */
            //{ src:"img/telescope-400x.jpeg",
            {
                src: "img/telescope-1000x.jpeg",
                id: 'front-page-image'
            },
            {
                src: "img/brand-logo-no-subtitle-WF-22.png",
                id: 'brand-logo-no-subtitle'
            },
            {
                src: "img/brand-logo-WF-22.png",
                id: 'brand-logo'
            },
            {
                src: "img/water-mark-WF-21-300x.png",
                id: 'water-mark'
            },
            {
                src: "img/green-triangle.png",
                id: 'green-triangle'
            },
            {
                src: "img/red-triangle.png",
                id: 'red-triangle'
            }
        ];
    //================================================
    // \\// images to import from computer file system
    //================================================

})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeFrontPage = composeFrontPage;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeFrontPage() {
        buildFrontImage();
        ddCont[ddCont.length - 1].pageBreak = 'after';
    }



    //==============================        
    // //\\ 
    //==============================
    function buildFrontImage() {
        ddCont.push(
            {
                image: imagesRack.loadedImages['front-page-image'].dataURI,
                fit: [895.0, 900.0],
                //width: 'auto',
                absolutePosition: {
                    x: 0,
                    y: 0
                }
            }
        );
        ddCont.push(
            {
                columns:
                    [
                        {
                            image: imagesRack.loadedImages['brand-logo-no-subtitle'].dataURI,
                            width: 100,
                            margin: [40, 40, 0, 0]
                        },
                        {
                            stack: [
                                {
                                    text: ns.reportConf.frontPageTitle,
                                    fontSize: 22,
                                    bold: true
                                },
                                {
                                    text: "Family Portfolio Review",
                                    fontSize: 19
                                },
                                {
                                    text: ns.nheap.dateStampStr,
                                    fontSize: 19
                                }
                            ],
                            margin: [450, 40, 0, 0]
                        }
                    ]
            });
    }
    //==============================        
    // \\// 
    //==============================


})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection_table_of_contents = composeSection_table_of_contents;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection_table_of_contents() {


        ddCont.push(
            {
                image: imagesRack.loadedImages['water-mark'].dataURI,
                fit: [500.0, 900.0],
                //width: 'auto',
                absolutePosition: {
                    x: 400,
                    y: 0
                }
            }
        );

        ddCont.push({
            text: 'Table of Contents',
            fontSize: 20,
            margin: [0, 55, 20, 0]
        });

        ddCont.push(
            {
                toc: {
                    //.left marg. may align with chart
                    //.last marg. adds the gab to chart
                    fontSize: 30,
                    color: '#333333',
                    bold: true,

                    title: { text: "", style: 'header' },
                    //margin: [ 25, 200, 20, 0],
                    //textMargin: [35, 0, 0, 0],
                    //textStyle: {italics: true},
                    numberStyle: { bold: true }
                }
            });
        ddCont[ddCont.length - 1].pageBreak = 'after';
    }

})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection2 = composeSection2;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection2() {
        addHeader();
        var shift = 210;
        var startX = 60;

        var totals = nheap.content_data
        ["Page 2"]
        ["OverallSummaryAndFamilyMember.txt"]
        ["Table"][0];
        //??
        var gainPercent = totals.GAINLOSS / totals.INVESTED_AMOUNT * 100;

        var topColumns = top3Charts(shift, gainPercent);


        //=======================================
        // //\\ most right top column
        //=======================================
        var finalColumn = {};
        ddCont.push({
            columns: topColumns.concat([finalColumn])
            //positions fancy charts
            , absolutePosition: { x: 26, y: 65 }
        });
        IRR_Column(finalColumn, totals);
        //=======================================
        // \\// most right top column
        //=======================================


        //=======================================
        // //\\ fancy digits over top charts
        //=======================================
        var num2commasStr = methods.putCommasToBigNumbers;

        var totalsTablesColumns =
            [
                totalsTable(num2commasStr(totals.CURRENT_VALUE, 2)),
                totalsTable(num2commasStr(totals.INVESTED_AMOUNT, 2)),
                totalsTable(num2commasStr(totals.GAINLOSS, 2))
            ];
        ddCont.push({
            columns: totalsTablesColumns
            //positions fancy charts
            , absolutePosition: { x: 26, y: 115 }
        });
        //=======================================
        // \\// fancy digits over top charts
        //=======================================

        pageTable();
        //.table title fix
        ddCont[ddCont.length - 2].margin = [0, 170, 0, 0, 0];
        ddCont[ddCont.length - 1].pageBreak = 'after';
    }





    //==============================        
    // //\\ totals table
    //==============================
    function totalsTable(cell1) {
        // //\\ distributes space
        //      for this table'srow:
        //      | value | Cr |
        //      giving "Cr" a bit of space behind
        var wwValueScale = 0.85; //scales value down a bit
        var ww = wwValueScale * cell1.length + 2;
        var widths = [(100 * wwValueScale * cell1.length / ww) + '%',
        (100 * 2 / ww) + '%'
        ];
        // \\// distributes space


        return {
            layout: {
                hLineWidth: () => 0.01,
                vLineWidth: () => 0.01,
                hLineColor: 'transparent',
                vLineColor: 'transparent',
                paddingLeft: function (i, node) { return 2; },
                paddingRight: function (i, node) { return 7; },

                //.combined with heights
                //.cannot be non-function?
                paddingTop: function (i, node) {
                    return 8;
                },
                paddingBottom: function (i, node) {
                    return 4;
                }
            },
            dontBreakRows: true,
            fontSize: 20,
            lineHeight: 1.4,
            color: '#333',
            width: 210,
            table: {
                headerRows: 1,
                heights: 50,
                dontBreakRows: true,
                widths: widths,
                body: [[
                    {
                        text: cell1,
                        fontSize: 30,
                        alignment: 'right',
                        //.disable this line to see space distribution
                        //.for cells
                        border: [false, false, false, false],

                        color: 'black'
                    },
                    {
                        text: "Cr",
                        border: [false, false, false, false],
                        fontSize: 30,
                        alignment: 'left',
                        color: 'grey'
                    }
                ]]
            }
        };
    }
    //==============================        
    // \\// totals table
    //==============================



    //==============================        
    // //\\ header
    //==============================
    function addHeader() {
        var ptitle = "Overall Summary";
        ddCont.push(
            //header: no dice for classic header:
            {
                text: ptitle,
                margin: [0, 15, 40, 30],
                fontSize: 17,
                bold: true
            }
        );
    }
    //==============================        
    // \\// header
    //==============================




    //==============================        
    // //\\ page top 3 charts
    //==============================
    function top3Charts(shift, gainPercent) {
        var table = nheap.content_data
        ["Page 2"]
        ["OverallSummaryAndFamilyMember.txt"]
        ["Table2"];

        var widgetDef =
        {
            "time": "MONTH_END_DATE",
            "fieldDefs":
                [
                    { fieldName: "CURRENT_VALUE", caption: 'Current Value' },
                    { fieldName: "INVESTED_VALUE", caption: 'Invested Value' },
                    { fieldName: "GAIN", caption: 'Gain (' + gainPercent.toFixed(1) + '%)' }
                ]
        };
        var columns = [];
        widgetDef.fieldDefs.forEach(function (fieldDef, fix) {
            contCharts.push({

                ddContIx: ddCont.length,
                columnIx: fix,
                dataTable: table,
                widgetDef: widgetDef,
                fieldName: fieldDef.fieldName,

                options:
                {
                    "chart": {
                        "colors": [
                            "#cc9944"
                        ]
                        /*
                        ,
                        events : {
                                render : function( event ) {
                                        //"this" is a chart: ccc( 'render', this);
                                        if( state !== 'done') {
                                            var dat = this.series[0].data;
                                            var debugPos = Math.floor(
                                                           ( dat.length - 1 ) / 2 );
                                            state='done';
                                            this.tooltip.refresh( dat[ debugPos ] );
                                        }
                                }
                        }
                        */
                    },
                    plotOptions: {
                        areaspline: {
                            marker: {
                                enabled: false
                            }
                        }
                        /*
                        //must work too
                        ,series: {
                            marker: {
                                enabled: false
                            }
                        }
                        */
                    },

                    "exporting": {
                        "enabled": false
                    },
                    "credits": {
                        "enabled": false
                    },
                    "title": {
                        text: widgetDef.fieldDefs[fix].caption,
                        style: {
                            fontWeight: '400',
                            fontSize: '60px',
                            color: '#aaa'
                        }
                    },
                    tooltip: {
                        enabled: false,
                        useHTML: false,
                        crosshairs: {
                            width: 1,
                            color: 'white'
                            //,dashStyle: 'shortdot'
                        }
                    },
                    xAxis: {
                        visible: false,
                        crosshair: !true,
                        labels: {
                            enabled: false
                        },
                        title: {
                            enabled: false
                        }
                    },
                    yAxis: [{
                        visible: false,
                        crosshair: false,
                        title: {
                            enabled: false
                        }
                    }],
                    "series": [
                        {
                            type: 'areaspline',
                            //type : 'spline',
                            "color": "#e37a78",
                            showInLegend: false,
                            "data": '**to be filled later'
                        }
                    ]
                }

            });
            columns.push({
                margin: [0, 0, 0, 0],
                //image: will come from chart
                fit: [shift, 200],
                //width: 212, //??
                alignment: 'center'
            });
        });
        return columns;
    }
    //==============================        
    // \\// page top 3 charts
    //==============================        


    //==============================        
    // //\\ last upper column
    //==============================
    function IRR_Column(finalColumn, totals) {
        finalColumn.stack = [];
        finalColumn.fontSize = 18;
        finalColumn.color = '#aaa';

        finalColumn.stack.push({
            stack: [
                {
                    text: "IRR",
                    headlineLevel: 1,
                    margin: [20, 10, 10, 0]
                },
                {
                    text: totals.IRR + '%',
                    headlineLevel: 1,
                    margin: [35, 0, 30, 0],
                    fontSize: 23,
                    color: 'black'
                }
            ]
        });
        finalColumn.stack.push({
            stack: [
                {
                    text: "BMIRR",
                    headlineLevel: 1,
                    margin: [20, 10, 10, 0]
                },
                {
                    text: totals.BMIRR + '%',
                    headlineLevel: 1,
                    margin: [35, 0, 30, 0],
                    fontSize: 23,
                    color: 'black'
                }
            ]
        });
    }
    //==============================        
    // \\// last upper column
    //==============================



    //==============================        
    // //\\ page table
    //==============================        
    function pageTable() {
        methods.tableTpl_2_content({
            table: nheap.content_data
            ["Page 2"]
            ["OverallSummaryAndFamilyMember.txt"]
            ["Table1"],
            caption: "Family Members",
            columnsWithTriangleDecoration: { "3": true, "4": true, "5": true },
            columns:
                [
                    { "Family_Member": { "caption": "Name" } },
                    { "Invested_Value": { "caption": "Invested Value (Cr)" } },
                    { "Current_Value": { "caption": "Current Value (Cr)" } },
                    { "Gain_Loss": { "caption": "Gain (Cr)", "green mark": true } },
                    { "IRR": { "caption": "XIRR", "green mark": true } },
                    { "Benchmark_IRR": { "caption": "BM XIRR", "green mark": true } }
                ]
        });
    }
    //==============================        
    // \\// page table
    //==============================        



})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection3 = composeSection3;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection3() {
        methods.addTOC("Portfolio Summary", "Exposure")
        addHeader();
        buildChart({
            fileName: "Exposure(Asset Type).txt",
            chartCaption: "Exposure (Asset Type)",
            chartType: "columnpyramid"
        });
        /*
        var curCon = ddCont[ ddCont.length - 1 ];
        curCon.tocItem = true;
        //curCon.style = 'subheading';
        curCon.tocMargin = [5, 10, 0, 0];
        curCon.tocStyle =  {color: 'grey', fontSize: 13};
        curCon.tocNumberStyle = {color: 'grey', fontSize: 13};
        */

        buildChart({
            fileName: "Exposure(ProductType).txt",
            chartCaption: "Exposure (ProductType)",
            yAxisDisabled: true,
            chartType: "column"
        });
        ddCont[ddCont.length - 1].pageBreak = 'after';
    }



    //==============================        
    // //\\ header
    //==============================
    function addHeader() {
        ddCont.push(
            //header: no dice for classic header:
            {
                text: "Portfolio Summary / Exposure",
                margin: [0, 5, 0, 0],
                fontSize: 15,
                bold: true,
                color: '#d4d',
            }
        );
    }
    //==============================        
    // \\// header
    //==============================





    //==============================        
    // //\\ builds chart
    //==============================
    function buildChart(cartPars) {
        var fileName = cartPars.fileName;
        var chartCaption = cartPars.chartCaption;
        var yAxisDisabled = cartPars.yAxisDisabled;
        var chartType = cartPars.chartType;

        var table = nheap.content_data
        ["Page 3"]
        [fileName]
        ["Table"];
        var colors = table.map(row => row.color);
        var xAxis_categories = table.map(row => row.label);
        var series_data = table.map((row, rix) => [rix, row['weight']]);
        //.decorate bottom rounded corners
        var fake_series = table.map((row, rix) => [rix, row['weight'] / 2]);
        var chartHeight = 240;

        contCharts.push({
            ddContIx: ddCont.length,
            options:
            {
                chart: {
                    width: 777.00,
                    height: chartHeight,
                    //type: 'column'
                    type: chartType
                },
                colors: colors,
                "exporting": {
                    "enabled": false
                },
                "credits": {
                    "enabled": false
                },
                "title": {
                    text: chartCaption,
                    style: {
                        fontWeight: '400',
                        fontSize: '15px',
                        color: '#444'
                    }
                },
                xAxis: {
                    visible: true,
                    tickLength: 0,
                    categories: xAxis_categories,
                    //type: "category",
                    labels: {
                        enabled: true
                    },
                    title: {
                        enabled: false
                    }
                },
                yAxis: [{
                    visible: !yAxisDisabled,
                    title: {
                        text: "Weight (%)",
                        enabled: true
                    }
                }],
                plotOptions: {
                    column: {
                        ////was vital to put fake smaller column on top of
                        ////rounded column
                        grouping: false,
                        shadow: false,
                        borderWidth: 0
                    },
                    columnpyramid: {
                        ////was vital to put fake smaller column on top of
                        ////rounded column
                        grouping: false,
                        shadow: false,
                        borderWidth: 0
                    }
                },

                "series": [
                    {
                        borderRadius: chartType === "column" ? 10 : 0,
                        showInLegend: false,
                        colorByPoint: true,
                        dataLabels: {
                            color: nheap.dataLabelsColor,
                            /*
                            style:  {"color": "contrast",
                                     "fontSize": "11px", "fontWeight": "bold",
                                     "textOutline": "1px contrast" },
                            */
                            style: { "textOutline": "none" },
                            enabled: chartType === "column" || chartType === "bar"
                        },
                        "data": series_data
                    },

                    {
                        showInLegend: false,
                        colorByPoint: true,
                        "data": fake_series
                    }
                ]
            }

        });
        ddCont.push({
            width: 777,
            height: chartHeight,
            margin: [0, 0, 0, 0],
            //image: will come from chart
        });
    }
    //==============================        
    // \\// builds chart
    //==============================        


})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection4 = composeSection4;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection4() {
        pageTables();
        ddCont[ddCont.length - 1].pageBreak = 'after';
    }




    //==============================        
    // //\\ page table
    //==============================        
    function pageTables() {
        var columns = { columns: [[], []] };
        ddCont.push(columns);

        methods.tableTpl_2_content({
            contentPlaceholderToAttach: columns.columns[0],
            table: nheap.content_data
            ["Page 4"]
            ["Top10Holdings.txt"]
            ["Table"],
            caption: "Top 10 Holdings",
            columns:
                [
                    { "Scheme_Name": { "caption": "Security" } },
                    { "Asset_Class": { "caption": "Asset Type" } },
                    { "Weight": { "caption": "Weight" } },
                ]
        });
        methods.tableTpl_2_content({
            contentPlaceholderToAttach: columns.columns[1],
            table: nheap.content_data
            ["Page 4"]
            ["Top10Position.txt"]
            ["Table"],
            caption: "Top 10 Positions",
            columns:
                [
                    { "EQUITY": { "caption": "Security" } },
                    { "sector_name": { "caption": "Product Type" } },
                    { "CONTRIBUTION": { "caption": "XIRR" } },
                ]
        });
    }
    //==============================        
    // \\// page table
    //==============================        



})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection5 = composeSection5;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection5() {
        methods.addTOC(null, "Performance")
        addHeader();
        buildChart({
            fileName: "HistoricalPerformanceVsBlendedBenchmark.txt",
            chartCaption: "Historical Performance Vs. Blended Benchmark",
            chartType: "column"
        });
        ddCont[ddCont.length - 1].pageBreak = 'after';
    }



    //==============================        
    // //\\ header
    //==============================
    function addHeader() {
        ddCont.push(
            //header: no dice for classic header:
            {
                text: "Portfolio Summary / Performance",
                margin: [0, 5, 0, 0],
                fontSize: 15,
                bold: true,
                color: '#d4d'
            }
        );
    }
    //==============================        
    // \\// header
    //==============================





    //==============================        
    // //\\ builds chart
    //==============================
    function buildChart(cartPars) {
        var fileName = cartPars.fileName;
        var chartCaption = cartPars.chartCaption;
        var yAxisDisabled = cartPars.yAxisDisabled;
        var chartType = cartPars.chartType;
        var overrideColumnBottom = cartPars.overrideColumnBottom;

        var table = nheap.content_data
        ["Page 5"]
        [fileName]
        ["Table"];

        var table1 = nheap.content_data
        ["Page 5"]
        [fileName]
        ["Table1"];

        /*
         "ID":1,
         "FROMDATE":"2019-01-01T00:00:00",
         "TODATE":"2019-02-19T00:00:00",
         "PERIOD_IN_MONTHS":"YTD",
         "XIRR":-17.84


         "ID":1,
         "FROMDATE":"2019-01-01T00:00:00",
         "TODATE":"2019-02-19T00:00:00",
         "PERIOD_IN_MONTHS":"YTD",
         "XIRR":3.96



        */



        var seriesColors = ['#cee4e8', '#646e7d'];
        var xAxis_categories = table.map(row => row.PERIOD_IN_MONTHS);
        var series_data = table.map((row, rix) => [row['ID'], row['XIRR']]);
        var series1_data = table1.map((row, rix) => [row['ID'], row['XIRR']]);


        if (overrideColumnBottom) {
            ////decorates bottom rounded corners
            var fake_series = table.map((row, rix) => [rix, row['weight'] / 2]);
        }
        var chartHeight = 500;
        var chartWidth = 750;
        var yAxisTitle = "Returns (%)";

        var options =
        {
            chart: {
                styledMode: false,
                width: chartWidth,
                height: chartHeight,
                //type: 'column'
                type: chartType
            },
            "exporting": {
                "enabled": false
            },
            "credits": {
                "enabled": false
            },
            "title": {
                text: chartCaption,
                align: 'left',
                style: {
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#444'
                }
            },
            xAxis: {
                visible: true,
                tickLength: 0,
                categories: xAxis_categories,
                //type: "category",
                labels: {
                    enabled: true
                },
                title: {
                    enabled: true
                }
            },
            yAxis: [{
                visible: !yAxisDisabled,
                title: {
                    text: yAxisTitle,
                    enabled: true
                }
            }],
            plotOptions: {
                column: {
                    ////was vital to put fake smaller column on top of
                    ////rounded column
                    //grouping: false,
                    shadow: false,
                    borderWidth: 0
                }
            },

            "series": [
                {
                    name: 'Portfolio',
                    //borderRadius : chartType === "column" ? 10 : 0,
                    showInLegend: true,
                    dataLabels: {
                        color: nheap.dataLabelsColor,
                        style: { "textOutline": "none" },
                        enabled: true
                    },
                    //colorByPoint: true,
                    "data": series_data
                }
                ,
                {
                    name: 'Benchmark',
                    //borderRadius : chartType === "column" ? 10 : 0,
                    showInLegend: true,
                    dataLabels: {
                        color: nheap.dataLabelsColor,
                        style: { "textOutline": "none" },
                        enabled: true
                    },
                    //colorByPoint: true,
                    "data": series1_data
                }
            ]
        };
        if (seriesColors) {
            options.colors = seriesColors;
        }
        if (overrideColumnBottom) {
            options.series[1] =
                {
                    showInLegend: false,
                    colorByPoint: true,
                    "data": fake_series
                }
        }

        contCharts.push({
            ddContIx: ddCont.length,
            options: options
        });

        ddCont.push({
            width: chartWidth,
            height: chartHeight,
            margin: [0, 0, 0, 0],
            //image: will come from chart
        });
    }
    //==============================        
    // \\// builds chart
    //==============================        


})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};
    var fapp = ns.fapp = ns.fapp || {};
    var fconf = fapp.conf = fapp.conf || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection6 = composeSection6;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection6() {
        buildChart({
            fileName: "PortfolioTrend.txt",
            chartCaption: "Portfolio Trend",
            chartType: "areaspline"
        });

        buildMixedChart({
            fileName: "DistributionWisePerformance.txt",
            chartCaption: "Distributor Wise Performance"
        });
        ddCont[ddCont.length - 1].pageBreak = 'after';
    }







    //==============================        
    // //\\ builds chart
    //==============================
    function buildChart(cartPars) {
        var fileName = cartPars.fileName;
        var chartCaption = cartPars.chartCaption;
        var yAxisDisabled = cartPars.yAxisDisabled;
        var chartType = cartPars.chartType;
        var overrideColumnBottom = cartPars.overrideColumnBottom;

        var table = nheap.content_data
        ["Page 6"]
        [fileName]
        ["Table"];

        /*
           "Table":[
              {
                 "DATE":"2018-02-28T00:00:00",
                 "Portfolio":3882.14
              },
              {
        */
        const monthNames = fconf.monthNames;
        var xAxis_categories = [];
        var series_data = table.map((row, rix) => {
            var dt = new Date(row["DATE"]);
            xAxis_categories.push(
                monthNames[dt.getMonth()] + '-' + (dt.getFullYear() % 100));
            return [rix, row['Portfolio']];
        }
        );



        if (overrideColumnBottom) {
            ////decorates bottom rounded corners
            var fake_series = table.map((row, rix) => [rix, row['weight'] / 2]);
        }
        var chartHeight = 250;
        var chartWidth = 750;
        var yAxisTitle = "Amount in Crores";

        var options =
        {
            chart: {
                styledMode: false,
                width: chartWidth,
                height: chartHeight,
                //type: 'column'
                type: chartType
            },
            "exporting": {
                "enabled": false
            },
            "credits": {
                "enabled": false
            },
            "title": {
                text: chartCaption,
                align: 'left',
                style: {
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#444'
                }
            },
            xAxis: {
                visible: true,
                tickLength: 0,
                categories: xAxis_categories,
                type: "category",
                labels: {
                    enabled: true
                },
                title: {
                    enabled: true
                }
            },
            yAxis: [{
                visible: !yAxisDisabled,
                title: {
                    text: yAxisTitle,
                    enabled: true
                }
            }],
            plotOptions: {
                column: {
                    ////was vital to put fake smaller column on top of
                    ////rounded column
                    //grouping: false,
                    shadow: false,
                    borderWidth: 0
                }
            },

            "series": [
                {
                    name: 'Portfolio',
                    //borderRadius : chartType === "column" ? 10 : 0,
                    showInLegend: true,
                    //colorByPoint: true,
                    "data": series_data
                }
            ]
        };
        if (overrideColumnBottom) {
            options.series[1] =
                {
                    showInLegend: false,
                    colorByPoint: true,
                    "data": fake_series
                }
        }

        contCharts.push({
            ddContIx: ddCont.length,
            options: options
        });

        ddCont.push({
            width: chartWidth,
            height: chartHeight,
            margin: [0, 0, 0, 0],
            //image: will come from chart
        });
    }
    //==============================        
    // \\// builds chart
    //==============================        


    //==============================        
    // //\\ builds Mixed Chart
    //==============================
    function buildMixedChart(cartPars) {
        var fileName = cartPars.fileName;
        var chartCaption = cartPars.chartCaption;
        var yAxisDisabled = cartPars.yAxisDisabled;
        var chartType = cartPars.chartType;
        var overrideColumnBottom = cartPars.overrideColumnBottom;

        var table = nheap.content_data
        ["Page 6"]
        [fileName]
        ["Table"];
        var xAxis_categories = table.map(row => row.DISTRIBUTOR_NAME);
        var series_contribution = table.map((row, rix) => [rix, row['CONTRIBUTION']]);


        //---------------------------------------------
        //not very clear: where is XIRR?:
        //specs: Spline is Xirr and Column is Weight

        //column:
        var series_weight = table.map((row, rix) => [rix, row['WEIGHT']]);
        //.decorate bottom rounded corners
        var fake_series_weight =
            table.map((row, rix) => [rix, row['WEIGHT'] / 2]);
        //---------------------------------------------


        var chartHeight = 250;
        var chartWidth = 750;
        var yAxisTitle = "XIRR (%)";

        var options =
        {
            chart: {
                styledMode: false,
                width: chartWidth,
                height: chartHeight,
                //type: 'column'
                type: chartType
            },
            "exporting": {
                "enabled": false
            },
            "credits": {
                "enabled": false
            },
            "title": {
                text: chartCaption,
                align: 'left',
                style: {
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#444'
                }
            },
            xAxis: {
                visible: true,
                tickLength: 0,
                categories: xAxis_categories,
                type: "category",
                labels: {
                    enabled: true
                },
                title: {
                    enabled: true
                }
            },
            yAxis: [{
                visible: !yAxisDisabled,
                title: {
                    text: yAxisTitle,
                    enabled: true
                }
            }],
            plotOptions: {
                column: {
                    ////was vital to put fake smaller column on top of
                    ////rounded column
                    grouping: false,
                    shadow: false,
                    borderWidth: 0
                }
            },

            "series": [
                //----------------------
                // //\\ rounded columns
                //----------------------
                {
                    color: nheap.companyColors.dB_neutralDark,
                    type: "column",
                    borderRadius: 10,
                    showInLegend: false,
                    dataLabels: {
                        color: nheap.dataLabelsColor,
                        style: { "textOutline": "none" },
                        enabled: true
                    },
                    "data": series_weight
                },
                {
                    color: nheap.companyColors.dB_neutralDark,
                    type: "column",
                    borderRadius: 0,
                    showInLegend: false,
                    //colorByPoint: true,
                    "data": fake_series_weight
                },
                //----------------------
                // \\// rounded columns
                //----------------------
                {
                    color: 'orange',
                    type: "spline",
                    borderRadius: 10,
                    showInLegend: false,
                    //colorByPoint: true,
                    "data": series_contribution
                }
            ]
        };
        if (overrideColumnBottom) {
            options.series[1] =
                {
                    showInLegend: false,
                    colorByPoint: true,
                    "data": fake_series
                }
        }

        contCharts.push({
            ddContIx: ddCont.length,
            options: options
        });

        ddCont.push({
            width: chartWidth,
            height: chartHeight,
            margin: [0, 0, 0, 0],
            //image: will come from chart
        });
    }
    //==============================        
    // \\// builds Mixed Chart
    //==============================        


})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection7 = composeSection7;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection7() {
        methods.addTOC(null, "Analysis")
        addHeader();
        pageTables();
        ddCont[ddCont.length - 1].pageBreak = 'after';
    }

    //==============================        
    // //\\ header
    //==============================
    function addHeader() {
        ddCont.push(
            //header: no dice for classic header:
            {
                text: "Portfolio Summary / Analysis",
                margin: [0, 5, 0, 0],
                fontSize: 15,
                bold: true,
                color: '#d4d'
            }
        );
    }
    //==============================        
    // \\// header
    //==============================



    //==============================        
    // //\\ page table
    //==============================        
    function pageTables() {
        var rows = nheap.content_data
        ["Page 7 & 8"]
        ["PortfolioSummaryAnalysis(Detailed Performance Analysis).txt"]
        ["Table"];
        var fistRow = rows[0];
        var wFlatRow = Array.isArray(fistRow) ? fistRow[1] : fistRow;
        //var emptyCaptions = ns.eachmap( wFlatRow, prop => 'TODO' );

        //====================================================        
        // //\\ processing parent/child rows encoded structure
        //====================================================        
        //      parent rows have valFld === null
        //      parent rows have totals of their childs
        var clsFld = "Asset_Class";
        var valFld = "Product_Name";
        //-----------------------------------------
        // //\\ summating totals of totals for each
        //-----------------------------------------
        //      fieldsToSummate
        //      summation goes only over parent rows
        var fieldsToSummate =
            { Latest_Values: 0, Weight: 0, Portfolio_Return: 0, Benchmark_Return: 0 }
        var totalsRack = rows.reduce(
            (accomulator, row) =>
                row[valFld] !== null ? accomulator :
                    ns.eachmap(accomulator, (value, prop) => row[prop] + value)
            ,
            fieldsToSummate
        );
        totalsRack[valFld] = 'Total';
        rows = rows.concat([[{ bold: true }, totalsRack]]);
        //-----------------------------------------
        // \\// summating totals of totals for each
        //-----------------------------------------


        //---------------------------------------------------
        // //\\ builds up a meta structure on top of each row
        //---------------------------------------------------
        //      converts each row to an array if the row indicates it is a 
        //      parent row in row group;
        //      indication happens by presence  of "null" value in certain field
        rows = rows.map(row => row[valFld] !== null ?
            row :
            [{ bold: true },
            ns.eachmap(row, (value, prop) => prop === valFld ? row[clsFld] : value)
            ]
        );
        //---------------------------------------------------
        // \\// builds up a meta structure on top of each row
        //====================================================        
        // \\// processing parent/child rows encoded structure
        //====================================================        


        methods.tableTpl_2_content({
            table: rows,
            caption: "Detailed Performance Analysis",
            margin: [0, 5, 0, 15],
            /*
               "Table":[
                  {
                     "Asset_Class":"Equity",
                     "Product_Name":null,
                     "Latest_Values":2134.15,
                     "Weight":52.83,
                     "Portfolio_Return":10.05,
                     "Benchmark_Return":9.86,
                     "Portfolio_Cont":6.57,
                     "Benchmark_Cont":4.31,
                     "Flag":"1"
                  },
            */
            columns:
                [
                    { "Product_Name": { "caption": "Asset Class" } },
                    { "Latest_Values": { "caption": "Latest Values (Cr)" } },
                    { "Weight": { "caption": "Weight" } },
                    { "Portfolio_Return": { "caption": "Portfolio Return" } },
                    { "Benchmark_Return": { "caption": "Benchmark Return" } }
                ]
        });
    }
    //==============================        
    // \\// page table
    //==============================        



})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection9 = composeSection9;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection9() {
        methods.addTOC("Debt Portfolio", "Exposure")
        addHeader();
        buildTopRoundedChart({
            fileName: "DebtPortfolio(ProductWiseExposure).txt",
            chartCaption: "Product Wise Analysis",
            yAxisDisabled: true,
            chartType: "column",
            columnTopRadius: 15
        });
        pageTable();
        //ddCont[ ddCont.length - 1 ].alignment = 'left';
        ddCont[ddCont.length - 1].margin = [12, 0, 0, 0];
        //ddCont[ ddCont.length - 1 ].pageBreak = 'after';
    }


    //==============================        
    // //\\ header
    //==============================
    function addHeader() {
        ddCont.push(
            //header: no dice for classic header:
            {
                text: "Debt Portfolio / Exposure",
                //.left marg. may align with chart
                //.last marg. adds the gab to chart
                margin: [10, 5, 20, 0],
                fontSize: 17,
                color: '#55DDFF',
                bold: true
            }
        );
    }
    //==============================        
    // \\// header
    //==============================




    //==============================        
    // //\\ builds chart
    //==============================
    function buildTopRoundedChart(cartPars) {
        var fileName = cartPars.fileName;
        var chartCaption = cartPars.chartCaption;
        var yAxisDisabled = cartPars.yAxisDisabled;
        var chartType = cartPars.chartType;
        var columnTopRadius = cartPars.columnTopRadius;

        var table = nheap.content_data
        ["Page 9"]
        [fileName]
        ["Table"];

        /*
           "Table":[
              {
                 "label":"Mutual Funds",
                 "weight":78.74,
                 "color":"#646e7d"
        */
        var colors = table.map(row => row.color);
        var xAxis_categories = table.map(row => row.label);

        var series_weight = table.map((row, rix) => [rix, row['weight']]);

        if (columnTopRadius) {
            var fake_series_weight =
                table.map((row, rix) => [rix, row['weight'] / 2]);
        }
        var chartHeight = 180;
        var chartWidth = 750;
        var yAxisTitle = "";

        var options =
        {
            chart: {
                styledMode: false,
                width: chartWidth,
                height: chartHeight,
                //type: 'column'
                type: chartType
            },
            "exporting": {
                "enabled": false
            },
            "credits": {
                "enabled": false
            },
            "title": {
                text: chartCaption,
                align: 'left',
                style: {
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#444'
                }
            },
            xAxis: {
                visible: true,
                tickLength: 0,
                categories: xAxis_categories,
                type: "category",
                labels: {
                    enabled: true
                },
                title: {
                    enabled: true
                }
            },
            yAxis: [{
                visible: !yAxisDisabled,
                title: {
                    text: yAxisTitle,
                    enabled: true
                }
            }],
            plotOptions: {
                column: {
                    ////was vital to put fake smaller column on top of
                    ////rounded column
                    grouping: !columnTopRadius,
                    shadow: false,
                    borderWidth: 0
                }
            },

            "series": [
                {
                    color: '#000088',
                    type: "column",
                    showInLegend: false,
                    colorByPoint: !!colors,
                    dataLabels: {
                        color: nheap.dataLabelsColor,
                        style: { "textOutline": "none" },
                        enabled: true
                    },
                    "data": series_weight
                }
            ]
        };

        if (colors) {
            options.colors = colors;
        }
        if (columnTopRadius) {
            options.series[1] =
                {
                    color: '#000088',
                    type: "column",
                    showInLegend: false,
                    colorByPoint: !!colors,
                    "data": fake_series_weight
                };
            options.series[0].borderRadius = columnTopRadius;
        }

        ///adds chart to converter-to-picture
        contCharts.push({
            ddContIx: ddCont.length,
            options: options
        });

        ///adds chart to docContent
        ddCont.push({
            width: chartWidth,
            height: chartHeight,
            margin: [0, 0, 0, 0],
            //image: will come from converter-to-picture
        });
    }
    //==============================        
    // \\// builds chart
    //==============================        




    //==============================        
    // //\\ page table
    //==============================        
    function pageTable() {
        /*
           "Table":[
              {
                 "Issuer":"Power Finance Corporation Limited",
                 "Weight":8.87,
                 "Colour":"#9fb2c7"
        */

        methods.tableTpl_2_content({
            table: nheap.content_data
            ["Page 9"]
            ["IssueWiseExposure.txt"]
            ["Table"],
            caption: "Issue Wise Exposure",
            widthPercent: 70,
            cellHeight: 11,
            cellPaddingTop: 4,
            cellPaddingBottom: 4,
            margin: [200, 0, 0, 0],
            columns:
                [
                    { "Issuer": { "caption": "Issuer" } },
                    { "Weight": { "caption": "Weight" } }
                ]
        });
    }
    //==============================        
    // \\// page table
    //==============================        



})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection10 = composeSection10;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection10() {
        //addHeader();
        buildTopRoundedChart({
            fileName: "RatingWiseAndMaturityExposure.txt",
            chartCaption: "Rating Wise Exposure",
            yAxisDisabled: true,
            chartType: "bar",
            columnTopRadius: 10,
            JSON_tableName: 'Table',
            valueName: 'Exposure',
            categoryName: 'RATING',
            JSON_pageName: "Page 10"
        });


        buildTopRoundedChart({
            fileName: "RatingWiseAndMaturityExposure.txt",
            chartCaption: "Maturity Wise Exposure",
            yAxisDisabled: true,
            chartType: "bar",
            columnTopRadius: 10,
            JSON_tableName: 'Table1',
            valueName: 'WEIGHT',
            categoryName: 'MATURITY',
            JSON_pageName: "Page 10"
        });
        //.outputs assembled chart to html-page nicely formatted
        //$$.c('pre').to( document.body ).ch(
        //   $$.div().html( JSON.stringify( contCharts[0].options, null, '    ' )));

        //pageTable();
        //ddCont[ ddCont.length - 1 ].alignment = 'center';
        //ddCont[ ddCont.length - 1 ].margin = [200,0,0,0];
        ddCont[ddCont.length - 1].pageBreak = 'after';
    }




    //==============================        
    // //\\ builds chart
    //==============================
    function buildTopRoundedChart(cartPars) {
        //--------------------------------
        // //\\ table parameters
        //--------------------------------
        var fileName = cartPars.fileName;
        var chartCaption = cartPars.chartCaption;
        var yAxisDisabled = cartPars.yAxisDisabled;
        var chartType = cartPars.chartType;
        var columnTopRadius = cartPars.columnTopRadius;
        //:field names
        var valueName = cartPars.valueName;
        var categoryName = cartPars.categoryName;
        //:
        var JSON_tableName = cartPars.JSON_tableName;
        var JSON_pageName = cartPars.JSON_pageName;

        var table = nheap.content_data
        [JSON_pageName]
        [fileName]
        [JSON_tableName];
        //--------------------------------
        // \\// table parameters       
        //--------------------------------


        //--------------------------------------
        // //\\ data validations and preparation
        //--------------------------------------
        //var colors           = table.map( row => row.color );
        var tlen = table.length;

        //.good solution, but not for double columns
        //var colors           = Array(tlen).fill('rgba(100,20,20,');
        //colors = colors.map( (rgb,ix) => rgb + ((tlen-ix)/tlen).toFixed(5) + ')' );
        //.this works for overlapping columns
        var colors = Array(tlen).fill([150, 30, 30]);
        colors = colors.map((rgb, ix) => blendRGB(rgb, ix / tlen));

        var xAxis_categories = table.map(row => row[categoryName]);

        ///data provider (client) sends strings instead of numbers ...
        ///this fragment fixes the data ...
        if (typeof table[0][valueName] === 'string') {
            table.forEach(row => {
                row[valueName] = parseFloat(row[valueName]);
            });
        }
        var series_value = table.map((row, rix) => [rix, row[valueName]]);

        if (columnTopRadius) {
            var fake_series_value =
                table.map((row, rix) => [rix, row[valueName] / 2]);
        }
        var chartHeight = 250;
        var chartWidth = 670;
        var yAxisTitle = "";
        var margin = [60, 0, 0, 0];
        //--------------------------------------
        // \\// data validations and preparation
        //--------------------------------------



        var options =
        {
            chart: {
                styledMode: false,
                width: chartWidth,
                height: chartHeight,
                //type: 'column'
                type: chartType
            },
            "exporting": {
                "enabled": false
            },
            "credits": {
                "enabled": false
            },
            "title": {
                text: chartCaption,
                align: 'left',
                style: {
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#444'
                }
            },
            xAxis: {
                visible: true,
                tickLength: 0,
                //type: "category",
                labels: {
                    enabled: true
                },
                title: {
                    enabled: true
                }
            },
            yAxis: [{
                visible: !yAxisDisabled,
                title: {
                    text: yAxisTitle,
                    enabled: true
                }
            }],
            plotOptions: {
                column: {
                    ////was vital to put fake smaller column on top of
                    ////rounded column
                    grouping: !columnTopRadius,
                    shadow: false,
                    borderWidth: 0
                }
            },

            "series": [
                {
                    color: '#000088',
                    type: "column",
                    showInLegend: false,
                    colorByPoint: !!colors,
                    dataLabels: {
                        color: nheap.dataLabelsColor,
                        style: { "textOutline": "none" },
                        enabled: true
                    },
                    "data": series_value
                }
            ]
        };

        if (colors) {
            options.colors = colors;
        }
        if (xAxis_categories) {
            options.xAxis.categories = xAxis_categories;
        }
        if (columnTopRadius) {
            options.series[1] =
                {
                    color: '#000088',
                    type: "column",
                    showInLegend: false,
                    colorByPoint: !!colors,
                    "data": fake_series_value
                };
            options.series[0].borderRadius = columnTopRadius;
        }
        ///adds chart to converter-to-picture
        contCharts.push({
            ddContIx: ddCont.length,
            options: options
        });

        ///adds chart to docContent
        ddCont.push({
            width: chartWidth,
            height: chartHeight,
            margin: margin,
            //image: will come from converter-to-picture
        });
    }
    //==============================        
    // \\// builds chart
    //==============================        


    /*
    //==============================        
    // //\\ header
    //==============================
    function addHeader()
    {
        ddCont.push(
            //header: no dice for classic header:
            {   
                text: "Debt Portfolio / Exposure",
                //.left marg. may align with chart
                //.last marg. adds the gab to chart
                margin: [ 10, 5, 20, 0],
                fontSize: 17,
                color:'#55DDFF',
                bold: true
            }
        );
    }
    //==============================        
    // \\// header
    //==============================
    */



    //==================================        
    // //\\ helpers
    //      increases color lightness by
    //      when fraction increases
    //==================================        
    function blendColor(cc, fraction) {
        return Math.floor(cc + (255 - cc) * fraction);
    }
    function blendRGB(rgb, fraction) {
        return 'rgb(' + blendColor(rgb[0], fraction) +
            ',' + blendColor(rgb[1], fraction) +
            ',' + blendColor(rgb[2], fraction) +
            ')';
    }
    //==================================        
    // \\// helpers
    //==================================        


})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection11 = composeSection11;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection11() {
        methods.addTOC("", "Performance")
        pageTables();
        ddCont[ddCont.length - 1].pageBreak = 'after';
    }




    //==============================        
    // //\\ page table
    //==============================        
    function pageTables() {
        var columns = { columns: [[], []] };
        ddCont.push(columns);

        methods.tableTpl_2_content({
            contentPlaceholderToAttach: columns.columns[0],
            table: nheap.content_data
            ["Page 11"]
            ["Top10Performance.txt"]
            ["Table"],
            caption: "Top 10 Performers",
            cellPaddingTop: 4,
            cellPaddingBottom: 4,
            columns:
                [
                    /*
                     "FIXEDINCOME":"Kieraya Furnishing Solutions Private Limited",
                     "classification":"High Yield Debt",
                     "CONTRIBUTION":19.96
                    */
                    { "FIXEDINCOME": { "caption": "Security" } },
                    { "classification": { "caption": "Type" } },
                    { "CONTRIBUTION": { "caption": "XIRR" } },
                ]
        });
        methods.tableTpl_2_content({
            contentPlaceholderToAttach: columns.columns[1],
            table: nheap.content_data
            ["Page 11"]
            ["Top10Holdings.txt"]
            ["Table4"],
            caption: "Top 10 Holdings",
            cellPaddingTop: 4,
            cellPaddingBottom: 4,
            columns:
                [
                    /*
                       "Table4":[
                          {
                             "Name":"ICICI Prudential Liquid Fund",
                             "Category":"Liquid",
                             "Weight":"6.74"
                          },
                    */
                    { "Name": { "caption": "Security" } },
                    { "Category": { "caption": "Type" } },
                    { "Weight": { "caption": "Weight" } },
                ]
        });
    }
    //==============================        
    // \\// page table
    //==============================        



})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection12 = composeSection12;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection12() {
        addHeader();
        pageTable();
        ddCont[ddCont.length - 1].pageBreak = 'after';
    }



    //==============================        
    // //\\ page table
    //==============================        
    function pageTable() {
        methods.tableTpl_2_content({
            table: nheap.content_data
            ["Page 12"]
            ["DebtPortfolioPerformance(DistributorWisePerformance).txt"]
            ["Table"],
            caption: "Distributor Wise Performance",
            columnsWithTriangleDecoration: { "4": true, "5": true },
            columns:
                [
                    /*
                       "Table":[
                          {
                             "FAMILY_ID":16382,
                             "Name":"Direct",
                             "Weight":15.01,
                             "Current_Value":210.87,
                             "Invested_Value":234.76,
                             "Gain":23.89,
                             "XIRR":8.33
                    */

                    { "Name": { "caption": "Name" } },
                    { "Weight": { "caption": "Weight" } },
                    { "Current_Value": { "caption": "Current Value" } },
                    { "Invested_Value": { "caption": "Invested Value" } },
                    { "Gain": { "caption": "GAIN" } },
                    { "XIRR": { "caption": "XIRR" } }
                ]
        });
    }
    //==============================        
    // \\// page table
    //==============================        

    //==============================        
    // //\\ header
    //==============================
    function addHeader() {
        ddCont.push(
            //header: no dice for classic header:
            {
                text: "Debt Portfolio / Performance",
                margin: [0, 15, 40, 30],
                fontSize: 17,
                color: '#3399DD',
                bold: true
            }
        );
    }
    //==============================        
    // \\// header
    //==============================



})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection13 = composeSection13;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection13() {
        methods.addTOC("Equity Portfolio", "Expsoure")
        addHeader();
        buildTopRoundedChart({
            fileName: "EquityPortfolioExposure(ProductWiseExpsoure).txt",
            chartCaption: "Product Wise Expsoure",
            yAxisDisabled: true,
            chartType: "column",
            columnTopRadius: 15,
            JSON_tableName: 'Table',
            valueName: 'weight',
            categoryName: 'label',
            JSON_pageName: "Page 13",
            colorsField: "color"
        });

        buildTopRoundedChart({
            fileName: "MarketCapWiseExposure.txt",
            chartCaption: "Market Cap Wise Exposure",
            yAxisDisabled: true,
            chartType: "bar",
            columnTopRadius: 15,
            JSON_tableName: 'Table',
            valueName: 'MARKET_CAP',
            categoryName: 'MCAP_TYPE',
            JSON_pageName: "Page 13",
            colors: ['#333366', '#336699', '#3399AA']
        });

        //.outputs assembled chart to html-page nicely formatted
        //$$.c('pre').to( document.body ).ch(
        //   $$.div().html( JSON.stringify( contCharts[0].options, null, '    ' )));

        //pageTable();
        //ddCont[ ddCont.length - 1 ].alignment = 'center';
        //ddCont[ ddCont.length - 1 ].margin = [200,0,0,0];

        ddCont[ddCont.length - 1].pageBreak = 'after';
    }




    //==============================        
    // //\\ builds chart
    //==============================
    function buildTopRoundedChart(cartPars) {
        //--------------------------------
        // //\\ table parameters
        //--------------------------------
        var fileName = cartPars.fileName;
        var chartCaption = cartPars.chartCaption;
        var yAxisDisabled = cartPars.yAxisDisabled;
        var chartType = cartPars.chartType;
        var columnTopRadius = cartPars.columnTopRadius;
        //:field names
        var valueName = cartPars.valueName;
        var categoryName = cartPars.categoryName;
        //:
        var JSON_tableName = cartPars.JSON_tableName;
        var JSON_pageName = cartPars.JSON_pageName;
        var colorsField = cartPars.colorsField;
        var colors = cartPars.colors;

        var table = nheap.content_data
        [JSON_pageName]
        [fileName]
        [JSON_tableName];
        //--------------------------------
        // \\// table parameters       
        //--------------------------------


        //--------------------------------------
        // //\\ data validations and preparation
        //--------------------------------------
        //var colors           = table.map( row => row.color );
        var tlen = table.length;

        if (colorsField) {
            colors = table.map(row => row[colorsField]);
        } else if (colors) {
            colors = table.map((row, ix) => colors[ix % colors.length]);
        } else {
            //.good solution, but not for double columns
            //var colors           = Array(tlen).fill('rgba(100,20,20,');
            //colors = colors.map( (rgb,ix) => rgb + ((tlen-ix)/tlen).toFixed(5) + ')' );
            //.this works for overlapping columns
            var colors = Array(tlen).fill([150, 30, 30]);
            colors = colors.map((rgb, ix) => blendRGB(rgb, ix / tlen));
        }
        var xAxis_categories = table.map(row => row[categoryName]);

        ///data provider (client) sends strings instead of numbers ...
        ///this fragment fixes the data ...
        if (typeof table[0][valueName] === 'string') {
            table.forEach(row => {
                row[valueName] = parseFloat(row[valueName]);
            });
        }
        var series_value = table.map((row, rix) => [rix, row[valueName]]);

        if (columnTopRadius) {
            var fake_series_value =
                table.map((row, rix) => [rix, row[valueName] / 2]);
        }
        var chartHeight = 250;
        var chartWidth = 750;
        var yAxisTitle = "";
        //--------------------------------------
        // \\// data validations and preparation
        //--------------------------------------



        var options =
        {
            chart: {
                styledMode: false,
                width: chartWidth,
                height: chartHeight,
                //type: 'column'
                type: chartType
            },
            "exporting": {
                "enabled": false
            },
            "credits": {
                "enabled": false
            },
            "title": {
                text: chartCaption,
                align: 'left',
                style: {
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#444'
                }
            },
            xAxis: {
                visible: true,
                tickLength: 0,
                //type: "category",
                labels: {
                    enabled: true
                },
                title: {
                    enabled: true
                }
            },
            yAxis: [{
                visible: !yAxisDisabled,
                title: {
                    text: yAxisTitle,
                    enabled: true
                }
            }],
            plotOptions: {
                column: {
                    ////was vital to put fake smaller column on top of
                    ////rounded column
                    grouping: !columnTopRadius,
                    shadow: false,
                    borderWidth: 0
                }
            },

            "series": [
                {
                    color: '#000088',
                    type: "column",
                    showInLegend: false,
                    colorByPoint: !!colors,
                    dataLabels: {
                        color: nheap.dataLabelsColor,
                        style: { "textOutline": "none" },
                        enabled: true
                    },
                    "data": series_value
                }
            ]
        };

        if (colors) {
            options.colors = colors;
        }
        if (xAxis_categories) {
            options.xAxis.categories = xAxis_categories;
        }
        if (columnTopRadius) {
            options.series[1] =
                {
                    color: '#000088',
                    type: "column",
                    showInLegend: false,
                    colorByPoint: !!colors,
                    "data": fake_series_value
                };
            options.series[0].borderRadius = columnTopRadius;
        }
        ///adds chart to converter-to-picture
        contCharts.push({
            ddContIx: ddCont.length,
            options: options
        });

        ///adds chart to docContent
        ddCont.push({
            width: chartWidth,
            height: chartHeight,
            margin: [0, 0, 0, 0],
            //image: will come from converter-to-picture
        });
    }
    //==============================        
    // \\// builds chart
    //==============================        



    //==============================        
    // //\\ header
    //==============================
    function addHeader() {
        ddCont.push(
            //header: no dice for classic header:
            {
                text: "Equity Portfolio Exposure",
                //.left marg. may align with chart
                //.last marg. adds the gab to chart
                margin: [10, 5, 20, 0],
                fontSize: 17,
                color: '#33BB77',
                bold: true
            }
        );
    }
    //==============================        
    // \\// header
    //==============================


    /*
    //==================================        
    // //\\ helpers
    //      increases color lightness by
    //      when fraction increases
    //==================================        
    function blendColor( cc, fraction )
    {
        return Math.floor(cc + (255-cc)*fraction);
    }
    function blendRGB( rgb, fraction )
    {
        return 'rgb(' + blendColor( rgb[0], fraction ) +
               ','    + blendColor( rgb[1], fraction ) +
               ','    + blendColor( rgb[2], fraction ) +
               ')';
    }
    //==================================        
    // \\// helpers
    //==================================        
    */

})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection14 = composeSection14;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection14() {
        addHeader();
        buildTopRoundedChart({
            fileName: "SectorWiseExposure.txt",
            chartCaption: "",
            yAxisDisabled: true,
            chartType: "bar",
            columnTopRadius: 10,
            JSON_tableName: 'Table',
            chartHeight: 500,
            /*
             "RANK":1,
             "SECTOR_NAME":"Financial Services",
             "SECTOR_WEIGHT":35.77
            */
            valueName: 'SECTOR_WEIGHT',
            categoryName: 'SECTOR_NAME',
            JSON_pageName: "Page 14",
            colors: [
                '#6666aa',
                '#66aa66',
                '#aa6666',
                '#bbaa66',
                '#66aabb',
                '#66bb66',
                '#aa6666',
                '#66aa66',
                '#bbbbaa',
                '#bbaabb',
                '#6666aa'
            ]
        });

        //.outputs assembled chart to html-page nicely formatted
        //$$.c('pre').to( document.body ).ch(
        //   $$.div().html( JSON.stringify( contCharts[0].options, null, '    ' )));

        //pageTable();
        //ddCont[ ddCont.length - 1 ].alignment = 'center';
        //ddCont[ ddCont.length - 1 ].margin = [200,0,0,0];

        ddCont[ddCont.length - 1].pageBreak = 'after';
    }




    //==============================        
    // //\\ builds chart
    //==============================
    function buildTopRoundedChart(cartPars) {
        //--------------------------------
        // //\\ table parameters
        //--------------------------------
        var fileName = cartPars.fileName;
        var chartCaption = cartPars.chartCaption;
        var yAxisDisabled = cartPars.yAxisDisabled;
        var chartType = cartPars.chartType;
        var columnTopRadius = cartPars.columnTopRadius;
        //:field names
        var valueName = cartPars.valueName;
        var categoryName = cartPars.categoryName;
        //:
        var JSON_tableName = cartPars.JSON_tableName;
        var JSON_pageName = cartPars.JSON_pageName;
        var colorsField = cartPars.colorsField;
        var colors = cartPars.colors;
        var chartHeight = cartPars.chartHeight || 250;
        var chartWidth = cartPars.chartWidth || 750;

        var table = nheap.content_data
        [JSON_pageName]
        [fileName]
        [JSON_tableName];
        //--------------------------------
        // \\// table parameters       
        //--------------------------------


        //--------------------------------------
        // //\\ data validations and preparation
        //--------------------------------------
        //var colors           = table.map( row => row.color );
        var tlen = table.length;

        if (colorsField) {
            colors = table.map(row => row[colorsField]);
        } else if (colors) {
            colors = table.map((row, ix) => colors[ix % colors.length]);
        } else {
            //.good solution, but not for double columns
            //var colors           = Array(tlen).fill('rgba(100,20,20,');
            //colors = colors.map( (rgb,ix) => rgb + ((tlen-ix)/tlen).toFixed(5) + ')' );
            //.this works for overlapping columns
            var colors = Array(tlen).fill([150, 30, 30]);
            colors = colors.map((rgb, ix) => blendRGB(rgb, ix / tlen));
        }
        var xAxis_categories = table.map(row => row[categoryName]);
        /*
        xAxis_categories[0] += '<img src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==\' style="vertical-align:middle;" width="30">' + '<span style="color:red">Moo</span>';
ccc( xAxis_categories )
        */
        ///data provider (client) sends strings instead of numbers ...
        ///this fragment fixes the data ...
        if (typeof table[0][valueName] === 'string') {
            table.forEach(row => {
                row[valueName] = parseFloat(row[valueName]);
            });
        }
        var series_value = table.map((row, rix) => [rix, row[valueName]]);

        if (columnTopRadius) {
            var fake_series_value =
                table.map((row, rix) => [rix, row[valueName] / 2]);
        }
        var yAxisTitle = "";
        //--------------------------------------
        // \\// data validations and preparation
        //--------------------------------------



        var options =
        {
            chart: {
                styledMode: false,
                width: chartWidth,
                height: chartHeight,
                //type: 'column'
                type: chartType
            },
            "exporting": {
                "enabled": false, //appar about a GUI button only
                fallbackToExportServer: true,
                error: function (options, err) {
                    console.log('exporting error=', err, ' options=', options);
                },
                "allowHTML": !true
            },
            "credits": {
                "enabled": false
            },
            "title": {
                text: chartCaption,
                align: 'left',
                style: {
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#444'
                }
            },
            xAxis: {
                visible: true,
                tickLength: 0,
                //type: "category",
                labels: {
                    "enabled": true
                    , useHTML: true //vital
                },
                title: {
                    enabled: true
                }
            },
            yAxis: [{
                visible: !yAxisDisabled,
                title: {
                    text: yAxisTitle,
                    enabled: true
                },
            }],
            plotOptions: {
                column: {
                    ////was vital to put fake smaller column on top of
                    ////rounded column
                    grouping: !columnTopRadius,
                    shadow: false,
                    borderWidth: 0
                }
            },

            "series": [
                {
                    color: '#000088',
                    type: "column",
                    showInLegend: false,
                    colorByPoint: !!colors,
                    dataLabels: {
                        color: nheap.dataLabelsColor,
                        style: { "textOutline": "none" },
                        enabled: true
                    },
                    "data": series_value
                }
            ]
        };

        if (colors) {
            options.colors = colors;
        }
        if (xAxis_categories) {
            options.xAxis.categories = xAxis_categories;
        }
        if (columnTopRadius) {
            options.series[1] =
                {
                    color: '#000088',
                    type: "column",
                    showInLegend: false,
                    colorByPoint: !!colors,
                    "data": fake_series_value
                };
            options.series[0].borderRadius = columnTopRadius;
        }
        /*
            $$.c('pre').to( document.body ).ch(
               $$.div().html( JSON.stringify( options, null, '    ' )));
            $$.c('pre').to( document.body ).ch(
               $$.div().html( JSON.stringify( xAxis_categories, null, '    ' )));
        */


        ///adds chart to converter-to-picture
        contCharts.push({
            ddContIx: ddCont.length,
            options: options
        });

        ///adds chart to docContent
        ddCont.push({
            width: chartWidth,
            height: chartHeight,
            margin: [0, 0, 0, 0],
            //image: will come from converter-to-picture
        });
    }
    //==============================        
    // \\// builds chart
    //==============================        



    //==============================        
    // //\\ header
    //==============================
    function addHeader() {
        ddCont.push(
            //header: no dice for classic header:
            {
                text: "Sector Wise Exposure",
                //.left marg. may align with chart
                //.last marg. adds the gab to chart
                margin: [10, 5, 20, 0],
                fontSize: 17,
                color: '#333333',
                bold: true
            }
        );
    }
    //==============================        
    // \\// header
    //==============================


    /*
    //==================================        
    // //\\ helpers
    //      increases color lightness by
    //      when fraction increases
    //==================================        
    function blendColor( cc, fraction )
    {
        return Math.floor(cc + (255-cc)*fraction);
    }
    function blendRGB( rgb, fraction )
    {
        return 'rgb(' + blendColor( rgb[0], fraction ) +
               ','    + blendColor( rgb[1], fraction ) +
               ','    + blendColor( rgb[2], fraction ) +
               ')';
    }
    //==================================        
    // \\// helpers
    //==================================        
    */

})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection15 = composeSection15;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection15() {
        methods.addTOC("", "Perfomance")
        pageTables();
        ddCont[ddCont.length - 1].pageBreak = 'after';
    }




    //==============================        
    // //\\ page table
    //==============================        
    function pageTables() {
        var columns = { columns: [[], []] };
        ddCont.push(columns);
        methods.tableTpl_2_content({
            contentPlaceholderToAttach: columns.columns[0],
            table: nheap.content_data
            ["Page 15"]
            ["Top10Perfomance.txt"]
            ["Table"],
            caption: "Top 10 Performers",
            cellPaddingTop: 4,
            cellPaddingBottom: 4,
            columns:
                [
                    { "EQUITY": { "caption": "Security" } },
                    { "sector_name": { "caption": "Sector" } },
                    { "CONTRIBUTION": { "caption": "XIRR (%)" } },
                ]
        });
        methods.tableTpl_2_content({
            contentPlaceholderToAttach: columns.columns[1],
            table: nheap.content_data
            ["Page 15"]
            ["Top10Holdings.txt"]
            ["Table"],
            caption: "Top 10 Holdings",
            cellPaddingTop: 4,
            cellPaddingBottom: 4,
            columns:
                [
                    { "Name": { "caption": "Security" } },
                    { "Category": { "caption": "Sector" } },
                    { "Weight": { "caption": "Contribution" } },
                ]
        });
    }
    //==============================        
    // \\// page table
    //==============================        



})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection16 = composeSection16;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection16() {
        addHeader();
        pageTable();
        ddCont[ddCont.length - 1].pageBreak = 'after';
    }



    //==============================        
    // //\\ page table
    //==============================        
    function pageTable() {
        methods.tableTpl_2_content({
            table: nheap.content_data
            ["Page 16"]
            ["EquityPortfolioPerformance(DistributorWisePerformance).txt"]
            ["Table"],
            caption: "Distributor Wise Performance",


            columnsWithTriangleDecoration: { "5": true, "6": true },
            columns:
                [
                    /*
                         "FAMILY_ID":16382,
                         "Name":"Direct",
                         "Weight":28.82,
                         "Current_Value":577.89,
                         "Invested_Value":615.03,
                         "Gain":38.22,
                         "XIRR":2.67
                    */
                    { "Name": { "caption": "Name" } },
                    { "Weight": { "caption": "Weight" } },
                    { "Invested_Value": { "caption": "Invested Value" } },
                    { "Current_Value": { "caption": "Current Value" } },
                    { "Gain": { "caption": "GAIN" } },
                    { "XIRR": { "caption": "XIRR" } }
                ]
        });
    }
    //==============================        
    // \\// page table
    //==============================        

    //==============================        
    // //\\ header
    //==============================
    function addHeader() {
        ddCont.push(
            //header: no dice for classic header:
            {
                text: "Equity Portfolio Performance",
                margin: [0, 15, 40, 30],
                fontSize: 17,
                color: '#33AA66',
                bold: true
            }
        );
    }
    //==============================        
    // \\// header
    //==============================



})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection17 = composeSection17;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection17() {
        methods.addTOC("", "Analysis")
        addHeader();
        buildTopRoundedChart({
            fileName: "EquityPortfolioAnalysis(AMC Exposure).txt",
            chartCaption: "AMC Exposure",
            yAxisDisabled: true,
            chartType: "bar",
            columnTopRadius: 10,
            JSON_tableName: 'Table',
            chartHeight: 500,
            /*
                 "RANK":1,
                 "label":"ICICI Prudential",
                 "weight":19.71,
                 "color":"#cee4e8"
            */
            valueName: 'weight',
            categoryName: 'label',
            JSON_pageName: "Page 17",
            colorsField: "color"
        });

        //.outputs assembled chart to html-page nicely formatted
        //$$.c('pre').to( document.body ).ch(
        //   $$.div().html( JSON.stringify( contCharts[0].options, null, '    ' )));

        //pageTable();
        //ddCont[ ddCont.length - 1 ].alignment = 'center';
        //ddCont[ ddCont.length - 1 ].margin = [200,0,0,0];

        ddCont[ddCont.length - 1].pageBreak = 'after';
    }




    //==============================        
    // //\\ builds chart
    //==============================
    function buildTopRoundedChart(cartPars) {
        //--------------------------------
        // //\\ table parameters
        //--------------------------------
        var fileName = cartPars.fileName;
        var chartCaption = cartPars.chartCaption;
        var yAxisDisabled = cartPars.yAxisDisabled;
        var chartType = cartPars.chartType;
        var columnTopRadius = cartPars.columnTopRadius;
        //:field names
        var valueName = cartPars.valueName;
        var categoryName = cartPars.categoryName;
        //:
        var JSON_tableName = cartPars.JSON_tableName;
        var JSON_pageName = cartPars.JSON_pageName;
        var colorsField = cartPars.colorsField;
        var colors = cartPars.colors;
        var chartHeight = cartPars.chartHeight || 250;
        var chartWidth = cartPars.chartWidth || 750;

        var table = nheap.content_data
        [JSON_pageName]
        [fileName]
        [JSON_tableName];
        //--------------------------------
        // \\// table parameters       
        //--------------------------------


        //--------------------------------------
        // //\\ data validations and preparation
        //--------------------------------------
        //var colors           = table.map( row => row.color );
        var tlen = table.length;

        if (colorsField) {
            colors = table.map(row => row[colorsField]);
        } else if (colors) {
            colors = table.map((row, ix) => colors[ix % colors.length]);
        } else {
            //.good solution, but not for double columns
            //var colors           = Array(tlen).fill('rgba(100,20,20,');
            //colors = colors.map( (rgb,ix) => rgb + ((tlen-ix)/tlen).toFixed(5) + ')' );
            //.this works for overlapping columns
            var colors = Array(tlen).fill([150, 30, 30]);
            colors = colors.map((rgb, ix) => blendRGB(rgb, ix / tlen));
        }
        var xAxis_categories = table.map(row => row[categoryName]);

        ///data provider (client) sends strings instead of numbers ...
        ///this fragment fixes the data ...
        if (typeof table[0][valueName] === 'string') {
            table.forEach(row => {
                row[valueName] = parseFloat(row[valueName]);
            });
        }
        var series_value = table.map((row, rix) => [rix, row[valueName]]);

        if (columnTopRadius) {
            var fake_series_value =
                table.map((row, rix) => [rix, row[valueName] / 2]);
        }
        var yAxisTitle = "";
        //--------------------------------------
        // \\// data validations and preparation
        //--------------------------------------



        var options =
        {
            chart: {
                styledMode: false,
                width: chartWidth,
                height: chartHeight,
                //type: 'column'
                type: chartType
            },
            "exporting": {
                "enabled": false
            },
            "credits": {
                "enabled": false
            },
            "title": {
                text: chartCaption,
                align: 'left',
                style: {
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#444'
                }
            },
            xAxis: {
                visible: true,
                tickLength: 0,
                //type: "category",
                labels: {
                    enabled: true
                },
                title: {
                    enabled: true
                }
            },
            yAxis: [{
                visible: !yAxisDisabled,
                title: {
                    text: yAxisTitle,
                    enabled: true
                }
            }],
            plotOptions: {
                column: {
                    ////was vital to put fake smaller column on top of
                    ////rounded column
                    grouping: !columnTopRadius,
                    shadow: false,
                    borderWidth: 0
                }
            },

            "series": [
                {
                    color: '#000088',
                    type: "column",
                    showInLegend: false,
                    colorByPoint: !!colors,
                    dataLabels: {
                        color: nheap.dataLabelsColor,
                        style: { "textOutline": "none" },
                        enabled: true
                    },
                    "data": series_value
                }
            ]
        };

        if (colors) {
            options.colors = colors;
        }
        if (xAxis_categories) {
            options.xAxis.categories = xAxis_categories;
        }
        if (columnTopRadius) {
            options.series[1] =
                {
                    color: '#000088',
                    type: "column",
                    showInLegend: false,
                    colorByPoint: !!colors,
                    "data": fake_series_value
                };
            options.series[0].borderRadius = columnTopRadius;
        }
        ///adds chart to converter-to-picture
        contCharts.push({
            ddContIx: ddCont.length,
            options: options
        });

        ///adds chart to docContent
        ddCont.push({
            width: chartWidth,
            height: chartHeight,
            margin: [0, 0, 0, 0],
            //image: will come from converter-to-picture
        });
    }
    //==============================        
    // \\// builds chart
    //==============================        



    //==============================        
    // //\\ header
    //==============================
    function addHeader() {
        ddCont.push(
            //header: no dice for classic header:
            {
                text: "Equity Portfolio Analysis",
                //.left marg. may align with chart
                //.last marg. adds the gab to chart
                margin: [10, 5, 20, 0],
                fontSize: 17,
                color: '#339933',
                bold: true
            }
        );
    }
    //==============================        
    // \\// header
    //==============================


    /*
    //==================================        
    // //\\ helpers
    //      increases color lightness by
    //      when fraction increases
    //==================================        
    function blendColor( cc, fraction )
    {
        return Math.floor(cc + (255-cc)*fraction);
    }
    function blendRGB( rgb, fraction )
    {
        return 'rgb(' + blendColor( rgb[0], fraction ) +
               ','    + blendColor( rgb[1], fraction ) +
               ','    + blendColor( rgb[2], fraction ) +
               ')';
    }
    //==================================        
    // \\// helpers
    //==================================        
    */

})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSection_glossaryOfTerms = composeSection_glossaryOfTerms;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSection_glossaryOfTerms() {
        // methods.addTOC( "Glossary of Terms", "" )
        // addHeader();
        ddCont[ddCont.length - 1].pageBreak = 'after';
    }


    //==============================        
    // //\\ header
    //==============================
    function addHeader() {
        ddCont.push({
            text: "Glossary of Terms",
            //.left marg. may align with chart
            //.last marg. adds the gab to chart
            margin: [10, 5, 20, 0],
            fontSize: 18,
            color: '#333333',
            bold: true
        });
    }
    //==============================        
    // \\// header
    //==============================


})();

(function () {
    var ns = window.b$l = window.b$l || {};
    var $$ = ns.$$;
    var methods = ns.methods = ns.methods || {};

    var nheap = ns.nheap = ns.nheap || {};
    var imagesRack = nheap.imagesRack = nheap.imagesRack || {};
    var ddCont = nheap.ddCont = nheap.ddCont || [];
    var contCharts = nheap.contCharts = nheap.contCharts || [];
    var ccc = window.console.log;

    methods.composeSectionFinal = composeSectionFinal;
    return;
    //00000000000000000000000000000000000000000000000000000000000000000000000





    ///==============================        
    /// composer
    ///==============================
    function composeSectionFinal() {
        addHeader();

        ddCont.push({
            text: 'Important Note:',
            margin: [0, 200, 0, 0],
            bold: true,
            fontSize: 16
        });
        ddCont.push({
            text: nheap.content_data['final-page--important-note.txt'],
            margin: [0, 0, 0, 0],
            bold: false,
            fontSize: 16
        });

        ddCont.push({
            text: 'Disclaimer:',
            margin: [0, 15, 0, 0],
            bold: true,
            fontSize: 16
        });
        ddCont.push({
            text: nheap.content_data['final-page--disclaimer.txt'],
            margin: [0, 0, 0, 0],
            bold: false,
            fontSize: 16
        });

        //.outputs assembled chart to html-page nicely formatted
        //$$.c('pre').to( document.body ).ch(
        //   $$.div().html( JSON.stringify( contCharts[0].options, null, '    ' )));

        //ddCont[ ddCont.length - 1 ].pageBreak = 'after';
    }


    //==============================        
    // //\\ header
    //==============================
    function addHeader() {
        ddCont.push({
            text: "Thank you",
            //.left marg. may align with chart
            //.last marg. adds the gab to chart
            margin: [10, 5, 20, 0],
            fontSize: 26,
            color: '#333333',
            bold: true
        });
    }
    //==============================        
    // \\// header
    //==============================


})();

