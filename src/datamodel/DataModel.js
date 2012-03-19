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
 * This script implements the Data Model.
 */

/**
 * Returns the default, empty Data Model for use in the script.
 *
 * @returns {Object} JSON Data Model
 * @member DataModel
 */
function getModel() {
    return {
        "cmi":{
            "_version":{
                "Value":"3.4",
                "Type":"CMIString255",
                "Vocab":"",
                "Read":true,
                "Write":false,
                "Mandatory":true,
                "Initialized":true,
                "Implemented":true
            },
            "core":{
                "_children":{
                    "Value":["student_id", "student_name", "lesson_location", "credit", "lesson_status", "entry", "score", "total_time", "lesson_mode", "exit", "session_time"],
                    "Type":"CMIString255",
                    "Vocab":"",
                    "Read":true,
                    "Write":false,
                    "Mandatory":true,
                    "Initialized":true,
                    "Implemented":true
                },
                "student_id":{
                    "Value":"",
                    "Type":"CMIIdentifier",
                    "Vocab":"",
                    "Read":true,
                    "Write":false,
                    "Mandatory":true,
                    "Initialized":false,
                    "Implemented":true
                },
                "student_name":{
                    "Value":"",
                    "Type":"CMIString255",
                    "Vocab":"",
                    "Read":true,
                    "Write":false,
                    "Mandatory":true,
                    "Initialized":false,
                    "Implemented":true
                },
                "lesson_location":{
                    "Value":"",
                    "Type":"CMIString255",
                    "Vocab":"",
                    "Read":true,
                    "Write":true,
                    "Mandatory":true,
                    "Initialized":true,
                    "Implemented":true
                },
                "credit":{
                    "Value":"",
                    "Type":"CMIVocabulary",
                    "Vocab":"Credit",
                    "Read":true,
                    "Write":false,
                    "Mandatory":true,
                    "Initialized":false,
                    "Implemented":true
                },
                "lesson_status":{
                    "Value":"not attempted",
                    "Type":"CMIVocabulary",
                    "Vocab":"Status",
                    "Read":true,
                    "Write":true,
                    "Mandatory":true,
                    "Initialized":false,
                    "Implemented":true
                },
                "entry":{
                    "Value":"ab-initio",
                    "Type":"CMIVocabulary",
                    "Vocab":"Entry",
                    "Read":true,
                    "Write":false,
                    "Mandatory":true,
                    "Initialized":true,
                    "Implemented":true
                },
                "score":{
                    "_children":{
                        "Value":["raw", "min", "max"],
                        "Type":"CMIString255",
                        "Vocab":"",
                        "Read":true,
                        "Write":false,
                        "Mandatory":true,
                        "Initialized":true,
                        "Implemented":true
                    },
                    "raw":{
                        "Value":"",
                        "Type":["CMIDecimal", "CMIBlank"],
                        "Vocab":"",
                        "Read":true,
                        "Write":true,
                        "Mandatory":true,
                        "Initialized":true,
                        "Implemented":true
                    },
                    "max":{
                        "Value":"",
                        "Type":["CMIDecimal", "CMIBlank"],
                        "Vocab":"",
                        "Read":true,
                        "Write":true,
                        "Mandatory":false,
                        "Initialized":true,
                        "Implemented":true
                    },
                    "min":{
                        "Value":"",
                        "Type":["CMIDecimal", "CMIBlank"],
                        "Vocab":"",
                        "Read":true,
                        "Write":true,
                        "Mandatory":false,
                        "Initialized":true,
                        "Implemented":true
                    }
                },
                "total_time":{
                    "Value":"0000:00:00.00",
                    "Type":"CMITimespan",
                    "Vocab":"",
                    "Read":true,
                    "Write":false,
                    "Mandatory":true,
                    "Initialized":true,
                    "Implemented":true
                },
                "lesson_mode":{
                    "Value":"",
                    "Type":"CMIVocabulary",
                    "Vocab":"Mode",
                    "Read":true,
                    "Write":false,
                    "Mandatory":false,
                    "Initialized":false,
                    "Implemented":true
                },
                "exit":{
                    "Value":"",
                    "Type":"CMIVocabulary",
                    "Vocab":"Exit",
                    "Read":false,
                    "Write":true,
                    "Mandatory":true,
                    "Initialized":false,
                    "Implemented":true
                },
                "session_time":{
                    "Value":"",
                    "Type":"CMITimespan",
                    "Vocab":"",
                    "Read":false,
                    "Write":true,
                    "Mandatory":true,
                    "Initialized":false,
                    "Implemented":true
                }
            },
            "suspend_data":{
                "Value":"",
                "Type":"CMIString4096",
                "Vocab":"",
                "Read":true,
                "Write":true,
                "Mandatory":true,
                "Initialized":true,
                "Implemented":true
            },
            "launch_data":{
                "Value":"",
                "Type":"CMIString4096",
                "Vocab":"",
                "Read":true,
                "Write":false,
                "Mandatory":true,
                "Initialized":false,
                "Implemented":true
            },
            "comments":{
                "Value":"",
                "Type":"CMIString4096",
                "Vocab":"",
                "Read":true,
                "Write":true,
                "Mandatory":false,
                "Initialized":true,
                "Implemented":true
            },
            "comments_from_lms":{
                "Value":"",
                "Type":"CMIString4096",
                "Vocab":"",
                "Read":true,
                "Write":false,
                "Mandatory":false,
                "Initialized":false,
                "Implemented":true
            },
            "objectives":{
                "_children":{
                    "Value":["id", "score", "status"],
                    "Type":"CMIString255",
                    "Vocab":"",
                    "Read":true,
                    "Write":false,
                    "Mandatory":false,
                    "Initialized":true,
                    "Implemented":true
                },
                "_count":{
                    "Value":"0",
                    "Type":"CMIInteger",
                    "Vocab":"",
                    "Read":true,
                    "Write":false,
                    "Mandatory":false,
                    "Initialized":true,
                    "Implemented":true
                },
                "Array":[
                    {
                        "id":{
                            "Value":"",
                            "Type":"CMIIdentifier",
                            "Vocab":"",
                            "Read":true,
                            "Write":true,
                            "Mandatory":false,
                            "Initialized":true,
                            "Implemented":true
                        },
                        "score":{
                            "_children":{
                                "Value":["raw", "min", "max"],
                                "Type":"CMIString255",
                                "Vocab":"",
                                "Read":true,
                                "Write":false,
                                "Mandatory":false,
                                "Initialized":true,
                                "Implemented":true
                            },
                            "raw":{
                                "Value":"",
                                "Type":["CMIDecimal", "CMIBlank"],
                                "Vocab":"",
                                "Read":true,
                                "Write":true,
                                "Mandatory":false,
                                "Initialized":true,
                                "Implemented":true
                            },
                            "max":{
                                "Value":"",
                                "Type":["CMIDecimal", "CMIBlank"],
                                "Vocab":"",
                                "Read":true,
                                "Write":true,
                                "Mandatory":false,
                                "Initialized":true,
                                "Implemented":true
                            },
                            "min":{
                                "Value":"",
                                "Type":["CMIDecimal", "CMIBlank"],
                                "Vocab":"",
                                "Read":true,
                                "Write":true,
                                "Mandatory":false,
                                "Initialized":true,
                                "Implemented":true
                            }
                        },
                        "status":{
                            "Value":"",
                            "Type":"CMIVocabulary",
                            "Vocab":"Status",
                            "Read":true,
                            "Write":true,
                            "Mandatory":false,
                            "Initialized":false,
                            "Implemented":true
                        }
                    }
                ]
            },
            "student_data":{
                "_children":{
                    "Value":["mastery_score", "max_time_allowed", "time_limit_action"],
                    "Type":"CMIString255",
                    "Vocab":"",
                    "Read":true,
                    "Write":false,
                    "Mandatory":false,
                    "Initialized":true,
                    "Implemented":true
                },
                "mastery_score":{
                    "Value":"",
                    "Type":"CMIDecimal",
                    "Vocab":"",
                    "Read":true,
                    "Write":false,
                    "Mandatory":false,
                    "Initialized":false,
                    "Implemented":true
                },
                "max_time_allowed":{
                    "Value":"",
                    "Type":"CMITimespan",
                    "Vocab":"",
                    "Read":true,
                    "Write":false,
                    "Mandatory":false,
                    "Initialized":false,
                    "Implemented":true
                },
                "time_limit_action":{
                    "Value":"",
                    "Type":"CMIVocabulary",
                    "Vocab":"Time Limit Action",
                    "Read":true,
                    "Write":false,
                    "Mandatory":false,
                    "Initialized":false,
                    "Implemented":true
                }
            },
            "student_preference":{
                "_children":{
                    "Value":["audio", "language", "speed", "text"],
                    "Type":"CMIString255",
                    "Vocab":"",
                    "Read":true,
                    "Write":false,
                    "Mandatory":false,
                    "Initialized":true,
                    "Implemented":true
                },
                "audio":{
                    "Value":"0",
                    "Type":"CMISInteger",
                    "Vocab":"",
                    "Read":true,
                    "Write":true,
                    "Mandatory":false,
                    "Initialized":true,
                    "Implemented":true
                },
                "language":{
                    "Value":"",
                    "Type":"CMIString255",
                    "Vocab":"",
                    "Read":true,
                    "Write":true,
                    "Mandatory":false,
                    "Initialized":true,
                    "Implemented":true
                },
                "speed":{
                    "Value":"0",
                    "Type":"CMISInteger",
                    "Vocab":"",
                    "Read":true,
                    "Write":true,
                    "Mandatory":false,
                    "Initialized":true,
                    "Implemented":true
                },
                "text":{
                    "Value":"0",
                    "Type":"CMISInteger",
                    "Vocab":"",
                    "Read":true,
                    "Write":true,
                    "Mandatory":false,
                    "Initialized":true,
                    "Implemented":true
                }
            },
            "interactions":{
                "_children":{
                    "Value":["id", "objectives", "time", "type", "correct_responses", "weighting", "student_response", "result", "latency"],
                    "Type":"CMIString255",
                    "Vocab":"",
                    "Read":true,
                    "Write":false,
                    "Mandatory":false,
                    "Initialized":true,
                    "Implemented":true
                },
                "_count":{
                    "Value":"0",
                    "Type":"CMIInteger",
                    "Vocab":"",
                    "Read":true,
                    "Write":false,
                    "Mandatory":false,
                    "Initialized":true,
                    "Implemented":true
                },
                "Array":[
                    {
                        "id":{
                            "Value":"",
                            "Type":"CMIIdentifier",
                            "Vocab":"",
                            "Read":false,
                            "Write":true,
                            "Mandatory":false,
                            "Initialized":true,
                            "Implemented":true
                        },
                        "objectives":{
                            "_count":{
                                "Value":"0",
                                "Type":"CMIInteger",
                                "Vocab":"",
                                "Read":true,
                                "Write":false,
                                "Mandatory":false,
                                "Initialized":true,
                                "Implemented":true
                            },
                            "Array":[
                                {
                                    "id":{
                                        "Value":"",
                                        "Type":"CMIIdentifier",
                                        "Vocab":"",
                                        "Read":false,
                                        "Write":true,
                                        "Mandatory":false,
                                        "Initialized":true,
                                        "Implemented":true
                                    }
                                }
                            ]
                        },
                        "time":{
                            "Value":"",
                            "Type":"CMITime",
                            "Vocab":"",
                            "Read":false,
                            "Write":true,
                            "Mandatory":false,
                            "Initialized":false,
                            "Implemented":true
                        },
                        "type":{
                            "Value":"",
                            "Type":"CMIVocabulary",
                            "Vocab":"Interaction",
                            "Read":false,
                            "Write":true,
                            "Mandatory":false,
                            "Initialized":false,
                            "Implemented":true
                        },
                        "correct_responses":{
                            "_count":{
                                "Value":"0",
                                "Type":"CMIInteger",
                                "Vocab":"",
                                "Read":true,
                                "Write":false,
                                "Mandatory":false,
                                "Initialized":true,
                                "Implemented":true
                            },
                            "Array":[
                                {
                                    "pattern":{
                                        "Value":"",
                                        "Type":"CMIFeedback",
                                        "Vocab":"",
                                        "Read":false,
                                        "Write":true,
                                        "Mandatory":false,
                                        "Initialized":false,
                                        "Implemented":true
                                    }
                                }
                            ],
                            "weighting":{
                                "Value":"",
                                "Type":"CMIDecimal",
                                "Vocab":"",
                                "Read":false,
                                "Write":true,
                                "Mandatory":false,
                                "Initialized":false,
                                "Implemented":true
                            },
                            "student_response":{
                                "Value":"",
                                "Type":"CMIFeedback",
                                "Vocab":"",
                                "Read":false,
                                "Write":true,
                                "Mandatory":false,
                                "Initialized":false,
                                "Implemented":true
                            },
                            "result":{
                                "Value":"",
                                "Type":"CMIVocabulary",
                                "Vocab":"Result",
                                "Read":false,
                                "Write":true,
                                "Mandatory":false,
                                "Initialized":false,
                                "Implemented":true
                            },
                            "latency":{
                                "Value":"",
                                "Type":"CMITimespan",
                                "Vocab":"",
                                "Read":false,
                                "Write":true,
                                "Mandatory":false,
                                "Initialized":false,
                                "Implemented":true
                            }
                        }
                    }
                ]
            }
        }
    };
}

/**
 * Returns the Objectives Array object, which allows us to dynamically generate new elements in the Objectives array in CMI DataModel.
 *
 * @returns {Object} JSON Data Model
 * @member DataModel
 */
function getObjectivesArray() {
    return this.getModel().cmi.objectives.Array[0];
}

/**
 * Returns the Interactions Array object, which allows us to dynamically generate new elements in the Objectives array in CMI DataModel.
 *
 * @returns {Object} JSON Data Model
 * @member DataModel
 */
function getInteractionsArray() {
    return this.getModel().cmi.interactions.Array[0];
}

/**
 * Returns the Interactions/Objectives Array object, which allows us to dynamically generate new elements in the Objectives array in CMI DataModel.
 *
 * @returns {Object} JSON Data Model
 * @member DataModel
 */
function getInteractionsObjectivesArray() {
    return this.getModel().cmi.interactions.Array[0].objectives.Array[0];
}

/**
 * Returns the Interactions/Correct_Responses Array object, which allows us to dynamically generate new elements in the Objectives array in CMI DataModel.
 *
 * @returns {Object} JSON Data Model
 * @member DataModel
 */
function getInteractionsCorrectResponsesArray() {
    return this.getModel().cmi.interactions.Array[0].correct_responses.Array[0];
}

/**
 * Defines the DataModel object, which is a THING!
 *
 * @class DataModel Object
 * @constructor
 */
function DataModel() {
}

DataModel.prototype.getObjectivesArray = getObjectivesArray;
DataModel.prototype.getInteractionsArray = getInteractionsArray;
DataModel.prototype.getInteractionsObjectivesArray = getInteractionsObjectivesArray;
DataModel.prototype.getInteractionsCorrectResponsesArray = getInteractionsCorrectResponsesArray;
DataModel.prototype.getModel = getModel;

DataModel.prototype.arrayBuilder = {
    'cmi.objectives':getObjectivesArray(),
    'cmi.interactions':getInteractionsArray(),
    'cmi.interactions.objectives':getInteractionsObjectivesArray(),
    'cmi.interactions.correct_responses':getInteractionsCorrectResponsesArray()
};