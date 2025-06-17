import {
  SimpleMessage,
  SimpleRabbitMQClient,
} from '@gwl/simple-rabbitmq-client';
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
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function test() {
  try {
    await objSimpleRabbitMQClient.register();
    const objSimpleMessage1 = new SimpleMessage(
      'tt_exchange',
      'message from dd',
    );
    objSimpleMessage1.send('tt_key');
  } catch (error) {
    console.error(error);
  }
}

test();
