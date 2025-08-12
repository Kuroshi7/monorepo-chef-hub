import { Migration } from '@mikro-orm/migrations';

export class Migration20250812005032 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`user\` (\`id\` text not null, \`email\` text not null, \`password\` text not null, \`name\` text not null, \`created_at\` datetime not null, primary key (\`id\`));`);
    this.addSql(`create unique index \`user_email_unique\` on \`user\` (\`email\`);`);
  }

}
