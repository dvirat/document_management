import { IsOptional, IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDocumentDto {
  @ApiProperty({ example: 'Updated Title', maxLength: 255, required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @IsNotEmpty()
  title?: string;

  @ApiProperty({ example: 'Updated content.', required: false })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  content?: string;
} 