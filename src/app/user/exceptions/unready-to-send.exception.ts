/**
 * Thrown when user tries to create entity id map from the mixed id value,
 * but id value is a single value when entity requires multiple values.
 */
import { NotAcceptableException } from '@nestjs/common';

export class UnreadyToSendException extends NotAcceptableException {
  constructor() {
    super('Unready to send');
  }
}
