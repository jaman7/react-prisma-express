import { createClient } from 'redis';

const redisPublisher = createClient();
const redisSubscriber = createClient();

redisPublisher.connect();
redisSubscriber.connect();

export { redisPublisher, redisSubscriber };
