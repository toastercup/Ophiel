/// <reference path="../../lib/json.js"/>
/// <reference path="../../lib/session.js"/>
/// <reference path="../Tools.js"/>
/// <reference path="./DataModelValidator.js"/>
/// <reference path="./cmi/CMIRequest.js"/>
/// <reference path="./DataManager.js"/>

/**
 * @author Alex Tharp
 * @version 1.0
 *
 * This script implements the Data Manager.
 */

/**
 * Begins the session by setting 'init' and 'CMIModel'.
 *
 * @member DataManager
 */
function SessionStart() {
    var CMIModelString;
    CMIModelString = JSON.stringify(this.CMIModel.getModel());
    Session.set('init', 'true');
    Session.set('CMIModel', CMIModelString);
}

/**
 * Takes in a CMIRequest Object and retrieves the value from the CMIModel JSON Session value.
 *
 * @member DataManager
 * @param {CMIRequest} RequestObject (Object being passed in.)
 * @param {Boolean} ignoreFlag (Hack the Gibson- ignore the element's read-only status.)
 * @returns {String} Session value
 */
function getValue(RequestObject, ignoreFlag) {
    var broken, x, CMIModelJSON, mObjectString, mModel, mBaseCategory, mElement, mTotalIndices, mTotalSubCat, mTotalPatterns, mIndexCounter, mPatternCounter, mSubCatCounter;
    broken = false;
    mModel = RequestObject.getModel();
    mBaseCategory = RequestObject.getBaseCategory();
    mElement = RequestObject.getElement();
    mTotalIndices = RequestObject.getNumIndices();
    mTotalSubCat = RequestObject.getNumSubCat();
    mTotalPatterns = RequestObject.getTotalNumTokens();

    mIndexCounter = 0;
    mPatternCounter = 0;
    mSubCatCounter = 0;

    mObjectString = mModel + '.' + mBaseCategory;

    for (x = 2; x < mTotalPatterns + 2; x++) {
        switch (RequestObject.getPattern(x)) {
            case 3: // SubCategory
                mObjectString += '.' + RequestObject.getSubCategory(mSubCatCounter);
                mSubCatCounter++;
                break;
            case 4: // Array Index
                mObjectString += '.Array[' + RequestObject.getIndex(mIndexCounter) + ']';
                mIndexCounter++;
                break;
            case 5: // Element
                mObjectString += '.' + mElement;
                break;
            case 6: // Value to be set
                debugAdd('Somehow, a SET request ended up in getValue()', kColor_Failure);
                setError('101');
                break;
            default:
                if (RequestObject.getPattern(x) !== -1) {
                    debugAdd('Invalid parameter in request.', kColor_Failure);
                    setError('101');
                }
        }
    }

    debugAdd('Rebuilt Object String: ' + mObjectString, kColor_Info);
    CMIModelJSON = JSON.parse(Session.get('CMIModel'));
    if (!broken) {
        try {
            if (eval('CMIModelJSON.' + mObjectString + '.Implemented')) {
                if (eval('CMIModelJSON.' + mObjectString + '.Read') || ignoreFlag) {
                    debugAdd('Successfully Retrieved Value: ' + eval('CMIModelJSON.' + mObjectString + '.Value'), kColor_Success);
                    return eval('CMIModelJSON.' + mObjectString + '.Value');
                }
                else {
                    debugAdd('This element does not have Read permissions.', kColor_Failure);
                    setError('403');
                }
            }
            else {
                debugAdd('Error 401. This element is not implemented.', kColor_Failure);
                setError('401');
            }
        }
        catch (err) {
            debugAdd('Error 401. Element is *likely* not implemented. Message: ' + err.message, kColor_Failure);
            setError('401');
        }
    }

    return kEmptyString;
}

/**
 * Takes in a CMIRequest Object, builds any necessary new arrays for the JSON, and sets the value to the session's JSON object.
 *
 * @member DataManager
 * @param {CMIRequest} RequestObject (Object being passed in.)
 * @returns {CMIBoolean} Represents success or failure.
 */
function setValue(RequestObject) {
    var flag, validationResult, broken, x, CMIModelJSON, mArrayBuildString, mObjectString, mOldObjectString, mModel, mBaseCategory, mElement, mTotalIndices, mTotalSubCat, mTotalPatterns, mIndexCounter, mPatternCounter, mSubCatCounter, mSetVal;
    flag = kCMIBooleanFalse;
    broken = false;

    mModel = RequestObject.getModel();
    mBaseCategory = RequestObject.getBaseCategory();
    mElement = RequestObject.getElement();
    mTotalIndices = RequestObject.getNumIndices();
    mTotalSubCat = RequestObject.getNumSubCat();
    mTotalPatterns = RequestObject.getTotalNumTokens();

    mIndexCounter = 0;
    mPatternCounter = 0;
    mSubCatCounter = 0;

    mObjectString = mModel + '.' + mBaseCategory;
    mArrayBuildString = mObjectString;

    CMIModelJSON = JSON.parse(Session.get('CMIModel'));
    mValidatorInstance = new DataModelValidator();

    for (x = 2; x < mTotalPatterns + 2; x++) {
        switch (RequestObject.getPattern(x)) {
            case 3: // SubCategory
                mObjectString += '.' + RequestObject.getSubCategory(mSubCatCounter);
                mArrayBuildString += '.' + RequestObject.getSubCategory(mSubCatCounter);
                mSubCatCounter++;
                break;
            case 4: // Array Index
                mOldObjectString = mObjectString;
                mObjectString += '.Array[' + RequestObject.getIndex(mIndexCounter) + ']';
                if (parseInt(RequestObject.getIndex(mIndexCounter), 10) > 0 && parseInt(RequestObject.getIndex(mIndexCounter), 10) !== parseInt(eval('CMIModelJSON.' + mOldObjectString + '._count.Value'), 10)) {
                    if (typeof (eval('CMIModelJSON.' + mObjectString)) === 'undefined') {
                        if (parseInt(RequestObject.getIndex(mIndexCounter), 10) - parseInt(eval('CMIModelJSON.' + mOldObjectString + '._count.Value'), 10) === 1) {
                            debugAdd('Building Array: ' + mArrayBuildString, kColor_Info);
                            eval('CMIModelJSON.' + mOldObjectString + '._count.Value = ' + RequestObject.getIndex(mIndexCounter));
                            eval('CMIModelJSON.' + mOldObjectString + ".Array.push(this.CMIModel.arrayBuilder['" + mArrayBuildString + "'])");
                        }
                        else {
                            debugAdd('Array index is not sequential. Set failed.', kColor_Warning);
                            setError('101');
                            broken = true;
                        }
                    }
                }
                mIndexCounter++;
                break;
            case 5: // Element
                mObjectString += '.' + mElement;
                mArrayBuildString += '.' + mElement;
                break;
            case 6: // Value to be set
                if (!RequestObject.isAKeywordRequest()) {
                    mSetVal = RequestObject.getValue();
                }
                else {
                    debugAdd('Element is a keyword! Set failed.', kColor_Failure);
                    setError('402');
                    broken = true;
                }
                break;
            default:
                if (RequestObject.getPattern(x) !== -1) {
                    debugAdd('Invalid parameter in request. Set failed.', kColor_Failure);
                    setError('101');
                    broken = true;
                }
        }
    }

    debugAdd('Rebuilt Object String: ' + mObjectString, kColor_Info);

    if (!broken) {
        try {
            if (eval('CMIModelJSON.' + mObjectString + '.Implemented')) {
                if (eval('CMIModelJSON.' + mObjectString + '.Write')) {
                    if (eval('CMIModelJSON.' + mObjectString + '.Type') === 'CMIVocabulary') {
                        validationResult = mValidatorInstance.Validate(eval('CMIModelJSON.' + mObjectString + '.Type'), mSetVal, eval('CMIModelJSON.' + mObjectString + '.Vocab'));
                    }
                    else {
                        validationResult = mValidatorInstance.Validate(eval('CMIModelJSON.' + mObjectString + '.Type'), mSetVal);
                    }
                    if (validationResult) {
                        eval('CMIModelJSON.' + mObjectString + '.Value = mSetVal');
                        debugAdd('Successfully set value "' + mSetVal + '"', kColor_Success);
                        if (!eval('CMIModelJSON.' + mObjectString + '.Initialized')) {
                            debugAdd('Initializing element...', kColor_Info);
                            eval('CMIModelJSON.' + mObjectString + '.Initialized = true');
                        }
                        Session.set('CMIModel', JSON.stringify(CMIModelJSON));
                        flag = kCMIBooleanTrue;
                    }
                    else {
                        debugAdd('Invalid datatype! Set failed.', kColor_Failure);
                        setError('405');
                    }
                }
                else {
                    debugAdd('This element does not have Write permissions.', kColor_Failure);
                    setError('403');
                }
            }
            else {
                debugAdd('Error 401. This element is not implemented.', kColor_Failure);
                setError('401');
            }
        }
        catch (err) {
            debugAdd('Error 401. Element is *likely* not implemented. Message: ' + err.message, kColor_Failure);
            setError('401');
        }
    }

    return flag;
}

/**
 * Here lies the DataManager class. Constructor initializes session if not init'd.
 *
 * @class DataManager Class
 * @constructor
 */
function DataManager() {
    if (typeof (Session.get('init')) === 'undefined') {
        this.SessionStart();
    }
}

DataManager.prototype.CMIModel = new DataModel();
DataManager.prototype.CMIModelJSON = {};
DataManager.prototype.SessionStart = SessionStart;
DataManager.prototype.getValue = getValue;
DataManager.prototype.setValue = setValue;
