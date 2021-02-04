interface Resource {
  creatorId: string,
  acl: any,
  ownerId?: string,
}

export function resourcePermissionAuthCheck(action: string, resourceName: string, resource: Resource) {
  const win: any = window;
  if (action === 'owner') {
    return resource.creatorId === win.currentUser.id;
  }
  
  if (resource.ownerId && resource.ownerId === win.currentUser.id) {
    return true
  }

  if (!resource.ownerId && resource.creatorId === win.currentUser.id) {
    return true;
  }

  if (!resource.acl) {
    console.error('auth:error:resource have no acl');
    return false;
  }
  return !!(resource.acl.actions && resource.acl.actions.indexOf(action) >= 0);
}
