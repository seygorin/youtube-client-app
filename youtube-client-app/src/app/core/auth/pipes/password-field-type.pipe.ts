import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passwordFieldType',
  standalone: true,
})
export class PasswordFieldTypePipe implements PipeTransform {
  transform(hidePassword: boolean): string {
    return hidePassword ? 'password' : 'text';
  }
}
