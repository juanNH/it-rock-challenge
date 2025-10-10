import { ExternalDataSource } from './../../../../../modules/tasks/domain/enums/data-source.enum';
import { UserOrmEntity } from './../../../../../modules/users/infrastructure/persistence/typeorm/user.orm-entity';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export type TaskPriority = 'low' | 'medium' | 'high';

@Entity('tasks')
@Index('IDX_tasks_user', ['userId'])
@Index('IDX_tasks_priority', ['priority'])
@Index('IDX_tasks_completed', ['completed'])
@Index('UQ_tasks_user_source_extid', ['userId','externalSource','externalId'], { unique: true })

export class TaskOrmEntity {
  @PrimaryColumn('uuid') id!: string;

  @Column({ type: 'varchar', length: 150 }) title!: string;

  @Column({ type: 'varchar', length: 2000, default: '' }) description!: string;

  @Column({ type: 'boolean', default: false }) completed!: boolean;

  @Column({ type: 'varchar', length: 10 }) priority!: TaskPriority;

  @Column({ name: 'user_id', type: 'uuid' }) userId!: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserOrmEntity;

   @Column({
    name: 'external_source',
    type: 'enum',
    enum: ExternalDataSource,
    enumName: 'external_source_enum',
    nullable: true,
  })
  externalSource?: ExternalDataSource | null;

  @Column({ name: 'external_id', type: 'varchar', nullable: true })
  externalId?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt!: Date;
}
