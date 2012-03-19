/// <reference path="../lib/session.js"/>
/// <reference path="../lib/AjaxRequest.js"/>

/**
 * @author Alex Tharp
 * @version 1.0
 *
 * Just a bunch of global tools. These should be part of a Tools class, which I will be adding later.
 */

var kDebug, kEmptyString, kColor_Info, kColor_Success, kColor_Failure, kColor_Warning, kCMIBooleanFalse, kCMIBooleanTrue, kErrorStringArray;

kDebug = true;
kEmptyString = '';
kColor_Info = '#3BD3F5';
kColor_Success = '#009E03';
kColor_Failure = '#CF1313';
kColor_Warning = '#BA9218';
kCMIBooleanFalse = 'false';
kCMIBooleanTrue = 'true';

kErrorStringArray = {
    "0":"No error",
    "101":"General exception",
    "201":"Invalid argument error",
    "202":"Element cannot have children",
    "203":"Element not an array - cannot have count",
    "301":"Not initialized",
    "401":"Not implemented error",
    "402":"Invalid set value, element is a keyword",
    "403":"Element is read only",
    "404":"Element is write only",
    "405":"Incorrect data type"
};

/**
 * Adds debug output to the Web page. Checks if kDebug is true before executing.
 *
 * @param {String} debugText (What will be written to new DIV)
 * @param {String} debugColor (Pass a kColor_XXX constant here. Will be the DIV style's text color)
 * @returns {number} mNewIndex (Latest debug DIV index added)
 */
function debugAdd(debugText, debugColor) {
    if (kDebug) {
        var mNewIndex, mNewDiv, mDivIdName, mDebugElement = document.getElementById('debug');

        if (typeof (debugColor) === 'undefined') {
            debugColor = '#FFFFFF';
        }
        mNewIndex = parseInt(mDebugElement.getAttribute("data-curindex"), 10) + 1;
        mNewDiv = document.createElement('div');
        mDivIdName = 'debug' + mNewIndex.toString() + 'Div';
        mDebugElement.setAttribute("data-curindex", mNewIndex.toString());
        mNewDiv.setAttribute('id', mDivIdName);
        mNewDiv.setAttribute('style', 'background-color: ' + debugColor + ';');
        mNewDiv.innerHTML = debugText;
        mDebugElement.appendChild(mNewDiv);
        return mNewIndex;
    }
}

/**
 * Can detect if the browser is IE without sniffing user-agents.
 * Usage: if(ie) detects if it's IE period. ie => 6, etc, would detect
 * if IE version is => 6. Not written by me.
 *
 * @return {Boolean}
 */
var ie = (function () {

    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
            all[0]
        );

    return v > 4 ? v : undef;

}());

/**
 * Sends data to the server page asynchronously.
 *
 * @param {Object} sendData (Data to be encoded and send to the server page)
 */
function runAjax(sendData) {
    var urlPath;

    // FFffff, really, IE??
    if (ie) {
        urlPath = 'http://' + window.location.hostname + '/SCORM/server/';
    }
    else {
        urlPath = '../server/';
    }

    AjaxRequest.post({
        'parameters':{ 'data':encodeURIComponent(sendData) },
        'url':urlPath + 'parse.php',
        'onLoading':function () {
            debugAdd('Sent Data to Server...', kColor_Info);
        },
        'onSuccess':function (req) {
            if (trim(escape(req.responseText)) === 'success') {
                debugAdd('Commit Success response received.', kColor_Success);
            }
            else {
                debugAdd('Server reported failure during AJAX request! Message: ' + escape(req.responseText), kColor_Failure);
            }
        },
        'onError':function (req) {
            setError('101');
            debugAdd('Commit Error!\nStatusText=' + escape(req.statusText) + '\nContents=' + escape(req.responseText), kColor_Failure);
        }
    });
}

/**
 * Sends data to the server page asynchronously.
 *
 * @param {Number} number (Number to be padded)
 * @param {Number} length (Length to pad to)
 * @returns {String} str (Outputted padded number)
 */
function pad(number, length) {
    var str = kEmptyString + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

/**
 * The LMS-managed course timer. It is used to time course if SCO does not already do so.
 */
function CourseTimer() {
    var timeDiff, startTime, endTime, seconds, minutes, hours;

    this.start = function () {
        startTime = new Date();
    };

    this.stop = function () {
        endTime = new Date();
    };

    this.clear = function () {
        startTime = null;
        endTime = null;
    };

    this.buildTimeString = function () {
        timeDiff = endTime - startTime;
        timeDiff /= 1000;
        seconds = parseInt(timeDiff % 60, 10);
        timeDiff /= Math.round(60);
        minutes = parseInt(timeDiff % 60, 10);
        timeDiff /= Math.round(60);
        hours = parseInt(timeDiff % 24, 10);
        timeDiff /= Math.round(24);

        return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
    };
}

/**
 * Sets the error code.
 *
 * @param {String} errorCode
 */
function setError(errorCode) {
    Session.set('lastError', errorCode);
}

/**
 * Retrieves the last error code.
 *
 * @return {String} errorCode
 */
function getError() {
    return Session.get('lastError');
}

/**
 * Trims a string.
 *
 * @param {String} strToTrim (String to be trimmed)
 * @returns {String} Trimmed string
 */
function trim(strToTrim) {
    return (strToTrim.replace(/^\s+|\s+$/g, kEmptyString));
}

/**
 * Returns an array of tokens of the current StringTokenizer
 *
 * @member StringTokenizer
 * @returns {Array} Set of tokens
 */
function getTokens() {
    var nextToken, start, end, trimmed, counter, tokens = [];
    if (this.material.indexOf(this.separator) < 0) {
        tokens[0] = this.material;
        return tokens;
    }
    start = 0;
    end = this.material.indexOf(this.separator, start);
    counter = 0;

    while (this.material.length - start >= 1) {
        nextToken = this.material.substring(start, end);

        start = end + 1;

        if (this.material.indexOf(this.separator, start + 1) < 0) {
            end = this.material.length;
        }
        else {
            end = this.material.indexOf(this.separator, start + 1);
        }
        trimmed = trim(nextToken);

        while (trimmed.substring(0, this.separator.length) == this.separator) {
            trimmed = trimmed.substring(this.separator.length);
        }
        trimmed = trim(trimmed);

        if (trimmed == kEmptyString) {
            continue;
        }
        tokens[counter] = trimmed;
        counter++;
    }
    return tokens;
}

/**
 * Returns the count of tokens in the current StringTokenizer
 *
 * @member StringTokenizer
 * @returns {Number} Count of tokens
 */
function countTokens() {
    return this.tokens.length;
}

/**
 * Returns the next token in the current StringTokenizer
 *
 * @member StringTokenizer
 * @returns {String} Next token in set
 */
function nextToken() {
    var returnToken;
    if (this.tokensReturned >= this.tokens.length) {
        return null;
    }
    else {
        returnToken = this.tokens[this.tokensReturned];
        this.tokensReturned++;
        return returnToken;
    }
}

/**
 * Returns whether there are more tokens in the current StringTokenizer
 *
 * @member StringTokenizer
 * @returns {Boolean} True if there are more tokens
 */
function hasMoreTokens() {
    if (this.tokensReturned < this.tokens.length) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Returns how many tokens were returned so far in the current StringTokenizer
 *
 * @member StringTokenizer
 * @returns {Number} Count of tokens returned so far
 */
function tokensReturned() {
    return this.tokensReturned;
}

/**
 * Provides a data structure and set of methods for parsing through a String containing delimited tokens. Author unknown.
 * Could be improved later by using prebuilt String member method 'split', but still should retain a lot of the nifty methods here.
 *
 * @class StringTokenizer Class
 * @constructor
 * @param {String} material (The value to be tokenized)
 * @param {String} separator (The delimiter used in material)
 */
function StringTokenizer(material, separator) {
    this.material = material;
    this.separator = separator;
    this.getTokens = getTokens;
    this.nextToken = nextToken;
    this.countTokens = countTokens;
    this.hasMoreTokens = hasMoreTokens;
    this.tokensReturned = tokensReturned;
    this.tokens = this.getTokens();
    this.tokensReturned = 0;
}
