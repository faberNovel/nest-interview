import { PokemonSpecies } from './species';

export type Pokemon = {
  name: string;
  id: number;
  height: number;
  weight: number;
  types: string[];
  species: PokemonSpecies;
};
