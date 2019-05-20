import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    CatsModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.types.graphqls']
    })
  ],
  providers: [],
  exports: []
})
export class AppModule { }
