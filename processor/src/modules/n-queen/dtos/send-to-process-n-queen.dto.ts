import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class SendToProcessNQueen {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @Min(4)
  numberOfQueens: number;
}
