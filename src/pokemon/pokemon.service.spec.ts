import { PokemonService } from './pokemon.service';

describe('PokemonService (integration)', () => {
  const pokemonService = new PokemonService();

  it('findPokemonByNameOrFail - valid pokemon name', async () => {
    // Given
    const pokemonName = 'bulbasaur';

    // When
    const pokemonStats =
      await pokemonService.findPokemonByNameOrFail(pokemonName);

    // Then
    expect(pokemonStats).toMatchObject({
      id: 1,
      name: 'bulbasaur',
      species: {
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
      },
      types: ['grass', 'poison'],
      weight: 69,
      height: 7,
    });
  });

  it('findPokemonByNameOrFail - non-existing pokemon name', async () => {
    // Given
    const pokemonName = 'bulba';

    // When + Then
    await expect(() =>
      pokemonService.findPokemonByNameOrFail(pokemonName),
    ).rejects.toThrow();
  });

  it('findPokemonByNameOrFail - 2nd generation pokemon name', async () => {
    // Given
    const pokemonName = 'togepi';

    // When + Then
    await expect(() =>
      pokemonService.findPokemonByNameOrFail(pokemonName),
    ).rejects.toThrow();
  });

  it('findPokemonByNameOrFail - valid pokemon name with stats', async () => {
    // Given
    const pokemonName = 'bulbasaur';

    // When
    const pokemonStats =
      await pokemonService.findPokemonByNameOrFail(pokemonName);

    // Then
    expect(pokemonStats).toStrictEqual({
      id: 1,
      name: 'bulbasaur',
      species: {
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
      },
      types: ['grass', 'poison'],
      weight: 69,
      height: 7,
      stats: {
        attack: 49,
        defense: 49,
        hp: 45,
        specialAttack: 65,
        specialDefense: 65,
        speed: 45,
      },
      same_type_average_stats: {
        attack: expect.closeTo(68.29),
        defense: expect.closeTo(62.45),
        hp: expect.closeTo(60.87),
        specialAttack: expect.closeTo(69.87),
        specialDefense: expect.closeTo(63.63),
        speed: expect.closeTo(59.29),
      },
    });
  });

  it('findPokemon - valid pokemon name', async () => {
    // Given
    const pokemonName = 'bulbasaur';

    // When
    const pokemonStats = await pokemonService.findPokemon(pokemonName);

    // Then
    expect(pokemonStats).toStrictEqual({
      id: 1,
      name: 'bulbasaur',
      species: {
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
      },
      types: ['grass', 'poison'],
      weight: 69,
      height: 7,
      stats: {
        attack: 49,
        defense: 49,
        hp: 45,
        specialAttack: 65,
        specialDefense: 65,
        speed: 45,
      },
    });
  });

  it('findPokemon - invalid pokemon name', async () => {
    // Given
    const pokemonName = 'bulba';

    // When + Then
    await expect(() =>
      pokemonService.findPokemon(pokemonName),
    ).rejects.toThrow();
  });

  it('findAveragedPokemonStats - one type', async () => {
    // Given
    const types = ['normal'];

    // When
    const averageStats = await pokemonService.findAveragedStatsForTypes(types);

    // Then
    expect(averageStats).toEqual({
      hp: expect.closeTo(78.68),
      attack: expect.closeTo(68.86),
      defense: expect.closeTo(53.55),
      specialAttack: expect.closeTo(51.27),
      specialDefense: expect.closeTo(59.86),
      speed: expect.closeTo(69.77),
    });
  });

  it('findAveragedPokemonStats - valid pokemon with two types', async () => {
    // Given
    const types = ['grass', 'poison'];

    // When
    const averageStats = await pokemonService.findAveragedStatsForTypes(types);

    // Then
    expect(averageStats).toEqual({
      attack: expect.closeTo(68.29),
      defense: expect.closeTo(62.45),
      hp: expect.closeTo(60.87),
      specialAttack: expect.closeTo(69.87),
      specialDefense: expect.closeTo(63.63),
      speed: expect.closeTo(59.29),
    });
  });
});
