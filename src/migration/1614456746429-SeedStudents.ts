import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { StudentSeed } from './seeds/students.seed';

export class SeedStudents1614456746429 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const students = await getRepository('Student').save(StudentSeed);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
