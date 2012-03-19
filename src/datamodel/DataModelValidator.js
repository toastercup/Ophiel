/// <reference path="../../lib/json.js"/>
/// <reference path="../../lib/session.js"/>
/// <reference path="../Tools.js"/>
/// <reference path="./DataModel.js"/>
/// <reference path="./cmi/CMIRequest.js"/>
/// <reference path="./DataManager.js"/>

/**
 * @author Alex Tharp
 * @version 1.0
 *
 * This script validates the DataModel.
 */

/**
 * Returns the array for the Mode Vocabulary.
 *
 * @member DataModelValidator
 * @returns {Array} Mode Vocabulary
 */
function buildModeList() {
    var list = [];

    list[0] = 'normal';
    list[1] = 'review';
    list[2] = 'browse';
    return list;
}

/**
 * Returns the array for the Status Vocabulary.
 *
 * @member DataModelValidator
 * @returns {Array} Status Vocabulary
 */
function buildStatusList() {
    var list = [];

    list[0] = 'passed';
    list[1] = 'completed';
    list[2] = 'failed';
    list[3] = 'incomplete';
    list[4] = 'browsed';
    list[5] = 'not attempted';
    return list;
}

/**
 * Returns the array for the Exit Vocabulary.
 *
 * @member DataModelValidator
 * @returns {Array} Exit Vocabulary
 */
function buildExitList() {
    var list = [];

    list[0] = kEmptyString;
    list[1] = 'time-out';
    list[2] = 'suspend';
    list[3] = 'logout';
    return list;
}

/**
 * Returns the array for the Credit Vocabulary.
 *
 * @member DataModelValidator
 * @returns {Array} Credit Vocabulary
 */
function buildCreditList() {
    var list = [];

    list[0] = 'credit';
    list[1] = 'no-credit';
    return list;
}

/**
 * Returns the array for the Entry Vocabulary.
 *
 * @member DataModelValidator
 * @returns {Array} Entry Vocabulary
 */
function buildEntryList() {
    var list = [];

    list[0] = kEmptyString;
    list[1] = 'ab-initio';
    list[2] = 'resume';
    return list;
}

/**
 * Returns the array for the Time Limit Action Vocabulary.
 *
 * @member DataModelValidator
 * @returns {Array} Time Limit Action Vocabulary
 */
function buildTimeLimitActionList() {
    var list = [];

    list[0] = kEmptyString;
    list[1] = 'exit,message';
    list[2] = 'exit,no message';
    list[3] = 'continue,message';
    list[4] = 'continue,no message';
    return list;
}

/**
 * Returns the array for the Interaction Vocabulary.
 *
 * @member DataModelValidator
 * @returns {Array} Interaction Vocabulary
 */
function buildInteractionList() {
    var list = [];

    list[0] = 'true-false';
    list[1] = 'choice';
    list[2] = 'fill-in';
    list[3] = 'matching';
    list[4] = 'performance';
    list[5] = 'likert';
    list[6] = 'sequencing';
    list[7] = 'numeric';
    return list;
}

/**
 * Returns the array for the Result Vocabulary.
 *
 * @member DataModelValidator
 * @returns {Array} Result Vocabulary
 */
function buildResultList() {
    var list = [];

    list[0] = 'correct';
    list[1] = 'wrong';
    list[2] = 'unanticipated';
    list[3] = 'neutral';

    return list;
}

/**
 * Verifies that the value is blank
 *
 * @member DataModelValidator
 * @param {String} value (Value to be checked)
 * @returns {Boolean} Result of validation
 */
function checkBlank(value) {
    var result = false;
    if (typeof (value) !== 'undefined') {
        if (value.length === 0) {
            result = true;
        }
    }
    return result;
}

/**
 * Verifies that the value is a CMIBoolean
 *
 * @member DataModelValidator
 * @param {String} value (Value to be checked)
 * @returns {Boolean} Result of validation
 */
function checkBoolean(value) {
    var flag = false;
    if (value === kCMIBooleanTrue || value === kCMIBooleanFalse) {
        flag = true;
    }
    return flag;
}

/**
 * Verifies that the value is a CMIFeedback (NOT YET IMPLEMENTED!!!!!)
 *
 * @member DataModelValidator
 * @param {String} value (Value to be checked)
 * @returns {Boolean} Result of validation
 */
function checkFeedback(value) {
    return true;
}

/**
 * Verifies that the value is a CMIString255
 *
 * @member DataModelValidator
 * @param {String} value (Value to be checked)
 * @returns {Boolean} Result of validation
 */
function checkString255(value) {
    var flag = false;
    if (value.length <= 255) {
        flag = true;
    }

    return flag;
}

/**
 * Verifies that the value is a CMIString4096
 *
 * @member DataModelValidator
 * @param {String} value (Value to be checked)
 * @returns {Boolean} Result of validation
 */
function checkString4096(value) {
    var flag = false;
    if (value.length <= 4096) {
        flag = true;
    }

    return flag;
}

/**
 * Verifies that the value is a CMIDecimal with added check for normalized score.
 *
 * @member DataModelValidator
 * @param {String} value (Value to be checked)
 * @returns {Boolean} Result of validation
 */
function checkScoreDecimal(value) {
    return checkDecimal(value, true);
}

/**
 * Verifies that the value is a CMIDecimal
 *
 * @member DataModelValidator
 * @param {String} value (Value to be checked)
 * @param {Boolean} score (Whether or not this is a Score variant of CMIDecimal)
 * @returns {Boolean} Result of validation
 */
function checkDecimal(value, score) {
    var tmpDouble, pattern = /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/, result = false;

    if (!(checkBlank(value))) {
        if (this.checkPattern(value, pattern)) {
            if (score) {
                tmpDouble = parseFloat(value);
                if (tmpDouble >= 0.0 && tmpDouble <= 100.0) {
                    result = true;
                }
                else {
                    debugAdd(value + ' is not a normalized score', kColor_Warning);
                    debugAdd('0 <= ' + value + ' >= 100', kColor_Warning);
                }
            }
            else {
                result = true;
            }
        }
        else {
            debugAdd(value + ' is not a valid CMIDecimal Type', kColor_Warning);
        }
    }
    else {
        result = true;
    }

    return result;
}

/**
 * Verifies that the value is a valid vocabulary member of the provided Vocab Type
 *
 * @member DataModelValidator
 * @param {String} vocabType (Vocabulary type of Element to be validated)
 * @param {String} value (Value to be checked)
 * @returns {Boolean} Result of validation
 */
function checkVocabulary(vocabType, value) {
    var vocabTypeList, tmpString, i, flag = false;

    debugAdd('checkVocabulary(' + vocabType + ', ' + value + ')', kColor_Info);

    if (this.vocabulary.hasOwnProperty(vocabType)) {
        vocabTypeList = this.vocabulary[vocabType];

        for (i = 0; i < vocabTypeList.length; i++) {
            tmpString = vocabTypeList[i];

            if (tmpString === value) {
                flag = true;
                break;
            }
        }

        //Check to see if the "Results" category is passing in a decimal number
        if (vocabType === 'Result' && flag !== true) {
            flag = this.checkDecimal(value);
        }
    }
    // No match found
    if (flag === false) {
        debugAdd("'" + value + "' is not a valid vocabulary member for the " + vocabType + " Vocabulary Type or that Type does not exist.", kColor_Warning);
    }

    return flag;
}

/**
 * Verifies that the value is a CMIIdentifier
 *
 * @member DataModelValidator
 * @param {String} value (Value to be checked)
 * @returns {Boolean} Result of validation
 */
function checkIdentifier(value) {
    var flag = false;

    if (value.length <= 255 && value.indexOf(' ') === -1 && !(this.checkBlank(value))) {
        flag = true;
    }

    return flag;
}

/**
 * Verifies that the value is a CMIInteger
 *
 * @member DataModelValidator
 * @param {String} value (Value to be checked)
 * @returns {Boolean} Result of validation
 */
function checkInteger(value) {
    var flag = false;
    if (value != null && value !== kEmptyString && !isNaN(value)) {
        flag = (parseInt(value, 10) == value && value >= 0 && value <= 65536);
    }
    else {
        debugAdd(value + ' is not an Integer', kColor_Warning);
    }
    return flag;
}

/**
 * Verifies that the value is a CMISInteger
 *
 * @member DataModelValidator
 * @param {String} value (Value to be checked)
 * @returns {Boolean} Result of validation
 */
function checkSInteger(value) {
    var flag = false;
    if (value != null && value !== kEmptyString && !isNaN(value)) {
        flag = (parseInt(value, 10) == value && value >= -32768 && value <= 32768);
    }
    else {
        debugAdd(value + ' is not a Signed Integer', kColor_Warning);
    }
    return flag;
}

/**
 * Verifies that the value is a CMITime (HH:MM:SS.SS)
 *
 * @member DataModelValidator
 * @param {String} value (Value to be checked)
 * @returns {Boolean} Result of validation
 */
function checkTime(value) {
    var pattern = "^(([0-1][0-9])|([2][0-3])):([0-5][0-9]):([0-5][0-9])(\.([0-9][0-9]?))?$", result = false;

    if (!(checkBlank(value))) {
        if (this.checkPattern(value, pattern)) {
            result = true;
        }
        else {
            debugAdd('Value being used for setting: ' + value + ' is not in Valid Time Format (HH:MM:SS.SS)', kColor_Warning);
        }
    }
    else {
        result = true;
    }

    return result;
}

/**
 * Verifies that the value is a CMITimespan
 *
 * @member DataModelValidator
 * @param {String} value (Value to be checked)
 * @returns {Boolean} Result of validation
 */
function checkTimespan(value) {
    var pattern = "^([0-9][0-9][0-9]?[0-9]?):([0-5][0-9]):([0-5][0-9])(\.([0-9][0-9]?))?$", result = false;

    if (!(checkBlank(value))) {
        if (this.checkPattern(value, pattern)) {
            result = true;
        }
        else {
            debugAdd('Value being used for setting: ' + value + ' is not in Valid Timespan Format (HHHH:MM:SS.SS)', kColor_Warning);
        }
    }
    else {
        result = true;
    }

    return result;
}

/**
 * Validates a string against a RegEx pattern.
 *
 * @member DataModelValidator
 * @param {String} value (Value to be checked)
 * @param {String} pattern (RegEx Pattern to check value with)
 * @returns {Boolean} Result of validation
 */
function checkPattern(value, pattern) {
    var flag = false;
    if (value.search(pattern) !== -1) {
        flag = true;
    }

    return flag;
}

/**
 * Verifies that the value is a valid vocabulary member of the provided Vocab Type
 *
 * @member DataModelValidator
 * @param {String} type (Type of Element to be validated)
 * @param {String} value (Value to be checked)
 * @param {String} vocab (Optional, can be the vocabulary type to be validated)
 * @returns {Boolean} Result of validation
 */
function Validate(type, value, vocab) {
    var i;

    debugAdd('Validating DataType [' + type + ']...', kColor_Info);

    if (type === 'CMIVocabulary' && this.typeArray.hasOwnProperty(type)) {
        if (eval('this.typeArray.' + type + '.call(this, vocab, value)')) {
            return true;
        }
    }
    else {
        if (type instanceof Array) {
            for (i = 0; i < type.length; i++) {
                if (this.typeArray.hasOwnProperty(type[i])) {
                    if (eval('this.typeArray.' + type[i] + '.call(this, value)')) {
                        return true;
                    }
                }
            }
        }
        else {
            if (this.typeArray.hasOwnProperty(type)) {
                if (eval('this.typeArray.' + type + '.call(this, value)')) {
                    return true;
                }
            }
        }
    }

    return false;
}

/**
 * Provides a set of methods used to validate vocabulary members and CMI data types.
 *
 * @class DataModelValidator Class
 * @constructor
 */
function DataModelValidator() {
}

DataModelValidator.prototype.buildModeList = buildModeList;
DataModelValidator.prototype.buildStatusList = buildStatusList;
DataModelValidator.prototype.buildExitList = buildExitList;
DataModelValidator.prototype.buildCreditList = buildCreditList;
DataModelValidator.prototype.buildEntryList = buildEntryList;
DataModelValidator.prototype.buildTimeLimitActionList = buildTimeLimitActionList;
DataModelValidator.prototype.buildInteractionList = buildInteractionList;
DataModelValidator.prototype.buildResultList = buildResultList;
DataModelValidator.prototype.checkBlank = checkBlank;
DataModelValidator.prototype.checkBoolean = checkBoolean;
DataModelValidator.prototype.checkFeedback = checkFeedback;
DataModelValidator.prototype.checkString255 = checkString255;
DataModelValidator.prototype.checkString4096 = checkString4096;
DataModelValidator.prototype.checkScoreDecimal = checkScoreDecimal;
DataModelValidator.prototype.checkDecimal = checkDecimal;
DataModelValidator.prototype.checkVocabulary = checkVocabulary;
DataModelValidator.prototype.checkIdentifier = checkIdentifier;
DataModelValidator.prototype.checkInteger = checkInteger;
DataModelValidator.prototype.checkSInteger = checkSInteger;
DataModelValidator.prototype.checkTime = checkTime;
DataModelValidator.prototype.checkTimespan = checkTimespan;
DataModelValidator.prototype.checkPattern = checkPattern;
DataModelValidator.prototype.Validate = Validate;

DataModelValidator.prototype.vocabulary = {
    'Mode':buildModeList(),
    'Status':buildStatusList(),
    'Exit':buildExitList(),
    'Credit':buildCreditList(),
    'Entry':buildEntryList(),
    'TimeLimitAction':buildTimeLimitActionList(),
    'Interaction':buildInteractionList(),
    'Result':buildResultList()
};

DataModelValidator.prototype.typeArray = {
    'CMIBlank':checkBlank,
    'CMIBoolean':checkBoolean,
    'CMIDecimal':checkDecimal,
    'CMIScore':checkScoreDecimal,
    'CMIFeedback':checkFeedback,
    'CMIIdentifier':checkIdentifier,
    'CMIInteger':checkInteger,
    'CMISInteger':checkSInteger,
    'CMIString255':checkString255,
    'CMIString4096':checkString4096,
    'CMITime':checkTime,
    'CMITimespan':checkTimespan,
    'CMIVocabulary':checkVocabulary
};
