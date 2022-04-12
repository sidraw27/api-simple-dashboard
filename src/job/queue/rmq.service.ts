import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';

@Injectable()
export class RmqService implements OnApplicationBootstrap {
  constructor(@Inject('rmq-module') private readonly client: ClientProxy) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.client.connect();
  }

  public async produce(pattern: string, data: any) {
    return this.client.emit(pattern, data).pipe(timeout(3000));
  }
}
