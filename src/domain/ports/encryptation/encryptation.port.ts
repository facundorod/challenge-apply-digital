export interface EncryptationService {
  encryptData(data: string | Buffer): Promise<string>;
  compare(data: string, encrypted: string): Promise<boolean>;
}
