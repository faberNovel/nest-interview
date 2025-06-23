import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

class PokemonSpeciesResponse {
  @ApiProperty({
    type: 'string',
    description: 'species name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'species URL',
  })
  @IsString()
  url: string;
}

export class GetPokemonByNameResponse {
  @ApiProperty({
    type: 'string',
    description: 'pokemon name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'number',
    description: 'pokemon ID (from 1 to 151)',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    type: 'number',
    description: 'height',
  })
  @IsNumber()
  height: number;

  @ApiProperty({
    type: 'number',
    description: 'weight',
  })
  @IsNumber()
  weight: number;

  @ApiProperty({
    type: [String],
    description: 'pokemon ID (from 1 to 151)',
  })
  @IsArray()
  @IsString({ each: true })
  types: string[];

  @ApiProperty({
    type: () => PokemonSpeciesResponse,
    description: 'pokemon species',
  })
  @Type(() => PokemonSpeciesResponse)
  species: PokemonSpeciesResponse;
}
