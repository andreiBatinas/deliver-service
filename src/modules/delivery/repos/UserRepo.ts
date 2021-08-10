import { DeleteResult } from 'typeorm';

import { DB } from '../../../infrastructure/typeorm';
import { User } from '../domain/User';
import { UserMap } from '../mappers/UserMap';

export interface IUserRepo {
  //findAccountByAccountName(name: string): Promise<Account | null>;
  findUserByUserId(userId: number): Promise<User | null>;
  save(user: User): Promise<User>;
  exists(userEmail: string): Promise<boolean>;
  // findUsersByFleetId(fleetId: number): Promise<User[]>;
  findUsersByAccountId(accountId: number): Promise<User[]>;
  removeUserByUserId(userId: number): Promise<boolean>;
  updateUser(user: User): Promise<User | null>;
}

export class UserRepo implements IUserRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  public async exists(userEmail: string): Promise<boolean> {
    const userModel = this.models.User;
    const r = await DB.getRepository(userModel).findOne({
      userEmail,
    });
    if (r !== undefined) return true;
    return false;
  }

  // public async findAccountByAccountName(name: string): Promise<Account | null> {
  //   const accountModel = this.models.Account;
  //   const account = await DB.getRepository(accountModel).findOne({
  //     where: {
  //       name,
  //     },
  //   });

  //   if (undefined === account) {
  //     return null;
  //   }
  //   return account as Account;
  // }

  public async save(user: User): Promise<User> {
    const userModel = this.models.User;
    const rawUser = UserMap.toPersistent(user);

    const userRepo = DB.getRepository(userModel);
    const c = new userModel();

    c.userName = rawUser.userName;
    c.userSurname = rawUser.userSurname;
    c.userCreatedAt = new Date();
    c.userUpdatedAt = rawUser.userUpdatedAt;
    c.userPassword = rawUser.userPassword;
    c.userEmail = rawUser.userEmail;
    c.userRole = rawUser.userRole;
    c.userTelephone = rawUser.userTelephone;
    c.accountId = rawUser.accountId;
    c.fleetId = rawUser.fleetId;

    const userResult = await userRepo.save(c);

    const userAdded: any = await userRepo.findOne({
      userName: c.userName,
      userEmail: c.userEmail,
      accountId: c.accountId,
      userCreatedAt: c.userCreatedAt,
    });
    userResult.userId = userAdded.userId;

    return userResult;
  }

  public async findUsersByAccountId(accountId: number): Promise<User[]> {
    const userModel = this.models.User;
    const r = await DB.getRepository(userModel).find({
      where: {
        accountId,
      },
    });

    const userList = r.map((entry: any) => {
      return UserMap.toDomainFromDb(entry);
    });

    return userList;
  }

  public async findUserByUserId(userId: number): Promise<User | null> {
    const userModel = this.models.User;
    const user = await DB.getRepository(userModel).findOne({
      where: {
        userId,
      },
      //relations: ['modules'],
    });

    if (undefined === user) {
      return null;
    }
    return user as User;
  }

  // public async findModulesByConversationId(
  //   conversationId: string,
  // ): Promise<Account[]> {
  //   const conversationModel = this.models.Conversation;
  //   const conversation = await DB.getRepository(conversationModel).findOne({
  //     where: {
  //       conversationId,
  //     },
  //     relations: ['modules'],
  //   });

  //   return [];
  // }
  public async removeUserByUserId(userId: number): Promise<boolean> {
    const userModel = this.models.User;
    const result: DeleteResult = await DB.getRepository(userModel).delete({
      userId,
    });

    if (result.affected === 0) {
      return false;
    }
    return true;
  }

  public async updateUser(user: User): Promise<User | null> {
    const userModel = this.models.User;
    const rawUser = UserMap.toPersistent(user);
    const criteria = { userId: user.userId };
    const propertiesToUpdate: any = { userUpdatedAt: new Date() };
    if (rawUser.userName) {
      propertiesToUpdate.userName = rawUser.userName;
    }
    if (rawUser.userSurname) {
      propertiesToUpdate.userSurname = rawUser.userSurname;
    }
    if (rawUser.userPassword) {
      propertiesToUpdate.userPassword = rawUser.userPassword;
    }
    if (rawUser.userEmail) {
      propertiesToUpdate.userEmail = rawUser.userEmail;
    }
    if (rawUser.userRole) {
      propertiesToUpdate.userRole = rawUser.userRole;
    }
    if (rawUser.userTelephone) {
      propertiesToUpdate.userTelephone = rawUser.userTelephone;
    }

    const result = await DB.getRepository(userModel).update(
      criteria,
      propertiesToUpdate,
    );
    if (undefined === result) {
      return null;
    }
    return rawUser;
  }
}
