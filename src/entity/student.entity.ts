import { Expose } from 'class-transformer';
import { IsInt, Length, Max, Min, IsDefined } from 'class-validator';
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Student extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Length(3, 50)
	@IsDefined()
	@Expose()
	first_name: string;

	@Column()
	@Length(3, 255)
	@IsDefined()
	@Expose()
	last_name: string;

	@Column()
	@IsInt()
	@Min(1900)
	@Max(new Date().getFullYear())
	@IsDefined()
	@Expose()
	year_of_admission: number;
}
