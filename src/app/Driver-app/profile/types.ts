/**
 * Type definitions for Driver Profile screen
 */

export type Tab = "profile" | "password" | "schedule";

export interface WorkScheduleDay {
  enabled: boolean;
  start_time: string;
  end_time: string;
}

export interface WorkSchedule {
  saturday?: WorkScheduleDay;
  sunday?: WorkScheduleDay;
  monday?: WorkScheduleDay;
  tuesday?: WorkScheduleDay;
  wednesday?: WorkScheduleDay;
  thursday?: WorkScheduleDay;
  friday?: WorkScheduleDay;
}

export interface PasswordForm {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export interface PasswordErrors {
  old_password?: string;
  new_password?: string;
  confirm_new_password?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  phone?: string;
  role: string;
  municipality_name?: string;
  work_schedule?: WorkSchedule;
}

export const DAYS_ARABIC: Record<string, string> = {
  saturday: "السبت",
  sunday: "الأحد",
  monday: "الإثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
};

export const DEFAULT_PASSWORD_FORM: PasswordForm = {
  old_password: "",
  new_password: "",
  confirm_new_password: "",
};
