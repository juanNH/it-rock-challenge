import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1759987209913 implements MigrationInterface {
    name = 'Auto1759987209913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL, "title" character varying(150) NOT NULL, "description" character varying(2000) NOT NULL DEFAULT '', "completed" boolean NOT NULL DEFAULT false, "priority" character varying(10) NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_tasks_completed" ON "tasks" ("completed") `);
        await queryRunner.query(`CREATE INDEX "IDX_tasks_priority" ON "tasks" ("priority") `);
        await queryRunner.query(`CREATE INDEX "IDX_tasks_user" ON "tasks" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_db55af84c226af9dce09487b61b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_db55af84c226af9dce09487b61b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_tasks_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_tasks_priority"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_tasks_completed"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
    }

}
