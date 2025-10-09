import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITaskRepository } from '../../../domain/repositories/task.repository.port';
import { Task } from '../../../domain/entities/task';
import { TaskOrmEntity } from './task.orm-entity';
import { TaskMapper } from '../../mappers/task.mapper';

@Injectable()
export class TaskTypeormRepository implements ITaskRepository {
  constructor(@InjectRepository(TaskOrmEntity) private readonly repo: Repository<TaskOrmEntity>) {}

  async create(t: Task): Promise<Task> {
    const saved = await this.repo.save(TaskMapper.toOrm(t));
    return TaskMapper.toDomain(saved);
  }

  async update(t: Task): Promise<Task> {
    await this.repo.update({ id: t.id }, TaskMapper.toOrm(t));
    const refreshed = await this.repo.findOne({ where: { id: t.id } });
    return TaskMapper.toDomain(refreshed!);
  }

  delete(id: string): Promise<void> {
    return this.repo.delete({ id }).then(() => undefined);
  }

  async findById(id: string): Promise<Task | null> {
    const e = await this.repo.findOne({ where: { id } });
    return e ? TaskMapper.toDomain(e) : null;
  }

  async listByUser(
    userId: string,
    opts: { page: number; pageSize: number; priority?: 'low'|'medium'|'high'; completed?: boolean }
  ): Promise<{ data: Task[]; total: number }> {
    const qb = this.repo.createQueryBuilder('t').where('t.user_id = :userId', { userId });
    if (opts.priority) qb.andWhere('t.priority = :p', { p: opts.priority });
    if (opts.completed !== undefined) qb.andWhere('t.completed = :c', { c: opts.completed });
    const total = await qb.getCount();
    const dataE = await qb
      .orderBy('t.created_at', 'DESC')
      .skip((opts.page - 1) * opts.pageSize)
      .take(opts.pageSize)
      .getMany();
    return { data: dataE.map(TaskMapper.toDomain), total };
  }
}
