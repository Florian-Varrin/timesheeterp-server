export interface CRUDControllerDocumentationInterface {
  controller: {
    create: Record<string, unknown>;
    findAll: Record<string, unknown>;
    findOne: Record<string, unknown>;
    update: Record<string, unknown>;
    remove: Record<string, unknown>;
  };
}
