/// <reference path="../../../lib/json.js"/>
/// <reference path="../../../lib/session.js"/>
/// <reference path="../../Tools.js"/>
/// <reference path="../DataModelValidator.js"/>
/// <reference path="../DataModel.js"/>
/// <reference path="../DataManager.js"/>

/**
 * @author Alex Tharp
 * @version 1.0
 *
 * This script implements the CMIRequest object.
 */

/**
 * Increments the pattern count.
 *
 * @member CMIRequest
 */
function incrementPatternCount() {
    this.pattern_counter++;
}

/**
 * Resets the pattern count.
 *
 * @member CMIRequest
 */
function resetPatternCounter() {
    this.pattern_counter = 2;
}

/**
 * Returns the data model used.
 *
 * @member CMIRequest
 * @returns {String} Data model used
 */
function getModel() {
    return this.model;
}

/**
 * Indicates if this request is for an LMSSetValue() request.
 *
 * @member CMIRequest
 * @returns {Boolean}
 */
function isForASetRequest() {
    return this.IsSetRequest;
}

/**
 * Indicates if request is for a keyword request. (_children, _count, or _version)
 *
 * @member CMIRequest
 * @returns {Boolean}
 */
function isAKeywordRequest() {
    var result = false;
    if (isAChildrenRequest() || isACountRequest() || isAVersionRequest()) {
        result = true;
    }
    return result;
}

/**
 * Indicates if request is a _children request.
 *
 * @member CMIRequest
 * @returns {Boolean}
 */
function isAChildrenRequest() {
    var result = false;
    if (this.element == '_children') {
        result = true;
    }
    return result;
}

/**
 * Indicates if request is a count request.
 *
 * @member CMIRequest
 * @returns {Boolean}
 */
function isACountRequest() {
    var result = false;
    if (this.element == '_count') {
        result = true;
    }
    return result;
}

/**
 * Indicates if request is a _version request.
 *
 * @member CMIRequest
 * @returns {Boolean}
 */
function isAVersionRequest() {
    var result = false;
    if (this.element == '_version') {
        result = true;
    }
    return result;
}

/**
 * Returns original unparsed request.
 *
 * @member CMIRequest
 * @returns {String}
 */
function getRequest() {
    return this.request;
}

/**
 * Returns the Base Category.
 *
 * @member CMIRequest
 * @returns {String}
 */
function getBaseCategory() {
    this.tokensRequested++;
    return this.baseCategory;
}

/**
 * Returns the value for setting.
 *
 * @member CMIRequest
 * @returns {String}
 */
function getValue() {
    return this.setValue;
}

/**
 * Returns the request's Element.
 *
 * @member CMIRequest
 * @returns {String}
 */
function getElement() {
    return this.element;
}

/**
 * Returns the total number of tokens.
 *
 * @member CMIRequest
 * @returns {String}
 */
function getTotalNumTokens() {
    return this.totalNumberOfTokens;
}

/**
 * Returns the number of SubCategories.
 *
 * @member CMIRequest
 * @returns {Number}
 */
function getNumSubCat() {
    return this.numOfSubCategories;
}

/**
 * Returns the number of Indices.
 *
 * @member CMIRequest
 * @returns {Number}
 */
function getNumIndices() {
    return this.numOfInd;
}

/**
 * Returns the pattern found at the specified position.
 *
 * @member CMIRequest
 * @param {Number} position (Position in pattern to find value.)
 * @returns {Number}
 */
function getPattern(position) {
    return this.pattern[position];
}

/**
 * Returns the value found at the specified position.
 *
 * @member CMIRequest
 * @param {Number} position (Position in index to find value.)
 * @returns {String}
 */
function getIndex(position) {
    return this.index[position];
}

/**
 * Returns the SubCategory found at the specified position.
 *
 * @member CMIRequest
 * @param {Number} position (Position in SubCategories to find SubCat.)
 * @returns {String}
 */
function getSubCategory(position) {
    var subCat = '-1';
    if (position >= 0 && position < 10) {
        subCat = this.subcategory[position];
    }

    return subCat;
}

/**
 * Parses an LMSGetValue() request.
 *
 * @member CMIRequest
 * @param {String} theRequest (The raw request string.)
 */
function parseGetRequest(theRequest) {
    var tmpIndex, tmpIndex1, tmpInt, temp, done, stk = new StringTokenizer(theRequest, '.');
    debugAdd('In CMIRequest::parseGetRequest', kColor_Info);

    this.totalNumberOfTokens = this.totalNumberOfTokens + stk.countTokens();

    this.model = stk.nextToken();
    this.tokensProcessed++;

    this.pattern[0] = this.MODEL;

    this.baseCategory = stk.nextToken();
    this.tokensProcessed++;

    this.pattern[1] = this.BASE_CATEGORY;

    if (stk.hasMoreTokens()) {
        done = false;

        while (!done) {
            if (this.onLastToken()) {
                temp = stk.nextToken();

                if (!isNaN(temp)) {
                    tmpInt = parseInt(temp, 10);
                    tmpIndex = this.findNextIndexLoc();

                    this.index[tmpIndex] = tmpInt;

                    this.numOfInd++;

                    tmpIndex1 = this.findNextPatternLoc();

                    this.pattern[tmpIndex1] = this.ARRAY_INDEX;

                    this.element = this.subcategory[this.numOfSubCategories - 1];

                    tmpIndex1 = this.findNextPatternLoc();
                    this.pattern[tmpIndex1] = this.ELEMENT;
                }
                else {
                    this.element = temp;
                    tmpIndex = this.findNextPatternLoc();

                    this.pattern[tmpIndex] = this.ELEMENT;
                }

                this.tokensProcessed++;

                done = true;
            }
            else {
                this.determineNextToken(stk);
            }
        }
    }
    else {
        this.element = this.baseCategory;
    }
}

/**
 * Parses an LMSSetValue() request.
 *
 * @member CMIRequest
 * @param {String} theRequest (The raw request string.)
 * @param {String} theSetValue (The value to be set.)
 */
function parseSetRequest(theRequest, theSetValue) {
    var done, tmpIndex, stk = new StringTokenizer(theRequest, '.');
    debugAdd('In CMIRequest::parseSetRequest', kColor_Info);

    this.totalNumberOfTokens = this.totalNumberOfTokens + stk.countTokens();

    this.model = stk.nextToken();
    this.tokensProcessed++;

    this.pattern[0] = this.MODEL;

    this.baseCategory = stk.nextToken();
    this.tokensProcessed++;

    this.pattern[1] = this.BASE_CATEGORY;

    if (stk.hasMoreTokens()) {
        done = false;

        while (!done) {
            if (this.onLastToken()) {
                this.setValue = theSetValue;
                this.tokensProcessed++;

                tmpIndex = this.findNextPatternLoc();

                this.pattern[tmpIndex] = this.VALUE;
                done = true;
            }
            else if ((this.totalNumberOfTokens - this.tokensProcessed) === 2) {
                this.element = stk.nextToken();
                this.tokensProcessed++;
                tmpIndex = this.findNextPatternLoc();

                this.pattern[tmpIndex] = this.ELEMENT;
            }
            else {
                this.determineNextToken(stk);
            }
        }
    }
    else {
        this.setValue = theSetValue;
        this.tokensProcessed++;
        tmpIndex = this.findNextPatternLoc();

        this.pattern[tmpIndex] = this.VALUE;
    }
}

/**
 * Used to determine the next token.
 *
 * @member CMIRequest
 * @param {StringTokenizer} stk (String Tokenizer holding the request.)
 */
function determineNextToken(stk) {
    var temp = stk.nextToken(), tmpIndex, tmpIndex1, tmpInt;

    this.tokensProcessed++;

    if (!isNaN(temp)) {
        tmpInt = parseInt(temp, 10);

        tmpIndex = this.findNextIndexLoc();

        this.index[tmpIndex] = tmpInt;

        this.numOfInd++;

        tmpIndex1 = this.findNextPatternLoc();

        this.pattern[tmpIndex1] = this.ARRAY_INDEX;
    }
    else {
        tmpIndex = this.findNextSubLoc();

        this.subcategory[tmpIndex] = temp;

        this.numOfSubCategories++;

        tmpIndex1 = this.findNextPatternLoc();

        this.pattern[tmpIndex1] = this.SUB_CATEGORY;
    }
}

/**
 * Determines if on last token.
 *
 * @member CMIRequest
 * @returns {Boolean} True if on last token.
 */
function onLastToken() {
    var flag = false;

    if ((this.totalNumberOfTokens - this.tokensProcessed) === 1) {
        flag = true;
    }
    return flag;
}

/**
 * Uses pattern collection to determine the next available token.
 *
 * @member CMIRequest
 * @returns {String} Next available token.
 */
function getNextToken() {
    var tmpIndex, tmpPattern, tmpPat, rtrnString = kEmptyString;

    if (this.pattern[this.pattern_counter] != kEmptyString) {
        tmpPat = this.pattern[this.pattern_counter];
        tmpPattern = parseInt(tmpPat, 10);

        if (tmpPattern == this.SUB_CATEGORY) {
            if (this.subcategory[this.numOfSubCatReturned] != kEmptyString) {
                rtrnString = this.subcategory[this.numOfSubCatReturned];
                this.numOfSubCatReturned++;
            }
            else {
                debugAdd('Index Out of Bounds', kColor_Warning);
            }
        }
        else if (tmpPattern == this.ARRAY_INDEX) {
            if (this.index[this.numOfIndReturned] != kEmptyString) {
                tmpIndex = this.index[this.numOfIndReturned];
                this.numOfIndReturned++;
                rtrnString = tmpIndex.toString();
            }
            else {
                debugAdd('Index Out of Bounds', kColor_Warning);
            }
        }
        else if (tmpPattern == this.ELEMENT) {
            rtrnString = this.element;

            this.resetPatternCounter();
        }
        else if (tmpPattern == this.VALUE) {
            rtrnString = this.setValue;
        }

        if (tmpPattern != this.ELEMENT) {
            this.incrementPatternCount();
        }
        this.tokensRequested++;
    }
    else {
        debugAdd('Index Out of Bounds', kColor_Warning);
    }

    return rtrnString;
}

/**
 * Determines if there are more tokens to process.
 *
 * @member CMIRequest
 * @returns {Boolean} True if there are more tokens.
 */
function hasMoreTokensToProcess() {
    var flag = true;

    // If dealing with LMSSetValue() request don't count the setValue
    if (this.IsSetRequest) {
        if (((this.totalNumberOfTokens - 1) - this.tokensRequested) == 0) {
            flag = false;
        }
    }
    else {
        if ((this.totalNumberOfTokens - this.tokensRequested) == 0) {
            flag = false;
        }
    }

    return flag;
}

/**
 * Invoked when processing of a request is complete.
 *
 * @member CMIRequest
 */
function done() {
    this.resetPatternCounter();
    this.tokensRequested = 1;
    this.numOfSubCatReturned = 0;
    this.numOfIndReturned = 0;
    return;
}

/**
 * Determines next available position in pattern array.
 *
 * @member CMIRequest
 * @returns {Number} Next available position.
 */
function findNextPatternLoc() {
    var i, result = -1, value = -1;

    for (i = 0; i <= this.numPat; i++) {
        if (value == parseInt(this.pattern[i], 10)) {
            result = i;
            break;
        }
    }

    return result;
}

/**
 * Determines next available position in Index array.
 *
 * @member CMIRequest
 * @returns {Number} Next available position.
 */
function findNextIndexLoc() {
    var i, result = -1, value = -1;

    for (i = 0; i <= this.numInd; i++) {
        if (value == parseInt(this.index[i], 10)) {
            result = i;
            break;
        }
    }

    return result;
}

/**
 * Determines next available position in subcategory array.
 *
 * @member CMIRequest
 * @returns {Number} Next available position.
 */
function findNextSubLoc() {
    var i, result = -1, tmpString = '-1';

    for (i = 0; i <= this.numSub; i++) {
        if (this.subcategory[i] == tmpString) {
            result = i;
            break;
        }
    }

    return result;
}

/**
 * Generates debug output based on the current CMIRequest object.
 *
 * @member CMIRequest
 * @returns {Number} Next available position.
 */
function showRequest() {
    var i;
    debugAdd('Base Category: ' + this.baseCategory, kColor_Info);
    debugAdd('Element: ' + this.element, kColor_Info);
    debugAdd('Model: ' + this.model, kColor_Info);
    debugAdd('Number of Indices: ' + this.numOfInd, kColor_Info);
    debugAdd('Number of SubCategories: ' + this.numOfSubCategories, kColor_Info);

    for (i = 0; i < this.numOfSubCategories; i++) {
        debugAdd('Subcategory[' + i + ']: ' + this.getSubCategory(i), kColor_Info);
    }

    for (i = 0; i < this.numOfInd; i++) {
        debugAdd('Index[' + i + ']: ' + this.index[i], kColor_Info);
    }

    for (i = 0; i < this.numPat; i++) {
        if (parseInt(this.pattern[i], 10) > -1) {
            debugAdd('Pattern[' + i + ']: ' + this.pattern[i], kColor_Info);
        }
    }

    if (this.isForASetRequest()) {
        debugAdd('Set Value: ' + this.setValue, kColor_Info);
    }
}

/**
 * Defines the CMIRequest object, which is fed as part of getting/setting an actual data value.
 *
 * @class CMIRequest Object
 * @constructor
 * @param {String} theRequest (The request and its various parameters. (example, cmi.core.student_id))
 * @param {Boolean} getRequestFlag (True if this is for an LMSGetValue())
 */
function CMIRequest(theRequest, getRequestFlag) {
    var i, setTok, numTokensForSet, numTokensProcessed, theSetValue = kEmptyString, theNewRequest = kEmptyString;

    if (getRequestFlag) {
        debugAdd('Building CMIRequest for a LMSGetValue(' + theRequest + ')', kColor_Info);
    }
    else {
        debugAdd('Building CMIRequest for a LMSSetValue(' + theRequest + ')', kColor_Info);
    }

    if (typeof (theRequest) !== 'undefined') {
        this.request = theRequest;
    }
    else {
        this.request = kEmptyString;
    }

    if (typeof (getRequestFlag) !== 'undefined') {
        this.IsGetRequest = getRequestFlag;
    }
    else {
        this.IsGetRequest = false;
    }

    this.model = kEmptyString;

    this.baseCategory = kEmptyString;

    this.numSub = 10;
    this.subcategory = [];

    this.numOfSubCategories = 0;

    this.numOfSubCatReturned = 0;

    this.numInd = 10;
    this.index = [];

    this.numOfInd = 0;

    this.numOfIndReturned = 0;

    this.element = kEmptyString;

    this.setValue = kEmptyString;

    this.totalNumberOfTokens = 0;

    this.tokensRequested = 1;

    this.tokensProcessed = 0;

    this.IsSetRequest = false;

    // 1 - model
    // 2 - base category
    // 3 - sub category
    // 4 - array index
    // 5 - element
    // 6 - value to use for set
    // cmi.core.student_id -- 1,2,5
    // cmi.student_data.tries.n.score.raw -- 1,2,3,4,3,5
    this.numPat = 10;
    this.pattern = [];

    this.MODEL = 1;
    this.BASE_CATEGORY = 2;
    this.SUB_CATEGORY = 3;
    this.ARRAY_INDEX = 4;
    this.ELEMENT = 5;
    this.VALUE = 6;

    // we're starting at 2!
    this.pattern_counter = 2;

    this.index = new Array(this.numInd);

    for (i = 0; i < this.index.length; i++) {
        this.index[i] = -1;
    }

    this.pattern = new Array(this.numPat);

    for (i = 0; i < this.pattern.length; i++) {
        this.pattern[i] = -1;
    }

    this.subcategory = new Array(this.numSub);

    for (i = 0; i < this.subcategory.length; i++) {
        this.subcategory[i] = '-1';
    }

    if (this.IsGetRequest) {
        this.IsSetRequest = false;
        this.parseGetRequest(theRequest);
    }
    else {
        this.IsSetRequest = true;

        setTok = new StringTokenizer(theRequest, ',');
        numTokensForSet = setTok.countTokens();
        numTokensProcessed = 0;

        theNewRequest = setTok.nextToken();
        numTokensProcessed++;

        debugAdd('Request: [' + theNewRequest + ']', kColor_Info);

        if (numTokensForSet === 1) {
            theSetValue = kEmptyString;
        }
        else {
            while (numTokensProcessed < numTokensForSet) {
                theSetValue += setTok.nextToken();
                numTokensProcessed++;

                if (numTokensProcessed != numTokensForSet) {
                    theSetValue += ',';
                }
            }

            debugAdd('Set Value: [' + theSetValue + ']', kColor_Info);
        }

        this.totalNumberOfTokens++;
        this.parseSetRequest(theNewRequest, theSetValue);
    }

    this.showRequest();
}

CMIRequest.prototype.incrementPatternCount = incrementPatternCount;
CMIRequest.prototype.resetPatternCounter = resetPatternCounter;
CMIRequest.prototype.getModel = getModel;
CMIRequest.prototype.isForASetRequest = isForASetRequest;
CMIRequest.prototype.isAKeywordRequest = isAKeywordRequest;
CMIRequest.prototype.isAChildrenRequest = isAChildrenRequest;
CMIRequest.prototype.isACountRequest = isACountRequest;
CMIRequest.prototype.isAVersionRequest = isAVersionRequest;
CMIRequest.prototype.getRequest = getRequest;
CMIRequest.prototype.getBaseCategory = getBaseCategory;
CMIRequest.prototype.getValue = getValue;
CMIRequest.prototype.getElement = getElement;
CMIRequest.prototype.getTotalNumTokens = getTotalNumTokens;
CMIRequest.prototype.getNumSubCat = getNumSubCat;
CMIRequest.prototype.getNumIndices = getNumIndices;
CMIRequest.prototype.getPattern = getPattern;
CMIRequest.prototype.getIndex = getIndex;
CMIRequest.prototype.getSubCategory = getSubCategory;
CMIRequest.prototype.parseGetRequest = parseGetRequest;
CMIRequest.prototype.parseSetRequest = parseSetRequest;
CMIRequest.prototype.determineNextToken = determineNextToken;
CMIRequest.prototype.onLastToken = onLastToken;
CMIRequest.prototype.getNextToken = getNextToken;
CMIRequest.prototype.hasMoreTokensToProcess = hasMoreTokensToProcess;
CMIRequest.prototype.findNextPatternLoc = findNextPatternLoc;
CMIRequest.prototype.findNextIndexLoc = findNextIndexLoc;
CMIRequest.prototype.findNextSubLoc = findNextSubLoc;
CMIRequest.prototype.showRequest = showRequest;