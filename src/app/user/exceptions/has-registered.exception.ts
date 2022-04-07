/**
 * Thrown when user tries to create entity id map from the mixed id value,
 * but id value is a single value when entity requires multiple values.
 */
import { BadRequestException } from '@nestjs/common';

export class HasRegisteredException extends BadRequestException {
  constructor() {
    super('Has registered');
  }
}
