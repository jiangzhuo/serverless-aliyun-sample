import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import {
    Args,
    Mutation,
    Query,
    ResolveProperty,
    Resolver,
    Subscription,
} from '@nestjs/graphql';
// import { CatsGuard } from './cats.guard';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

const pubSub = new PubSub();

@Resolver('Cat')
export class CatsResolvers {
    constructor(private readonly catsService: CatsService) {}

    @Query('getCats')
    // @UseGuards(CatsGuard)
    async getCats() {
        return await this.catsService.findAll();
    }

    @ResolveProperty('color')
    getColor() {
        return 'black';
    }

    @ResolveProperty()
    weight() {
        return 5;
    }

    @Query('cat')
    async findOneById(
        @Args('id', ParseIntPipe)
            id: number,
    ): Promise<Cat> {
        return await this.catsService.findOneById(id);
    }

    @Mutation('createCat')
    async create(@Args() args: Cat): Promise<Cat> {
        const createdCat = await this.catsService.create(args);
        pubSub.publish('catCreated', { catCreated: createdCat });
        return createdCat;
    }

    @Subscription('catCreated')
    catCreated() {
        return pubSub.asyncIterator('catCreated');
    }
}
