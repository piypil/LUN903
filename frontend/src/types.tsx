export interface Vulnerability {
  sourceid: string;
  other: string;
  method: string;
  evidence: string;
  pluginId: string;
  cweid: string;
  confidence: string;
  wascid: string;
  description: string;
  messageId: string;
  inputVector: string;
  tags: { [key: string]: string };
  reference: string;
  solution: string;
  alert: string;
  param: string;
  attack: string;
  name: string;
  risk: string;
  id: string;
  alertRef: string;
  urls: string[];
}

export interface Result {
  name: string;
  severity: string;
  description: string;
  count: number;
  vulnerabilities: Vulnerability[];
}
export interface ProjectData {
  id: number;
  project_name: string;
  url: string;
  scan_date: string;
  results: Result[] | null;
}

export interface UrlDetail {
  url: string;
  details: string[];
}