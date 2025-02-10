import { Injectable } from '@nestjs/common';
import got, { Got } from 'got';
import { Pokemon } from './types/pokemon';
import { pokemonApiUrl } from './pokemon.controller';
import { PokemonSpecies } from './types/species';

@Injectable()
export class PokemonService {
  private httpClient: Got;
  constructor() {
    this.httpClient = got.extend({
      prefixUrl: pokemonApiUrl,
      responseType: 'json',
      throwHttpErrors: false,
    });
  }

  async findPokemonByNameOrFail(pokemonName: string): Promise<Pokemon> {
    type GetPokemonResponse = {
      name: string;
      id: number;
      height: number;
      weight: number;
      types: { type: { name: string; url: string } }[];
      species: PokemonSpecies;
    };

    return await this.httpClient
      .get(`pokemon/${pokemonName}`)
      .then((response) => response.body as unknown as GetPokemonResponse)
      .then((body) => {
        if (!body.id) {
          return null;
        }

        const types = body.types
          .map((type) => type.type)
          .map((type) => type.name);

        return {
          name: body.name,
          id: body.id,
          height: body.height,
          weight: body.weight,
          types,
          species: {
            name: body.species.name,
            url: body.species.url,
          },
        };
      })
      .catch((error) => {
        throw error;
      });
  }
}
