import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetPokemonByNameQuery {
  @ApiProperty({ type: 'string' })
  @IsString()
  name: string;
}
