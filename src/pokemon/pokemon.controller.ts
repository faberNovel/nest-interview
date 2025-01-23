import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { GetPokemonByNameQuery } from './dtos/get-pokemon-by-name.query';
import { Pokemon } from './types/pokemon';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PokemonNotFoundError } from './types/error';
import { GetPokemonByNameResponse } from './dtos/get-pokemon-by-name.response';

@Controller('pokemon')
@ApiTags('pokemon')
export class PokemonController {
  constructor(private pokemonService: PokemonService) {}

  @Get('pokemon')
  @ApiQuery({
    type: GetPokemonByNameQuery,
    description: 'Lookup string for pokemons (match against pokemon name)',
  })
  @ApiResponse({
    status: 200,
    type: GetPokemonByNameResponse,
    description:
      'Returns a pokemon whose name exactly matches the string query param',
  })
  @ApiBadRequestResponse({
    description: 'Returned if query param "name" is empty',
  })
  @ApiNotFoundResponse({
    description:
      'Returned if no first-generation pokemon was found for this name',
  })
  @ApiInternalServerErrorResponse({
    description: 'Returned if any other error is encountered',
  })
  async GetPokemonByNameController(
    @Query('name') name: string,
  ): Promise<Pokemon> {
    try {
      if (name === undefined || name.length === 0) {
        throw new BadRequestException('Pokemon name cannot be empty');
      }

      const myPokemon = await this.pokemonService.findPokemonByNameOrFail(name);

      return myPokemon;
    } catch (error) {
      if (error instanceof PokemonNotFoundError) {
        throw new NotFoundException(error);
      } else if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
