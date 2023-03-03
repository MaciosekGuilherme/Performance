import { InvalidEmail } from './../error/customError';
import { CustomError } from "../error/customError";
import { BaseDatabase } from "./BaseDatabse";
import { user } from "../model/user";

export class UserDatabase extends BaseDatabase {
  public findUser = async (email: string) => {
    try {
      const result = await UserDatabase.connection("performance_user_panel")
        .select()
        .where({ email });

      return result[0];
    } catch (error: any) {
      throw new InvalidEmail();
    }
  };

  public createUser = async (user: user) => {
    try {
      await UserDatabase.connection
        .insert({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        })
        .into("performance_user_panel");
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

}