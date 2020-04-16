import _ from 'lodash';
import cacheLatest from '@gio-core/utils/cacheLatest';

interface UserPermission {
  key: string,
  name: string,
  actions?: Action[],
  permissions?: Permission[],
}

interface Action {
  id: string,
  key: string,
  name: string
}

interface Permission {
  id: string,
  action: string,
  name: string
}

const gioCorePermissionModules = {};

export function initializeModulePermissionAuth(userPermissions: UserPermission[]) {
  cacheLatest(updatePermissions)(userPermissions);
}

function updatePermissions(userPermissions) {
  for (const prop of Object.keys(userPermissions)) {
    delete gioCorePermissionModules[prop];
  }
  userPermissions.forEach((permission) => {
    if (permission.actions) {
      gioCorePermissionModules[permission.key] = permission.actions.map((a) => a.key);
    } else {
      gioCorePermissionModules[permission.key] = permission.permissions.map((p) => p.action);
    }
  });
}

export function modulePermissionAuthCheck(action, key) {
  if (_.isEmpty(gioCorePermissionModules)) {
    return false;
  }
  if (!gioCorePermissionModules[key]) {
    return false;
  }
  const win: any = window;
  const edition = win.standalone ? win.edition : win.organizationEdition;
  if (edition && (edition.state === 'disabled' || edition.state === 'expired') && action !== '*' && action !== 'read' && action !== 'request') {
    return false;
  }
  if (action === '*') {
    return !!(gioCorePermissionModules[key] && gioCorePermissionModules[key].length);
  }
  if (action === 'read' && gioCorePermissionModules[key] && (_.intersection(gioCorePermissionModules[key], ['create', 'edit', 'manage']).length > 0)) {
    return true;
  }
  return !!(gioCorePermissionModules[key] && gioCorePermissionModules[key].indexOf(action) >= 0);
}
