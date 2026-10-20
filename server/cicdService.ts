import { eventBus } from './eventBus.ts';

export interface PipelineStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  durationSeconds: number;
  logs: string[];
}

export interface PipelineRun {
  runId: string;
  commitHash: string;
  commitMessage: string;
  author: string;
  branch: string;
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'success' | 'failed';
  stages: PipelineStage[];
  environment: 'production' | 'staging' | 'canary';
}

class CicdService {
  private runs: PipelineRun[] = [
    {
      runId: 'pipe_build_9482',
      commitHash: 'a7f3e19',
      commitMessage: 'feat(services): implement inter-service event bus and multilingual voice engine',
      author: 'Linh Ung Dev Team <dev@chualinhung.vn>',
      branch: 'main',
      startedAt: new Date(Date.now() - 720000).toISOString(),
      completedAt: new Date(Date.now() - 540000).toISOString(),
      status: 'success',
      environment: 'production',
      stages: [
        {
          id: 'stage_lint',
          name: '1. Code Lint & TypeCheck (tsc --noEmit)',
          status: 'success',
          durationSeconds: 14,
          logs: [
            '[lint] Running typescript strict compiler checks...',
            '[lint] Checked 48 files across server and client.',
            '[lint] 0 errors, 0 warnings found. Code style passed.'
          ]
        },
        {
          id: 'stage_test',
          name: '2. Unit & Integration Tests (Vitest & Supertest)',
          status: 'success',
          durationSeconds: 28,
          logs: [
            '[test] Running navigation Dijkstra pathfinding tests... PASS (12ms)',
            '[test] Testing Payment HMAC-SHA256 signature verification... PASS (8ms)',
            '[test] Testing Booking state machine (PENDING -> PAID)... PASS (15ms)',
            '[test] Testing Multilingual POI catalog fallback... PASS (6ms)',
            '[test] Test Suites: 6 passed, 6 total. Tests: 42 passed.'
          ]
        },
        {
          id: 'stage_security',
          name: '3. SAST Security & Dependency Audit (Trivy / Snyk)',
          status: 'success',
          durationSeconds: 19,
          logs: [
            '[security] Scanning container base images & node modules...',
            '[security] 0 critical vulnerabilities, 0 high vulnerabilities.',
            '[security] OWASP Top 10 API Security compliance verified.'
          ]
        },
        {
          id: 'stage_docker',
          name: '4. Multi-Stage Container Build (Docker & Buildx)',
          status: 'success',
          durationSeconds: 45,
          logs: [
            '[docker] Building multi-stage image asia-docker.pkg.dev/linhung/app:v2.4.1',
            '[docker] Stage 1/2: Builder (node:22-alpine) compiled assets.',
            '[docker] Stage 2/2: Distroless runner created (Image size: 84.2 MB).',
            '[docker] Pushed image digest: sha256:d894e63f91ba...'
          ]
        },
        {
          id: 'stage_canary',
          name: '5. Canary Deployment (10% Traffic on Cloud Run)',
          status: 'success',
          durationSeconds: 30,
          logs: [
            '[canary] Routing 10% traffic to revision linhung-prod-v2-4-1...',
            '[canary] Monitoring p99 latency (< 35ms) & error rate (0.00%).',
            '[canary] Automated health check passed: /api/health returned 200 OK.'
          ]
        },
        {
          id: 'stage_rollout',
          name: '6. Full Production Rollout (100% Zero-Downtime)',
          status: 'success',
          durationSeconds: 22,
          logs: [
            '[deploy] Scaling target replicas in GCP Cloud Run & GKE.',
            '[deploy] Traffic shifted: 100% to active revision.',
            '[deploy] Deployment completed successfully in 158 seconds.'
          ]
        }
      ]
    }
  ];

  public getRecentPipelines(): PipelineRun[] {
    return this.runs;
  }

  public triggerNewPipeline(options?: { branch?: string; commitMessage?: string }): PipelineRun {
    const runId = `pipe_build_${Math.floor(1000 + Math.random() * 9000)}`;
    const newRun: PipelineRun = {
      runId,
      commitHash: Math.random().toString(16).substring(2, 9),
      commitMessage: options?.commitMessage || 'chore: trigger automated release via CI/CD dashboard',
      author: 'DevOps Automated Pipeline <cicd@chualinhung.vn>',
      branch: options?.branch || 'main',
      startedAt: new Date().toISOString(),
      status: 'running',
      environment: 'production',
      stages: [
        {
          id: 'stage_lint',
          name: '1. Code Lint & TypeCheck',
          status: 'running',
          durationSeconds: 4,
          logs: ['[lint] Triggered: Verifying TypeScript definitions and formatting standards...']
        },
        {
          id: 'stage_test',
          name: '2. Unit & Integration Tests',
          status: 'pending',
          durationSeconds: 0,
          logs: ['[test] Queued: Waiting for lint stage completion...']
        },
        {
          id: 'stage_security',
          name: '3. Security Vulnerability Scan',
          status: 'pending',
          durationSeconds: 0,
          logs: ['[security] Queued...']
        },
        {
          id: 'stage_docker',
          name: '4. Multi-Stage Container Build',
          status: 'pending',
          durationSeconds: 0,
          logs: ['[docker] Queued...']
        },
        {
          id: 'stage_canary',
          name: '5. Canary Traffic Verification',
          status: 'pending',
          durationSeconds: 0,
          logs: ['[canary] Queued...']
        },
        {
          id: 'stage_rollout',
          name: '6. Zero-Downtime Production Rollout',
          status: 'pending',
          durationSeconds: 0,
          logs: ['[deploy] Queued...']
        }
      ]
    };

    this.runs.unshift(newRun);
    if (this.runs.length > 10) this.runs.pop();

    eventBus.publish('CicdService', 'CICD_PIPELINE_TRIGGERED', {
      runId,
      branch: newRun.branch,
      commitMessage: newRun.commitMessage
    }, {
      targetService: 'MetricsService',
      latencyMs: 15
    });

    // Simulate progressive execution
    setTimeout(() => {
      newRun.stages[0].status = 'success';
      newRun.stages[0].logs.push('[lint] All 48 TypeScript modules verified.');
      newRun.stages[1].status = 'running';
      newRun.stages[1].logs.push('[test] Running microservice integration tests...');
    }, 2000);

    setTimeout(() => {
      newRun.stages[1].status = 'success';
      newRun.stages[1].logs.push('[test] 42 tests passed in 18ms.');
      newRun.stages[2].status = 'success';
      newRun.stages[3].status = 'success';
      newRun.stages[4].status = 'success';
      newRun.stages[5].status = 'success';
      newRun.status = 'success';
      newRun.completedAt = new Date().toISOString();

      eventBus.publish('CicdService', 'CICD_PIPELINE_COMPLETED', {
        runId,
        status: 'success'
      }, {
        targetService: 'MetricsService',
        latencyMs: 18
      });
    }, 5000);

    return newRun;
  }
}

export const cicdService = new CicdService();
