import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/infrastructure/security/jwt-auth.guard';
import { CreateTaskDto } from '../application/dto/create-task.dto';
import { UpdateTaskDto } from '../application/dto/update-task.dto';
import { QueryTaskDto } from '../application/dto/query-task.dto';
import { ListTasksUseCase } from '../application/use-cases/list-tasks.usecase';
import { CreateTaskUseCase } from '../application/use-cases/create-task.usecase';
import { GetTaskUseCase } from '../application/use-cases/get-task.usecase';
import { UpdateTaskUseCase } from '../application/use-cases/update-task.usecase';
import { DeleteTaskUseCase } from '../application/use-cases/delete-task.usecase';
import { PopulateTasksUseCase } from '../application/use-cases/populate-tasks.usecase';
import { PopulateQueryDto } from '../application/dto/populate-query.dto';
import { ApiKeyGuard } from './../../../common/guards/api-key.guard';

@ApiTags('tasks')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly listUC: ListTasksUseCase,
    private readonly createUC: CreateTaskUseCase,
    private readonly getUC: GetTaskUseCase,
    private readonly updateUC: UpdateTaskUseCase,
    private readonly deleteUC: DeleteTaskUseCase,
    private readonly populateUC: PopulateTasksUseCase,
  ) {}
  
  @Get('populate')
  @ApiOperation({ summary: 'Populate desde API externa (dedupe por externalId)' })
  @ApiSecurity('api-key')
  @UseGuards(ApiKeyGuard, JwtAuthGuard)
  populate(@Req() req: any, @Query() q: PopulateQueryDto) {
    return this.populateUC.execute(req.user.sub, q.limit);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tareas del usuario autenticado (cache 10 min)' })
  list(@Req() req: any, @Query() q: QueryTaskDto) {
    return this.listUC.execute(req.user.sub, q);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear tarea' })
  create(@Req() req: any, @Body() dto: CreateTaskDto) {
    return this.createUC.execute(req.user.sub, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea (debe ser del usuario o admin)' })
  getOne(@Req() req: any, @Param('id') id: string) {
    return this.getUC.execute(req.user.sub, id, req.user.role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tarea (solo dueño o admin)' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.updateUC.execute(req.user.sub, id, req.user.role, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tarea (dueño o admin)' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.deleteUC.execute(req.user.sub, id, req.user.role);
  }
  
}
