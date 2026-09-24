import React, { useState, useEffect } from 'react';
import {
  ServiceHealthData,
  ServiceEventData,
  PipelineRunData,
  SupportedLanguage
} from '../types/index.ts';
import { apiClient } from '../services/apiClient.ts';
import {
  Server,
  Activity,
  GitBranch,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
  Terminal,
  Shield,
  Box,
  Share2,
  RefreshCw,
  Cpu,
  ArrowRight
} from 'lucide-react';

interface BackendCicdDashboardProps {
  currentLang: SupportedLanguage;
}

export const BackendCicdDashboard: React.FC<BackendCicdDashboardProps> = () => {
  const [services, setServices] = useState<ServiceHealthData[]>([]);
  const [events, setEvents] = useState<ServiceEventData[]>([]);
  const [pipelines, setPipelines] = useState<PipelineRunData[]>([]);
  const [activeTab, setActiveTab] = useState<'topology' | 'events' | 'pipelines' | 'manifests'>('topology');
  const [isTriggering, setIsTriggering] = useState(false);
  const [systemSummary, setSystemSummary] = useState<any>(null);

  const loadData = async () => {
    try {
      const [svcRes, evtRes, pipeRes] = await Promise.all([
        apiClient.getServicesHealth(),
        apiClient.getRecentEvents(),
        apiClient.getPipelines(),
      ]);
      setServices(svcRes.services);
      setSystemSummary(svcRes.systemSummary);
      setEvents(evtRes);
      setPipelines(pipeRes);
    } catch (err) {
      console.error('Error loading backend data:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerPipeline = async () => {
    setIsTriggering(true);
    try {
      await apiClient.triggerPipeline('main', 'feat: update pagoda POI audio stream & canary rollout');
      await loadData();
      setActiveTab('pipelines');
    } catch (err) {
      alert('Lỗi kích hoạt pipeline: ' + err);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 border border-stone-800 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>Microservice Mesh & Automated CI/CD Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100 font-mono">
            Hệ Thống Dịch Vụ Backend & CI/CD
          </h2>
          <p className="text-xs text-stone-400 max-w-2xl">
            Các dịch vụ độc lập giao tiếp qua EventBus trung tâm, kiểm soát bảo mật, tính toán đường đi, cổng thanh toán và quy trình CI/CD chuẩn hóa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleTriggerPipeline}
            disabled={isTriggering}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-stone-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isTriggering ? 'Đang chạy Pipeline...' : 'Kích Hoạt CI/CD Mới'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Dịch Vụ Khả Dụng</span>
            <Server className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-mono font-bold text-emerald-400">
            {services.length} / {services.length} Healthy
          </div>
          <div className="text-[10px] text-stone-500">100% Uptime SLA</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Độ Trễ Trung Bình</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-mono font-bold text-cyan-400">
            {systemSummary?.avgClusterLatencyMs || 15} ms
          </div>
          <div className="text-[10px] text-stone-500">EventBus async delivery</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Sự Kiện Đã Xử Lý</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-mono font-bold text-amber-400">
            {systemSummary?.totalClusterCalls || 142}
          </div>
          <div className="text-[10px] text-stone-500">Correlation ID tracked</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Bản Phát Hành (CI/CD)</span>
            <GitBranch className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-mono font-bold text-purple-400">
            v2.4.1 (Canary 10%)
          </div>
          <div className="text-[10px] text-stone-500">Zero-downtime rolling update</div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
        {[
          { id: 'topology', label: 'Cụm Microservices & Sức Khỏe', icon: Server },
          { id: 'events', label: 'Nhật Ký EventBus Trực Tiếp', icon: Zap },
          { id: 'pipelines', label: 'Lịch Sử CI/CD Pipelines', icon: GitBranch },
          { id: 'manifests', label: 'Docker & Kubernetes Specs', icon: Box },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Microservices Topology & Health */}
      {activeTab === 'topology' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-cyan-500/40 transition-all space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 block uppercase">
                      {svc.version} • {svc.endpoint}
                    </span>
                    <h4 className="text-sm font-bold text-stone-100 font-mono">
                      {svc.name}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    HEALTHY
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-stone-950/80 border border-stone-850 font-mono">
                  <div>
                    <span className="text-stone-500 text-[10px] block">Latency:</span>
                    <span className="text-cyan-300 font-bold">{svc.avgLatencyMs} ms</span>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px] block">Calls:</span>
                    <span className="text-amber-300 font-bold">{svc.totalCalls} req</span>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px] block">Uptime:</span>
                    <span className="text-stone-300">{svc.uptimeSeconds}s</span>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px] block">Error Rate:</span>
                    <span className="text-emerald-400 font-bold">{svc.errorRatePercent}%</span>
                  </div>
                </div>

                {/* Dependencies */}
                <div className="text-[11px] text-stone-400">
                  <span className="text-stone-500 font-mono">Interacts with: </span>
                  {svc.dependencies.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Live EventBus Stream */}
      {activeTab === 'events' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-850 pb-2">
              <span className="font-mono">Central EventBus Streaming Channels</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Socket Connected
              </span>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto font-mono text-xs pr-1">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/30 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {evt.eventType}
                      </span>
                      <span className="text-stone-300 font-bold">{evt.sourceService}</span>
                      <ArrowRight className="w-3 h-3 text-stone-500" />
                      <span className="text-cyan-400">{evt.targetService || 'Broadcast (All)'}</span>
                    </div>

                    <div className="flex items-center gap-3 text-stone-500">
                      <span>{evt.latencyMs ? `${evt.latencyMs}ms` : '< 5ms'}</span>
                      <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-400 bg-stone-950/70 p-2 rounded-lg overflow-x-auto">
                    {JSON.stringify(evt.payload)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CI/CD Pipelines History */}
      {activeTab === 'pipelines' && (
        <div className="space-y-4">
          {pipelines.map((pipe) => (
            <div
              key={pipe.runId}
              className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl"
            >
              {/* Pipeline Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-400">
                      #{pipe.runId}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-800 text-stone-300 font-mono">
                      git commit {pipe.commitHash} ({pipe.branch})
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {pipe.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-stone-200">
                    {pipe.commitMessage}
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    Khởi tạo bởi: {pipe.author} • {new Date(pipe.startedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Stages Progression */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {pipe.stages.map((stage) => (
                    <div
                      key={stage.id}
                      className="p-3 rounded-xl bg-stone-950 border border-stone-850 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-200 truncate">
                          {stage.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            stage.status === 'success'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : stage.status === 'running'
                              ? 'bg-cyan-500/20 text-cyan-300 animate-pulse'
                              : 'bg-stone-800 text-stone-500'
                          }`}
                        >
                          {stage.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-[10px] text-stone-500 font-mono">
                        Thời gian chạy: {stage.durationSeconds}s
                      </div>

                      {stage.logs.length > 0 && (
                        <div className="bg-stone-900/90 p-2 rounded text-[10px] font-mono text-stone-400 space-y-0.5 max-h-24 overflow-y-auto">
                          {stage.logs.map((log, i) => (
                            <div key={i}>{log}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Docker & Kubernetes Architecture Specs */}
      {activeTab === 'manifests' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
              <Box className="w-4 h-4 text-amber-400" />
              Dockerfile (Multi-Stage Production Container)
            </h4>
            <pre className="p-3 rounded-xl bg-stone-900 text-stone-300 text-[11px] font-mono overflow-x-auto leading-relaxed max-h-96">
{`# Multi-Stage Dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
USER node
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/server.ts ./server.ts
COPY --chown=node:node --from=builder /app/server ./server
EXPOSE 3000
CMD ["npm", "start"]`}
            </pre>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
            <h4 className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              k8s/deployment.yaml (Canary Rolling Update Spec)
            </h4>
            <pre className="p-3 rounded-xl bg-stone-900 text-stone-300 text-[11px] font-mono overflow-x-auto leading-relaxed max-h-96">
{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: linh-ung-app-deployment
  namespace: prod-pagoda
spec:
  replicas: 3
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
        - name: linh-ung-app
          image: asia-docker.pkg.dev/linhung/app:latest
          ports:
            - containerPort: 3000
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
