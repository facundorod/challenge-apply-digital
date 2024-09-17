export interface AuthenticationService {
  signData(dataToSign: object): Promise<string>;
  verify(accessToken: string): Promise<object>;
}
