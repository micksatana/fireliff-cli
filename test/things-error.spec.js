import { ThingsError } from '../lib/things-error';

describe('ThingsError', () => {
  const fakeErrorMessage = 'Test ThingsError message';
  const fakeResponse = {
    data: 'response data',
  };
  let error;

  beforeAll(() => {
    error = new ThingsError(fakeErrorMessage, fakeResponse);
  });

  it('has correct instanceof', () => {
    expect(error instanceof Error).toEqual(true);
    expect(error instanceof ThingsError).toEqual(true);
  });

  it('has correct message', () => {
    expect(error.message).toEqual(fakeErrorMessage);
  });

  it('has correct reponse', () => {
    expect(error.response).toEqual(fakeResponse);
  });
});
