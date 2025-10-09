export const tasksCacheVersionKey = (userId: string) => `tasks:v:${userId}`;
export const tasksCacheKey = (userId: string, version: string, q: any) =>
  `tasks:list:${userId}:v${version}:p${q.page}:s${q.pageSize}:prio${q.priority ?? 'any'}:done${q.completed ?? 'any'}`;
