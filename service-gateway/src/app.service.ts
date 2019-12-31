import { Injectable } from '@nestjs/common';
import { Tedis } from 'tedis';

@Injectable()
export class AppService {
    private tedis: Tedis;

    constructor() {
        this.tedis = new Tedis({
            host: 'data-redis',
            port: 6379,
        });
    }

    async exists(token: string): Promise<boolean> {
        const result = await this.tedis.exists(token);
        if (result === 1) {
            return true;
        } else {
            return false;
        }
    }
}
