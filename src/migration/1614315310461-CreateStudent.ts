import {MigrationInterface, Table, QueryRunner} from "typeorm";

export class CreateStudent1614313987385 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "student",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "first_name",
                    type: "varchar(50)",
                },
                {
                    name: "last_name",
                    type: "varchar(255)",
                },
                {
                    name: "year_of_admission",
                    type: "integer",
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("student");
    }

}
