const mockRedisClient = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  connect: jest.fn(),
};

export default mockRedisClient;
