import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskOrmEntity } from './persistence/typeorm/task.orm-entity';
import { TASK_REPOSITORY } from '../domain/repositories/task.repository.port';
import { TaskTypeormRepository } from './persistence/typeorm/task.typeorm.repository';
import { TasksController } from './tasks.controller';
import { ListTasksUseCase } from '../application/use-cases/list-tasks.usecase';
import { CreateTaskUseCase } from '../application/use-cases/create-task.usecase';
import { GetTaskUseCase } from '../application/use-cases/get-task.usecase';
import { UpdateTaskUseCase } from '../application/use-cases/update-task.usecase';
import { DeleteTaskUseCase } from '../application/use-cases/delete-task.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([TaskOrmEntity])],
  controllers: [TasksController],
  providers: [
    { provide: TASK_REPOSITORY, useClass: TaskTypeormRepository },
    ListTasksUseCase,
    CreateTaskUseCase,
    GetTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
  ],
})
export class TasksModule {}
