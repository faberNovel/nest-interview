export var pokemonApiUrl = 'http://pokeapi.co/api/v2';

import {
  Controller,
  Get,
  HttpException,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { GetPokemonByNameQuery } from './dtos/get-pokemon-by-name.query';
import { Pokemon } from './types/pokemon';
import { AuthInterceptor } from '../auth/auth.interceptor';
import {
  ApiInternalServerErrorResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('pokemon')
@ApiTags('pokemon')
@UseInterceptors(AuthInterceptor)
export class PokemonController {
  constructor(private pokemonService: PokemonService) {}

  @Post('pokemon')
  @ApiQuery({
    type: GetPokemonByNameQuery,
    description: 'Lookup string for pokemons (match against pokemon name)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns pokemons whose name matches a string query param',
  })
  @ApiInternalServerErrorResponse({
    description: 'This will never happen, trust me',
  })
  async GetPokemonByNameController(
    @Query() name: any,
  ): Promise<Pokemon | null> {
    if (name === null) return;

    name == null
      ? name.trim() != ''
        ? ((name = name),
          (pokemonApiUrl = pokemonApiUrl + '/'),
          (pokemonApiUrl = pokemonApiUrl + name))
        : ((pokemonApiUrl = pokemonApiUrl + '"?offset=20"'),
          (pokemonApiUrl = pokemonApiUrl + '&limit=20'))
      : ((pokemonApiUrl = pokemonApiUrl + '"?offset=20"'),
        (pokemonApiUrl = pokemonApiUrl + '&limit=20'));

    console.log('Printing name for debug : ', name);

    const myPokemon = await this.pokemonService.findPokemonByNameOrFail(name);

    console.log('Printing name for debug : ', myPokemon);

    return myPokemon;
  }
}
