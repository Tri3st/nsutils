export interface WeightData {
    date: string;
    weightKg: number;
    boneMass: number;
    bodyFat: number;
    bodyWater: number;
    muscleMass: number;
    bmi: number;
    user: string;
}

export interface WeightMeasurement extends WeightData{
    id?: number;
}

export interface WeightState {
  weightData: WeightMeasurement[]
  loading: boolean
  error: string | null
}

export interface FetchParams {
  date_gte?: string
  date_lte?: string
  ordering?: string
}
