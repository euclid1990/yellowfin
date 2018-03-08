window.yellowfin = window.yellowfin || {
/*
* Yellowfin External Javascript Base API
*/
"apiVersion": "2.1",
"baseURL": "http://bi.valuecommerce.com/JsAPI",
"jqueryPath": "http://bi.valuecommerce.com//js/jquery-3.2.1.min.js",
"requirePath": "http://bi.valuecommerce.com//js/libs/requirejs/requirejs.js",

"serverInfo": {
    "releaseVersion": "7.35",
    "buildVersion": "20171201",
    "javaVersion": "1.8.0_131",
    "operatingSystem": "Linux",
    "operatingSystemArch": "amd64",
    "operatingSystemVersion": "3.10.0-514.21.1.el7.x86_64",
    "schemaVersion": "20130704"
},

"requests": [],
"nextRequestId": 0,

"traceEnabled": false,

"trace": function(name) {
    if (this.traceEnabled) {
        this.log('TRACE: ' + name);
    }
},

"log": function(text) {
    if (window.console && console.log) {
        console.log(text);
    }
},

"apiError": function(object) {
    this.trace('yellowfin.yellowfin.apiError()');
    alert('API Error: ' + object.errorDescription);
},

"apiLoadError": function(object) {
    this.trace('yellowfin.yellowfin.apiLoadError()');
    alert('Error loading API: ' + object.errorDescription);
},

"insertStylesheet": function(url) {
    this.trace('yellowfin.insertStylesheet()');

    var css = document.createElement('link');
    css.type = 'text/css';
    css.rel = 'stylesheet';
    css.href = url;
    css.media = 'screen';
    var head = document.getElementsByTagName('head')[0];
    if (head.firstChild) {
        head.insertBefore(css, head.firstChild);
    } else {
        head.appendChild(css);
    }

},

"insertScript": function(url) {
    this.trace('yellowfin.insertScript()');

    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = url;
    document.getElementsByTagName('head')[0].appendChild(s);

},

"loadApi": function(type, callback, arg) {
    this.trace('yellowfin.loadApi(\'' + type + '\')');

    var url = this.baseURL + '?api=' + encodeURIComponent(type);
    if (callback && callback != '') {
        url += '&callback=' + encodeURIComponent(callback);
        if (arg != null) {
            url += '&arg=' + encodeURIComponent(arg);
        }
    }
    this.insertScript(url);

},

"loadScript": function(script, callback, arg) {
    this.trace('yellowfin.loadScript(\'' + script + '\')');

    var url = this.baseURL + '?load=' + script;
    if (callback && callback != '') {
        url += '&callback=' + encodeURIComponent(callback);
        if (arg) {
            url += '&arg=' + encodeURIComponent(arg);
        }
    }
    this.insertScript(url);

},

"getObj": function(id) {
    this.trace('yellowfin.getObj()');

    if (document.layers) return document.layers[id];
    if (document.getElementById) return document.getElementById(id);
    return document.all[id];
},

"hasClassName": function(element, className) {
    this.trace('yellowfin.hasClassName()');

    if (!element) return;
    var cn = element.className;
    return (cn && (cn == className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(cn)));
},

"EventObj" : function(event, element) {

    /* the event object */
    this.event = event || window.event;

    /* mouse buttons */
    this.buttonLeft = false;
    this.buttonMiddle = false;
    this.buttonRight = false;
    if (this.event.which) {
        switch (this.event.which) {
            case 1:
            this.buttonLeft = true;
            break;
            case 2:
            this.buttonMiddle = true;
            break;
            case 3:
            this.buttonRight = true;
            break;
        }
    } else if (this.event.button) {
        this.buttonLeft = (this.event.button & 1) == 1;
        this.buttonMiddle = (this.event.button & 2) == 2;
        this.buttonRight = (this.event.button & 4) == 4;
    }

    /* mouse and window co-ordinates */
    if (this.event.pageX) {
        this.pageX = this.event.pageX;
        this.pageY = this.event.pageY;
    } else {
        this.pageX = this.event.clientX + yellowfin.getScrollLeft() - 2;
        this.pageY = this.event.clientY + yellowfin.getScrollTop() - 2;
    }
    this.clientX = this.event.clientX;
    this.clientY = this.event.clientY;

    /* source element */
    this.element = element;
    this.target = this.event.target || this.event.srcElement;
    this.fromElement = this.event.fromElement || this.event.relatedTarget;
    this.toElement = this.event.toElement || this.event.relatedTarget;

    /* prevent default function */
    this.preventDefault = function() {
        if (this.event.preventDefault) {
            this.event.preventDefault();
        } else {
            this.event.returnValue = false;
        }
    };

},

"loadReport": function(object) {
    this.trace('yellowfin.loadReport()');

    var rid = this.nextRequestId++;
    var robj = {
        "id": rid,
        "options": object
    };
    this.requests['r' + rid] = robj;

    if (yellowfin.reports) {
        this.loadReportNow(rid);
    } else {
        this.loadApi('reports', 'yellowfin.loadReportNow', rid);
    }
},

"loadReportNow": function(reqId) {
    this.trace('yellowfin.loadReportNow()');

    var object = this.requests['r' + reqId];
    if (!object) {
        alert('Error: invalid request');
        return;
    }
    this.requests['r' + reqId] = null;

    yellowfin.reports.loadReport(object.options);
},

"loadDash": function(object) {
    this.trace('yellowfin.loadDash()');

    var rid = this.nextRequestId++;
    var robj = {
        "id": rid,
        "options": object
    };
    this.requests['r' + rid] = robj;

    if (yellowfin.dash) {
        this.loadDashNow(rid);
    } else {
        this.loadApi('dash', 'yellowfin.loadDashNow', rid);
    }
},

"loadDashNow": function(reqId) {
    this.trace('yellowfin.loadDashNow()');

    var object = this.requests['r' + reqId];
    if (!object) {
        alert('Error: invalid request');
        return;
    }
    this.requests['r' + reqId] = null;

    yellowfin.dash.loadDash(object.options);
},

"getAbsoluteTop": function(elem) {
    this.trace('yellowfin.getAbsoluteTop()');

    var topPosition = 0;
    while (elem) {
        if (elem.tagName.toUpperCase() == 'BODY') break;
        topPosition += elem.offsetTop;
        elem = elem.offsetParent;
    }
    return topPosition;
},

"getAbsoluteLeft": function(elem) {
    this.trace('yellowfin.getAbsoluteLeft()');

    var leftPosition = 0;
    while (elem) {
        if (elem.tagName.toUpperCase() == 'BODY') break;
        leftPosition += elem.offsetLeft;
        elem = elem.offsetParent;
    }
    return leftPosition;
},

"eventOnObject": function(obj, onEvent, handler) {
    this.trace('yellowfin.eventOnObject()');

    if (obj.attachEvent) {
        obj.attachEvent("on" + onEvent, handler);
    } else {
        obj.addEventListener(onEvent, handler, true);
    }
},

"eventOffObject": function(obj, onEvent, handler) {
    this.trace('yellowfin.eventOffObject()');

    if (obj.detachEvent) {
        obj.detachEvent("on" + onEvent, handler);
    } else {
        obj.removeEventListener(onEvent, handler, true);
    }
},

"getScrollLeft": function() {
    this.trace('yellowfin.getScrollLeft()');

    if (document.compatMode && document.compatMode != 'BackCompat') {
        return Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
    } else {
        return document.body.scrollLeft;
    }
},

"getScrollTop": function() {
    this.trace('yellowfin.getScrollTop()');

    if (document.compatMode && document.compatMode != 'BackCompat') {
        return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    } else {
        return document.body.scrollTop;
    }
},

"escapeHtml": function(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}


};
window.yellowfin = window.yellowfin || {};
yellowfin.reports = yellowfin.reports || {

    "requests": {},
    "nextRequestId": 0,
    "reportOptions": {},
    "loadingReport": false,
    "reportQueue": [],
    "commonStyleLoaded": false,

    "loadReportByName": function(options) {
        yellowfin.trace('yellowfin.reports.loadReportByName()');

        var rid = this.nextRequestId++;
        var robj = {
            "id": rid,
            "options": options
        };
        this.requests['r' + rid] = robj;

/* can't do this because the container div is not set up until after we have the report id
var div = this.createLoadingDiv('Loading Report...');
options.outerContainer.appendChild(div);
robj.loadingDiv = div;
*/

var src = yellowfin.baseURL + '?api=reports&cmd=loadReportId&reqId=' + rid + '&wsName=' + encodeURIComponent(options.wsName);
src += '&u=' + Math.floor(Math.random() * 1000000000);

yellowfin.insertScript(src);

},

"reportIdLoaded": function(reqId, name, reportId) {
    yellowfin.trace('yellowfin.reports.reportIdLoaded()');

    var robj = this.requests['r' + reqId];
    this.requests['r' + reqId] = null;
    var options = robj.options;
    options.reportId = reportId;
    this.loadReport(options);

},

"loadReportByUUID": function(options) {
    yellowfin.trace('yellowfin.reports.loadReportByUUID()');

    var rid = this.nextRequestId++;
    var robj = {
        "id": rid,
        "options": options
    };
    this.requests['r' + rid] = robj;

/* can't do this because the container div is not set up until after we have the report id
var div = this.createLoadingDiv('Loading Report...');
options.outerContainer.appendChild(div);
robj.loadingDiv = div;
*/

var src = yellowfin.baseURL + '?api=reports&cmd=loadReportId&reqId=' + rid + '&reportUUID=' + encodeURIComponent(options.reportUUID);
src += '&u=' + Math.floor(Math.random() * 1000000000);

yellowfin.insertScript(src);

},

"loadReport": function(options) {
    yellowfin.trace('yellowfin.reports.loadReport()');

// validate

if (!options) {
    alert('No options specified');
    return;
}

if (!options.element) {
    if (options.elementId) {
        options.element = yellowfin.getObj(options.elementId);
        if (!options.element) {
            alert('Element not found: ' + options.elementId);
            return;
        }
    }
}
if (!options.element) {
    alert('No Element specified');
    return;
}

if (!options.reportId || options.reportId == '') {
    if (options.wsName && options.wsName != '') {
// load the report id
this.loadReportByName(options);
} else if (options.reportUUID && options.reportUUID != '') {
// load the report id
this.loadReportByUUID(options);
} else {
    alert('No reportUUID specified');
}
return;
}

this.reportOptions['r' + options.reportId] = options;

options.showTitle = options.showTitle == null || options.showTitle == true || options.showTitle == 'true';
options.showInfo = options.showInfo == null || options.showInfo == true || options.showInfo == 'true';
options.showFilters = options.showFilters == null || options.showFilters == true || options.showFilters == 'true';
options.showSections = options.showSections == null || options.showSections == true || options.showSections == 'true';
options.showSeries = options.showSeries == null || options.showSeries == true || options.showSeries == 'true';
options.showPageLinks = options.showPageLinks == null || options.showPageLinks == true || options.showPageLinks == 'true';
options.showExport = options.showExport == null || options.showExport == true || options.showExport == 'true';
options.showTimesel = options.showTimesel == null || options.showTimesel == true || options.showTimesel == 'true';
options.showGISNav = options.showGISNav == null || options.showGISNav == true || options.showGISNav == 'true';

if (!options.height) {
    if (options.innerElement) {
        options.height = options.innerElement.offsetHeight;
    } else if (options.element.offsetHeight) {
        options.height = options.element.offsetHeight - 5;
        if (options.showTitle) options.height -= 30;
        if (options.height < 0) options.height = null;
    }
}

if (!options.width) {
    if (options.innerElement) {
        options.width = options.innerElement.offsetWidth;
    } else {
        options.width = options.element.offsetWidth;
    }
}

// set up the container div etc
this.setupReport(options);

if (this.loadingReport) {
    this.reportQueue.push(options);
} else {
    this.loadReportNow(options);
}

},

"loadNextReport": function() {
    yellowfin.trace('yellowfin.reports.loadNextReport()');

    if (this.reportQueue.length > 0) {
        this.loadReportNow(this.reportQueue.shift());
    } else {
        this.loadingReport = false;
    }

},

"setupReport": function(options) {
    yellowfin.trace('yellowfin.reports.setupReport()');

    if (!options) return;
    if (!options.element) return;
    if (!options.reportId) return;

    if (!this.commonStyleLoaded) {
        yellowfin.insertStylesheet(yellowfin.baseURL + '?api=reports&cmd=commonCss&u=' + Math.floor(Math.random() * 1000000000));
        this.commonStyleLoaded = true;
    }

    if (!options.outerContainer) {

// set up divs
while (options.element.firstChild)
    options.element.removeChild(options.element.firstChild);

var div = document.createElement('div');
div.className = 'yfReportOuterContainer';
if (options.element.offsetHeight) {
    div.style.height = options.element.offsetHeight + 'px';
}
div.style.width = '100%';
div.style.position = 'relative';
options.element.appendChild(div);
options.outerContainer = div;

if (options.showTitle) {
    div = document.createElement('div');
    div.className = 'yfReportTitleOuter';
    if (options.width) {
        div.style.width = options.width + 'px';
    } else {
        div.style.width = '100%';
    }

    options.outerContainer.appendChild(div);
    options.titleElement = div;
}

div = document.createElement('div');
div.className = 'yfReport';
div.setAttribute('data-reportid', options.reportId);
if (options.height) {
    div.style.height = options.height + 'px';
}
if (options.width) {
    div.style.width = options.width + 'px';
} else {
    div.style.width = '100%';
}
div.style.position = 'relative';
div.style.overflow = 'auto';
options.outerContainer.appendChild(div);
options.innerElement = div;

div = document.createElement('div');
div.className = 'yfLogon';
div.style.position = 'relative';
div.style.overflow = 'auto';
div.style.width = '100%';
if (options.height) {
    div.style.height = options.height + 'px';
}
div.style.padding = '2px 0px';
div.style.display = 'none';
var div2 = document.createElement('div');
div2.className = 'yfLogonErrors';
div2.style.display = 'none';
div.appendChild(div2);
options.logonErrorsElement = div2;
var tbl = document.createElement('table');
var tbody = document.createElement('tbody');
var tr = document.createElement('tr');
var td = document.createElement('td');
td.appendChild(document.createTextNode('Username:'));
tr.appendChild(td);
td = document.createElement('td');
var txtel = document.createElement('input');
txtel.type = 'text';
td.appendChild(txtel);
options.logonUsernameEl = txtel;
tr.appendChild(td);
tbody.appendChild(tr);
tr = document.createElement('tr');
td = document.createElement('td');
td.appendChild(document.createTextNode('Password:'));
tr.appendChild(td);
td = document.createElement('td');
txtel = document.createElement('input');
txtel.type = 'password';
td.appendChild(txtel);
options.logonPasswordEl = txtel;
tr.appendChild(td);
tbody.appendChild(tr);
tr = document.createElement('tr');
td = document.createElement('td');
tr.appendChild(td);
td = document.createElement('td');
var el = document.createElement('input');
el.type = 'submit';
el.name = 'submitbutton';
el.value = 'Login';
el.onclick = function() { yellowfin.reports.logon(options.reportId) };
td.appendChild(el);
tr.appendChild(td);
tbody.appendChild(tr);
tbl.appendChild(tbody);
div.appendChild(tbl);
options.outerContainer.appendChild(div);
options.logonElement = div;


div = document.createElement('div');
div.className = 'yfReportFooter';
if (options.width) {
    div.style.width = options.width + 'px';
} else {
    div.style.width = '100%';
}
div.style.position = 'relative';
options.outerContainer.appendChild(div);
options.footerElement = div;

}

},

"loadReportNow": function(options) {
    yellowfin.trace('yellowfin.reports.loadReportNow(' + options.reportId + '/' + options.wsName + ')');

    this.loadingReport = true;

    var rid = this.nextRequestId++;
    var robj = {
        "id": rid,
        "options": options
    };
    this.requests['r' + rid] = robj;

    if (options.sectionsDisplayed) {
        robj.sectionsDisplayed = true;
        options.sectionsDisplayed = null;
    }
    if (options.pageLinksDisplayed) {
        robj.pageLinksDisplayed = true;
        options.pageLinksDisplayed = null;
    }
    if (options.seriesDisplayed) {
        robj.sectionsDisplayed = true;
        options.sectionsDisplayed = null;
    }
    if (options.gisNavDisplayed) {
        robj.gisNavDisplayed = true;
        options.gisNavDisplayed = null;
    }

    div = this.createLoadingDiv('Loading Report...');
    options.outerContainer.appendChild(div);
    robj.loadingDiv = div;

    var src = yellowfin.baseURL + '?api=reports&cmd=loadReport&reqId=' + rid;
    src += '&version=' + yellowfin.apiVersion;
    src += '&reportId=' + options.reportId;
    if (options.height) {
        src += '&height=' + options.height;
    }
    if (options.width) {
        src += '&width=' + options.width;
    }
    if (options.display != null) {
        src += '&display=' + options.display;
    }
    if (options.fitTableWidth != null) {
        src += '&fitTableWidth=' + options.fitTableWidth;
    }
    if (options.reload == null || options.reload == true) {
        src += '&reload=true';
    }
    if (options.canChangeDisplay != null) {
        src += '&canChangeDisplay=' + options.canChangeDisplay;
    }
    if (options.dashUUID != null) {
        src += '&dashUUID=' + options.dashUUID;
    }
    if (options.username) {
        src += '&username=' + encodeURIComponent(options.username);
    }
    if (options.password) {
        src += '&password=' + encodeURIComponent(options.password);
    }
    if(options.clientOrg) {
        src += '&clientOrg=' + encodeURIComponent(options.clientOrg);
    }
    if (options.token) {
        src += '&token=' + encodeURIComponent(options.token);
    }
    if (options.filters) {
// options.filters should be an object keyed by uuid
for (var k in options.filters) {
    src += '&yfFilter' + k + '=';
    if (options.filters[k] instanceof Array) {
        src += encodeURIComponent(this.serialiseList(options.filters[k]));
    } else {
        src += encodeURIComponent(options.filters[k]);
    }
}
delete options.filters;
}
if (options.bookmarkUUID) {
    src += '&bookmarkUUID=' + encodeURIComponent(options.bookmarkUUID);
}
if (options.snapshotUUID) {
    src += '&snapshotUUID=' + encodeURIComponent(options.snapshotUUID);
}
if (window.google) {
    src += '&google=true';
}
src += '&u=' + Math.floor(Math.random() * 1000000000);

yellowfin.insertScript(src);

},

"reportLoaded": function(object) {
    yellowfin.trace('yellowfin.reports.reportLoaded()');

    var robj = this.requests['r' + object.reqId];
    if (!robj) {
        alert('Error: invalid request');
        this.loadNextReport();
        return;
    }

    this.requests['r' + object.reqId] = null;

    robj.options.display = object.display;
    robj.options.dashUUID = object.dashUUID;

    yellowfin.insertStylesheet(yellowfin.baseURL + '?api=reports&cmd=css&reportId=' + robj.options.reportId + '&u=' + Math.floor(Math.random() * 1000000000));

    if (robj.options.titleElement && robj.options.showTitle) {

        while (robj.options.titleElement.firstChild)
            robj.options.titleElement.removeChild(robj.options.titleElement.firstChild);

        var tbl2 = document.createElement('table');
        tbl2.border = 0;
        tbl2.cellPadding = 0;
        tbl2.cellSpacing = 0;
        tbl2.width = '100%';
        var tbody2 = document.createElement('tbody');
        var tr2 = document.createElement('tr');
        var td2 = document.createElement('td');
        td2.width = 4;
        var img = document.createElement('img');
        img.src = yellowfin.baseURL + '?cmd=img&fn=js_top_left.png';
        img.border = 0;
        img.style.display = 'block';
        td2.appendChild(img);
        tr2.appendChild(td2);
        td2 = document.createElement('td');
        td2.setAttribute('width', '*');
        td2.style.background = 'url(' + yellowfin.baseURL + '?cmd=img&fn=js_top.png)';

        var innerDiv = document.createElement('div');
        innerDiv.className = 'yfReportTitleInner';

        var tbl = document.createElement('table');
        tbl.width = '100%';
        tbl.border = 0;
        tbl.cellSpacing = 0;
        tbl.cellPadding = 0;
        var tbody = document.createElement('tbody');
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.className = 'yfReportTitle';

        var div = document.createElement('div');
        div.className = 'yfReportTitle';
        div.appendChild(document.createTextNode(object.reportTitle));
        td.appendChild(div);
        tr.appendChild(td);

        td = document.createElement('td');
        td.width = '3';
        tr.appendChild(td);

        td = document.createElement('td');
        td.className = 'yfReportTitleLinks';

        if (robj.options.showInfo) {
            var a = document.createElement('a');
            a.href = 'javascript:yellowfin.reports.toggleReportInfo(' + robj.options.reportId + ');';
            var img = document.createElement('img');
            img.src = yellowfin.baseURL + '?cmd=img&fn=js_info.png';
            img.border = 0;
            img.align = 'absmiddle';
            img.title = 'Report Info';
            a.appendChild(img);
            td.appendChild(a);
            td.appendChild(document.createTextNode(' '));
            robj.options.infoBtnImg = img;

            a = document.createElement('a');
            a.href = 'javascript:yellowfin.reports.toggleShare(' + robj.options.reportId + ');';
            var img = document.createElement('img');
            img.src = yellowfin.baseURL + '?cmd=img&fn=js_share.png';
            img.border = 0;
            img.align = 'absmiddle';
            img.title = 'Share';
            a.appendChild(img);
            td.appendChild(a);
            td.appendChild(document.createTextNode(' '));
            robj.options.shareBtnImg = img;

        }

        if (object.canChangeDisplay) {

            if (object.display == 'table') {
                var a = document.createElement('a');
                a.href = 'javascript:yellowfin.reports.toggleDisplay(' + robj.options.reportId + ');';
                var img = document.createElement('img');
                img.src = yellowfin.baseURL + '?cmd=img&fn=js_chart.png';
                img.border = 0;
                img.align = 'absmiddle';
                img.title = 'Chart';
                a.appendChild(img);
                td.appendChild(a);
            } else {
                var img = document.createElement('img');
                img.src = yellowfin.baseURL + '?cmd=img&fn=js_chart_on.png';
                img.border = 0;
                img.align = 'absmiddle';
                img.title = 'Chart';
                td.appendChild(img);
            }
            td.appendChild(document.createTextNode(' '));

            if (object.display == 'chart') {
                var a = document.createElement('a');
                a.href = 'javascript:yellowfin.reports.toggleDisplay(' + robj.options.reportId + ');';
                img = document.createElement('img');
                img.src = yellowfin.baseURL + '?cmd=img&fn=js_table.png';
                img.border = 0;
                img.align = 'absmiddle';
                img.title = 'Table';
                a.appendChild(img);
                td.appendChild(a);
            } else {
                var img = document.createElement('img');
                img.src = yellowfin.baseURL + '?cmd=img&fn=js_table_on.png';
                img.border = 0;
                img.align = 'absmiddle';
                img.title = 'Table';
                td.appendChild(img);
            }
            td.appendChild(document.createTextNode(' '));
        }

        if (robj.options.showFilters && object.filterhtml && object.filterhtml != '') {
            var a = document.createElement('a');
            a.href = 'javascript:yellowfin.reports.toggleFilters(' + robj.options.reportId + ');';
            var img = document.createElement('img');
            img.src = yellowfin.baseURL + '?cmd=img&fn=js_filter.png';
            img.border = 0;
            img.align = 'absmiddle';
            img.title = 'Filters';
            a.appendChild(img);
            td.appendChild(a);
            td.appendChild(document.createTextNode(' '));
            robj.options.filterBtnImg = img;
        }

        if (robj.options.showSections && object.sectionhtml && object.sectionhtml != '') {
            var a = document.createElement('a');
            a.href = 'javascript:yellowfin.reports.toggleSections(' + robj.options.reportId + ');';
            var img = document.createElement('img');
            if (robj.sectionsDisplayed) {
                img.src = yellowfin.baseURL + '?cmd=img&fn=js_section_on.png';
            } else {
                img.src = yellowfin.baseURL + '?cmd=img&fn=js_section.png';
            }
            img.border = 0;
            img.align = 'absmiddle';
            img.title = 'Sections';
            a.appendChild(img);
            td.appendChild(a);
            td.appendChild(document.createTextNode(' '));
            robj.options.sectionBtnImg = img;
        }

        if (robj.options.showPageLinks && object.pagehtml && object.pagehtml != '') {
            var a = document.createElement('a');
            a.href = 'javascript:yellowfin.reports.togglePageLinks(' + robj.options.reportId + ');';
            var img = document.createElement('img');
            if (robj.pageLinksDisplayed) {
                img.src = yellowfin.baseURL + '?cmd=img&fn=js_next_on.png';
            } else {
                img.src = yellowfin.baseURL + '?cmd=img&fn=js_next.png';
            }
            img.border = 0;
            img.align = 'absmiddle';
            img.title = 'Pages';
            a.appendChild(img);
            td.appendChild(a);
            td.appendChild(document.createTextNode(' '));
            robj.options.pagelinkBtnImg = img;
        }

        if (robj.options.showSeries && object.serieshtml && object.serieshtml != '' && object.display == 'chart') {
            var a = document.createElement('a');
            if (object.seriestype == 'LEFTPANEL') {
                a.href = 'javascript:yellowfin.reports.toggleLeftSeries(' + robj.options.reportId + ');';
            } else {
                a.href = 'javascript:yellowfin.reports.toggleSeries(' + robj.options.reportId + ');';
            }
            var img = document.createElement('img');
            if (robj.seriesDisplayed) {
                img.src = yellowfin.baseURL + '?cmd=img&fn=js_series_on.png';
            } else {
                img.src = yellowfin.baseURL + '?cmd=img&fn=js_series.png';
            }
            img.border = 0;
            img.align = 'absmiddle';
            img.title = 'Series';
            a.appendChild(img);
            td.appendChild(a);
            td.appendChild(document.createTextNode(' '));
            robj.options.seriesBtnImg = img;
        }

        if (robj.options.showExport && object.exporthtml && object.exporthtml != '') {
            var a = document.createElement('a');
            a.href = 'javascript:yellowfin.reports.toggleExport(' + robj.options.reportId + ');';
            var img = document.createElement('img');
            img.src = yellowfin.baseURL + '?cmd=img&fn=js_export.png';
            img.border = 0;
            img.align = 'absmiddle';
            img.title = 'Export';
            a.appendChild(img);
            td.appendChild(a);
            td.appendChild(document.createTextNode(' '));
            robj.options.exportBtnImg = img;
        }

        if (robj.options.showTimesel && object.timeselhtml && object.timeselhtml != '') {
            var a = document.createElement('a');
            a.href = 'javascript:yellowfin.reports.toggleTimesel(' + robj.options.reportId + ');';
            var img = document.createElement('img');
            img.src = yellowfin.baseURL + '?cmd=img&fn=js_aggregation.png';
            img.border = 0;
            img.align = 'absmiddle';
            img.title = 'Time Period';
            a.appendChild(img);
            td.appendChild(a);
            td.appendChild(document.createTextNode(' '));
            robj.options.timeselBtnImg = img;
        }

        if (robj.options.showGISNav && object.gisnavhtml && object.gisnavhtml != '') {
            var a = document.createElement('a');
            a.href = 'javascript:yellowfin.reports.toggleGISNav(' + robj.options.reportId + ');';
            var img = document.createElement('img');
            if (robj.gisNavDisplayed) {
                img.src = yellowfin.baseURL + '?cmd=img&fn=js_gis_on.png';
            } else {
                img.src = yellowfin.baseURL + '?cmd=img&fn=js_gis.png';
            }
            img.border = 0;
            img.align = 'absmiddle';
            img.title = 'GIS Navigation';
            a.appendChild(img);
            td.appendChild(a);
            td.appendChild(document.createTextNode(' '));
            robj.options.gisnavBtnImg = img;
        }

        tr.appendChild(td);
        tbody.appendChild(tr);
        tbl.appendChild(tbody);

        innerDiv.appendChild(tbl);
        td2.appendChild(innerDiv);
        tr2.appendChild(td2);
        td2 = document.createElement('td');
        td2.width = 4;
        var img = document.createElement('img');
        img.src = yellowfin.baseURL + '?cmd=img&fn=js_top_right.png';
        img.border = 0;
        img.style.display = 'block';
        td2.appendChild(img);
        tr2.appendChild(td2);
        tbody2.appendChild(tr2);
        tbl2.appendChild(tbody2);

        robj.options.titleElement.appendChild(tbl2);

    }

    if (robj && robj.options && robj.options.outerContainer && robj.loadingDiv) {
        robj.options.outerContainer.removeChild(robj.loadingDiv);
    }

    while (robj.options.innerElement.firstChild)
        robj.options.innerElement.removeChild(robj.options.innerElement.firstChild);

    if (robj.options.filterFormElement) {
        if (robj.options.filterFormElement.parentNode) {
            robj.options.filterFormElement.parentNode.removeChild(robj.options.filterFormElement);
        }
        robj.options.filterFormElement = null;
    }
    if (robj.options.filterElement) {
        if (robj.options.filterElement.parentNode) {
            robj.options.filterElement.parentNode.removeChild(robj.options.filterElement);
        }
        robj.options.filterElement = null;
    }

    if (robj.options.showFilters && object.filterhtml && object.filterhtml != '') {

        var outerDiv = document.createElement('div');
        outerDiv.className = 'yfLeftMenu yfReportFilters';

        var frm = document.createElement('form');
        frm.style.margin = '0px';
        frm.style.padding = '0px';

        div = document.createElement('div');
        div.className = 'yfReportFiltersInner';
        div.innerHTML = object.filterhtml;
        frm.appendChild(div);

        outerDiv.appendChild(frm);
        robj.options.innerElement.appendChild(outerDiv);
        robj.options.filterFormElement = frm;
        robj.options.filterElement = outerDiv;
        robj.options.filterContainer = div;
        robj.options.filters = object.filters;

        this.setupFilters(object.reportId);

    }

    if (robj.options.infoElement) {
        if (robj.options.infoElement.parentNode) {
            robj.options.infoElement.parentNode.removeChild(robj.options.infoElement);
        }
        robj.options.infoElement = null;
    }
    if (robj.options.shareElement) {
        if (robj.options.shareElement.parentNode) {
            robj.options.shareElement.parentNode.removeChild(robj.options.shareElement);
        }
        robj.options.shareElement = null;
    }
    if (robj.options.showInfo && robj.options.showTitle) {
        div = document.createElement('div');
        div.className = 'yfTopMenu yfReportInfo';

        tbl = document.createElement('table');
        tbl.className = 'yfReportInfoInner';
        tbl.width = '100%';
        tbl.cellPadding = 0;
        tbl.cellSpacing = 0;
        tbody = document.createElement('tbody');
        tr = document.createElement('tr');
        td = document.createElement('td');
        td.innerHTML = object.infohtml;
        tr.appendChild(td);
        td = document.createElement('td');
        td.align = 'right';
        td.vAlign = 'top';
        a = document.createElement('a');
        a.href = 'javascript:yellowfin.reports.toggleReportInfo(' + robj.options.reportId + ');';
        img = document.createElement('img');
        img.src = yellowfin.baseURL + '?cmd=img&fn=js_close.png';
        img.border = 0;
        img.align = 'absmiddle';
        img.title = 'Close';
        a.appendChild(img);
        td.appendChild(a);
        tr.appendChild(td);
        tbody.appendChild(tr);
        tbl.appendChild(tbody);
        div.appendChild(tbl);

        robj.options.innerElement.appendChild(div);
        robj.options.infoElement = div;

        div = document.createElement('div');
        div.className = 'yfTopMenu yfReportShare';

        tbl = document.createElement('table');
        tbl.className = 'yfReportShareInner';
        tbl.width = '100%';
        tbl.cellPadding = 0;
        tbl.cellSpacing = 0;
        tbody = document.createElement('tbody');
        tr = document.createElement('tr');
        td = document.createElement('td');
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'yfReportShareInput';

        var w = Math.round(robj.options.titleElement.offsetWidth * 0.9);
        if (w < 60) w = 60;
        inp.style.width = w + 'px';

        inp.value = '<script type="text/javascript" src="' + object.embedLinkEsc + '"></script>';
        inp.onclick = inp.select;
        td.appendChild(inp);
        tr.appendChild(td);
        td = document.createElement('td');
        td.align = 'right';
        td.vAlign = 'top';
        a = document.createElement('a');
        a.href = 'javascript:yellowfin.reports.toggleShare(' + robj.options.reportId + ');';
        img = document.createElement('img');
        img.src = yellowfin.baseURL + '?cmd=img&fn=js_close.png';
        img.border = 0;
        img.align = 'absmiddle';
        img.title = 'Close';
        a.appendChild(img);
        td.appendChild(a);
        tr.appendChild(td);
        tbody.appendChild(tr);
        tbl.appendChild(tbody);
        div.appendChild(tbl);

        robj.options.innerElement.appendChild(div);
        robj.options.shareElement = div;
    }

    if (robj.options.sectionElement) {
        if (robj.options.sectionElement.parentNode) {
            robj.options.sectionElement.parentNode.removeChild(robj.options.sectionElement);
        }
        robj.options.sectionElement = null;
    }
    if (robj.options.showSections && object.sectionhtml && object.sectionhtml != '') {

        var outerDiv = document.createElement('div');
        outerDiv.className = 'yfTopMenu yfReportSections';

        div = document.createElement('div');
        div.className = 'yfReportSectionsInner';

        var tbl = document.createElement('table');
        tbl.cellPadding = 0;
        tbl.cellSpacing = 0;
        tbl.width = '100%';
        var tbody = document.createElement('tbody');
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.className = 'yfReportSectionsCell';
        td.width = '99%';
        td.innerHTML = object.sectionhtml;
        tr.appendChild(td);
        td = document.createElement('td');
        td.align = 'right';
        var a = document.createElement('a');
        a.href = 'javascript:yellowfin.reports.toggleSections(' + robj.options.reportId + ');';
        var img = document.createElement('img');
        img.src = yellowfin.baseURL + '?cmd=img&fn=js_close.png';
        img.border = 0;
        img.align = 'absmiddle';
        img.title = 'Close';
        a.appendChild(img);
        td.appendChild(a);
        tr.appendChild(td);
        tbody.appendChild(tr);
        tbl.appendChild(tbody);

        div.appendChild(tbl);
        outerDiv.appendChild(div);
        robj.options.innerElement.appendChild(outerDiv);
        robj.options.sectionElement = outerDiv;

    }

    if (robj.options.seriesFormElement) {
        if (robj.options.seriesFormElement.parentNode) {
            robj.options.seriesFormElement.parentNode.removeChild(robj.options.seriesFormElement);
        }
        robj.options.seriesFormElement = null;
    }
    if (robj.options.seriesElement) {
        if (robj.options.seriesElement.parentNode) {
            robj.options.seriesElement.parentNode.removeChild(robj.options.seriesElement);
        }
        robj.options.seriesElement = null;
    }
    if (robj.options.leftSeriesElement) {
        if (robj.options.leftSeriesElement.parentNode) {
            robj.options.leftSeriesElement.parentNode.removeChild(robj.options.leftSeriesElement);
        }
        robj.options.leftSeriesElement = null;
    }

    robj.options.seriesType = null;
    robj.options.seriesChartKey = null;
    if (robj.options.showSeries && object.serieshtml && object.serieshtml != '') {

        if (object.seriestype == 'LEFTPANEL') {

            var outerDiv = document.createElement('div');
            outerDiv.className = 'yfLeftMenu yfReportLeftSeries';

            div = document.createElement('div');
            div.className = 'yfReportLeftSeriesInner';
            div.innerHTML = object.serieshtml;
            outerDiv.appendChild(div);

            robj.options.innerElement.appendChild(outerDiv);
            robj.options.leftSeriesElement = outerDiv;

        } else {

            var outerDiv = document.createElement('div');
            outerDiv.className = 'yfTopMenu yfReportSeries';

            var form = document.createElement('form');
            form.style.margin = '0px';
            form.style.padding = '0px';

            div = document.createElement('div');
            div.className = 'yfReportSeriesInner';

            var tbl = document.createElement('table');
            tbl.cellPadding = 0;
            tbl.cellSpacing = 0;
            tbl.width = '100%';
            var tbody = document.createElement('tbody');
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            td.width = '99%';
            td.innerHTML = object.serieshtml;
            tr.appendChild(td);
            td = document.createElement('td');
            td.align = 'right';
            td.vAlign = 'top';
            var a = document.createElement('a');
            a.href = 'javascript:yellowfin.reports.toggleSeries(' + robj.options.reportId + ');';
            var img = document.createElement('img');
            img.src = yellowfin.baseURL + '?cmd=img&fn=js_close.png';
            img.border = 0;
            img.align = 'absmiddle';
            img.title = 'Close';
            a.appendChild(img);
            td.appendChild(a);
            tr.appendChild(td);
            tbody.appendChild(tr);
            tbl.appendChild(tbody);

            div.appendChild(tbl);
            form.appendChild(div);
            outerDiv.appendChild(form);
            robj.options.innerElement.appendChild(outerDiv);
            robj.options.seriesFormElement = form;
            robj.options.seriesElement = outerDiv;

        }

        robj.options.seriesType = object.seriestype;
        robj.options.seriesChartKey = object.serieschartkey;
        robj.options.seriesInitialScroll = object.seriesinitialscroll;
        robj.options.seriesInitialised = false;

    }

    if (robj.options.pagelinkElement) {
        if (robj.options.pagelinkElement.parentNode) {
            robj.options.pagelinkElement.parentNode.removeChild(robj.options.pagelinkElement);
        }
        robj.options.pagelinkElement = null;
    }
    if (robj.options.showPageLinks && object.pagehtml && object.pagehtml != '') {

        var outerDiv = document.createElement('div');
        outerDiv.className = 'yfTopMenu yfReportPageLinks';

        div = document.createElement('div');
        div.className = 'yfReportPageLinksInner';

        var tbl = document.createElement('table');
        tbl.cellPadding = 0;
        tbl.cellSpacing = 0;
        tbl.width = '100%';
        var tbody = document.createElement('tbody');
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.className = 'yfReportPageLinksCell';
        td.width = '99%';
        td.innerHTML = object.pagehtml;
        tr.appendChild(td);
        td = document.createElement('td');
        td.align = 'right';
        var a = document.createElement('a');
        a.href = 'javascript:yellowfin.reports.togglePageLinks(' + robj.options.reportId + ');';
        var img = document.createElement('img');
        img.src = yellowfin.baseURL + '?cmd=img&fn=js_close.png';
        img.border = 0;
        img.align = 'absmiddle';
        img.title = 'Close';
        a.appendChild(img);
        td.appendChild(a);
        tr.appendChild(td);
        tbody.appendChild(tr);
        tbl.appendChild(tbody);

        div.appendChild(tbl);
        outerDiv.appendChild(div);
        robj.options.innerElement.appendChild(outerDiv);
        robj.options.pagelinkElement = outerDiv;

    }

    if (robj.options.timeselElement) {
        if (robj.options.timeselElement.parentNode) {
            robj.options.timeselElement.parentNode.removeChild(robj.options.timeselElement);
        }
        robj.options.timeselElement = null;
    }
    if (robj.options.showTimesel) {

        var outerDiv = document.createElement('div');
        outerDiv.className = 'yfTopMenu yfReportTimesel';

        var tbl = document.createElement('table');
        tbl.className = 'yfReportTimeselInner';
        tbl.cellPadding = 0;
        tbl.cellSpacing = 0;
        tbl.width = '100%';
        var tbody = document.createElement('tbody');
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.className = 'yfReportTimeselCell';
        td.width = '99%';
        td.innerHTML = object.timeselhtml || '';
        tr.appendChild(td);
        td = document.createElement('td');
        td.align = 'right';
        var a = document.createElement('a');
        a.href = 'javascript:yellowfin.reports.toggleTimesel(' + robj.options.reportId + ');';
        var img = document.createElement('img');
        img.src = yellowfin.baseURL + '?cmd=img&fn=js_close.png';
        img.border = 0;
        img.align = 'absmiddle';
        img.title = 'Close';
        a.appendChild(img);
        td.appendChild(a);
        tr.appendChild(td);
        tbody.appendChild(tr);
        tbl.appendChild(tbody);

        outerDiv.appendChild(tbl);
        robj.options.innerElement.appendChild(outerDiv);
        robj.options.timeselElement = outerDiv;

    }

    if (robj.options.gisnavElement) {
        if (robj.options.gisnavElement.parentNode) {
            robj.options.gisnavElement.parentNode.removeChild(robj.options.gisnavElement);
        }
        robj.options.gisnavElement = null;
    }
    if (robj.options.showGISNav) {

        var outerDiv = document.createElement('div');
        outerDiv.className = 'yfLeftMenu yfReportGISNav';
        div = document.createElement('div');
        div.className = 'yfReportGISNavInner';

        div.innerHTML = object.gisnavhtml || '';

        outerDiv.appendChild(div);
        robj.options.innerElement.appendChild(outerDiv);
        robj.options.gisnavElement = outerDiv;

    }

    if (robj.options.exportElement) {
        if (robj.options.exportElement.parentNode) {
            robj.options.exportElement.parentNode.removeChild(robj.options.exportElement);
        }
        robj.options.exportElement = null;
    }
    if (robj.options.showExport) {

        var outerDiv = document.createElement('div');
        outerDiv.className = 'yfTopMenu yfReportExport';

        var tbl = document.createElement('table');
        tbl.className = 'yfReportExportInner';
        tbl.cellPadding = 0;
        tbl.cellSpacing = 0;
        tbl.width = '100%';
        var tbody = document.createElement('tbody');
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.className = 'yfReportExportCell';
        td.width = '99%';
        td.innerHTML = object.exporthtml || '';
        tr.appendChild(td);
        td = document.createElement('td');
        td.align = 'right';
        var a = document.createElement('a');
        a.href = 'javascript:yellowfin.reports.toggleExport(' + robj.options.reportId + ');';
        var img = document.createElement('img');
        img.src = yellowfin.baseURL + '?cmd=img&fn=js_close.png';
        img.border = 0;
        img.align = 'absmiddle';
        img.title = 'Close';
        a.appendChild(img);
        td.appendChild(a);
        tr.appendChild(td);
        tbody.appendChild(tr);
        tbl.appendChild(tbody);

        outerDiv.appendChild(tbl);
        robj.options.innerElement.appendChild(outerDiv);
        robj.options.exportElement = outerDiv;

    }

    var div = document.createElement('div');
    div.innerHTML = object.html;
    robj.options.innerElement.appendChild(div);

    if(object.jsChartCSS) {
        var element = document.createElement('style');
        element.setAttribute('type', 'text/css');
        if ('textContent' in element) {
            element.textContent = object.jsChartCSS;
        } else {
            element.styleSheet.cssText = object.jsChartCSS;
        }
        document.getElementsByTagName('head')[0].appendChild(element);
    }

    if(object.js) {
        eval(object.js);
    }

    while (robj.options.footerElement.firstChild)
        robj.options.footerElement.removeChild(robj.options.footerElement.firstChild);

    var tbl = document.createElement('table');
    tbl.width = '100%';
    tbl.border = 0;
    tbl.cellPadding = 0;
    tbl.cellSpacing = 0;
    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.width = 4;
    var img = document.createElement('img');
    img.src = yellowfin.baseURL + '?cmd=img&fn=js_bottom_left.png';
    img.style.display = 'block';
    td.appendChild(img);
    tr.appendChild(td);
    td = document.createElement('td');
    td.style.background = 'url(' + yellowfin.baseURL + '?cmd=img&fn=js_bottom.png)';
    td.width = '99%';
    td.appendChild(document.createTextNode(' '));
    tr.appendChild(td);
    td = document.createElement('td');
    td.width = 4;
    var img = document.createElement('img');
    img.src = yellowfin.baseURL + '?cmd=img&fn=js_bottom_right.png';
    img.style.display = 'block';
    td.appendChild(img);
    tr.appendChild(td);
    tbody.appendChild(tr);
    tbl.appendChild(tbody);
    robj.options.footerElement.appendChild(tbl);

    robj.options.menus = null;
    if (robj.sectionsDisplayed) {
        this.toggleMenu(robj.options.reportId, 'section', true);
    } else if (robj.seriesDisplayed) {
        this.toggleMenu(robj.options.reportId, 'series', true);
    } else if (robj.pageLinksDisplayed) {
        this.toggleMenu(robj.options.reportId, 'pagelink', true);
    } else if (robj.gisNavDisplayed) {
        this.toggleMenu(robj.options.reportId, 'gisnav', true);
    }

// initialise date slider
robj.options.slider = object.slider;
if (object.slider) {
    if (yellowfin.DateSlider) {
        this.setupDateSlider(robj.options.reportId);
    } else {
        yellowfin.loadScript('DateSlider', 'yellowfin.reports.setupDateSlider', robj.options.reportId);
    }
}

// intialise google map
robj.options.gmapData = object.gmapData;
if (object.gmapData) {
    this.setupGMap(robj.options.reportId);
}

// initialise multi drill links
var clickHandler = function(e) { yellowfin.reports.handleMultiLink(robj.options.reportId, e, this); };
var arr = div.querySelectorAll('a.rlink');
var links;
if (arr) {
    for (var i = 0; i < arr.length; i++) {
        links = JSON.parse(arr[i].getAttribute('links'));
        if (links.length > 1) {
            arr[i].addEventListener('click', clickHandler);
        }
    }
}
arr = div.querySelectorAll('area.rlink');
if (arr) {
    for (var i = 0; i < arr.length; i++) {
        links = JSON.parse(arr[i].getAttribute('links'));
        if (links.length > 1) {
            arr[i].addEventListener('click', clickHandler);
        }
    }
}

// get the browser to update whether to display sliders or
// not by switching the overflow to hidden then back to auto,
// but only back to auto once the report is in the DOM.
robj.options.innerElement.style.overflow = 'hidden';
setTimeout(function(){
    robj.options.innerElement.style.overflow = 'auto';
}, 0);

this.loadNextReport();

},

"setupDateSlider": function(reportId) {
    yellowfin.trace('yellowfin.reports.setupDateSlider()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

    if (!options.slider) return;

    var dsWindow = options.element.querySelector('div.dateSliderWindow');
    if (!dsWindow) return;

    var map = null;
    var dsImg = options.element.querySelector('img.dateSliderPreview');
    if (dsImg) {
        var mapname = dsImg.getAttribute('usemap');
        if (mapname != null && mapname.indexOf('#') == 0) {
            mapname = mapname.substring(1);
            map = options.element.querySelector('map[name=' + mapname + ']');
        }
    }

    yellowfin.DateSlider.setupSlider(
dsWindow, // yellowfin.getObj('resizeDiv' + reportId), // div.dateSliderWindow
dsWindow.querySelector('tr.dateSliderTop td.dateSliderMid'), // yellowfin.getObj('resizeTop' + reportId), // div.dateSliderWindow tr.dateSliderTop td.dateSliderMid
dsWindow.querySelector('tr.dateSliderMid1 td.dateSliderMid'), // yellowfin.getObj('resizeMid1' + reportId), // div.dateSliderWindow tr.dateSliderMid1 td.dateSliderMid
dsWindow.querySelector('tr.dateSliderMid2 td.dateSliderMid'), // yellowfin.getObj('resizeMid2' + reportId), // div.dateSliderWindow tr.dateSliderMid2 td.dateSliderMid
dsWindow.querySelector('tr.dateSliderMid3 td.dateSliderMid'), // yellowfin.getObj('resizeMid3' + reportId), // div.dateSliderWindow tr.dateSliderMid3 td.dateSliderMid
dsWindow.querySelector('tr.dateSliderMove td.dateSliderMid'), // yellowfin.getObj('resizeBottom' + reportId), // div.dateSliderWindow tr.dateSliderMove td.dateSliderMid
dsWindow.querySelector('img.dateSliderRightHandle'), // yellowfin.getObj('rightHandle' + reportId), // div.dateSliderWindow img.dateSliderRightHandle
dsWindow.querySelector('img.dateSliderLeftHandle'), // yellowfin.getObj('leftHandle' + reportId), // div.dateSliderWindow img.dateSliderLeftHandle
options.slider.lowIndex,
options.slider.highIndex,
options.slider.lowIndexSet,
options.slider.highIndexSet,
options.slider.dateValues,
reportId,
options.slider.sideWidths,
options.slider.dateFormat);
yellowfin.DateSlider.addSlider(reportId, dsWindow.querySelector('table.dateSliderTbl') /*yellowfin.getObj('sliderBg' + reportId)*/, map); // div.dateSliderWindow table.dateSliderTbl
//yellowfin.DateSlider.reposSlider(reportId);

},

"setupGMap": function(reportId) {
    yellowfin.trace('yellowfin.reports.setupGMap()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

    if (!options.gmapData) return;

    if (!window.google) return;

    if (!yellowfin.GMap) {
        yellowfin.loadScript('GMap', 'yellowfin.reports.setupGMap', reportId);
        return;
    }

    yellowfin.GMap.setupMap(reportId, options.gmapData);

},

"setupFilters": function(reportId) {
    yellowfin.trace('yellowfin.reports.setupFilters()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

    var filters = options.filters;
    if (!filters) return;

    for (var i = 0; i < filters.length; i++) {
        if (filters[i].display == 'DIAL' && !yellowfin.DialWidget) {
            yellowfin.loadScript('DialWidget', 'yellowfin.reports.setupFilters', reportId);
            return;
        } else if (filters[i].display == 'NUMERIC_SLIDER') {
            if (!yellowfin.SliderWidget) {
                yellowfin.loadScript('SliderWidget', 'yellowfin.reports.setupFilters', reportId);
                return;
            }
            if (!yellowfin.NumericFormatter) {
                yellowfin.loadScript('NumericFormatter', 'yellowfin.reports.setupFilters', reportId);
                return;
            }
        }
    }

    if (!yellowfin.ElementInfo) {
        yellowfin.loadScript('ElementInfo', 'yellowfin.reports.setupFilters', reportId);
        return;
    }

    this.setupFiltersNow(reportId);

},

"setupFiltersNow": function(reportId) {
    yellowfin.trace('yellowfin.reports.setupFiltersNow()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

    var filters = options.filters;
    if (!filters) return;

    var frm = options.filterFormElement;

    var obj, key;
    for (var i = 0; i < filters.length; i++) {

        if (!filters[i].displayed) continue;

        if (filters[i].display == 'DATE') {

            if (filters[i].list) {
                for (var j = 0; ; j++) {
                    obj = yellowfin.getObj('yfFilter' + filters[i].filterId + '-' + j + '-d');
                    if (!obj) break;

                    yellowfin.ElementInfo.addElementInfo(obj, 'dd');
                    yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId + '-' + j + '-m'), 'mm');
                    yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId + '-' + j + '-y'), 'yyyy');
                }

            } else {

                yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId + '-d'), 'dd');
                yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId + '-m'), 'mm');
                yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId + '-y'), 'yyyy');

                if (filters[i].between) {
                    yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId + 'b-d'), 'dd');
                    yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId + 'b-m'), 'mm');
                    yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId + 'b-y'), 'yyyy');
                }

            }

        } else if (filters[i].display == 'TIMESTAMP') {

            if (filters[i].list) {

                for (var j = 0; ; j++) {
                    obj = yellowfin.getObj('yfFilter' + filters[i].filterId + '-' + j);
                    if (!obj) break;
                    yellowfin.ElementInfo.addElementInfo(obj, 'yyyy-mm-dd hh:mm:ss');
                }

            } else {

                yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId), 'yyyy-mm-dd hh:mm:ss');
                if (filters[i].between) {
                    yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId + 'b'), 'yyyy-mm-dd hh:mm:ss');
                }

            }

        } else if (filters[i].display == 'DIAL') {

            yellowfin.DialWidget.setupDial(frm, 'yfFilter' + filters[i].filterId);

        } else if (filters[i].display == 'NUMERIC_SLIDER') {

            key = 'yfFilter' + filters[i].filterId;

            var fparms = {};
            var fkeys = ['DECIMALPLACES', 'THOUSANDSEPARATOR', 'PREFIX', 'SUFFIX'];
            for (var j = 0; j < fkeys.length; j++) {
                if (frm.elements[key + '|fmt|' + fkeys[j]])
                    fparms[fkeys[j]] = frm.elements[key + '|fmt|' + fkeys[j]].value;
            }
            var fmt = yellowfin.NumericFormatter.createFormatter(fparms);

            yellowfin.SliderWidget.setupSlider(frm, key, key, fmt);
            if (yellowfin.getObj(key + 'b|sliderDiv')) {
                yellowfin.SliderWidget.setupSlider(frm, key, key + 'b', fmt);
                yellowfin.SliderWidget.sliders[key].maxSlider = yellowfin.SliderWidget.sliders[key + 'b'];
                yellowfin.SliderWidget.sliders[key + 'b'].minSlider = yellowfin.SliderWidget.sliders[key];
            }

        } else if (filters[i].display == 'PREDEF_DATE_DROPDOWN') {

            yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId + '-d'), 'dd');
            yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId + '-m'), 'mm');
            yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId + '-y'), 'yyyy');

            if (filters[i].between) {
                yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId + 'b-d'), 'dd');
                yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId + 'b-m'), 'mm');
                yellowfin.ElementInfo.addElementInfo(yellowfin.getObj('yfFilter' + filters[i].filterId + 'b-y'), 'yyyy');
            }

        }

    }

},

"reportLoadError": function(object) {
    yellowfin.trace('yellowfin.reports.reportLoadError()');

    if (object.errorCodeStr == 'NO_ACCESS') {
        yellowfin.reports.showLogonFormWithErrors(object, object.errorDescription);
        return;
    }

    if (object.reqId) {
        var robj = this.requests['r' + object.reqId];
        if (robj && robj.options && robj.options.outerContainer && robj.loadingDiv) {
            robj.options.outerContainer.removeChild(robj.loadingDiv);
        }
        this.requests['r' + object.reqId] = null;
    }

    alert('Error loading report: ' + object.errorDescription);
    this.loadNextReport();

},

"initMenus": function(reportId) {
    yellowfin.trace('yellowfin.reports.initMenus()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

    var menus = {};

    var topMenus = [ 'info', 'export', 'share', 'section', 'pagelink', 'series', 'timesel' ];
    var leftMenus = [ 'filter', 'leftSeries', 'gisnav' ];

    var div, menu;
    for (var i = 0; i < topMenus.length; i++) {

        div = options[topMenus[i] + 'Element'];
        if (!div) continue;

        menu = {};
        menu.div = div;
        menu.key = topMenus[i];
        menu.top = true;
        menu.img = options[menu.key + 'BtnImg'];
        menu.open = false;
        if (menu.key == 'pagelink') {
            menu.imgsrc = yellowfin.baseURL + '?cmd=img&fn=js_next.png';
            menu.imgoversrc = yellowfin.baseURL + '?cmd=img&fn=js_next_on.png';
        } else if (menu.key == 'timesel') {
            menu.imgsrc = yellowfin.baseURL + '?cmd=img&fn=js_aggregation.png';
            menu.imgoversrc = yellowfin.baseURL + '?cmd=img&fn=js_aggregation_on.png';
        } else {
            menu.imgsrc = yellowfin.baseURL + '?cmd=img&fn=js_' + menu.key + '.png';
            menu.imgoversrc = yellowfin.baseURL + '?cmd=img&fn=js_' + menu.key + '_on.png';
        }

// make sure none of the menus are going to show if they have little content.
var styleTopHeight = div.offsetHeight;
if(styleTopHeight < 26){
    styleTopHeight = 26;
}

div.style.top = (-10 - styleTopHeight) + 'px';
div.style.visibility = 'visible';

menus[menu.key] = menu;

}

for (var i = 0; i < leftMenus.length; i++) {
    div = options[leftMenus[i] + 'Element'];
    if (!div) continue;

    menu = {};
    menu.div = div;
    menu.key = leftMenus[i];
    menu.top = false;
    menu.img = options[menu.key + 'BtnImg'];
    menu.open = false;
    if (menu.key == 'leftSeries') {
        menu.imgsrc = yellowfin.baseURL + '?cmd=img&fn=js_series.png';
        menu.imgoversrc = yellowfin.baseURL + '?cmd=img&fn=js_series_on.png';
    } else if (menu.key == 'gisnav') {
        menu.imgsrc = yellowfin.baseURL + '?cmd=img&fn=js_gis.png';
        menu.imgoversrc = yellowfin.baseURL + '?cmd=img&fn=js_gis_on.png';
    } else {
        menu.imgsrc = yellowfin.baseURL + '?cmd=img&fn=js_' + menu.key + '.png';
        menu.imgoversrc = yellowfin.baseURL + '?cmd=img&fn=js_' + menu.key + '_on.png';
    }

    div.style.left = (-15 - div.offsetWidth) + 'px';
    div.style.visibility = 'visible';

    menus[menu.key] = menu;

}

options.menus = menus;

},

"toggleMenu": function(reportId, menuKey, notransition) {
    yellowfin.trace('yellowfin.reports.toggleMenu()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

// get the menu
if (!options.menus) {
    this.initMenus(reportId);
}
var menu = options.menus[menuKey];
if (!menu) return;


// XXX put this into initMenus() ?
if ((menuKey == 'series' || menuKey == 'leftSeries') && !options.seriesInitialised) {

// intialise series selection
if (options.seriesType == 'TOPPANEL' || options.seriesType == 'LEFTPANEL') {
    this.showSelectPanelScrolls(reportId, true, options.seriesType == 'TOPPANEL');
}
options.seriesInitialised = true;

}

// close any other menus
for (var k in options.menus) {

    if (k != menuKey) {
        this.closeMenu(reportId, k);
    }

}

if (menu.open) {
// just close this menu
this.closeMenu(reportId, menuKey);
} else {

// open this menu
if (notransition) {
    menu.div.style.transition = '';
    menu.div.style.MozTransition = '';
    menu.div.style.OTransition = '';
    menu.div.style.WebkitTransition = '';
} else {

    if (menu.top) {
        t = 'top 0.3s ease-in-out';
    } else {
        t = 'left 0.3s ease-in-out';
    }
    menu.div.style.transition = t;
    menu.div.style.MozTransition = t;
    menu.div.style.OTransition = t;
    menu.div.style.WebkitTransition = t;

}

// open the div
if (menu.top) {
    menu.div.style.top = '0px';
} else {
    menu.div.style.left = '0px';
}

// change the image
if (menu.img) menu.img.src = menu.imgoversrc;
menu.open = true;

if (options.innerElement) {
    options.innerElement.scrollLeft = 0;
    options.innerElement.scrollTop = 0;
}

}

},

"closeMenu": function(reportId, menuKey) {
    yellowfin.trace('yellowfin.reports.closeMenu()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

// get the menu
if (!options.menus) {
    this.initMenus(reportId);
}
var menu = options.menus[menuKey];
if (!menu) return;
if (!menu.open) return;

var t;
if (menu.top) {
    t = 'top 0.3s ease-in-out';
} else {
    t = 'left 0.3s ease-in-out';
}
menu.div.style.transition = t;
menu.div.style.MozTransition = t;
menu.div.style.OTransition = t;
menu.div.style.WebkitTransition = t;

// close the div
if (menu.top) {
    menu.div.style.top = (-10 - menu.div.offsetHeight) + 'px';
} else {
    menu.div.style.left = (-15 - menu.div.offsetWidth) + 'px';
}
if (menu.img) menu.img.src = menu.imgsrc;
menu.open = false;

},

"toggleReportInfo": function(reportId) {
    yellowfin.trace('yellowfin.reports.toggleReportInfo()');
    this.toggleMenu(reportId, 'info');
},

"toggleExport": function(reportId) {
    yellowfin.trace('yellowfin.reports.toggleExport()');
    this.toggleMenu(reportId, 'export');
},

"toggleTimesel": function(reportId) {
    yellowfin.trace('yellowfin.reports.toggleTimesel()');
    this.toggleMenu(reportId, 'timesel');
},

"toggleGISNav": function(reportId) {
    yellowfin.trace('yellowfin.reports.toggleGISNav()');
    this.toggleMenu(reportId, 'gisnav');
},

"closeReportTitle": function(reportId) {
    yellowfin.trace('yellowfin.reports.closeReportTitle()');

    var options = this.reportOptions['r' + reportId];
    if (options && options.titleElement) {
        options.titleElement.style.display = 'none';
    }
},

"runReportCmd": function(reportId, cmd) {
    yellowfin.trace('yellowfin.reports.runReportCmd()');

    if (!reportId || reportId == '') {
        alert('No reportId specified');
        return;
    }

    if (!cmd || cmd == '') {
        alert('No command specified');
        return;
    }

    var rptOptions = this.reportOptions['r' + reportId];

    if (rptOptions.dashUUID != null && cmd.indexOf('DRILLDOWN|') == 0) {
// use the dash api
yellowfin.dash.drillDownReport(rptOptions.dashUUID, reportId, cmd);
return;
}

var rid = this.nextRequestId++;
var robj = {
    "id": rid,
    "reportId": reportId,
    "cmd": cmd
};
this.requests['r' + rid] = robj;

var idx = cmd.indexOf('|');
var scmd = cmd;
if (idx >= 0)
    scmd = cmd.substring(0, idx);

if (scmd == 'TAB') {
// changing sections
if (rptOptions.menus['section'] && rptOptions.menus['section'].open) {
    robj.sectionsDisplayed = true;
}
} else if (scmd == 'PAGE') {
// changing page
// either multi-page sections, or paged rows
if (rptOptions.menus['section'] && rptOptions.menus['section'].open) {
    robj.sectionsDisplayed = true;
} else if (rptOptions.menus['pagelink'] && rptOptions.menus['pagelink'].open) {
    robj.pageLinksDisplayed = true;
}
} else if (scmd == 'MOVELEFT' || scmd == 'MOVERIGHT' || scmd == 'MOVEUP' || scmd == 'MOVEDOWN' || scmd == 'ZOOMIN' || scmd == 'ZOOMOUT') {
    if (rptOptions.menus['gisnav'] && rptOptions.menus['gisnav'].open) {
        robj.gisNavDisplayed = true;
    }
}

var div = this.createLoadingDiv('Running command...');
rptOptions.outerContainer.appendChild(div);
robj.loadingDiv = div;

robj.options = rptOptions;

var url = yellowfin.baseURL + '?api=reports&cmd=cmd&reportId=' + reportId + '&reqId=' + rid + '&reportCmd=' + encodeURIComponent(cmd) + '&u=' + Math.floor(Math.random() * 1000000000);
yellowfin.insertScript(url);

// close drillpop if it is open
if(yellowfin.reports.drillPopBox != null){
    yellowfin.reports.drillPopClose();
}
},

"reportCmdFinished": function(object) {
    yellowfin.trace('yellowfin.reports.reportCmdFinished()');

    var robj = this.requests['r' + object.reqId];
    if (!robj) {
        alert('Error: invalid request');
        return;
    }

    if (robj.options && robj.options.outerContainer && robj.loadingDiv) {
        robj.options.outerContainer.removeChild(robj.loadingDiv);
    }

    this.requests['r' + object.reqId] = null;

// now re-run the report
var options = {};
var oldOptions = this.reportOptions['r' + robj.reportId];
for (var k in oldOptions) {
    if (k == 'bookmarkUUID') continue;
    if (k == 'snapshotUUID') continue;
    options[k] = oldOptions[k];
}

options["reportId"] = object.displayReportId;
if (robj.sectionsDisplayed) {
    options["sectionsDisplayed"] = true;
} else {
    options["sectionsDisplayed"] = null;
}
if (robj.pageLinksDisplayed) {
    options["pageLinksDisplayed"] = true;
} else {
    options["pageLinksDisplayed"] = null;
}
if (robj.seriesDisplayed) {
    options["seriesDisplayed"] = true;
} else {
    options["seriesDisplayed"] = null;
}
if (robj.gisNavDisplayed) {
    options["gisNavDisplayed"] = true;
} else {
    options["gisNavDisplayed"] = null;
}
options["reload"] = false;
this.loadReport(options);

},

"reportCmdError": function(object) {
    yellowfin.trace('yellowfin.reports.reportCmdError()');

    if (object.reqId) {
        var robj = this.requests['r' + object.reqId];
        if (robj && robj.options && robj.options.outerContainer && robj.loadingDiv) {
            robj.options.outerContainer.removeChild(robj.loadingDiv);
        }
        this.requests['r' + object.reqId] = null;
    }
    alert('Error running report command: ' + object.errorDescription);
},

"toggleChart": function(reportId) {
    yellowfin.trace('yellowfin.reports.toggleChart()');

    var options = this.reportOptions['r' + reportId];
    if (!options) {
        alert('Report not loaded');
        return;
    }

    var newOptions = {};
    var disp = 'chart';
    for (var k in options) {
        newOptions[k] = options[k];
        if (k == 'display') disp = options[k].toLowerCase();
    }

    if (disp == 'table') {
        disp = 'both';
    } else {
        disp = 'table';
    }
    newOptions['display'] = disp;
    newOptions['reload'] = false;
    this.loadReport(newOptions);

},

"toggleTable": function(reportId) {
    yellowfin.trace('yellowfin.reports.toggleTable()');

    var options = this.reportOptions['r' + reportId];
    if (!options) {
        alert('Report not loaded');
        return;
    }

    var newOptions = {};
    var disp = 'chart';
    for (var k in options) {
        newOptions[k] = options[k];
        if (k == 'display') disp = options[k].toLowerCase();
    }

    if (disp == 'chart') {
        disp = 'both';
    } else {
        disp = 'chart';
    }
    newOptions['display'] = disp;
    newOptions['reload'] = false;
    this.loadReport(newOptions);

},

"toggleDisplay": function(reportId) {
    yellowfin.trace('yellowfin.reports.toggleDisplay()');

    var options = this.reportOptions['r' + reportId];
    if (!options) {
        alert('Report not loaded');
        return;
    }

    var newOptions = {};
    for (var k in options) {
        newOptions[k] = options[k];
    }

    if (options['display'] == 'table') {
        newOptions['display'] = 'chart';
    } else {
        newOptions['display'] = 'table';
    }
    newOptions['reload'] = false;
    this.loadReport(newOptions);

},

"toggleFilters": function(reportId) {
    yellowfin.trace('yellowfin.reports.toggleFilters()');
    this.toggleMenu(reportId, 'filter');
},

"closeFilters": function(reportId) {
    yellowfin.trace('yellowfin.reports.closeFilters()');
    this.closeMenu(reportId, 'filter');
},

"closeAllMenus": function(reportId) {
    yellowfin.trace('yellowfin.report.closeAllMenus()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

    if (!options.menus) {
        this.initMenus(reportId);
    }

    for (var k in options.menus) {
        this.closeMenu(reportId, k);
    }

},

"predefChange": function(input)
{
    var val = input.value;
    var customDiv = yellowfin.getObj(input.name + 'custom');
    if(val == "CUSTOM" || val == "CUSTOM_BETWEEN")
    {
        customDiv.style.display='block';
        customDiv.style.visibility='visible';
    }
    else
    {
        customDiv.style.display='none';
        customDiv.style.visibility='hidden';
    }
},

"setFilters": function(reportId, reloadReport, focusElName) {
    yellowfin.trace('yellowfin.reports.setFilters()');

    var options = this.reportOptions['r' + reportId];
    if (!options) {
        alert('Report not loaded');
        return;
    }

    if (!options.filterFormElement) {
        alert('Filter form element not found');
        return;
    }
    if (!options.filters || options.filters.length == 0) {
        alert('No filters found');
        return;
    }

    yellowfin.ElementInfo.removeAllElementInfo(options.filterFormElement);

    var rid = this.nextRequestId++;
    var robj = {
        "id": rid,
        "reportId": reportId,
        "cmd": 'setFilters',
        "reloadReport": reloadReport,
        "focusElName": focusElName
    };
    this.requests['r' + rid] = robj;

    var div = this.createLoadingDiv('Running command...');
    options.outerContainer.appendChild(div);
    robj.loadingDiv = div;

    robj.options = options;

    var url = yellowfin.baseURL + '?api=reports&cmd=setfilters&reportId=' + reportId + '&reqId=' + rid;

    var timefn = function(form, key) {

        var h = parseInt(form.elements[key + '-h'].value, 10);
        var m = parseInt(form.elements[key + '-m'].value, 10);
        var a = form.elements[key + '-ampm'].value;
        if (a == 'AM') {
            if (h == 12) h = 0;
        } else {
            if (h < 12) h += 12;
        }
        if (!isNaN(h) && !isNaN(m)) {
            return h + ':' + m + ':00';
        } else {
            return "";
        }

    };
    var datefn = function(form, key) {
        var y = form.elements[key + '-y'].value;
        var m = form.elements[key + '-m'].value;
        var d = form.elements[key + '-d'].value;
        return encodeURIComponent(y + '-' + m + '-' + d);
    };

    var form = options.filterFormElement;
    var fil, fid, fel, h, m, a, arr;
    for (var i = 0; i < options.filters.length; i++) {
        fil = options.filters[i];
        if (!fil.displayed) continue;

        fid = fil.filterId;
/*
if (form.elements['yfFilter' + fid + '-omit'] &&
form.elements['yfFilter' + fid + '-omit'].checked) {
url += '&yfFilter' + fid + '-omit=true';
continue;
}
*/

if (fil.display == 'CACHED_DROPDOWN' ||
    fil.display == 'ACCESS_FILTER_DROPDOWN' ||
    fil.display == 'ORGREFCODE_DROPDOWN' ||
    fil.display == 'PREDEF_DATE_DROPDOWN' ||
    fil.display == 'CACHED_QUERY_DROPDOWN') {

    if (fil.list) {

        fel = form.elements['yfFilter' + fid];
        arr = [];
        for (var j = 0; j < fel.options.length; j++) {
            if (fel.options[j].selected) {
//url += '&yfFilter' + fid + '=' + encodeURIComponent(fel.options[j].value);
arr.push(fel.options[j].value);
}
}
url += '&yfFilter' + fid + '=' + encodeURIComponent(this.serialiseList(arr));

} else {

    if (fil.between && fil.display != 'PREDEF_DATE_DROPDOWN') {
        arr = [];
        arr.push(form.elements['yfFilter' + fid].value);
        arr.push(form.elements['yfFilter' + fid + 'b'].value);
        url += '&yfFilter' + fid + '=' + encodeURIComponent(this.serialiseList(arr));
    } else {
        if(fil.display == 'PREDEF_DATE_DROPDOWN' && form.elements['yfFilter' + fid].value.indexOf('CUSTOM') == 0)
        {
            if(fil.nativeType == 'DATE')
            {
                if (fil.between) {
                    arr = [];
                    arr.push(datefn(form, 'yfFilter' + fid));
                    arr.push(datefn(form, 'yfFilter' + fid + 'b'));
                    url += '&yfFilter' + fid + '=' + encodeURIComponent(this.serialiseList(arr));
                } else {
                    url += '&yfFilter' + fid + '=' + datefn(form, 'yfFilter' + fid);
                }
            }
else  //timestamp
{
    if (fil.between) {
        arr = [];
        arr.push(form.elements['yfFilter' + fid + '-custom'].value);
        arr.push(form.elements['yfFilter' + fid + 'b-custom'].value);
        url += '&yfFilter' + fid + '=' + encodeURIComponent(this.serialiseList(arr));
    } else {
        url += '&yfFilter' + fid + '=' + encodeURIComponent(form.elements['yfFilter' + fid + '-custom'].value);
    }

}
}
else
    url += '&yfFilter' + fid + '=' + encodeURIComponent(form.elements['yfFilter' + fid].value);
}

}

} else if (fil.display == 'NUMERIC_RANGE') {

    url += '&yfFilter' + fid + '=' + encodeURIComponent(form.elements['yfFilter' + fid].value);

} else if (fil.display == 'DATE') {

    if (fil.list) {
        arr = [];
        for (var j = 0; ; j++) {
            if (!form.elements['yfFilter' + fid + '-' + j + '-d']) break;
//url += '&yfFilter' + fid + '=' + datefn(form, 'yfFilter' + fid + '-' + j);
arr.push(datefn(form, 'yfFilter' + fid + '-' + j));
}
url += '&yfFilter' + fid + '=' + encodeURIComponent(this.serialiseList(arr));
} else if (fil.between) {
    arr = [];
    arr.push(datefn(form, 'yfFilter' + fid));
    arr.push(datefn(form, 'yfFilter' + fid + 'b'));
    url += '&yfFilter' + fid + '=' + encodeURIComponent(this.serialiseList(arr));
} else {
    url += '&yfFilter' + fid + '=' + datefn(form, 'yfFilter' + fid);
}

} else if (fil.display == 'BOOLEAN') {

    fel = form.elements['yfFilter' + fid];
    for (var j = 0; j < fel.length; j++) {
        if (fel[j].checked) {
            url += '&yfFilter' + fid + '=' + encodeURIComponent(fel[j].value);
            break;
        }
    }

} else if (fil.display == 'TIME') {

    if (fil.list) {
        arr = [];
        for (var j = 0; ; j++) {
            if (!form.elements['yfFilter' + fid + '-' + j + '-h']) break;
//url += '&yfFilter' + fid + '=' + timefn(form, 'yfFilter' + fid + '-' + j);
arr.push(timefn(form, 'yfFilter' + fid + '-' + j));
}
url += '&yfFilter' + fid + '=' + encodeURIComponent(this.serialiseList(arr));

} else if (fil.between) {
    arr = [];
    arr.push(timefn(form, 'yfFilter' + fid));
    arr.push(timefn(form, 'yfFilter' + fid + 'b'));
    url += '&yfFilter' + fid + '=' + encodeURIComponent(this.serialiseList(arr));
} else {
    url += '&yfFilter' + fid + '=' + timefn(form, 'yfFilter' + fid);
}

} else if (fil.display == 'NUMERIC_SLIDER') {

    if (fil.between) {
        arr = [];
        arr.push(form.elements['yfFilter' + fid + '|value1'].value);
        arr.push(form.elements['yfFilter' + fid + '|value2'].value);
        url += '&yfFilter' + fid + '=' + encodeURIComponent(this.serialiseList(arr));
    } else {
        url += '&yfFilter' + fid + '=' + encodeURIComponent(form.elements['yfFilter' + fid + '|value1'].value);
    }

} else {

    if (fil.list) {
        arr = [];
        for (var j = 0; ; j++) {
            if (!form.elements['yfFilter' + fid + '-' + j]) break;
//url += '&yfFilter' + fid + '=' + encodeURIComponent(form.elements['yfFilter' + fid + '-' + j].value);
arr.push(form.elements['yfFilter' + fid + '-' + j].value);
}
url += '&yfFilter' + fid + '=' + encodeURIComponent(this.serialiseList(arr));

} else if (fil.between) {
    arr = [];
    arr.push(form.elements['yfFilter' + fid].value);
    if (!form.elements['yfFilter' + fid + 'b']) {
        alert(fil.description + ': ' + fil.display);
    }
    arr.push(form.elements['yfFilter' + fid + 'b'].value);
    url += '&yfFilter' + fid + '=' + encodeURIComponent(this.serialiseList(arr));
} else {
    url += '&yfFilter' + fid + '=' + encodeURIComponent(form.elements['yfFilter' + fid].value);
}

}

}

url += '&u=' + Math.floor(Math.random() * 1000000000);

yellowfin.insertScript(url);

},

"setFiltersFinished": function(object) {
    yellowfin.trace('yellowfin.reports.setFiltersFinished()');

    var robj = this.requests['r' + object.reqId];
    if (!robj) {
        alert('Error: invalid request');
        return;
    }

    if (robj.options && robj.options.outerContainer && robj.loadingDiv) {
        robj.options.outerContainer.removeChild(robj.loadingDiv);
    }

    this.requests['r' + object.reqId] = null;

    var fel = robj.options.filterContainer;
    if (fel) {
        while (fel.firstChild)
            fel.removeChild(fel.firstChild);
        fel.innerHTML = object.filterhtml;
    }

    robj.options.filters = object.filters;
    this.setupFilters(object.reportId);

    if (robj.focusElName) {
        var frm = robj.options.filterFormElement;
        var el = frm.elements[robj.focusElName];
        if (el && el.focus) {
            el.focus();
        }
    }

    if (robj.reloadReport) {

// now re-run the report
var options = {};
var oldOptions = this.reportOptions['r' + robj.reportId];
for (var k in oldOptions) {
    if (k == 'bookmarkUUID') continue;
    if (k == 'snapshotUUID') continue;
    options[k] = oldOptions[k];
}

options["reload"] = false;
this.loadReport(options);

}

},

"setFiltersError": function(object) {
    yellowfin.trace('yellowfin.reports.setFiltersError()');

    if (object.reqId) {
        var robj = this.requests['r' + object.reqId];
        if (robj && robj.options && robj.options.outerContainer && robj.loadingDiv) {
            robj.options.outerContainer.removeChild(robj.loadingDiv);
        }
        this.requests['r' + object.reqId] = null;
    }
    alert('Error setting report filters: ' + object.errorDescription);
},

"toggleSections": function(reportId) {
    yellowfin.trace('yellowfin.reports.toggleSections()');
    this.toggleMenu(reportId, 'section');
},

"togglePageLinks": function(reportId) {
    yellowfin.trace('yellowfin.reports.togglePageLinks()');
    this.toggleMenu(reportId, 'pagelink');
},

"toggleSeries": function(reportId) {
    yellowfin.trace('yellowfin.reports.toggleSeries()');
    this.toggleMenu(reportId, 'series');
},

"toggleShare": function(reportId) {
    yellowfin.trace('yellowfin.reports.toggleShare()');
    this.toggleMenu(reportId, 'share');
},

"toggleLeftSeries": function(reportId) {
    yellowfin.trace('yellowfin.reports.toggleLeftSeries()');
    this.toggleMenu(reportId, 'leftSeries');
},

"closeLeftSeries": function(reportId) {
    yellowfin.trace('yellowfin.reports.closeLeftSeries()');
    this.closeMenu(reportId, 'leftSeries');
},

"chooseSeries": function(reportId) {
    yellowfin.trace('yellowfin.reports.chooseSeries()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

    var arr = [];
    if (options.seriesFormElement) {
        for (var i = 0; i < options.seriesFormElement.elements.length; i++) {
            if (options.seriesFormElement.elements[i].checked) {
                arr.push(options.seriesFormElement.elements[i].value);
            }
        }
    }
    this.selectSeries(reportId, this.serialiseList(arr));

},

"showLogonForm": function(object) {
    yellowfin.trace('yellowfin.reports.showLogonForm()');

    var robj = this.requests['r' + object.reqId];
    if (robj) {
        this.requests['r' + object.reqId] = null;
    }

    var options = this.reportOptions['r' + object.reportId];
    if (!options && robj) {
        options = robj.options;
    }

    if (!options) {
        alert('Error: invalid request');
        this.loadNextReport();
        return;
    }

    if (options.outerContainer && robj && robj.loadingDiv) {
        robj.options.outerContainer.removeChild(robj.loadingDiv);
    }

    if (options.infoElement && options.infoElement.style.visibility == 'visible') {
        this.toggleReportInfo(options.reportId);
    }

    if (options.titleElement) {

        while (options.titleElement.firstChild)
            options.titleElement.removeChild(options.titleElement.firstChild);

        var tbl2 = document.createElement('table');
        tbl2.border = 0;
        tbl2.cellPadding = 0;
        tbl2.cellSpacing = 0;
        tbl2.width = '100%';
        var tbody2 = document.createElement('tbody');
        var tr2 = document.createElement('tr');
        var td2 = document.createElement('td');
        td2.width = 4;
        var img = document.createElement('img');
        img.src = yellowfin.baseURL + '?cmd=img&fn=js_top_left.png';
        img.border = 0;
        img.style.display = 'block';
        td2.appendChild(img);
        tr2.appendChild(td2);
        td2 = document.createElement('td');
        td2.setAttribute('width', '*');
        td2.style.background = 'url(' + yellowfin.baseURL + '?cmd=img&fn=js_top.png)';

        var innerDiv = document.createElement('div');
        innerDiv.className = 'yfReportTitleInner';

        var tbl = document.createElement('table');
        tbl.width = '100%';
        tbl.border = 0;
        tbl.cellSpacing = 0;
        tbl.cellPadding = 0;
        var tbody = document.createElement('tbody');
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.className = 'yfReportTitle';

        var div = document.createElement('div');
        div.className = 'yfReportTitle';
        div.appendChild(document.createTextNode('Login'));
        td.appendChild(div);
        tr.appendChild(td);
        tbody.appendChild(tr);
        tbl.appendChild(tbody);

        innerDiv.appendChild(tbl);
        td2.appendChild(innerDiv);
        tr2.appendChild(td2);
        td2 = document.createElement('td');
        td2.width = 4;
        var img = document.createElement('img');
        img.src = yellowfin.baseURL + '?cmd=img&fn=js_top_right.png';
        img.border = 0;
        img.style.display = 'block';
        td2.appendChild(img);
        tr2.appendChild(td2);
        tbody2.appendChild(tr2);
        tbl2.appendChild(tbody2);

        options.titleElement.appendChild(tbl2);

    }

    if (options.innerElement) {
        while (options.innerElement.firstChild)
            options.innerElement.removeChild(options.innerElement.firstChild);
        options.innerElement.style.display = 'none';
    }
    if (options.footerElement) {
        while (options.footerElement.firstChild)
            options.footerElement.removeChild(options.footerElement.firstChild);
    }

    options.logonUsernameEl.value = '';
    options.logonPasswordEl.value = '';
    options.logonElement.style.display = 'block';
    options.logonErrorsElement.style.display = 'none';

    this.loadNextReport();

},

"showLogonFormWithErrors": function(object, errors) {
    yellowfin.trace('yellowfin.reports.showLogonFormWithErrors()');

    var robj = this.requests['r' + object.reqId];
    var options = robj ? robj.options : null;

    this.showLogonForm(object);

    if (options && options.logonErrorsElement) {
        var html = '<div style=\"border: 1px solid #c0c0c0; background: #eeeeee; padding: 2px;\">' + errors + '</div>';
        options.logonErrorsElement.innerHTML = html;
        options.logonErrorsElement.style.display = 'block';
    }

},

"logon": function(reportId) {
    yellowfin.trace('yellowfin.reports.logon()');

    if (yellowfin.auth) {
        this.logonNow(reportId);
    } else {
        yellowfin.loadApi('auth', 'yellowfin.reports.logonNow', reportId);
        return;
    }

},

"logonNow": function(reportId) {
    yellowfin.trace('yellowfin.reports.logonNow()');
    var options = this.reportOptions['r' + reportId];
    if (!options) {
        alert('Error: invalid request');
        return;
    }

    var rid = this.nextRequestId++;
    var robj = {
        "id": rid,
        "options": options
    };
    this.requests['r' + rid] = robj;

    options.logonElement.style.display = 'none';

    div = this.createLoadingDiv('Logging in...');
    options.outerContainer.appendChild(div);
    robj.loadingDiv = div;

// auth api should be loaded
yellowfin.auth.logonUser(options.logonUsernameEl.value, options.logonPasswordEl.value, options.clientOrg, 'yellowfin.reports.logonCallback', rid);

},

"logonCallback": function(reqId, success, errors) {
    yellowfin.trace('yellowfin.reports.logonCallback()');

    var robj = this.requests['r' + reqId];
    if (!robj) {
        alert('Error: invalid request');
        return;
    }

    this.requests['r' + reqId] = null;

    var options = robj.options;
    if (robj.loadingDiv) {
        options.outerContainer.removeChild(robj.loadingDiv);
    }

    if (success) {

        if (options.innerElement) {
            options.innerElement.style.display = 'block';
        }
        this.loadReport(options);

// also reload any other reports
var opt;
for (var k in this.reportOptions) {
    opt = this.reportOptions[k];
    if (opt.reportId != options.reportId) {
        if (opt.logonElement) {
            opt.logonElement.style.display = 'none';
        }
        if (opt.innerElement) {
            opt.innerElement.style.display = 'block';
        }
        this.loadReport(opt);
    }
}

} else {

    options.logonErrorsElement.innerHTML = errors;
    options.logonErrorsElement.style.display = 'block';
    options.logonElement.style.display = 'block';

}

},

"logoff": function(reportId) {
    yellowfin.trace('yellowfin.reports.logoff()');

    if (yellowfin.auth) {
        this.logoffNow(reportId);
    } else {
        yellowfin.loadApi('auth', 'yellowfin.reports.logoffNow', reportId);
    }

},

"logoffNow": function(reportId) {
    yellowfin.trace('yellowfin.reports.logoffNow()');

    var options = this.reportOptions['r' + reportId];
    if (!options) {
        alert('Error: invalid request');
        return;
    }

    var rid = this.nextRequestId++;
    var robj = {
        "id": rid,
        "options": options
    };
    this.requests['r' + rid] = robj;

    var div = this.createLoadingDiv('Logging out...');
    options.outerContainer.appendChild(div);
    robj.loadingDiv = div;

// auth api should be loaded
yellowfin.auth.logoffUser('yellowfin.reports.logoffCallback', rid);

},

"logoffCallback": function(reqId) {
    yellowfin.trace('yellowfin.reports.logoffCallback()');

    var robj = this.requests['r' + reqId];
    if (!robj) {
        alert('Error: invalid request');
        return;
    }

    this.requests['r' + reqId] = null;

    var options = robj.options;
    if (robj.loadingDiv) {
        options.outerContainer.removeChild(robj.loadingDiv);
    }

    this.showLogonForm({"reportId": options.reportId});

// also logoff any other reports
var opt;
for (var k in this.reportOptions) {
    opt = this.reportOptions[k];
    if (opt.reportId != options.reportId) {
        this.showLogonForm({"reportId": opt.reportId});
    }
}

},

"exportReport": function(reportId, fmt) {
    yellowfin.trace('yellowfin.reports.exportReport()');

    var rid = this.nextRequestId++;
    var robj = {
        "id": rid,
        "reportId": reportId,
        "fmt": fmt
    };
    this.requests['r' + rid] = robj;

    var src = yellowfin.baseURL + '?api=reports&cmd=' + encodeURIComponent(fmt) + '&reportId=' + reportId + '&reqId=' + rid;
    src += '&u=' + Math.floor(Math.random() * 1000000000);
    console.log(src);
    yellowfin.insertScript(src);

},

"exportReady": function(reqId) {
    yellowfin.trace('yellowfin.reports.exportReady()');

    var robj = this.requests['r' + reqId];
    console.log(robj);
    if (!robj) {
        alert('Error: invalid request');
        return;
    }

    this.requests['r' + reqId] = null;
    console.log(yellowfin.baseURL + '?api=reports&cmd=download&fmt=' + encodeURIComponent(robj.fmt) + '&reportId=' + encodeURIComponent(robj.reportId));
    window.location.href = yellowfin.baseURL + '?api=reports&cmd=download&fmt=' + encodeURIComponent(robj.fmt) + '&reportId=' + encodeURIComponent(robj.reportId);

},

"exportFailed": function(object) {
    yellowfin.trace('yellowfin.reports.exportFailed()');

    if (object.reqId) {
        this.requests['r' + object.reqId] = null;
    }

    yellowfin.apiError(object);
},

"createLoadingDiv": function(text) {
    yellowfin.trace('yellowfin.reports.createLoadingDiv()');

    var div = document.createElement('div');
    div.className = 'yfReportLoading';
    div.style.background = '#c0c0c0';
    div.style.position = 'absolute';
    div.style.top = '0px';
    div.style.left = '0px';
    div.style.fontFamily = 'Arial, Helvetica, sans-serif';
    div.style.fontSize = '16px';
    div.style.padding = '1px';
    div.appendChild(document.createTextNode(text));
    return div;

},

"drillPopBox": null,


"drillPop" : function(event, title, linkArr) {
    yellowfin.trace('yellowfin.reports.drillPop()');

    var eo = new yellowfin.EventObj(event, this);

    if (yellowfin.reports.drillPopBox != null) {
        yellowfin.reports.drillPopClose();
    }

    var tbl = document.createElement('table');
    tbl.cellSpacing = '0';
    tbl.cellPadding = '0';
    tbl.width = '200';
    tbl.border = '0';
    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
    var td = document.createElement('td');
// top image
var img = document.createElement('img');

//top left corner
img.src = yellowfin.baseURL + '?cmd=img&fn=drillpop/drillpop_tl.png';
img.style.display = 'block';
img.height='21';
img.width = '6';
td.appendChild(img);
tr.appendChild(td);

//top
td = document.createElement('td');
img = document.createElement('img');
img.src = yellowfin.baseURL + '?cmd=img&fn=drillpop/drillpop_top.png';
img.style.display = 'block';
img.height='21';
img.width = '188';
td.innerHTML = "<span class='i4drillpoptitle' style='position:absolute; top:4px'>"+title+":</span>";
td.appendChild(img);

img = document.createElement('img');
img.src = yellowfin.baseURL + '?cmd=img&fn=drillpop/drillpop_close.png';
img.style.display = 'block';
img.style.cursor = 'pointer';
img.width = '9';
img.height = '9';
img.style.position = 'absolute';
img.style.left = '184px';
img.style.top = '6px';
td.appendChild(img);
yellowfin.eventOnObject(img, 'click', yellowfin.reports.drillPopClose);
tr.appendChild(td);

//top right corner
td = document.createElement('td');
img = document.createElement('img');
img.src = yellowfin.baseURL + '?cmd=img&fn=drillpop/drillpop_tr.png';
img.style.display = 'block';
img.height='21';
img.width = '6';
td.appendChild(img);
tr.appendChild(td);

tbody.appendChild(tr);

//left side
tr = document.createElement('tr');
td = document.createElement('td');
td.width = '6';
var src = yellowfin.baseURL + '?cmd=img&fn=drillpop/drillpop_left.png';
td.style.background = 'url(' + src + ') repeat-y';
tr.appendChild(td);

td = document.createElement('td');
td.width = '200';
td.style.background = '#ffffff';

// inner table
var tbl2 = document.createElement('table');
tbl2.cellSpacing = '1';
tbl2.cellPadding = '3';
tbl2.width = '100%';


var tbody2 = document.createElement('tbody');
var tr2 = document.createElement('tr');
var td2 = document.createElement('td');

for(i=0; i<linkArr.length; i++){
    tr2 = document.createElement('tr');
    td2 = document.createElement('td');
    td2.className = 'i4sidenavtext';
    td2.colSpan = 2;

    td2.innerHTML = linkArr[i];

    tr2.appendChild(td2);
    tbody2.appendChild(tr2);
}

tbl2.appendChild(tbody2);
td.appendChild(tbl2);

tr.appendChild(td);

//right side
td = document.createElement('td');
td.width = 6;

src = yellowfin.baseURL + '?cmd=img&fn=drillpop/drillpop_right.png';
td.style.background = 'url('+ src + ') repeat-y';
tr.appendChild(td);
tbody.appendChild(tr);
tr = document.createElement('tr');

//bottom right hand corner
td = document.createElement('td');
td.style.lineHeight = '0';
img = document.createElement('img');
img.src = yellowfin.baseURL + '?cmd=img&fn=drillpop/drillpop_bl.png';
img.height = '6';
img.width = '6';
td.appendChild(img);
tr.appendChild(td);

//bottom
td = document.createElement('td');
td.style.lineHeight = '0';
img = document.createElement('img');
img.src = yellowfin.baseURL + '?cmd=img&fn=drillpop/drillpop_bot.png';
img.height = '6';
img.width = '188';
td.appendChild(img);
tr.appendChild(td);

//bottom
td = document.createElement('td');
td.style.lineHeight = '0';
img = document.createElement('img');
img.src = yellowfin.baseURL + '?cmd=img&fn=drillpop/drillpop_br.png';
img.height = '6';
img.width = '6';
td.appendChild(img);
tr.appendChild(td);

tbody.appendChild(tr);

tr = document.createElement('tr');
td = document.createElement('td');
td.colspan = 3;
img = document.createElement('img');
img.src = yellowfin.baseURL + '?cmd=img&fn=drillpop/drillpop_arrow.png';
img.height = '7';
img.width = '14';
img.style.position = 'absolute';
img.style.left = 30 + 'px';
td.appendChild(img);
tr.appendChild(td);

tbody.appendChild(tr);

tbl.appendChild(tbody);

var div = document.createElement('div');
div.appendChild(tbl);
div.style.position = 'absolute';
div.style.boxShadow = '1px 3px 10px 2px rgba(005, 005, 005, 0.2)';

var leftPosition = eo.pageX-38;
// Left position becomes 1 when it is negative
if(leftPosition < 0){
    leftPosition = 1;
}

div.style.left = leftPosition + 'px';

div.style.zIndex = 301;
div.style.cursor = 'default';
div.style.display = 'inline';


document.body.appendChild(div);
drillPopBox = div;

var heightDiv = drillPopBox.offsetHeight;
var modifier = heightDiv + 7 + 5;
var topPosition = eo.pageY - modifier;
// Top position becomes 1 when it is negative
if(topPosition < 0){
    topPosition = 1;
}

div.style.top = topPosition + 'px';
yellowfin.reports.drillPopBox = div;


var body = document.getElementsByTagName("body");
yellowfin.eventOnObject(body[0], 'click', yellowfin.reports.drillPopCloseClick);

},

"drillPopClose" : function() {
    yellowfin.trace('yellowfin.reports.drillPopClose()');

    document.body.removeChild(yellowfin.reports.drillPopBox);
    yellowfin.reports.drillPopBox = null;
},

"drillPopCloseClick" : function(event) {
    yellowfin.trace('yellowfin.reports.drillPopCloseClick()');

    var eo = new yellowfin.EventObj(event, this);

    if (yellowfin.reports.drillPopBox != null) {
        if (eo.pageX < yellowfin.reports.drillPopBox.offsetLeft || eo.pageX > (yellowfin.reports.drillPopBox.offsetLeft + yellowfin.reports.drillPopBox.offsetWidth)
|| eo.pageY < yellowfin.reports.drillPopBox.offsetTop || eo.pageY > (yellowfin.reports.drillPopBox.offsetTop + yellowfin.reports.drillPopBox.offsetHeight + 20)) { // offset of +20 to make up for the box floating above the link
            yellowfin.reports.drillPopClose();
    }
}
},

"serialiseList": function(list) {
    yellowfin.trace('yellowfin.reports.serialiseList()');

    var txt = '';
    var str;
    for (var i = 0; i < list.length; i++) {
        str = list[i];
// escape any slashes
str = str.replace(/\\/g, '\\\\');
// escape any pipes
str = str.replace(/\|/g, '\\|');

if (i > 0) txt += '|';
txt += str;
}
return txt;

},

"loadReportFilters": function(reportId, callback, arg) {
    yellowfin.trace('yellowfin.reports.loadReportFilters()');

    var options = this.reportOptions['r' + reportId];
    if (options != null && options.filters != null) {
        callback(options.filters, arg);
        return;
    }

    /* reportId might be a UUID */
    for (var k in this.reportOptions) {
        if (reportId == this.reportOptions[k].reportUUID) {
            if (this.reportOptions[k].filters != null) {
                callback(this.reportOptions[k].filters, arg);
                return;
            }
        }
    }

    var rid = this.nextRequestId++;
    var robj = {
        "id": rid,
        "reportId": reportId,
        "callback": callback,
        "arg": arg
    };
    this.requests['r' + rid] = robj;

    var src = yellowfin.baseURL + '?api=reports&cmd=loadreportfilters&reqId=' + rid + '&reportId=' + encodeURIComponent(reportId);
    src += '&u=' + Math.floor(Math.random() * 1000000000);

    yellowfin.insertScript(src);

},


"reportFiltersLoaded": function(reqId, filters) {
    yellowfin.trace('yellowfin.reports.reportFiltersLoaded()');

    var robj = this.requests['r' + reqId];
    if (!robj) return;

    this.requests['r' + reqId] = null;

    robj.callback(filters, robj.arg);

},

"filterSelectAll": function(reportId, filterId, sel) {
    yellowfin.trace('yellowfin.reports.filterSelectAll()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

    /* FilterId might be a UUID */
    for (var i = 0; i < options.filters.length; i++) {
        if (filterId == options.filters[i].filterUUID) {
            filterId = options.filters[i].filterId;
            break;
        }
    }

    var frm = options.filterFormElement;
    if (!frm) return;

    var elName = 'yfFilter' + filterId;

    var el = frm.elements[elName];
    if (!el) return;

    if (el.type == 'select-one' || el.type == 'select-multiple') {

        for (var i = 0; i < el.options.length; i++) {
            el.options[i].selected = sel;
        }

        el.focus();

    } else {

// checkboxes
if (el.length) {
    for (var i = 0; i < el.length; i++) {
        el[i].checked = sel;
    }
} else {
    el.checked = sel;
}

}

var filter = null;
for (var i = 0; i < options.filters.length; i++) {
    if (options.filters[i].filterId == filterId) {
        filter = options.filters[i];
        break;
    }
}
if (filter && filter.dependencies) {
// refresh filters
this.setFilters(reportId, false, elName);
}


},

"filterChanged": function(reportId, filterId) {
    yellowfin.trace('yellowfin.reports.filterChanged()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

    var filter = null;
    for (var i = 0; i < options.filters.length; i++) {
        if (options.filters[i].filterId == filterId) {
            filter = options.filters[i];
            break;
        }
    }
    if (filter && filter.dependencies) {
// refresh filters
this.setFilters(reportId, false, 'yfFilter' + filterId);
}

},

"setDateSlider": function(reportId, startX, endX) {
    yellowfin.trace('yellowfin.reports.setDateSlider()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

    var rid = this.nextRequestId++;
    var robj = {
        "id": rid,
        "reportId": reportId,
        "options": options
    };
    this.requests['r' + rid] = robj;

    var div = this.createLoadingDiv('Running command...');
    options.outerContainer.appendChild(div);
    robj.loadingDiv = div;

    var src = yellowfin.baseURL + '?api=reports&cmd=setdateslider&reqId=' + rid;
    src += '&reportId=' + reportId;
    src += '&start=' + startX;
    src += '&end=' + endX;
    src += '&u=' + Math.floor(Math.random() * 1000000000);

    yellowfin.insertScript(src);

},

"scrollSelectPanelLR": function(reportId, amount) {
    yellowfin.trace('yellowfin.reports.scrollSelectPanelLR()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

    var sPan = yellowfin.getObj('yfpanelSeriesSel' + reportId + '-' + options.seriesChartKey);
    var sRight = yellowfin.getObj('yfpsScrollR' + reportId + "-" + options.seriesChartKey);
    var sLeft = yellowfin.getObj('yfpsScrollL' + reportId + "-" + options.seriesChartKey);

    sPan.scrollLeft += amount;

    sLeft.style.left = sPan.scrollLeft + 'px';
    sRight.style.left = (sPan.scrollLeft + sPan.offsetWidth - sRight.offsetWidth) + 'px';

    this.showSelectPanelScrolls(reportId, false, true);
},

"scrollSelectPanelUD": function(reportId, amount) {
    yellowfin.trace('yellowfin.reports.scrollSelectPanelUD()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

    var sPan = yellowfin.getObj('yfpanelSeriesSel' + reportId + '-' + options.seriesChartKey);
    var sUp = yellowfin.getObj('yfpsScrollU' + reportId + "-" + options.seriesChartKey);
    var sDown = yellowfin.getObj('yfpsScrollD' + reportId + "-" + options.seriesChartKey);

    sPan.scrollTop += amount;

    sUp.style.top = sPan.scrollTop + 'px';
    sDown.style.top = (sPan.scrollTop + sPan.offsetHeight - sDown.offsetHeight) + 'px';

    this.showSelectPanelScrolls(reportId, false, false);
},

"showSelectPanelScrolls": function(reportId, start, horizontal) {
    yellowfin.trace('yellowfin.reports.showSelectPanelScrolls()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

    var panel = yellowfin.getObj('yfpanelSeriesSel' + reportId + '-' + options.seriesChartKey);
    var ssImg = yellowfin.getObj('yfpanelSeriesSel' + reportId + '-' + options.seriesChartKey + 'Img');

    if (panel == null) {
        return;
    }

    if (horizontal) {
        var sRight = yellowfin.getObj('yfpsScrollR' + reportId + '-' + options.seriesChartKey);
        var sLeft = yellowfin.getObj('yfpsScrollL' + reportId + '-' + options.seriesChartKey);

        if (start) {
            panel.scrollLeft = options.seriesInitialScroll;

            sLeft.style.left = panel.scrollLeft + 'px';
            sRight.style.left = (panel.scrollLeft + panel.offsetWidth - sRight.offsetWidth) + 'px'
        }

        if (ssImg.offsetWidth - panel.scrollLeft > panel.offsetWidth) {
            sRight.style.visibility = 'visible';
        } else {
            sRight.style.visibility = 'hidden';
        }

        if (panel.scrollLeft > 0) {
            sLeft.style.visibility = 'visible';
        } else {
            sLeft.style.visibility = 'hidden';
        }
    } else {
        var sDown = yellowfin.getObj('yfpsScrollD' + reportId + '-' + options.seriesChartKey);
        var sUp = yellowfin.getObj('yfpsScrollU' + reportId + '-' + options.seriesChartKey);

        if (start) {
            panel.scrollTop = options.seriesInitialScroll;

            sUp.style.top = panel.scrollTop + 'px';
            sDown.style.top = (panel.scrollTop + panel.offsetHeight - sDown.offsetHeight) + 'px';
        }

        if (ssImg.offsetHeight - panel.scrollTop > panel.offsetHeight) {
            sDown.style.visibility = 'visible';
        } else {
            sDown.style.visibility = 'hidden';
        }

        if (panel.scrollTop > 0) {
            sUp.style.visibility = 'visible';
        } else {
            sUp.style.visibility = 'hidden';
        }
    }

},

"selectSeries": function(reportId, series) {
    yellowfin.trace('yellowfin.reports.selectSeries()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

    var rid = this.nextRequestId++;
    var robj = {
        "id": rid,
        "reportId": reportId
    };
    this.requests['r' + rid] = robj;

    var src = yellowfin.baseURL + '?api=reports&cmd=selectseries&reqId=' + rid + '&reportId=' + encodeURIComponent(reportId);
    src += '&series=' + series;
    src += '&u=' + Math.floor(Math.random() * 1000000000);

    yellowfin.insertScript(src);
},

"seriesSelFinished": function(object) {
    yellowfin.trace('yellowfin.reports.seriesSelFinished()');

    var robj = this.requests['r' + object.reqId];
    if (!robj) {
        alert('Error: invalid request');
        return;
    }

    this.requests['r' + object.reqId] = null;

// now re-run the reports
var options;
for (var i = 0; i < object.reportIds.length; i++) {
    options = this.reportOptions['r' + object.reportIds[i]];
    if (!options) continue;
    options.reload = false;
    this.loadReport(options);
}

},

"switchGran": function(reportId, str) {
    yellowfin.trace('yellowfin.reports.switchGran()');

    var options = this.reportOptions['r' + reportId];
    if (!options) return;

    var rid = this.nextRequestId++;
    var robj = {
        "id": rid,
        "reportId": reportId,
        "options": options
    };
    this.requests['r' + rid] = robj;

    var src = yellowfin.baseURL + '?api=reports&cmd=switchgran&reqId=' + rid + '&reportId=' + encodeURIComponent(reportId);
    src += '&gran=' + str;
    src += '&u=' + Math.floor(Math.random() * 1000000000);

    yellowfin.insertScript(src);

},

"handleMultiLink": function(reportId, event, a) {
    yellowfin.trace('yellowfin.reports.handleMultiLink()');

    var arr = JSON.parse(a.getAttribute('links'));
    var links = [];
    var url;
    for (var i = 0; i < arr.length; i++) {
        url = 'javascript:yellowfin.reports.runReportCmd(' + reportId + ', \'DRILLJSON|' + reportId + '|' + arr[i].data + '\');';
        links.push('<a href="' + url + '">' + yellowfin.escapeHtml(arr[i].name) + '</a>');
    }
    yellowfin.reports.drillPop(event, 'Select Drill To Content', links);
}

};

if(typeof jQuery == 'undefined') {
    var src = yellowfin.jqueryPath;
    yellowfin.insertScript(src);
}

if(typeof require == 'undefined') {
    var src = yellowfin.requirePath;
    yellowfin.insertScript(src);
}
