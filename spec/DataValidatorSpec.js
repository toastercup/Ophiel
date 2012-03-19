/// <reference path="../lib/json.js"/>
/// <reference path="../src/Tools.js"/>
/// <reference path="../src/datamodel/Element.js"/>
/// <reference path="../src/datamodel/DataModelValidator.js"/>
/// <reference path="../src/datamodel/cmi/CMIRequest.js"/>
/// <reference path="../src/datamodel/DataManager.js"/>
/// <reference path="../lib/jasmine-1.1.0/jasmine.js"/>

var VocabTestMode, mValidatorInstance, mApiInstance, mInitReturnedResult, VocabTestEntry, VocabTestInteraction;
kDebug = false;

describe("SCORM API", function () {
    beforeEach(function () {
        mApiInstance = new apiClass();
        mInitReturnedResult = mApiInstance.LMSInitialize(kEmptyString);
        VocabTestMode = 'Mode';
        VocabTestEntry = 'Entry';
        VocabTestInteraction = 'Interaction';
        mValidatorInstance = new DataModelValidator();
    });

    describe("LMSInitialize (We are already initialized on startup of Unit Tester)", function () {
        it("should return CMIBoolean('false') if parameter is not '' or NULL", function () {
            expect(mApiInstance.LMSInitialize('rurur')).toEqual("false");
        });

        it("should return CMIBoolean('false') if parameter is '' and you are attempting to re-initialize", function () {
            expect(mApiInstance.LMSInitialize('')).toEqual("false");
        });

        it("should return CMIBoolean('false') if parameter is NULL and you are attempting to re-initialize", function () {
            expect(mApiInstance.LMSInitialize()).toEqual("false");
        });
    });

    describe("LMSGetErrorString", function () {
        it("should be able to return an Error String for Error Code #0", function () {
            expect(mApiInstance.LMSGetErrorString('0')).toEqual("No error");
        });

        it("should be able to return an Error String for Error Code #101", function () {
            expect(mApiInstance.LMSGetErrorString('101')).toEqual("General exception");
        });

        it("should be able to return an Error String for Error Code #201", function () {
            expect(mApiInstance.LMSGetErrorString('201')).toEqual("Invalid argument error");
        });

        it("should return a blank value for Error Code #333", function () {
            expect(mApiInstance.LMSGetErrorString('333')).toEqual("");
        });
    });

    describe("LMSSetValue", function () {
        it("should be able to set a value for 'cmi.interactions.1.correct_responses.1.pattern'", function () {
            expect(mApiInstance.LMSSetValue('cmi.interactions.1.correct_responses.1.pattern', '44')).toEqual("true");
        });
    });

    describe("LMSGetValue", function () {
        it("should be able to retrieve cmi's _version", function () {
            expect(mApiInstance.LMSGetValue('cmi._version')).toEqual("3.4");
        });
    });
});

describe("DataModelValidator", function () {
    beforeEach(function () {
        mApiInstance = new apiClass();
        mInitReturnedResult = mApiInstance.LMSInitialize(kEmptyString);
        VocabTestMode = 'Mode';
        VocabTestEntry = 'Entry';
        VocabTestInteraction = 'Interaction';
        mValidatorInstance = new DataModelValidator();
    });

    describe("Validate", function () {
        it("should be able to Validate('CMIVocabulary', 'ab-initio', 'Entry') as True", function () {
            expect(mValidatorInstance.Validate('CMIVocabulary', 'ab-initio', 'Entry')).toBeTruthy();
        });

        it("should be able to Validate('CMIVocabulary', 'abc', 'Entry') as False", function () {
            expect(mValidatorInstance.Validate('CMIVocabulary', 'abc', 'Entry')).toBeFalsy();
        });

        it("should be able to Validate('CMIVocabulary', 'ab-initio', 'FakeVocab') as False", function () {
            expect(mValidatorInstance.Validate('CMIVocabulary', 'ab-initio', 'FakeVocab')).toBeFalsy();
        });
    });

    describe("CMIDecimal", function () {
        it("should be able to validate a CMIDecimal('5.0') as True", function () {
            expect(mValidatorInstance.checkDecimal('5.0')).toBeTruthy();
        });

        it("should be able to validate a CMIDecimal('abc') as False", function () {
            expect(mValidatorInstance.checkDecimal('abc')).toBeFalsy();
        });

        it("should be able to validate a CMIDecimal('5.') as False", function () {
            expect(mValidatorInstance.checkDecimal('5.')).toBeFalsy();
        });
    });

    describe("CMIScore", function () {
        it("should be able to validate a CMIScore('101.0') as False", function () {
            expect(mValidatorInstance.checkScoreDecimal('101.0')).toBeFalsy();
        });

        it("should be able to validate a CMIScore('-1') as False", function () {
            expect(mValidatorInstance.checkScoreDecimal('-1')).toBeFalsy();
        });

        it("should be able to validate a CMIScore('90') as True", function () {
            expect(mValidatorInstance.checkScoreDecimal('90')).toBeTruthy();
        });
    });

    describe("CMIBoolean", function () {
        it("should be able to validate a CMIBoolean('true') as True", function () {
            expect(mValidatorInstance.checkBoolean('true')).toBeTruthy();
        });

        it("should be able to validate a CMIBoolean('false') as True", function () {
            expect(mValidatorInstance.checkBoolean('false')).toBeTruthy();
        });

        it("should be able to validate a CMIBoolean('FaLsE') as False", function () {
            expect(mValidatorInstance.checkBoolean('FaLsE')).toBeFalsy();
        });
    });

    describe("CMIInteger", function () {
        it("should be able to validate a CMIInteger('5') as True", function () {
            expect(mValidatorInstance.checkInteger('5')).toBeTruthy();
        });

        it("should be able to validate a CMIInteger(0) as True", function () {
            expect(mValidatorInstance.checkInteger(0)).toBeTruthy();
        });

        it("should be able to validate a CMIInteger('-5') as False", function () {
            expect(mValidatorInstance.checkInteger('-5')).toBeFalsy();
        });

        it("should be able to validate a CMIInteger('65537') as False", function () {
            expect(mValidatorInstance.checkInteger('65537')).toBeFalsy();
        });

        it("should be able to validate a CMIInteger('65536') as True", function () {
            expect(mValidatorInstance.checkInteger('65536')).toBeTruthy();
        });

        it("should be able to validate a CMIInteger(5.1) as False", function () {
            expect(mValidatorInstance.checkInteger(5.1)).toBeFalsy();
        });

        it("should be able to validate a CMIInteger('Golem') as False", function () {
            expect(mValidatorInstance.checkInteger('Golem')).toBeFalsy();
        });
    });

    describe("CMISInteger", function () {
        it("should be able to validate a CMISInteger('5') as True", function () {
            expect(mValidatorInstance.checkSInteger('5')).toBeTruthy();
        });

        it("should be able to validate a CMISInteger(0) as True", function () {
            expect(mValidatorInstance.checkSInteger(0)).toBeTruthy();
        });

        it("should be able to validate a CMISInteger('-5') as True", function () {
            expect(mValidatorInstance.checkSInteger('-5')).toBeTruthy();
        });

        it("should be able to validate a CMISInteger('32768') as True", function () {
            expect(mValidatorInstance.checkSInteger('32768')).toBeTruthy();
        });

        it("should be able to validate a CMISInteger('-32768') as True", function () {
            expect(mValidatorInstance.checkSInteger('-32768')).toBeTruthy();
        });

        it("should be able to validate a CMISInteger('-32769') as False", function () {
            expect(mValidatorInstance.checkSInteger('-32769')).toBeFalsy();
        });

        it("should be able to validate a CMISInteger('32769') as False", function () {
            expect(mValidatorInstance.checkSInteger('32769')).toBeFalsy();
        });

        it("should be able to validate a CMISInteger('65000') as False", function () {
            expect(mValidatorInstance.checkSInteger('65000')).toBeFalsy();
        });

        it("should be able to validate a CMISInteger(5.1) as False", function () {
            expect(mValidatorInstance.checkSInteger(5.1)).toBeFalsy();
        });

        it("should be able to validate a CMISInteger('Golem') as False", function () {
            expect(mValidatorInstance.checkSInteger('Golem')).toBeFalsy();
        });
    });

    describe("CMITime", function () {
        it("should be able to validate a CMITime('1234:34:56.78') as False", function () {
            expect(mValidatorInstance.checkTime('1234:34:56.78')).toBeFalsy();
        });

        it("should be able to validate a CMITime('12:34:56.78') as True", function () {
            expect(mValidatorInstance.checkTime('12:34:56.78')).toBeTruthy();
        });

        it("should be able to validate a CMITime('12:345:56.78') as False", function () {
            expect(mValidatorInstance.checkTime('12:345:56.78')).toBeFalsy();
        });

        it("should be able to validate a CMITime('12:34:56.789') as False", function () {
            expect(mValidatorInstance.checkTime('12:34:56.789')).toBeFalsy();
        });

        it("should be able to validate a CMITime('1:34:56.78') as False", function () {
            expect(mValidatorInstance.checkTime('1:34:56.78')).toBeFalsy();
        });

        it("should be able to validate a CMITime('12:3:56.78') as False", function () {
            expect(mValidatorInstance.checkTime('12:3:56.78')).toBeFalsy();
        });

        it("should be able to validate a CMITime('12:34:5.78') as False", function () {
            expect(mValidatorInstance.checkTime('12:34:5.78')).toBeFalsy();
        });

        it("should be able to validate a CMITime('24:34:56.78') as False", function () {
            expect(mValidatorInstance.checkTime('24:34:56.78')).toBeFalsy();
        });

        it("should be able to validate a CMITime('12:34:56') as True", function () {
            expect(mValidatorInstance.checkTime('12:34:56')).toBeTruthy();
        });

        it("should be able to validate a CMITime('12:34') as False", function () {
            expect(mValidatorInstance.checkTime('12:34')).toBeFalsy();
        });

        it("should be able to validate a CMITime('5') as False", function () {
            expect(mValidatorInstance.checkTime('5')).toBeFalsy();
        });

        it("should be able to validate a CMITime('bogus') as False", function () {
            expect(mValidatorInstance.checkTime('bogus')).toBeFalsy();
        });
    });

    describe("CMITimespan", function () {
        it("should be able to validate a CMITimespan('1234:34:56.78') as True", function () {
            expect(mValidatorInstance.checkTimespan('1234:34:56.78')).toBeTruthy();
        });

        it("should be able to validate a CMITimespan('12:34:56.78') as True", function () {
            expect(mValidatorInstance.checkTimespan('12:34:56.78')).toBeTruthy();
        });

        it("should be able to validate a CMITimespan('12:345:56.78') as False", function () {
            expect(mValidatorInstance.checkTimespan('12:345:56.78')).toBeFalsy();
        });

        it("should be able to validate a CMITimespan('12:34:56') as True", function () {
            expect(mValidatorInstance.checkTimespan('12:34:56')).toBeTruthy();
        });

        it("should be able to validate a CMITimespan('12:34') as False", function () {
            expect(mValidatorInstance.checkTimespan('12:34')).toBeFalsy();
        });

        it("should be able to validate a CMITimespan('5') as False", function () {
            expect(mValidatorInstance.checkTimespan('5')).toBeFalsy();
        });

        it("should be able to validate a CMITimespan('bogus') as False", function () {
            expect(mValidatorInstance.checkTimespan('bogus')).toBeFalsy();
        });
    });

    describe("CMIString255", function () {
        it("should be able to validate a CMIString255('Short String') as True", function () {
            expect(mValidatorInstance.checkString255('Short String')).toBeTruthy();
        });

        it("should be able to validate a CMIString255(LongString) (a String > 255 chars) as False", function () {
            expect(mValidatorInstance.checkString255('LongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongString')).toBeFalsy();
        });

        it("should be able to validate a CMIString255(false) as False", function () {
            expect(mValidatorInstance.checkString255(false)).toBeFalsy();
        });
    });

    describe("CMIString4096", function () {
        it("should be able to validate a CMIString4096('Short String') as True", function () {
            expect(mValidatorInstance.checkString4096('Short String')).toBeTruthy();
        });

        it("should be able to validate a CMIString4096(LongString) (a String > 255 but < 4096 chars) as True", function () {
            expect(mValidatorInstance.checkString4096('LongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongString')).toBeTruthy();
        });

        it("should be able to validate a CMIString4096(LongerString) (a String > 4096 chars) as False", function () {
            expect(mValidatorInstance.checkString4096('LongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongStringLongString')).toBeFalsy();
        });

        it("should be able to validate a CMIString4096(false) as False", function () {
            expect(mValidatorInstance.checkString4096(false)).toBeFalsy();
        });
    });

    describe("CMIVocabulary (Needs more test cases)", function () {
        describe("Mode Vocabulary", function () {
            it("should be able to validate a CMIVocabulary('') as False", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestMode, '')).toBeFalsy();
            });

            it("should be able to validate a CMIVocabulary('normal') as True", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestMode, 'normal')).toBeTruthy();
            });

            it("should be able to validate a CMIVocabulary('review') as True", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestMode, 'review')).toBeTruthy();
            });

            it("should be able to validate a CMIVocabulary('browse') as True", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestMode, 'browse')).toBeTruthy();
            });

            it("should be able to validate a CMIVocabulary('bogus') as False", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestMode, 'bogus')).toBeFalsy();
            });
        });

        describe("Entry Vocabulary", function () {
            it("should be able to validate a CMIVocabulary('') as True", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestEntry, '')).toBeTruthy();
            });

            it("should be able to validate a CMIVocabulary('ab-initio') as True", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestEntry, 'ab-initio')).toBeTruthy();
            });

            it("should be able to validate a CMIVocabulary('resume') as True", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestEntry, 'resume')).toBeTruthy();
            });

            it("should be able to validate a CMIVocabulary('bogus') as False", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestEntry, 'bogus')).toBeFalsy();
            });
        });

        describe("Interaction Vocabulary", function () {
            it("should be able to validate a CMIVocabulary('') as False", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestInteraction, '')).toBeFalsy();
            });

            it("should be able to validate a CMIVocabulary('true-false') as True", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestInteraction, 'true-false')).toBeTruthy();
            });

            it("should be able to validate a CMIVocabulary('choice') as True", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestInteraction, 'choice')).toBeTruthy();
            });

            it("should be able to validate a CMIVocabulary('fill-in') as True", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestInteraction, 'fill-in')).toBeTruthy();
            });

            it("should be able to validate a CMIVocabulary('matching') as True", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestInteraction, 'matching')).toBeTruthy();
            });

            it("should be able to validate a CMIVocabulary('performance') as True", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestInteraction, 'performance')).toBeTruthy();
            });

            it("should be able to validate a CMIVocabulary('likert') as True", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestInteraction, 'likert')).toBeTruthy();
            });

            it("should be able to validate a CMIVocabulary('sequencing') as True", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestInteraction, 'sequencing')).toBeTruthy();
            });

            it("should be able to validate a CMIVocabulary('numeric') as True", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestInteraction, 'numeric')).toBeTruthy();
            });

            it("should be able to validate a CMIVocabulary('bogus') as False", function () {
                expect(mValidatorInstance.checkVocabulary(VocabTestInteraction, 'bogus')).toBeFalsy();
            });
        });
    });
});