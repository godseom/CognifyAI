
export interface BusinessResult {
  name: string;
  address: string;
  rating: string | number;
  category: string;
  id?: string;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface AnalysisResult {
  business: BusinessResult;
  report: string;
  sources: GroundingSource[];
  timestamp: number;
}
