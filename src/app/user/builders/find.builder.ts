import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Provider, User } from '../../../database/entities';

export class FindBuilder {
  private options: FindOneOptions<User>;

  constructor(
    @InjectRepository(User)
    private readonly entity: Repository<User>,
  ) {
    this.flush();
  }

  public setUUID(uuid: string) {
    this.options.where = {
      uuid,
    };

    return this;
  }

  public setEmail(email: string) {
    this.options.relations.push('email');
    this.options.where = {
      email: {
        email,
      },
    };

    return this;
  }

  public setProvider(provider: Provider, providerId: string) {
    this.options.relations.push('oauthProvider');
    this.options.where = {
      oauthProvider: {
        provider,
        providerId,
      },
    };
  }

  public async execute(): Promise<User> {
    const { options } = this;

    this.flush();

    return this.entity.findOneOrFail(options);
  }

  private flush() {
    this.options = {
      select: ['id', 'uuid', 'name'],
      relations: ['password', 'loginType'],
      where: {},
    };
  }
}
