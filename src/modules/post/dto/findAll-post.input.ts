import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class FindAllPostInput {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @Field({ nullable: true })
  searchText?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  tagId?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @Field({ nullable: true })
  cursor?: string;
}
