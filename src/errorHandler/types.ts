export interface ErrorClientInfo {
  statusCode: number;
  message: string;
  metadata: Record<string, unknown>;
}
