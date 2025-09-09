import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user.module';
import { CategoryModule } from './category.module';
import { dataSourceOptions } from '../utils/data-source';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors'
import { ConfigModule } from '@nestjs/config'
import { FileModule } from './file.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // Automatically generates schema
      playground: true,
      // debug: true,
      csrfPrevention: false,
      formatError: (formattedError) => {

        if (formattedError.extensions.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED) {
          return {
            ...formattedError,
            message: formattedError.message.includes('Field') ?
              'Məlumatların hər biri daxil edilməyib' : formattedError.message.includes('Expected') ?
                'Validasiya zamanı xəta baş verdi' : 'Xəta baş verdi'
          }
        }
        return formattedError
      }
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    CategoryModule,
    FileModule
  ]
})
export class AppModule { }
