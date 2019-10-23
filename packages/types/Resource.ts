export type AclAction = 'read' | 'edit' | 'delete' | 'share' | 'download';

type Resource = {
    id: string,
    name: string,
    acl: {
        actions: AclAction[],
        shared: boolean
    },
    [key : string] : any
}

export default Resource;
