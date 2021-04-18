import { ApiProperty } from '@nestjs/swagger';
import { Min, IsInt, IsUrl } from 'class-validator';

export class CreateBotDto {
    @ApiProperty()
    @IsInt()
    @Min(1)
    readonly amount?: number;

    @ApiProperty()
    @IsUrl()
    readonly url: string;
}
