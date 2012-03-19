/// <reference path="../lib/json.js"/>
/// <reference path="../lib/session.js"/>
/// <reference path="./Tools.js"/>
/// <reference path="./datamodel/DataModelValidator.js"/>
/// <reference path="./datamodel/DataModel.js"/>
/// <reference path="./datamodel/cmi/CMIRequest.js"/>
/// <reference path="./datamodel/DataManager.js"/>

/**
 * @author Alex Tharp
 * @version 1.0
 *
 * This script implements the SCORM API with the class 'API'.
 */

var API, child, courseTime = new CourseTimer();

/**
 * Initializes the LMS
 *
 * @member apiClass
 * @param {String} parameter (must be empty String)
 * @returns {CMIBoolean} ('false' - failed. 'true' - succeeded.)
 */
function LMSInitialize(parameter) {
    setError('0');
    debugAdd('init LMS...', kColor_Info);
    var mInitResult = kCMIBooleanFalse;

    if (!(parameter === kEmptyString || parameter === 'null')) {
        setError('201');
        debugAdd('Code 201', kColor_Warning);
        return mInitResult;
    }

    if (this.isLMSInitialized === true) {
        setError('101');
        debugAdd('Code 101', kColor_Warning);
    } else {
        Session.clear();
        setError('0');
        courseTime.start();
        debugAdd('Began recording LMS Course Time.', kColor_Info);
        this.isLMSInitialized = true;
        mInitResult = kCMIBooleanTrue;
    }

    return mInitResult;
}

/**
 * Retrieves an LMS value.
 *
 * @member apiClass
 * @param {String} element
 * @param {Boolean} ignoreFlag (Hack the Gibson- ignore the element's read-only status.)
 * @returns {String}
 */
function LMSGetValue(element, ignoreFlag) {
    var mDataManager, mCMIRequestInstance;
    setError('0');
    mDataManager = new DataManager();
    mCMIRequestInstance = new CMIRequest(element, true);
    return mDataManager.getValue(mCMIRequestInstance, ignoreFlag);
}

/**
 * Sets an LMS value.
 *
 * @member apiClass
 * @param {String} element
 * @param {String} value
 * @returns {CMIBoolean} ('false' - failed. 'true' - succeeded.)
 */
function LMSSetValue(element, value) {
    var mDataManager, mCMIRequestInstance;
    setError('0');
    if (typeof (value) !== 'undefined') {
        element = element + ',' + value;
    }
    mDataManager = new DataManager();
    mCMIRequestInstance = new CMIRequest(element, false);

    return mDataManager.setValue(mCMIRequestInstance);
}

/**
 * Commits LMS state.
 *
 * @member apiClass
 * @param {String} parameter (must be empty String)
 * @returns {CMIBoolean} ('false' - failed. 'true' - succeeded.)
 */
function LMSCommit(parameter) {
    var courseTimeString, mResult = kCMIBooleanFalse;
    setError('0');

    if (!(parameter === kEmptyString || parameter === 'null')) {
        setError('201');
        debugAdd('Commit failure! Code 201', kColor_Failure);
        return mResult;
    }

    debugAdd('Committing LMS state...', kColor_Info);
    runAjax(Session.get('CMIModel'));
    mResult = kCMIBooleanTrue;

    return mResult;
}

/**
 * Checks if session_time has been set, and if not, retrieves LMS's timer and sets it.
 *
 * @member apiClass
 * @returns {Boolean} (Indicates if the LMS set the value)
 */
function CheckTime() {
    var courseTimeString, mResult = false;

    courseTime.stop();
    courseTimeString = courseTime.buildTimeString();
    debugAdd('Checking time. LMS-recorded Course Time: ' + courseTimeString, kColor_Info);
    if (this.LMSGetValue('cmi.core.session_time', true) === kEmptyString) {
        this.LMSSetValue('cmi.core.session_time', courseTimeString);
        mResult = true;
        debugAdd('The LMS set the course time manually because the SCO did not! For shame.', kColor_Warning);
    }

    return mResult;
}

/**
 * Turns off communication with the SCO.
 *
 * @member apiClass
 * @param {String} parameter (must be empty String)
 * @returns {CMIBoolean} ('false' - failed. 'true' - succeeded.)
 */
function LMSFinish(parameter) {
    var mResult = kCMIBooleanFalse;
    setError('0');

    if (!(parameter === kEmptyString || parameter === 'null')) {
        setError('201');
        debugAdd('Code 201', kColor_Warning);
        return mResult;
    }

    debugAdd('Finishing LMS/SCO communication...', kColor_Info);
    if (this.CheckInitialization()) {
        this.CheckTime();
        this.LMSCommit("");
        this.isLMSInitialized = false;
        mResult = kCMIBooleanTrue;
        debugAdd('LMS is now finished.', kColor_Success);
        return mResult;
    }
    else {
        debugAdd('LMS is already finished!', kColor_Failure);
        return mResult;
    }
}

/**
 * Retrieves the last reported error.
 *
 * @member apiClass
 * @returns {String} (These are Strings that can be converted into integer numbers)
 */
function LMSGetLastError() {
    debugAdd('Retrieving last error...', kColor_Info);
    return getError();
}

/**
 * Retrieves a description of the error represented by the error code passed.
 *
 * @member apiClass
 * @param {String} errorNumber
 * @returns {String}
 */
function LMSGetErrorString(errorNumber) {
    debugAdd('Retrieving error description...', kColor_Info);
    var errorString;
    if (errorNumber !== kEmptyString) {
        errorString = kErrorStringArray[errorNumber];
        if (typeof (errorString) === 'undefined') {
            errorString = kEmptyString;
        }
    } else {
        errorString = kEmptyString;
    }

    return errorString;
}

/**
 * Retrieves a description of a vendor-specific error.
 *
 * @member apiClass
 * @param {String} parameter (Can be an integer number in the form of a String, or an empty String- this would request additional info on the last error.)
 * @returns {String}
 */
function LMSGetDiagnostic(errornumber) {
    debugAdd('Retrieving diagnostic (not implemented)...', kColor_Info);
}

/**
 * Checks and returns whether or not the LMS is initialized, and if not, triggers the error handler.
 *
 * @member apiClass
 * @returns {Boolean}
 */
function CheckInitialization() {
    setError('0');
    if (this.isLMSInitialized !== true) {
        setError('301');
        debugAdd('Code 301', kColor_Warning);
    }
    return this.isLMSInitialized;
}

/**
 * The SCORM API class constructor
 *
 * @class SCORM API
 * @constructor
 */
function apiClass() {
}

apiClass.prototype.LMSInitialize = LMSInitialize;
apiClass.prototype.LMSGetValue = LMSGetValue;
apiClass.prototype.LMSSetValue = LMSSetValue;
apiClass.prototype.LMSCommit = LMSCommit;
apiClass.prototype.LMSFinish = LMSFinish;
apiClass.prototype.LMSGetLastError = LMSGetLastError;
apiClass.prototype.LMSGetErrorString = LMSGetErrorString;
apiClass.prototype.LMSGetDiagnostic = LMSGetDiagnostic;
apiClass.prototype.CheckInitialization = CheckInitialization;
apiClass.prototype.CheckTime = CheckTime;
apiClass.prototype.isLMSInitialized = false;