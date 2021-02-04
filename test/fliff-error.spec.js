import { FLIFFError } from '../lib/fliff-error';

describe('FLIFFError', () => {
  const fakeErrorMessage = 'Test FLIFFError message';
  let error;

  beforeAll(() => {
    error = new FLIFFError(fakeErrorMessage);
  });

  it('has correct instanceof', () => {
    expect(error instanceof Error).toEqual(true);
    expect(error instanceof FLIFFError).toEqual(true);
  });

  it('has correct message', () => {
    expect(error.message).toEqual(fakeErrorMessage);
  });
});
