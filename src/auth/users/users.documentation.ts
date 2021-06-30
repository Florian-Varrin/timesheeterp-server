import { AbstractDocumentation } from '../../documentation/abstract.documentation';
import { CRUDControllerDocumentationInterface } from '../../documentation/interfaces/CRUDControllerDocumentationInterface';
import { CRUDDTODocumentationInterface } from '../../documentation/interfaces/CRUDDTODocumentationInterface';

export class UsersDocumentation
  extends AbstractDocumentation
  implements
    CRUDControllerDocumentationInterface,
    CRUDDTODocumentationInterface {
  controller = {
    create: { summary: 'Create a user' },
    findAll: { summary: 'Get all users' },
    findOne: { summary: 'Get a user' },
    update: { summary: 'Update a user' },
    remove: { summary: 'Delete a user' },
    addRoles: { summary: 'Add a role to a user' },
    removeRole: { summary: 'Delete a role to a user' },
  };

  dto = {
    create: {
      email: { example: 'test@gmail.com' },
      password: { example: '%nhEjdU^e5wWZv%G0' },
    },
  };
}
