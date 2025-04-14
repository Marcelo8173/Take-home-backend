import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from 'src/users/user.entity';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
