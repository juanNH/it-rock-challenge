import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('roles')
export class RoleOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Index('UQ_roles_name', { unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  name!: string;
}
