import { FLIFF } from '../lib/fliff';
import { FLIFFError } from '../lib/fliff-error';

describe('fliff token', () => {
    let fliff;

    beforeAll(() => {
        fliff = new FLIFF();
    });

    describe('when neither issue nor revoke', () => {
        const options = {};

        it('reject with error', async () => {
            await expect(fliff.token(options)).rejects.toEqual(new FLIFFError(FLIFF.ErrorMessages.TokenRequiredIssueOrRevoke));
        });

    });

});
