import { PokemonSpecies } from './species';

export type PokemonStats = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

export type Pokemon = {
  name: string;
  id: number;
  height: number;
  weight: number;
  types: string[];
  species: PokemonSpecies;
  stats: PokemonStats;
};

export type PokemonWithStats = {
  same_type_average_stats: PokemonStats;
} & Pokemon;
