import { SimpleRabbitMQClient } from '@gwl/simple-rabbitmq-client';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Constant objSimpleRabbitMQClient type SimpleRabbitMQClient
 */
const objSimpleRabbitMQClient: SimpleRabbitMQClient =
  SimpleRabbitMQClient.getInstance();

/**
 * This method is used tests whether the application is able to create & consume the messages.
 */
async function test() {
  try {
    await objSimpleRabbitMQClient.register();
    objSimpleRabbitMQClient.consumeMessage('tt_new', consumeFunction1);
  } catch (error) {
    console.error(error);
  }
}
/**
 * This method helps to positively acknowledge the message when it is correct & handled.
 * @param msg The message which is processed by the consumer.
 */
function consumeFunction1(msg: any) {
  //message is correct & it is handled
  //console.log('message is correct & it is handled.');
  objSimpleRabbitMQClient.ack(msg);
}

test();
