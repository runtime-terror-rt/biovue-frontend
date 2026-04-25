export interface Ad {
  id: number;
  ads_title: string;
  ads_type: string;
  image: string | null;
  placement: string;
  start_date: string;
  end_date: string;
  status: boolean | number;
  redirect_url: string;
}

export interface AdFormData {
  ads_title: string;
  ads_type: string;
  image: File | null;
  placement: string[];
  start_date: string;
  end_date: string;
  status: boolean;
  redirect_url: string;
}
