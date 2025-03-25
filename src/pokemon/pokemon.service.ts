import { Injectable } from '@nestjs/common';
import got from 'got';
import { Pokemon } from './types/pokemon';
import { PokemonSpecies } from './types/species';

import { PokemonNotFoundError, UnexpectedError } from './types/error';

const POKEMON_API_URL = 'http://pokeapi.co/api/v2';
const FIRST_GENERATION_POKEMON_LAST_ID = 151;
@Injectable()
export class PokemonService {
  private readonly httpClient = got.extend({
    prefixUrl: POKEMON_API_URL,
    responseType: 'json',
    throwHttpErrors: false,
  });

  async findPokemonByNameOrFail(pokemonName: string): Promise<Pokemon> {
    try {
      return this.findPokemon(pokemonName);
    } catch (error) {
      if (error instanceof PokemonNotFoundError) {
        throw error;
      }

      throw new UnexpectedError(error);
    }
  }

  async findPokemon(pokemonName: string): Promise<Pokemon> {
    type GetPokemonResponse = {
      name: string;
      id: number;
      height: number;
      weight: number;
      types: { type: { name: string; url: string } }[];
      species: PokemonSpecies;
    };

    return this.httpClient
      .get(`pokemon/${pokemonName}`)
      .then((response) => response.body as unknown as GetPokemonResponse)
      .then(async (body) => {
        if (!body.id) {
          throw new PokemonNotFoundError(
            `No pokemon found for name '${pokemonName}'`,
          );
        }

        if (body.id > FIRST_GENERATION_POKEMON_LAST_ID) {
          throw new PokemonNotFoundError(
            `Pokemon '${pokemonName}' is not first-generation: ID ${body.id} > ${FIRST_GENERATION_POKEMON_LAST_ID}`,
          );
        }

        // remap PokeAPI stats to a 'PokemonSpecs' object
        return {
          name: body.name,
          id: body.id,
          height: body.height,
          weight: body.weight,
          types: body.types.map((type) => type.type.name),
          species: {
            name: body.species.name,
            url: body.species.url,
          },
        };
      });
  }
}
