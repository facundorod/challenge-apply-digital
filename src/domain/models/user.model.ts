export class User {
  private userId: number;
  private name: string;
  private email: string;
  private password: string;
  private surname: string;

  constructor(
    userId: number,
    name: string,
    email: string,
    password: string,
    surname: string,
  ) {
    this.setUserId(userId);
    this.setName(name);
    this.setEmail(email);
    this.setPassword(password);
    this.setSurname(surname);
  }

  public getUserId(): number {
    return this.userId;
  }

  public setUserId(userId: number): void {
    this.userId = userId;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getPassword(): string {
    return this.password;
  }

  public setPassword(encryptedPass: string): void {
    this.password = encryptedPass;
  }

  public getSurname(): string {
    return this.surname;
  }

  public setSurname(surname: string): void {
    this.surname = surname;
  }
}
