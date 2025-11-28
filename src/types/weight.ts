export interface WeightData {
    date: string;
    weight_kg: number;
    bone_mass: number;
    body_fat: number;
    body_water: number;
    muscle_mass: number;
    bmi: number;
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
  page?: number;
  page_size?: number;
  date_gte?: string
  date_lte?: string
  ordering?: string
}
