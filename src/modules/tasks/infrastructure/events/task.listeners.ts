// src/modules/tasks/infrastructure/events/task.listeners.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import * as taskEvents from '../../domain/events/task.events';

@Injectable()
export class TaskEventsListener {
  constructor(@InjectPinoLogger(TaskEventsListener.name) private readonly logger: PinoLogger) {}

  @OnEvent(taskEvents.TASK_CREATED, { async: true })
  handleTaskCreated(payload: taskEvents.TaskCreatedEvent) {
    this.logger.info({ event: 'TASK_CREATED', ...payload }, 'Task created');
  }

  @OnEvent(taskEvents.TASK_COMPLETED, { async: true })
  handleTaskCompleted(payload: taskEvents.TaskCompletedEvent) {
    this.logger.info({ event: 'TASK_COMPLETED', ...payload }, 'Task completed');
  }
}
