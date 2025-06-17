import { SetMetadata } from '@nestjs/common';
import { Role } from '../../enums/roles.enum';

export const rolesKey = 'roles';

export const RoleDecorator = (...role: Role[]) => {
  return SetMetadata(rolesKey, role);
};
