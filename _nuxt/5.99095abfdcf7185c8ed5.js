(window.webpackJsonp=window.webpackJsonp||[]).push([[5,36],{415:function(e,t,n){"use strict";n.r(t),function(e){var T=n(21),r=n(25),o=n(8),c=(n(35),n(136),n(71),n(12),n(22),n(24),n(34),n(272)),O=n(369),P=n(773),f=n(304),E=n(285),N=n(357),R=n(314),l=n(311),d=n(442);function I(t){var f=t.modules.windows;return function(){var E=Object(o.a)(regeneratorRuntime.mark((function o(E,path){var N,R,d,I,m,S,A,Y,U,D,L;return regeneratorRuntime.wrap((function(o){for(;;)switch(o.prev=o.next){case 0:if(N=E.modules,R=t.addExecution(),I={actions:{},value:Object(l.getBasicDefaultModelValue)(),fsItem:null,output:[],openValue:null},!path){o.next=14;break}return o.next=6,N.files.fs.get(path);case 6:if(d=o.sent,!(l.PROPERTY.CONTENT in d.data)){o.next=13;break}m=Object.assign({},d.data,Object(r.a)({},l.PROPERTY.CONTENT,[].concat(d.data[l.PROPERTY.CONTENT]).join("\n"))),I.fsItem=d,I.value=m,o.next=14;break;case 13:throw new Error("Can't read file content");case 14:return o.next=16,Promise.all([n.e(58).then(n.bind(null,914)).then((function(e){return e.default})),n.e(63).then(n.bind(null,915)).then((function(e){return e.default}))]);case 16:return S=o.sent,A=Object(T.a)(S,2),Y=A[0],U=A[1],D=N.windows.addWindow({title:"WebBasic - Extras 1.3",component:Y,componentData:{model:I},options:{scale:!0,scrollX:!0,scrollY:!0,center:!1,embed:!0,borderless:!0},layout:{size:Object(c.e)(540,360)}},{group:"extras13WebBasic"}),Object.assign(I.actions,{close:function(){D.close()},focus:function(){D.focus()},reset:function(){I.value=Object(l.getBasicDefaultModelValue)(),I.fsItem=null,I.output=[],I.openValue=null}}),I.actions.togglePreview=function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];t?(L=N.windows.addWindow({title:"Preview - WebBasic - Extras 1.3",component:U,componentData:{model:I},options:{scale:!0,scrollX:!0,scrollY:!0,center:!1,close:!1,embed:!0,borderless:!0},layout:{size:Object(c.e)(540,360)}},{group:"extras13WebBasic",active:!1}),e.requestAnimationFrame((function(){f.contentWrapper.setWindowPositions(O.a.SPLIT_HORIZONTAL,[D,L])}),0)):L&&(D.unfocus(),L.close(),e.requestAnimationFrame((function(){f.contentWrapper.setWindowPositions(O.a.SPLIT_HORIZONTAL,[D]),D.focus()})))},t.modules.screen.setTheme(P.a),o.abrupt("return",new Promise((function(e){R(),D.events.subscribe((function(n){"close"===n.name&&(L&&L.close(),t.modules.screen.setTheme(null),e())}))})));case 25:case"end":return o.stop()}}),o)})));return function(e,t){return E.apply(this,arguments)}}()}function m(e){var t=e.modules.windows;return function(){var r=Object(o.a)(regeneratorRuntime.mark((function r(o){var O,P,f,E,d,I,m,S;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return o.modules,O=e.addExecution(),r.next=4,Promise.all([n.e(57).then(n.bind(null,907)).then((function(e){return e.default}))]);case 4:P=r.sent,f=Object(T.a)(P,1),E=f[0],d=e.modules.screen.contentLayout,(I=new N.default(new R.default(d.position,Object(c.e)((function(){return d.position+d.size}))))).options.display.background=e.config.get(l.CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND),I.options.display.foreground=e.config.get(l.CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND),m={fsItem:null,app:I},S=t.addWindow({title:"WebPainting - Extras 1.3",component:E,componentData:{model:m},options:{scale:!1,scrollX:!1,scrollY:!1,embed:!0}},{group:"extras13WebPainting",full:!0}),m.actions={close:function(){S.close()},focus:function(){S.focus()}},O();case 15:case"end":return r.stop()}}),r)})));return function(e){return r.apply(this,arguments)}}()}t.default=function(e){var t=e.core;return t.config.setDefaults(l.CONFIG_DEFAULTS),{locked:!0,meta:[[f.a.SYMBOL,E.a.DISK_WORKBENCH13],[f.a.WINDOW_SIZE,Object(c.e)(320,140)],[f.a.WINDOW_POSITION,Object(c.e)(310,10)],[f.a.WINDOW_SYMBOL_REARRANGE,!0]],name:"Extras 1.3",items:[{meta:[[f.a.SYMBOL,E.a.WEB_PAINTING]],id:"WebPainting.app",name:"WebPainting",createdDate:new Date(2017,7,5).getTime(),editedDate:new Date(2020,3,14).getTime(),action:m(t)},{meta:[[f.a.SYMBOL,E.a.WEB_BASIC],[f.a.WINDOW_SIZE,Object(c.e)(360,200)]],id:"WebBasic.app",name:"WebBasic",createdDate:new Date(2017,7,5).getTime(),editedDate:new Date(2020,3,14).getTime(),action:I(t)},d.default]}}}.call(this,n(38))},442:function(e,t,n){"use strict";n.r(t);var T,r,o,c,O,P,f,E,N,R,l,d,I,m,S,A,Y,U=n(25),D=n(272),L=n(304),B=n(285),_=n(311);t.default={meta:[[L.a.SYMBOL,B.a.DIRECTORY],[L.a.WINDOW_SIZE,Object(D.e)(380,200)],[L.a.WINDOW_SYMBOL_REARRANGE,!0]],id:"BasicDemos",name:"Basic Demos",createdDate:new Date(2017,7,5).getTime(),editedDate:new Date(2020,3,14).getTime(),items:[{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"TEST.bas",data:(T={},Object(U.a)(T,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(T,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(T,_.PROPERTY.CONTENT,['PRINT USING "# #"; 1,2']),T)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"FunctionTest.bas",data:(r={},Object(U.a)(r,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(r,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(r,_.PROPERTY.CONTENT,['PRINT USING "LEN(\\"ABC\\") #"; LEN("ABC")','PRINT USING "ASC(\\"D\\") ##"; ASC("D")','PRINT USING "CHR$(68) ##"; CHR$(68)','PRINT USING "LEFT$(\\"XYZ\\", LEN(\\"XYZ\\")-1) #"; LEFT$("XYZ", LEN("XYZ")-1)','PRINT USING "RIGHT$(\\"XYZ\\", LEN(\\"XYZ\\")-1) #"; RIGHT$("XYZ", LEN("XYZ")-1)']),r)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"Fibonacci.bas",data:(o={},Object(U.a)(o,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(o,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(o,_.PROPERTY.CONTENT,["CLS","READ max","DIM fib%(max)","LET fib(1) = 1","LET fib(2) = 2","FOR i=3 TO max","LET fib(i) = fib(i - 2) + fib(i -1)","NEXT i","FOR i=1 TO max","PRINT fib(i)","NEXT i","DATA 10","END"]),o)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"Area.bas",data:(c={},Object(U.a)(c,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(c,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(c,_.PROPERTY.CONTENT,["CLS","DIM w%,h%,a%","LET w%=12","LET h%=4","LET a%=w%*h%",'PRINT "With the width " + w%','PRINT " and the height " + h%','PRINT " you have the area " + a%']),c)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"Circle.bas",data:(O={},Object(U.a)(O,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(O,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(O,_.PROPERTY.CONTENT,["CLS","DIM r,a","LET r=5","READ pi","LET a=r*r*pi",'PRINT USING "With the radius ##.##"; r','PRINT USING "we have the area ##.##"; a',"DATA 3.14","END"]),O)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"Your_Name.bas",data:(P={},Object(U.a)(P,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(P,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(P,_.PROPERTY.CONTENT,["CLS",'PRINT "What is your name?"',"INPUT n$",'PRINT "What is your shoe size?"',"INPUT size",'PRINT "Hello "; n$','PRINT USING "your shoe size is ##.##"; size',"END"]),P)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"GuessTheNumber.bas",data:(f={},Object(U.a)(f,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(f,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(f,_.PROPERTY.CONTENT,["GuessTheNumber","CLS","READ max%","DIM number%, guess%, guesses%, message$",'LET message$ =  ""','PRINT "The number is between 1-1000."',"LET number% = INT(RND * max%) + 1","LET guess% = 1","LET guesses% = 0","WHILE guess%<>number%",'PRINT "Guess the number"',"PRINT message$","INPUT message$ guess%","IF (guess%<>number%) THEN","IF (guess%>number%) THEN",'LET message$ = "Your guess was too high"',"ELSE",'LET message$ =  "Your guess was too low"',"ENDIF","ENDIF","LET guesses% = guesses% + 1","WEND",'PRINT USING "You found the number in # tries"; guesses%',"DATA 1000","END"]),f)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"Factorial.bas",data:(E={},Object(U.a)(E,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(E,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(E,_.PROPERTY.CONTENT,["DIM result, n",'PRINT "Calculate the factorial of"',"INPUT n","LET result = 1","FOR i = n TO 1 STEP -1","LET result = result * i","NEXT i",'PRINT USING "#! = #"; n, result',"END"]),E)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"Pyramid.bas",data:(N={},Object(U.a)(N,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(N,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(N,_.PROPERTY.CONTENT,["CLS","DIM stars$",'PRINT "Enter the height of the pyramid"',"INPUT height",'LET stars$ = ""',"FOR i = 1 TO height",'LET stars$ = ""',"FOR j = 1 TO (i+i-1)",'LET stars$ = stars$ + "*"',"NEXT j","PRINT SPC(height - i) + stars","NEXT i","END"]),N)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"Bubble_Sort.bas",data:(R={},Object(U.a)(R,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(R,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(R,_.PROPERTY.CONTENT,["CLS","READ max","DIM SHARED numbers(max)","SUB CreateList(max) STATIC","FOR i=1 TO max","LET numbers(i) = INT(RND * 100)","NEXT i","END SUB","SUB PrintList(max) STATIC","FOR i=1 TO max","PRINT numbers(i)","NEXT i","END SUB","SUB SwapValues(i%, j%) STATIC","LET numbers(i%) = numbers(i%) XOR numbers(j%)","LET numbers(j%) = numbers(i%) XOR numbers(j%)","LET numbers(i%) = numbers(i%) XOR numbers(j%)","END SUB","SUB Sort(max) STATIC","FOR i%=1 TO (max - 1)","FOR j%=i% TO max","IF numbers(i%)>numbers(j%) THEN","CALL SwapValues(i%, j%)","END IF","NEXT j%","NEXT i%","END SUB","CreateList(max)","Sort(max)","PrintList(max)","DATA 10","END"]),R)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"Goto.bas",data:(l={},Object(U.a)(l,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(l,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(l,_.PROPERTY.CONTENT,['PRINT "Step 1"','PRINT "Step 2"','PRINT "Step 3"',"GOTO ignore",'PRINT "Step 4"',"ignore:",'PRINT "Step 5"']),l)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"Vars.bas",data:(d={},Object(U.a)(d,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(d,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(d,_.PROPERTY.CONTENT,["DIM A, B","LET A = 2000",'LET B = "Hello World"','PRINT USING "A: #"; A','PRINT USING "B: #"; B']),d)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"If.bas",data:(I={},Object(U.a)(I,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(I,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(I,_.PROPERTY.CONTENT,["DIM A, B","LET A = 1","LET B = 2","IF A == B THEN",'PRINT "true"',"ELSE",'PRINT "false"',"END","IF (A < B) THEN",'PRINT "true"',"END"]),I)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"For.bas",data:(m={},Object(U.a)(m,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(m,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(m,_.PROPERTY.CONTENT,["DIM i%","FOR i% = 1 TO 5",'PRINT USING "For Number #"; i%',"NEXT i%"]),m)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"For_Step.bas",data:(S={},Object(U.a)(S,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(S,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(S,_.PROPERTY.CONTENT,["CLS","FOR i% = 0 TO 6 STEP 2",'PRINT "For Step Number #"; i%',"NEXT i%"]),S)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"While.bas",data:(A={},Object(U.a)(A,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(A,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(A,_.PROPERTY.CONTENT,["DIM i%","LET i%=0","WHILE i% < 5",'PRINT USING "While Number #"; i%',"LET i% = i% + 1","WEND"]),A)},{meta:[[L.a.SYMBOL,B.a.BASIC]],id:"Pause.bas",data:(Y={},Object(U.a)(Y,_.PROPERTY.HAS_WINDOW_OUTPUT,!0),Object(U.a)(Y,_.PROPERTY.OUTPUT_TYPE,"basic"),Object(U.a)(Y,_.PROPERTY.CONTENT,["DIM duration","LET duration = 2500",'PRINT USING "Start with Pause #ms"; duration',"PAUSE duration",'PRINT "End Pause"','PRINT USING "Start with Sleep #ms"; duration',"PAUSE duration",'PRINT "End Sleep"']),Y)}]}},773:function(e,t,n){"use strict";var T=n(354);t.a=new T.d("Black Contrast",{colors:{screen:{background:"#000"},header:{background:"#000",coverBackground:"#000",coverTitle:"#fff",title:"#fff"},windowHeader:{background:"#000",stripes:"#fff",title:"#fff",buttonBackground:"#fff",buttonPrimary:"#000",buttonSecondary:"#fff"},contextMenu:{border:"#fff"},contextMenuItem:{background:"#000",label:"#fff",indicatorContext:"#fff",hotkey:"#fff"},contextMenuSeparator:{background:"#fff"},window:{text:"#fff",background:"#000",border:"#fff",borderScaling:"#fff",helper__scaleBackground:"#000",helper__scaleIcon:"#fff",helper__scaleIconActive:"#fff"},scrollContent:{scrollbarCorner:"#000",scrollbarSpacer:"#fff",scrollbarBackground:"#000",scrollbarHelperBackground:"#000",scrollbarHelper:"#fff",scrollbarHelperActive:"#fff",scrollbarRange:"#000"},symbolWrapperItem:{text:"#fff"},textbox:{text:"#fff",background:"#000",border:"#000",outline:"#fff",dialog:{text:"#fff",background:"#000",border:"#000",outline:"#fff"},disabledReadonlyText:"#AAA",disabledReadonlyBackground:"#000"},textarea:{text:"#fff",background:"#000",border:"#000",outline:"#fff",resizeBackground:"#fff",resizeIcon:"#000"},itemSelect:{border:"#fff"},itemSelectItem:{border:"#fff",background:"#000",disabledLabelText:"#AAA",disabledLabelbackground:"#000"},button:{label:"#000",primary:{label:"#fff",background:"#000",border:"#AAA",outline:"#fff"},secondary:{label:"#fff",background:"#000",border:"#fff"},dialog:{label:"#fff",background:"#000",border:"#fff",outline:"#AAA"}},markdown:{typo:{selection:"#fff",headlinePrimary:"#fff",headlineSecondary:"#AAA",strong:"#AAA",strongEm:"#fff",link:"#AAA",linkHover:"#fff",del:"#fff",line:"#fff",blockquoteBackground:"#AAA",blockquoteText:"#fff",codeBackground:"#AAA",codeText:"#fff",codeSelection:"#fff"}},dialogContent:{backgroundPrimary:"#fff",backgroundSecondary:"#000",text:"#000"}}})}}]);