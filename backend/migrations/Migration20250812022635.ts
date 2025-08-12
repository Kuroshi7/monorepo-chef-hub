import { Migration } from '@mikro-orm/migrations';

export class Migration20250812022635 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`product\` (\`id\` integer not null primary key autoincrement, \`name\` text not null, \`price\` real not null, \`category\` text check (\`category\` in ('comida', 'bebida', 'sobremesa')) not null);`);
  }

}
