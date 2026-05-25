export const CryptoDigestAlgorithm = { SHA256: 'SHA-256' };

export const digestStringAsync = jest.fn(async (algorithm, input) => {

  return Buffer.from(input).toString('base64');
});
