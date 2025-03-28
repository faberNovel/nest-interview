import { Injectable } from '@nestjs/common';
import got from 'got';
import { Pokemon, PokemonWithStats, PokemonStats } from './types/pokemon';
import { PokemonSpecies } from './types/species';

import {
  PokemonNotFoundError,
  PokemonStatsNotFoundError,
  UnexpectedError,
} from './types/error';
import { PokeAPIStatName, PokeAPIStats } from './types/poke-api';

const POKEMON_API_URL = 'http://pokeapi.co/api/v2';
const FIRST_GENERATION_POKEMON_LAST_ID = 151;

@Injectable()
export class PokemonService {
  private readonly httpClient = got.extend({
    prefixUrl: POKEMON_API_URL,
    responseType: 'json',
    throwHttpErrors: false,
  });

  async findPokemonByNameOrFail(
    pokemonName: string,
  ): Promise<PokemonWithStats> {
    try {
      const pokemon = await this.findPokemon(pokemonName);

      return {
        ...pokemon,
        same_type_average_stats: await this.findAveragedStatsForTypes(
          pokemon.types,
        ),
      };
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
      stats: PokeAPIStats[];
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

        const { stats } = body;

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
          stats: {
            hp: this.extractStatFromResponse(stats, 'hp').base_stat,
            attack: this.extractStatFromResponse(stats, 'attack').base_stat,
            defense: this.extractStatFromResponse(stats, 'defense').base_stat,
            specialAttack: this.extractStatFromResponse(stats, 'special-attack')
              .base_stat,
            specialDefense: this.extractStatFromResponse(
              stats,
              'special-defense',
            ).base_stat,
            speed: this.extractStatFromResponse(stats, 'speed').base_stat,
          },
        };
      });
  }

  async findAveragedStatsForTypes(types: string[]): Promise<PokemonStats> {
    // Tips: Use this type

    // Tips:
    // Here are the steps to implement
    // - Step 1: Use route GET `type/${pokemonType}` to retrieve all pokemons of a given type (you can assume the response to be of the type below)
    //
    //           type GetPokemonTypeResponse = {
    //             pokemon: {
    //               pokemon: {
    //                 name: string;
    //                 url: string;
    //               };
    //             }[];
    //           };
    //
    // - Step 2: Retrieve each pokemon's id from the pokemon url contained in the previous response, e.g. 'https://pokeapi.co/api/v2/pokemon/1/' for Bulbasaur (id = 1)
    // - Step 3: Remove any non-first generation pokemon from the array of pokemons
    // - Step 4: Remove any duplicate in the array of pokemons
    // - Step 5: Get each pokemon's stats
    // - Step 6: Calculate and return the average stats

    type GetPokemonTypeResponse = {
      pokemon: {
        pokemon: {
          name: string;
          url: string;
        };
      }[];
    };

    // Step 1: Use route GET `type/${pokemonType}` to retrieve all pokemons of a given type
    const pokemonWithCommonTypes = await Promise.all(
      types.map((pokemonType) =>
        this.httpClient
          .get(`type/${pokemonType}`)
          .then(
            (response) => response.body as unknown as GetPokemonTypeResponse,
          ),
      ),
    );

    // Step 2: Remove any non-first generation pokemon from the array of pokemons
    const firstGenerationPokemons = pokemonWithCommonTypes.map(({ pokemon }) =>
      pokemon
        .map(({ pokemon }) => ({
          id: parseInt(
            pokemon.url
              .replace('https://pokeapi.co/api/v2/pokemon', '')
              .replaceAll('/', ''),
          ),
          name: pokemon.name,
        }))
        .filter((item) => item.id <= FIRST_GENERATION_POKEMON_LAST_ID),
    );

    // Step 3: Remove any duplicate in the array of pokemons
    const pokemonsWithoutDuplicates = firstGenerationPokemons
      .flat()
      .reduce((acc, current) => {
        if (!acc.some((item) => item.id === current.id)) {
          acc.push(current);
        }

        return acc.sort();
      }, []);

    // Step 4: Get each pokemon's stats
    const sameTypePokemonStats = await Promise.all(
      pokemonsWithoutDuplicates.map(({ name }) => this.findPokemon(name)),
    );

    // Step 5: Calculate average for each stats and return
    const numberOfSameTypePokemons = sameTypePokemonStats.length;

    return sameTypePokemonStats.reduce(
      (acc: PokemonStats, pokemon) => ({
        hp: acc.hp + pokemon.stats.hp / numberOfSameTypePokemons,
        attack: acc.attack + pokemon.stats.attack / numberOfSameTypePokemons,
        defense: acc.defense + pokemon.stats.defense / numberOfSameTypePokemons,
        specialAttack:
          acc.specialAttack +
          pokemon.stats.specialAttack / numberOfSameTypePokemons,
        specialDefense:
          acc.specialDefense +
          pokemon.stats.specialDefense / numberOfSameTypePokemons,
        speed: acc.speed + pokemon.stats.speed / numberOfSameTypePokemons,
      }),
      {
        hp: 0.0,
        attack: 0.0,
        defense: 0.0,
        specialAttack: 0.0,
        specialDefense: 0.0,
        speed: 0.0,
      },
    );
  }

  private extractStatFromResponse(
    stats: PokeAPIStats[],
    statName: PokeAPIStatName,
  ): PokeAPIStats {
    const match = stats.find(({ stat }) => stat.name === statName);

    if (!match) {
      throw new PokemonStatsNotFoundError(
        `No ${statName} stats found in stats=${JSON.stringify(stats)}`,
      );
    }

    return match;
  }
}
