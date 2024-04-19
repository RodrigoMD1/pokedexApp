import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class Pokemon extends Document {
    // esto hace referencia a los datos que van a ingresar en la base de datos ejemplo nombre, stock , email etc
    // esto es el entity para verificar los datos que van a la base de datos mientras que el dto es validar los datos que uno sube en un formulario por ejemplo creo

    // id:string   mongo me lo da el id 

    @Prop({
        unique: true,
        index: true,
    })
    name: string;

    @Prop({
        unique: true,
        index: true,
    })
    no: number;
}


export const PokemonSchema = SchemaFactory.createForClass(Pokemon); 
