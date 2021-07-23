import { Mapper } from '../../../core/infrastructure';
import { User } from '../domain/User';

export class UserMap extends Mapper<User> {
  public static toBackend(user: any): any {
    return {
      userId: user.userId,
      userName: user.userName,
      userSurname: user.userSurname,
      userPassword: user.userPassword,
      userEmail: user.userEmail,
      userRole: user.userRole,
      userTelephone: user.userTelephone,
      userCreatedAt: user.userCreatedAt,
      userUpdatedAt: user.userUpdatedAt,
      fleetId: user.fleetId,
    };
  }

  public static toPersistent(user: any): any {
    return {
      userId: user.userId,
      userName: user.userName,
      userSurname: user.userSurname,
      userPassword: user.userPassword,
      userEmail: user.userEmail,
      userRole: user.userRole,
      userTelephone: user.userTelephone,
      userCreatedAt: user.userCreatedAt,
      userUpdatedAt: user.userUpdatedAt,
      fleetId: user.fleetId,
    };
  }

  // static toDomain(raw: any): Conversation {
  //   const conversationOrError = Conversation.New({
  //     campaignId: raw.account_id,
  //     name: raw.name,
  //     conversationId: raw.conversation_id,
  //   });

  //   return conversationOrError.getValue() as Conversation;
  // }

  static toDomainFromDb(raw: any): User {
    const userOrError = User.New({
      fleetId: raw.fleetId,
      userName: raw.userName,
      userSurname: raw.userSurname,
      userPassword: raw.userPassword,
      userEmail: raw.userEmail,
      userRole: raw.userRole,
      userTelephone: raw.userTelephone,
      userCreatedAt: raw.userCreatedAt,
      userUpdatedAt: raw.userUpdatedAt,
    });

    return userOrError.getValue() as User;
  }

  static toFrontend(raw: User): any {
    return {
      fleetId: raw.fleetId,
      userName: raw.userName,
      userSurname: raw.userSurname,
      userPassword: raw.userPassword,
      userEmail: raw.userEmail,
      userRole: raw.userRole,
      userTelephone: raw.userTelephone,
      userCreatedAt: raw.userCreatedAt,
      userUpdatedAt: raw.userUpdatedAt,
    };
  }
}
