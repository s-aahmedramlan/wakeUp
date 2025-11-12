export interface AlarmSettings {
  hour: number;
  minute: number;
  pushupTarget: number;
  brushingSeconds: number;
  enabled: boolean;
}

export interface WakeSession {
  userId: string;
  date: string;
  pushupCount: number;
  brushingSeconds: number;
  wakeCompleted: boolean;
  motivationTrack?: string;
  timestamp: number;
}

export interface PosePoint {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface PushupState {
  isDown: boolean;
  repCount: number;
  isComplete: boolean;
  lastRepTime: number;
}


