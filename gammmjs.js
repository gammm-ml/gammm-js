/*
Name: GammmJS
Author: Angelo S. Octavio
Description: A simple javascript library that enables you to use javascript code inside a HTML code.
Version: 1.0.0
*/

const GammmJSDom = {
    generateGUID: function() {
        function _gjsUID(s) {
            var tempUID = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + tempUID.substr(0, 4) + "-" + tempUID.substr(4, 4) : tempUID;
        }
        return 'g' + _gjsUID() + _gjsUID(true) + _gjsUID(true) + _gjsUID();
    },

    load: function(element) {

        for (var i = 1; i < arguments.length; i++) {
            if (arguments[i].constructor.name == "GammmJS") {
                var Gammm = arguments[i];

                var templateDiv = document.createElement("span");
                templateDiv.id = Gammm.gammmId;
                templateDiv.innerHTML = Gammm.compiledTemplate;

                if(Gammm.className !== undefined){
                    templateDiv.className = Gammm.className;
                }

                Gammm.component[Gammm.component.length] = templateDiv;
                element.append(templateDiv); 
                Gammm.renderEvents();
            
                var GammmBlocks = arguments[i].blocksStack;

                for(var iBlock in GammmBlocks){
                    var blockName = GammmBlocks[iBlock].name;
                    window[blockName].blockId = GammmBlocks[iBlock].blockId;
                    window[blockName].props = GammmBlocks[iBlock].props;
                    
                    GammmJSDom.load(
                        document.getElementById(window[blockName].blockId),
                        window[blockName]
                    );
                    window[blockName].state();
                }
            } else {
                arguments[i]();
            }
        }
    },
    load2: function(component) {

        for (var i = 1; i < arguments.length; i++) {
            if (arguments[i].constructor.name == "GammmJS") {
                var element = document.getElementsByTagName(component);
                var Gammm = arguments[i];
                var templateDiv = document.createElement("span");
                templateDiv.id = Gammm.gammId;
                templateDiv.innerHTML = Gammm.compiledTemplate;

                if(Gammm.className !== undefined){
                    templateDiv.className = Gammm.className;
                }

                Gammm.component[Gammm.component.length] = templateDiv;
                element.innerHTML = '';
                element.append(templateDiv);
                Gammm.renderEvents();
            }
        }
    }

}

const GammmJS = function (args) {

    const ThisGammmJS = this;
    const GammmStartCode = "&lt;#gammmjs";
    const GammmEndCode = "#&gt;";

    //final replacements
    const GammmLtTagString = new RegExp("&lt;","g");
    const GammmGtTagString = new RegExp("&gt;","g");
    const GammmAmpersandString = new RegExp("&amp;","g");
    const GammmDoubleQuotes =  new RegExp("\"","g");

    const GammmStartBrackets = new RegExp("{{","g");
    const GammmEndBrackets = new RegExp("}}","g");

    const GammmRegexTable = {
        "<gammm-table" : "<table",
        "</gammm-table" : "</table",

        "<gammm-thead" : "<thead",
        "</gammm-thead" : "</thead",

        "<gammm-tbody" : "<tbody",
        "</gammm-tbody" : "</tbody",

        "<gammm-tr" : "<tr",
        "</gammm-tr" : "</tr",

        "<gammm-th" : "<th",
        "</gammm-th" : "</th",

        "<gammm-td" : "<td",
        "</gammm-td" : "</td",
    };

    this.gammmId = 0;
    this.template_arg = '';
    this.blockId = 0;
    this.component = [];
    this.html = '';
    this.template = '';
    this.beforeRender = null;
    this.afterRender = null;

    this.compiledTemplate = '';
    this.compiledEvents = [];

    this.data = {};
    this.events = {};

    this.debug = false;

    this.blocksStack = [];

    this.blocks = {};
    this.props = {};

    this.gammmId = GammmJSDom.generateGUID();
    this.className = ""; 

    function _className() {
        return this.constructor.name;
    }

    function parseData(d, g, h) {
        for (var e = d.length, i = [], j = 0, b = g.length, k = h.length, a = 0; a < e; a++) {
            if (0 != b && d.substr(a, b) == g) {
                for (var f = 0, c = a + b; c < e; c++) {
                    if (f++, c < e && d.substr(c, k) == h) {
                        var l = d.substr(a + b, f - 1);
                        i[j] = l, j++, a = a + b + (f - 1), c = e;
                    }
                }
            }
        }
        return i;
    }

    function checkArgs(thisArgs) {
        try {
            if (typeof args[thisArgs] !== 'undefined') {    
                return args[thisArgs];
            }
            return false;
        } catch (checkArgsErr) {
            console.log(checkArgsErr);
            return false;
        }
    }

    function compileHTML(htmlFunc) {
        try {
            var compiledString = parseData(htmlFunc + "", "`*", "*`")[0];
            return compiledString;
        } catch (compileHTMLErr) {
            console.error(compileHTMLErr);
            return false;
        }
    }

    if (checkArgs('debug') !== false) {
        this.debug = true;
    }
    if (checkArgs('className') !== false) {
        this.className = checkArgs('className');
    }

    if (checkArgs('html') !== false) {
        this.html = checkArgs('html');
        this.template = compileHTML(checkArgs('html'));
    }
    if (checkArgs('template') !== false) {
        this.html = checkArgs('template');
        this.template = checkArgs('template');
    }

    if (checkArgs('element') !== false) {
        this.template = checkArgs('element').innerHTML;
    }

    if (checkArgs('data') !== false) {
        this.data = checkArgs('data');
    }

    if (checkArgs('events') !== false) {
        this.events = checkArgs('events');
    }

    if (checkArgs('beforeRender') !== false) {
        this.beforeRender = checkArgs('beforeRender');
    }

    if (checkArgs('afterRender') !== false) {
        this.afterRender = checkArgs('afterRender');
    }

    this.toHTML = () => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(this.template, 'text/html');
        this.template = doc.body.innerHTML;
    };

    this.renderJs = () =>  {
        var compiledTemplate = this.template;
        try {
            
            var GammmAllCodes = parseData(compiledTemplate, GammmStartCode, GammmEndCode);
            var GammmFinalCodeCompiled = "";
            var GammmTempCode = "";
            var GammmFinalCode = "";

            function GammmEcho(str){
                GammmFinalCode += str;
            }

            while (GammmAllCodes.length > 0) {

                try {
                    GammmFinalCode = "";
                    GammmFinalCodeCompiled = "";
                    
                    GammmTempCode = GammmAllCodes[0];

                    GammmTempCode = GammmTempCode.replace(GammmDoubleQuotes,'\\"');

                    var GammmStartLtTagBool = false;
                    for(var GammmStartLtTagIndex = 0; GammmStartLtTagIndex < GammmTempCode.length; GammmStartLtTagIndex++){

                        var GammmStringValue = GammmTempCode[GammmStartLtTagIndex];

                        if(GammmStringValue == '<' && GammmStartLtTagBool == false) {
                            GammmFinalCodeCompiled += ' GammmEcho(\"' + GammmStringValue;
                            GammmStartLtTagBool = true;
                        } else if(GammmStartLtTagBool == true && GammmStringValue == "\n") {
                            GammmFinalCodeCompiled += '");' + GammmStringValue;
                            GammmStartLtTagBool = false;
                        } else {
                            GammmFinalCodeCompiled += GammmStringValue;
                        }

                    }

                    var GammmTagsWithBracketsOnTextArea = parseData(GammmFinalCodeCompiled,'<textarea','</textarea>');

                    while(GammmTagsWithBracketsOnTextArea.length > 0){
                        var GammmReplacementString = "&lt;textarea" + GammmTagsWithBracketsOnTextArea[0]
                                                    .replace(GammmStartBrackets,'" + ')
                                                    .replace(GammmEndBrackets,' + "') + "&lt;/textarea&gt;";
                       
                        GammmFinalCodeCompiled = GammmFinalCodeCompiled.replace('<textarea' + GammmTagsWithBracketsOnTextArea[0] + '</textarea>',GammmReplacementString);
                        GammmTagsWithBracketsOnTextArea = parseData(GammmFinalCodeCompiled,'<textarea','</textarea>');
                        
                    }

                    var GammmTagsWithBrackets = parseData(GammmFinalCodeCompiled,'<','>');
                    while(GammmTagsWithBrackets.length > 0){
                        var GammmReplacementString = "&lt;" + GammmTagsWithBrackets[0]
                                                    .replace(GammmStartBrackets,'" + ')
                                                    .replace(GammmEndBrackets,' + "') + "&gt;";
                                 
                        GammmFinalCodeCompiled = GammmFinalCodeCompiled.replace('<' + GammmTagsWithBrackets[0] + '>',GammmReplacementString);
                        GammmTagsWithBrackets = parseData(GammmFinalCodeCompiled,'<','>');
                        // console.log(GammmFinalCodeCompiled)  
                        
                    }

                    GammmFinalCodeCompiled = GammmFinalCodeCompiled.replace(GammmLtTagString,'<')
                                                                 .replace(GammmGtTagString,'>')
                                                                 .replace(GammmAmpersandString,'&')
                                                                 .replace(GammmStartBrackets,'GammmEcho(')
                                                                 .replace(GammmEndBrackets,');');
                    
                    for(var GammmRegexTableKey in GammmRegexTable){
                        var GammmRegexTableValue = new RegExp(GammmRegexTableKey,'g');
                        GammmFinalCodeCompiled = GammmFinalCodeCompiled.replace(GammmRegexTableValue,GammmRegexTable[GammmRegexTableKey]);
                    }

                    eval(GammmFinalCodeCompiled);
                    
                    compiledTemplate = compiledTemplate.replace(GammmStartCode + GammmAllCodes[0] + GammmEndCode, GammmFinalCode);
                    GammmAllCodes = parseData(compiledTemplate,GammmStartCode,GammmEndCode);

                } catch(gammmCodeCompileError) {
                    console.log(gammmCodeCompileError);
                    console.log(GammmFinalCodeCompiled);
                    compiledTemplate = compiledTemplate.replace(GammmStartCode + GammmAllCodes[0] + GammmEndCode, '[object-undefined]');
                    GammmAllCodes = parseData(compiledTemplate,GammmStartCode,GammmEndCode);
                }

                
            }

        } catch (renderJsError) {
            console.error(renderJsError);
        }
        this.compiledTemplate = compiledTemplate;
    }

    this.renderData = () => {
        var compiledTemplate = this.compiledTemplate;
        try {
            var allDatas = parseData(compiledTemplate, '{{', '}}');
            while (allDatas.length > 0) {
                var tempData = allDatas.pop();
                var cleanData = (tempData).replace(/ /g, '');
                compiledTemplate = compiledTemplate.replace('{{' + tempData + '}}', eval('this.data.' + cleanData));
            }

        } catch (renderTemplateError) {
            console.error(renderTemplateError);
        }
        this.compiledTemplate = compiledTemplate;
    };

    this.compileEvents = () => {
        var compiledTemplate = this.compiledTemplate;
        this.compiledEvents = [];
        try {
            var allEvents = parseData(compiledTemplate, "gammmjs-", '}');

            while (allEvents.length > 0) {
                var tempEvents = allEvents.pop();
                var eventAction = parseData("-" + tempEvents, "-", "=")[0];
                var eventFunction = parseData(tempEvents + "}", "{", "}")[0];
                var childComponentId = 'data-gammmeventid="' + (allEvents.length + 1) + '" ';

                compiledTemplate = compiledTemplate.replace('gammmjs-' + eventAction + '="{' + eventFunction + '}"', childComponentId);

                this.compiledEvents.push({
                    actionIndex: (allEvents.length + 1),
                    actionEvent: eventAction,
                    actionFunction: eventFunction
                });

            }

        } catch (compileEventsError) {
            console.error(compileEventsError);
        }
        this.compiledTemplate = compiledTemplate;
    };

    this.renderEvents = () => {

        try {
            var gammmId = this.gammmId;
            for (var gammmEventsIndex in this.compiledEvents) {
                const gammmEventObject = this.compiledEvents[gammmEventsIndex];

                const tempChildElement = document.querySelector("#" + gammmId + ' [data-gammmeventid="' + gammmEventObject.actionIndex + '"]');
                gammmEventObject.element = tempChildElement;
                gammmEventObject[gammmEventObject.actionFunction] = function(gammmEvent) {

                    if(ThisGammmJS.events[gammmEventObject.actionFunction] !== undefined){
                        ThisGammmJS.events[gammmEventObject.actionFunction].call(ThisGammmJS,this,gammmEvent);
                    } else {
                        gammmEventObject.actionFunction.call(ThisGammmJS,this,gammmEvent);
                    }
                    

                    try {
                        if (this.tagName == 'INPUT' || this.tagName == 'TEXTAREA') {
                            var caret = this.selectionStart;
                            ThisGammmJS.focus(document.querySelector("#" + gammmId + ' [data-gammmeventid="' + gammmEventObject.actionIndex + '"]'), caret);
                        }

                    } catch (renderEventsAddEventListnerError) {
                        console.error(renderEventsAddEventListnerError);
                    }
                };

                tempChildElement.addEventListener(gammmEventObject.actionEvent, gammmEventObject[gammmEventObject.actionFunction]);
            }
        } catch (renderEventsError) {
            console.error(renderEventsError);
        }
    };

    this.load = (prop) => {
        return this.compiledTemplate;
    };

    this.focus = (element,caret = 0) => {
        var eventType = "onfocusin" in element ? "focusin" : "focus",
            bubbles = "onfocusin" in element,
            event;

        if ("createEvent" in document) {
            event = document.createEvent("Event");
            event.initEvent(eventType, bubbles, true);
        } else if ("Event" in window) {
            event = new Event(eventType, { bubbles: bubbles, cancelable: true });
        }

        element.focus();
        element.dispatchEvent(event);

        if ((element.tagName.toLowerCase() == "input" && element.type == "text") || element.tagName.toLowerCase() == "textarea") {
            element.setSelectionRange(caret, caret);
        }
    }

    this.state = () => {

        if (this.debug) {
            console.time('state');
        }

        this.renderJs();
        this.renderData();
        this.compileEvents();
        this.renderBlocks();
        
        for (var elemIndex in this.component) {
            const componentElement = this.component[elemIndex];
            componentElement.innerHTML = this.compiledTemplate;
        }
        this.renderEvents();

        var GammmBlocks = this.blocksStack;
        for(var iBlock in GammmBlocks){
            let gammmClass = window[GammmBlocks[iBlock].name];
            var blockElement = document.getElementById(gammmClass.blockId);
            for (var elemIndex in gammmClass.component) {
                var blockDiv = document.createElement('span');
                blockDiv.id = gammmClass.gammmId;
                blockDiv.className = gammmClass.className;
                gammmClass.component[elemIndex] = blockDiv;
                const componentElement = gammmClass.component[elemIndex];
                componentElement.innerHTML = gammmClass.compiledTemplate;
                blockElement.append(componentElement);
            }
            gammmClass.renderEvents();
        }

        if (this.debug) {
            console.timeEnd('state');
        }
    };

    this.renderBlocks = () => {

        var compiledTemplate = this.compiledTemplate;
        try {
            var blockStart = "&lt;#";
            var blockEnd = "/&gt;";

            var allBlocks = parseData(compiledTemplate, blockStart, blockEnd);

            while (allBlocks.length > 0) {
                var tempData = allBlocks.pop();

                var cleanData = '';
                var propsData = {};
               
                if(tempData.indexOf(' ') > -1){
                    cleanData = (tempData).substr(0,tempData.indexOf(' '));

                    var tempPropsStr = tempData.substr(tempData.indexOf(' '),tempData.length);
                    var tempProps = tempPropsStr.split(' ');
                    for(iProp in tempProps){
                        var splitProp = tempProps[iProp].split('=');
                        if(splitProp[0] !== ''){
                            propsData[splitProp[0]] = splitProp[1].replace(/\"/g,'');
                        }
                    }
                    
                } else {
                    cleanData = tempData;
                }

                var blockId = '';
                var alreadyExist = false;
                
                for(var iBlocks = 0; iBlocks < this.blocksStack.length; iBlocks++){
                    if(this.blocksStack[iBlocks].name == cleanData){
                        alreadyExist = true;
                        blockId = this.blocksStack[iBlocks].blockId;
                        break;
                    }
                }
                
                if(!alreadyExist){
                    blockId = GammmJSDom.generateGUID()
                    this.blocksStack.push({name: cleanData, props: propsData, blockId: blockId});
                }
                compiledTemplate = compiledTemplate.replace(blockStart + tempData + blockEnd, "<" + tempData + " id=" + '"' + blockId + '"' + " >" + "</" + cleanData + ">");
                
            }
            
            this.compiledTemplate = compiledTemplate;
        } catch (renderComponentsError){
            console.error(renderComponentsError);
        }
    }

    
    if(this.beforeRender !== null){
        this.beforeRender();
    }

    this.toHTML();
    this.renderJs();
    this.renderData();
    this.compileEvents();
    this.renderBlocks();

    if(this.afterRender !== null){
        this.afterRender();
    }
    
    if (checkArgs('element') !== false) {
        GammmJSDom.load(
            checkArgs('element'),
            this
        );
    }

    return this;
}