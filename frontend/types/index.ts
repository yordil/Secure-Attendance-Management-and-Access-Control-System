export enum Role {
  DIRECTOR = 'DIRECTOR',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

export enum DataClassification {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  CONFIDENTIAL = 'CONFIDENTIAL',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  department?: string;
  isVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSession {
  id: string;
  courseId: string;
  teacherId: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  course?: Course;
  teacher?: User;
}

export interface Attendance {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
  classification: DataClassification;
  createdAt: string;
  updatedAt: string;
  session?: AttendanceSession;
  student?: User;
}

export interface Permission {
  id: string;
  userId: string;
  resource: string;
  action: string;
  grantedBy: string;
  createdAt: string;
  user?: User;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
  user?: User;
}

export interface Policy {
  id: string;
  name: string;
  description?: string;
  effect: string;
  action: string;
  resource: string;
  condition?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  requiresMfa?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  mfaToken?: string;
}
