/**
 * hooks/useDriverTasks.ts
 * ~~~~~~~~~~~~~~~~~~~~~~~~
 * Zustand store for driver tasks. Handles list fetching, detail fetching,
 * and the start/complete state transitions.
 */

import { create } from "zustand";
import driverApi from "../services/driverApi";

export interface DriverTaskSummary {
  id: number;
  scenario_name: string;
  collection_date: string;
  status: "assigned" | "in_progress" | "completed" | "cancelled";
  status_display: string;
  assigned_at: string;
  started_at: string | null;
  completed_at: string | null;
  report_id?: number | null;
}

export interface DriverTaskDetail extends DriverTaskSummary {
  driver_name: string;
  report_id?: number | null;
  scenario: {
    id: number;
    name: string;
    collection_date: string;
    vehicle: { id: number; name: string; capacity: number };
    end_landfill: {
      id: number;
      name: string;
      latitude: number;
      longitude: number;
    } | null;
    bins: {
      id: number;
      name: string;
      latitude: number;
      longitude: number;
      capacity: number;
    }[];
    start_latitude: number | null;
    start_longitude: number | null;
    planned_solution: {
      id: number;
      total_distance: number;
      total_time: number;
      co2_kg: number;
      data: any;
      geometry: [number, number][];
    } | null;
  };
}

interface TasksState {
  tasks: DriverTaskSummary[];
  task: DriverTaskSummary | null; // single latest active task (for home screen)
  currentTask: DriverTaskDetail | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  fetchTask: (id: number | string) => Promise<void>;
  getLatestTask: () => Promise<void>; // fetch the latest in_progress or assigned task
  startTask: (id: number | string) => Promise<{ report_id?: number }>;
  completeTask: (
    id: number | string,
    actualFuelLitres?: number,
  ) => Promise<{ report_id?: number }>;
  clearError: () => void;
}

export const useDriverTasks = create<TasksState>((set, get) => ({
  tasks: [],
  task: null,
  currentTask: null,
  loading: false,
  refreshing: false,
  error: null,

  clearError: () => set({ error: null }),

  getLatestTask: async () => {
    set({ loading: true, error: null });
    try {
      // Prefer in_progress, fall back to assigned
      const inProgressResp = await driverApi.get(
        "/driver/tasks/?limit=1&status=in_progress",
      );
      const inProgressResults = (
        inProgressResp.data.results ?? inProgressResp.data
      ).filter(
        (t: DriverTaskSummary) =>
          t.status !== "completed" && t.status !== "cancelled",
      );
      if (inProgressResults.length > 0) {
        set({ task: inProgressResults[0] });
        return;
      }
      const assignedResp = await driverApi.get(
        "/driver/tasks/?limit=1&status=assigned",
      );
      const assignedResults = (
        assignedResp.data.results ?? assignedResp.data
      ).filter(
        (t: DriverTaskSummary) =>
          t.status !== "completed" && t.status !== "cancelled",
      );
      set({ task: assignedResults.length > 0 ? assignedResults[0] : null });
    } catch {
      set({ error: "فشل تحميل المهمة الحالية." });
    } finally {
      set({ loading: false });
    }
  },

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await driverApi.get("/driver/tasks/");
      const tasks = resp.data.results ?? resp.data;
      set({ tasks });
    } catch {
      set({ error: "فشل تحميل قائمة المهام." });
    } finally {
      set({ loading: false });
    }
  },

  refreshTasks: async () => {
    set({ refreshing: true, error: null });
    try {
      const resp = await driverApi.get("/driver/tasks/");
      const tasks = resp.data.results ?? resp.data;
      set({ tasks });
    } catch {
    } finally {
      set({ refreshing: false });
    }
  },

  fetchTask: async (id) => {
    set({ loading: true, error: null, currentTask: null });
    try {
      const resp = await driverApi.get(`/driver/tasks/${id}/`);
      set({ currentTask: resp.data });
    } catch {
      set({ error: "فشل تحميل تفاصيل المهمة." });
    } finally {
      set({ loading: false });
    }
  },

  startTask: async (id) => {
    const resp = await driverApi.post(`/driver/tasks/${id}/start/`);
    const updated = resp.data;
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === Number(id)
          ? {
              ...t,
              status: updated.status || "in_progress",
              status_display: updated.status_display || "قيد التنفيذ",
            }
          : t,
      ),
      currentTask:
        state.currentTask?.id === Number(id)
          ? { ...state.currentTask, ...updated }
          : state.currentTask,
    }));
    return updated;
  },

  completeTask: async (id, actualFuelLitres) => {
    const body: Record<string, any> = {};
    if (actualFuelLitres !== undefined)
      body.actual_fuel_litres = actualFuelLitres;
    const resp = await driverApi.post(`/driver/tasks/${id}/complete/`, body);
    const updated = resp.data;
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === Number(id)
          ? {
              ...t,
              status: updated.status || "completed",
              status_display: updated.status_display || "مكتملة",
              report_id: updated.report_id ?? t.report_id,
            }
          : t,
      ),
      currentTask:
        state.currentTask?.id === Number(id)
          ? { ...state.currentTask, ...updated }
          : state.currentTask,
    }));
    return updated;
  },
}));
