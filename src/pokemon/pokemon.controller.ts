import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetPokemonByNameQuery } from './dtos/get-pokemon-by-name.query';
import { GetPokemonByNameResponse } from './dtos/get-pokemon-by-name.response';
import { PokemonService } from './pokemon.service';
import { PokemonNotFoundError } from './types/error';
import { Pokemon } from './types/pokemon';

@Controller('pokemon')
@ApiTags('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

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
    @Query() { name }: GetPokemonByNameQuery,
  ): Promise<Pokemon> {
    try {
      return await this.pokemonService.findPokemonByNameOrFail(name);
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
