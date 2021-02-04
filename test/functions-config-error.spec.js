import { FunctionsConfigError } from '../lib/functions-config-error';

describe('FunctionsConfigError', () => {
  const fakeErrorMessage = 'Test FunctionsConfigError message';
  let error;

  beforeAll(() => {
    error = new FunctionsConfigError(fakeErrorMessage);
  });

  it('has correct instanceof', () => {
    expect(error instanceof Error).toEqual(true);
    expect(error instanceof FunctionsConfigError).toEqual(true);
  });

  it('has correct message', () => {
    expect(error.message).toEqual(fakeErrorMessage);
  });
});
