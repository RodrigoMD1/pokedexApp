import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';



@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit');
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////

  // *CREAR UN POKEMON NUEVO 
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {

      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  // *BUSCAR TODOS LOS POKEMON EN GENERAL
  async findAll(paginationDto: PaginationDto) {

    const { limit = this.defaultLimit, offset = 0 } = paginationDto

    return this.pokemonModel.find()
      .limit(limit) // esto permite solo llamar de a 5 pokemons 
      .skip(offset) // esto permite mostrar los siguiente 5 de la primer llamada 
      .sort({
        no: 1
      })
      .select('-__v');
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////

  // *BUSCAR UN POKEMON EN ESPECIFICO
  async findOne(term: string) {

    let pokemon: Pokemon

    // busqueda por numero de la base de datos K
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    }

    // MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term)
    }

    // Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() })
    }

    if (!pokemon) throw new NotFoundException(`Pokeon with id, name or no "${term}"not found`)

    return pokemon;
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////

  // *ACTUALIZAR ALGUN DATO DE LOS POKEMONS 
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {


    const pokemon = await this.findOne(term)
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();


    try {

      await pokemon.updateOne(updatePokemonDto)
      return { ...pokemon.toJSON(), ...updatePokemonDto };


    } catch (error) {
      this.handleExceptions(error);

    }

  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  // *ELIMINAR ALGUN POKEMON 
  async remove(id: string) {

    // const pokemon = await this.findOne(id); 
    //await pokemon.deleteOne();// esto para eliminar poniendo el nombere o numero o id 

    // return {id};

    //const result = await this.pokemonModel.findByIdAndDelete(id);

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id "${id}" not found `)

    return;
  }




  /////////////////////////////////////////////////////////////////////////////////////////////////////

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`) // este es por si se repite el mismo pokemon 
    }

    console.log(error);
    throw new InternalServerErrorException(`cant create Pokemon -check server logs`)

  }


}
