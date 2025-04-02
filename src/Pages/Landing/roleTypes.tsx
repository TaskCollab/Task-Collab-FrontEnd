import { RoleDTO } from "../../API/UsersAPICall";

export interface Role {
    roleName: string;
    permissions: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
    };
}

export const convertRoleDTO = (dto: RoleDTO): Role => ({
    roleName: dto.roleName,
    permissions: {
        create: dto.createPermission || false,
        read: dto.readPermission || false,
        update: dto.updatePermission || false,
        delete: dto.deletePermission || false
    }
});