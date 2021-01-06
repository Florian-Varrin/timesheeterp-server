export class SafeUserDto {
  id: number;
  email: string;

  static getProperties() {
    return ['id', 'email'];
  }
}
