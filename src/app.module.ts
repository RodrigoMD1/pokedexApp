import { join } from 'path';  // en node 
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';





@Module({
  imports: [

    ConfigModule.forRoot({

      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }), // siempre al inicio esto

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    MongooseModule.forRoot(process.env.MONGODB,{
      dbName:'pokemonsdb'
    }),// CUIDADO CUANDO PONGO EL URL DE LA BASE DE DATOS POR TENER UN / DE MAS DABA ERRROR  EN .env esta la parte de mongo a eso cuidado en esa parte 

    PokemonModule, CommonModule, SeedModule
  ],

})
export class AppModule { }
