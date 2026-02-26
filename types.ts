
export type TrackColor = "white" | "yellow" | "green" | "blue" | "red" | "black";

export interface StageTemplate {
  name: string;
  color: TrackColor[];
  emoji?: string;
}

export interface TrackStage {
  id: string;
  template: StageTemplate;
  distanceToNext: number;
}

export interface Track {
  id: string;
  name: string;
  color: TrackColor;
  length: number; // number of stages
  stages: TrackStage[];
  avgHeight: number;
}
