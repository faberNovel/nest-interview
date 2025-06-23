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
});
