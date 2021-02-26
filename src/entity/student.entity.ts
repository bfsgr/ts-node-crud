import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		length: 50,
	})
	first_name: string;

	@Column({
		length: 255,
	})
	last_name: string;

	@Column()
	year_of_admission: number;
}
