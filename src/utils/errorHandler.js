export class XMTPError extends Error {
  constructor(message, code, originalError) {
    super(message);
    this.name = 'XMTPError';
    this.code = code;
    this.originalError = originalError;
  }
}

export const handleXMTPError = (error) => {
  console.error('XMTP Error:', error);

  if (error.message.includes('rate limit')) {
    return new XMTPError('Too many requests. Please try again later.', 'RATE_LIMIT', error);
  }

  if (error.message.includes('network')) {
    return new XMTPError('Network error. Please check your connection.', 'NETWORK_ERROR', error);
  }

  if (error.message.includes('signature')) {
    return new XMTPError(
      'Signature required. Please approve the request.',
      'SIGNATURE_REQUIRED',
      error
    );
  }

  return new XMTPError('An unexpected error occurred.', 'UNKNOWN_ERROR', error);
};
