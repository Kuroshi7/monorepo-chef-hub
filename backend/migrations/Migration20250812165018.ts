import { Migration } from '@mikro-orm/migrations';

export class Migration20250812165018 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`order\` (\`id\` integer not null primary key autoincrement, \`total\` numeric(10,2) not null, \`payment_method\` text check (\`payment_method\` in ('pix', 'dinheiro', 'cartao')) not null, \`status\` text check (\`status\` in ('pendente', 'preparando', 'pronto', 'concluido')) not null default 'pendente', \`created_at\` datetime not null);`);

    this.addSql(`create table \`order_products\` (\`order_id\` integer not null, \`product_id\` integer not null, constraint \`order_products_order_id_foreign\` foreign key(\`order_id\`) references \`order\`(\`id\`) on delete cascade on update cascade, constraint \`order_products_product_id_foreign\` foreign key(\`product_id\`) references \`product\`(\`id\`) on delete cascade on update cascade, primary key (\`order_id\`, \`product_id\`));`);
    this.addSql(`create index \`order_products_order_id_index\` on \`order_products\` (\`order_id\`);`);
    this.addSql(`create index \`order_products_product_id_index\` on \`order_products\` (\`product_id\`);`);
  }

}
