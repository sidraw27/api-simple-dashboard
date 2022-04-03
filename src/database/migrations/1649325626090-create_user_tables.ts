import {MigrationInterface, QueryRunner} from "typeorm";

export class createUserTables1649325626090 implements MigrationInterface {
    name = 'createUserTables1649325626090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."uuid" IS 'use for hiding primary sequence.'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_951b8f1dfc94ac1d0301a14b7e" ON "users" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "user_emails" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "email" character varying(254) NOT NULL, "is_verify" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "REL_2e88b95787b903d46ab3cc3eb9" UNIQUE ("user_id"), CONSTRAINT "PK_3ef6c4be97ba94ea3ba65362ad0" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_emails"."email" IS 'https://www.ietf.org/rfc/rfc2821.txt'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6594597afde633cfeab9a806e4" ON "user_emails" ("email") `);
        await queryRunner.query(`CREATE TABLE "user_email_validate_tokens" ("id" SERIAL NOT NULL, "user_email_id" integer NOT NULL, "token" character(32) NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "expired_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ffdce229ebeb5e3592affd4a37e" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_email_validate_tokens"."token" IS 'hash'`);
        await queryRunner.query(`CREATE INDEX "IDX_9e8cbda5a36f329cf0f89e1275" ON "user_email_validate_tokens" ("user_email_id") `);
        await queryRunner.query(`CREATE TYPE "public"."user_login_types_type_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "user_login_types" ("user_id" integer NOT NULL, "type" "public"."user_login_types_type_enum" NOT NULL, CONSTRAINT "REL_58979227309651b9a68057b78f" UNIQUE ("user_id"), CONSTRAINT "PK_58979227309651b9a68057b78f4" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_oauth_providers_provider_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "user_oauth_providers" ("user_id" integer NOT NULL, "provider" "public"."user_oauth_providers_provider_enum" NOT NULL, "provider_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_8654b29b5b8234a8fe1297d1c7" UNIQUE ("user_id"), CONSTRAINT "PK_8654b29b5b8234a8fe1297d1c72" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1829469de37ff4cc183f3403de" ON "user_oauth_providers" ("provider", "provider_id") `);
        await queryRunner.query(`CREATE TABLE "user_passwords" ("user_id" integer NOT NULL, "password" character(60) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_69bf155ad044d776976470eb03" UNIQUE ("user_id"), CONSTRAINT "PK_69bf155ad044d776976470eb032" PRIMARY KEY ("user_id")); COMMENT ON COLUMN "user_passwords"."password" IS 'use bcrypt algorithms to hashing, salt rounds 10.'`);
        await queryRunner.query(`ALTER TABLE "user_emails" ADD CONSTRAINT "FK_2e88b95787b903d46ab3cc3eb91" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_email_validate_tokens" ADD CONSTRAINT "FK_9e8cbda5a36f329cf0f89e12756" FOREIGN KEY ("user_email_id") REFERENCES "user_emails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_login_types" ADD CONSTRAINT "FK_58979227309651b9a68057b78f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_oauth_providers" ADD CONSTRAINT "FK_8654b29b5b8234a8fe1297d1c72" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_passwords" ADD CONSTRAINT "FK_69bf155ad044d776976470eb032" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_passwords" DROP CONSTRAINT "FK_69bf155ad044d776976470eb032"`);
        await queryRunner.query(`ALTER TABLE "user_oauth_providers" DROP CONSTRAINT "FK_8654b29b5b8234a8fe1297d1c72"`);
        await queryRunner.query(`ALTER TABLE "user_login_types" DROP CONSTRAINT "FK_58979227309651b9a68057b78f4"`);
        await queryRunner.query(`ALTER TABLE "user_email_validate_tokens" DROP CONSTRAINT "FK_9e8cbda5a36f329cf0f89e12756"`);
        await queryRunner.query(`ALTER TABLE "user_emails" DROP CONSTRAINT "FK_2e88b95787b903d46ab3cc3eb91"`);
        await queryRunner.query(`DROP TABLE "user_passwords"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1829469de37ff4cc183f3403de"`);
        await queryRunner.query(`DROP TABLE "user_oauth_providers"`);
        await queryRunner.query(`DROP TYPE "public"."user_oauth_providers_provider_enum"`);
        await queryRunner.query(`DROP TABLE "user_login_types"`);
        await queryRunner.query(`DROP TYPE "public"."user_login_types_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e8cbda5a36f329cf0f89e1275"`);
        await queryRunner.query(`DROP TABLE "user_email_validate_tokens"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6594597afde633cfeab9a806e4"`);
        await queryRunner.query(`DROP TABLE "user_emails"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_951b8f1dfc94ac1d0301a14b7e"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
