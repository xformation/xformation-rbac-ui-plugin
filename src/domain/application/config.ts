const IP = 'localhost';
const secSrvUrl = 'http://' + IP + ':8094';

export const config = {
  PERMS_LIST_ALL: secSrvUrl + '/security/permissions/listAll',
  PERMS_CREATE: secSrvUrl + '/security/permissions/create',
  ROLES_LIST_ALL: secSrvUrl + '/security/roles/listAll',
  ROLES_CREATE: secSrvUrl + '/security/roles/create',
  USERS_LIST_ALL: secSrvUrl + '/security/users/listAll',
  USERS_CREATE: secSrvUrl + '/security/users/create',
  USERS_UPDATE: secSrvUrl + '/security/users/update',
  USERS_GET: secSrvUrl + '/security/users/',
  PARENT_NAME: 'xformation-rbac-ui-plugin',

  LABEL_ROLES_AND_PERMISSIONS: 'Roles & Permissions',
};
