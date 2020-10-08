const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const Alexa = require('ask-sdk');
let skill;

exports.handler = async function (event, context) {
    //console.log('REQUEST ' + JSON.stringify(event));
    if (!skill) {
        skill = Alexa.SkillBuilders.custom()
            .addErrorHandlers(ErrorHandler)
            .addRequestHandlers(
            LaunchRequestHandler,
            ProductsHandler
            // add custom Intent handlers
            ).create();
    }

    const response = await skill.invoke(event, context);
    //console.log('RESPONSE :' + JSON.stringify(response));
    return response;

    const LaunchRequestHandler = {
        canHandle(handlerInput) {
            return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
        },
        handle(handlerInput) {
            const speechText = 'Welcome to my Alexa app';
            return handlerInput.responseBuilder
                .speak(speechText)
                .withShouldEndSession(false)
                .getResponse();
        }
    };
};
const ErrorHandler = {
    canHandle(handlerInput) {
        return true;
    },
    handle(handlerInput, error) {
        console.log('Error handled: ' + JSON.stringify(error.message));
        // console.log('Original Request was:', JSON.stringify(handlerInput.requestEnvelope.request, null, 2));

        const speechText = 'Sorry, your skill encountered an error';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const ProductsHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Products';
    },
   async handle(handlerInput) {
        // invoke custom logic of the handler
        const price = Number(Alexa.getSlotValue(handlerInput.requestEnvelope, 'price'));
        let speechText = "none";
        try {
         let data = await ddb.get({
        TableName: "books",
        Key: {
            [book]: book
        }
    }).promise();
    speechText = "tu libro es" + data.Item.book;
} catch (err) {
    speechText = "no encuentro tu libro";
    // error handling goes here
};
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};
