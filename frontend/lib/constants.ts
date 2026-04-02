export const COLORS = {
  primary: '#1E3A8A', // Deep Blue
  accent: '#06B6D4', // Electric Cyan
  bgLight: '#F8FAFC',
  bgDark: '#0F172A',
  cardLight: '#FFFFFF',
  cardDark: '#1E293B',
  textLight: '#0F172A',
  textDark: '#F1F5F9',
  textMutedLight: '#64748B',
  textMutedDark: '#94A3B8',
  borderLight: '#E2E8F0',
  borderDark: '#334155',
} as const;

export const API_ENDPOINTS = {
  logs: '/api/logs',
  verify: '/api/verify',
} as const;

export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  users: '/users',
  logs: '/logs',
  upload: '/upload',
  settings: '/settings',
} as const;

export const MOCK_USERS = [
  { id: 'FAC001', name: 'Dr. Sarah Johnson', role: 'Professor', department: 'Computer Science' },
  { id: 'FAC002', name: 'Prof. Michael Chen', role: 'Associate Professor', department: 'Mathematics' },
  { id: 'FAC003', name: 'Dr. Emily Rodriguez', role: 'Assistant Professor', department: 'Physics' },
  { id: 'FAC004', name: 'Prof. David Kumar', role: 'Professor', department: 'Engineering' },
  { id: 'FAC005', name: 'Dr. Lisa Anderson', role: 'Lecturer', department: 'Chemistry' },
];

export const MOCK_LOGS = [
  {
    id: '1',
    user: 'FAC001',
    userName: 'Dr. Sarah Johnson',
    action: 'Vault Entry',
    timestamp: '2026-02-13T10:35:45Z',
    paperHash: 'Qm1234abc5678xyz9012def3456ghi7890jkl',
    status: 'Granted',
  },
  {
    id: '2',
    user: 'FAC002',
    userName: 'Prof. Michael Chen',
    action: 'Paper Verification',
    timestamp: '2026-02-13T09:22:15Z',
    paperHash: 'Qm9876zyx5432wvu1098tsr7654qpo3210nml',
    status: 'Granted',
  },
  {
    id: '3',
    user: 'FAC003',
    userName: 'Dr. Emily Rodriguez',
    action: 'Vault Entry',
    timestamp: '2026-02-13T08:15:30Z',
    paperHash: 'Qmabcd1234efgh5678ijkl9012mnop3456qrst',
    status: 'Denied',
  },
  {
    id: '4',
    user: 'FAC004',
    userName: 'Prof. David Kumar',
    action: 'Paper Upload',
    timestamp: '2026-02-12T16:45:20Z',
    paperHash: 'Qm5678wxyz1234abcd5678efgh9012ijkl3456',
    status: 'Granted',
  },
  {
    id: '5',
    user: 'FAC001',
    userName: 'Dr. Sarah Johnson',
    action: 'Paper Verification',
    timestamp: '2026-02-12T14:30:10Z',
    paperHash: 'Qm1234abc5678xyz9012def3456ghi7890jkl',
    status: 'Granted',
  },
];
