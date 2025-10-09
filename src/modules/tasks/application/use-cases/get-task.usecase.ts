import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import * as taskRepositoryPort from '../../domain/repositories/task.repository.port';

@Injectable()
export class GetTaskUseCase {
  constructor(@Inject(taskRepositoryPort.TASK_REPOSITORY) private readonly repo: taskRepositoryPort.ITaskRepository) {}

  async execute(userId: string, id: string, role?: string) {
    const t = await this.repo.findById(id);
    if (!t) throw new NotFoundException('Task not found');
    if (t.userId !== userId && role !== 'admin') throw new ForbiddenException('Not allowed');
    return t;
  }
}
