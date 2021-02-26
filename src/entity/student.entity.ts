import { Expose } from 'class-transformer';
import { IsInt, Length, Max, Min } from 'class-validator';
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Student extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Length(3, 50)
	@Expose()
	first_name: string;

	@Column()
	@Length(3, 255)
	@Expose()
	last_name: string;

	@Column()
	@IsInt()
	@Min(1900)
	@Max(2021)
	@Expose()
	year_of_admission: number;

	errors: Array<object>;

	@BeforeInsert()
	validade() {
		if (this.first_name) {
		} else {
			this.errors.push({ first_name: 'First name is required' });
		}
	}
}
