import { User } from './user.model';

describe('User Class', () => {
  let user: User;

  beforeEach(() => {
    user = new User(1, 'Test', 'test@test.com', 'password', 'User');
  });

  it('should create an instance of User', () => {
    expect(user).toBeDefined();
  });

  it('should set and get the userId correctly through the constructor', () => {
    expect(user.getUserId()).toBe(1);
  });

  it('should set and get the name correctly through the constructor', () => {
    expect(user.getName()).toBe('Test');
  });

  it('should set and get the email correctly through the constructor', () => {
    expect(user.getEmail()).toBe('test@test.com');
  });

  it('should set and get the password correctly through the constructor', () => {
    expect(user.getPassword()).toBe('password');
  });

  it('should only accept string for email', () => {
    expect(typeof user.getEmail()).toBe('string');
  });

  it('should only accept string for password', () => {
    expect(typeof user.getPassword()).toBe('string');
  });

  it('should only accept string for surname', () => {
    expect(typeof user.getSurname()).toBe('string');
  });

  it('should only accept string for name', () => {
    expect(typeof user.getName()).toBe('string');
  });
});
