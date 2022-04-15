export class ProviderProfileDto {
  readonly id: string;

  readonly displayName: string;

  readonly emails: { value: string; verified: boolean }[];
}
