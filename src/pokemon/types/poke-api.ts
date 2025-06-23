export type PokeAPIStatName =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed';

export type PokeAPIStats = {
  base_stat: number;
  stat: {
    name: string;
  };
};
