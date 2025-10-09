import { UserOrmEntity } from './../../../../../modules/users/infrastructure/persistence/typeorm/user.orm-entity';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export type TaskPriority = 'low' | 'medium' | 'high';

@Entity('tasks')
@Index('IDX_tasks_user', ['userId'])
@Index('IDX_tasks_priority', ['priority'])
@Index('IDX_tasks_completed', ['completed'])
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

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt!: Date;
}
