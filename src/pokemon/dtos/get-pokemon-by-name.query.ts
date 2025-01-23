import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetPokemonByNameQuery {
  @ApiProperty({
    type: 'string',
    description:
      'pokemon name, must be exact and must be the name of a first-generation pokemon',
  })
  @IsString()
  name: string;
}
