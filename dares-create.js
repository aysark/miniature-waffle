'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');
const stripe = require('stripe')('sk_test_BZr7uQghwHHcd0byARYMftwN');

module.exports = (event, callback) => {
  const data = JSON.parse(event.body);

  data.id = uuid.v1();
  data.updatedAt = new Date().getTime();

  const params = {
    TableName: 'dares',
    Item: data
  };

  return dynamoDb.put(params, (error, data) => {
    if (error) {
      callback(error);
    }
    console.log("params:");
    console.info(params.Item);

    stripe.charges.create({
       amount: 500,
       currency: "usd",
       source: params.Item.token.id
    }, function(err, charge) {
      if(err){
        callback(err);
        return;
      }
      callback(error, params.Item);
    });
  });
};
