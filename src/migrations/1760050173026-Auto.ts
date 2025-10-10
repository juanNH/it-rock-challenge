import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1760050173026 implements MigrationInterface {
    name = 'Auto1760050173026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."external_source_enum" AS ENUM('jsonplaceholder')`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "external_source" "public"."external_source_enum"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "external_id" character varying`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_tasks_user_source_extid" ON "tasks" ("user_id", "external_source", "external_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."UQ_tasks_user_source_extid"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "external_id"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "external_source"`);
        await queryRunner.query(`DROP TYPE "public"."external_source_enum"`);
    }

}
