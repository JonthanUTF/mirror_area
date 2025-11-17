import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('hooks')
export class HookProcessor {
  @Process('processHook')
  async handleProcessHook(job: Job) {
    const { areaId, actionData } = job.data;
    console.log(`Processing hook for area ${areaId}:`, actionData);
    
    // Execute the reactions for this area
    // This would call the appropriate service adapters
    
    return { success: true };
  }
}
