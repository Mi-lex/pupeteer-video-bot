import { ApiProperty } from '@nestjs/swagger';
import { Min, IsInt, IsUrl, IsOptional } from 'class-validator';

export class CreateBotDto {
    @ApiProperty()
    @IsOptional()
    @IsInt()
    @Min(1)
    readonly amount?: number;

    @ApiProperty()
    @IsUrl()
    readonly url: string;
}
