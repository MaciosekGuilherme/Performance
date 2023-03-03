import { UserInputDTO, LoginInputDTO, EditUserInputDTO, EditUserInput } from "./../model/user";
import { IdGenerator } from "./../services/IdGenerator";
import {
  InvalidPassword,
  InvalidEmail,
  InvalidName,
  UserNotFound,
} from "./../error/customError";
import { TokenGenerator } from "./../services/TokenGenerator";
import { HashManager } from "../services/HashManager";
import { UserDatabase } from "../data/UserDatabase";
import { CustomError } from "../error/customError";
import { user } from "../model/user";
import { Authenticator } from "../services/Authenticator";

const idGenerator = new IdGenerator();
const tokenGenerator = new TokenGenerator();
const userDatabase = new UserDatabase();
const hashManager = new HashManager();
const authenticator = new Authenticator()

export class UserBusiness {
  public signup = async (input: UserInputDTO): Promise<string> => {
    try {
      const { name, email, password } = input;

      if (!name || !email || !password) {
        throw new CustomError(
          400,
          'Preencha os campos "name", "email" e "password"'
        );
      }

      if (name.length < 4) {
        throw new InvalidName();
      }

      if (!email.includes("@")) {
        throw new InvalidEmail();
      }

      if (password.length < 6) {
        throw new InvalidPassword();
      }

      const id: string = idGenerator.generateId();

      const hashPassword: string = await hashManager.generateHash(password);

      const user: user = {
        id,
        name,        
        email,
        password: hashPassword,
        nickname: name.toLowerCase()
      };

      await userDatabase.signup(user);
      const token = tokenGenerator.generateToken(id);

      return token;
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public login = async (input: LoginInputDTO): Promise<string> => {
    try {
      const { email, password } = input;

      if (!email || !password) {
        throw new CustomError(400, 'Preencha os campos "email" e "password"');
      }

      if (!email.includes("@")) {
        throw new InvalidEmail();
      }

      const user = await userDatabase.findUser(email);

      if (!user) {
        throw new UserNotFound();
      }

      const compareResult: boolean = await hashManager.compareHash(
        password,
        user.password
      );

      if (!compareResult) {
        throw new InvalidPassword();
      }

      const token = tokenGenerator.generateToken(user.id);

      return token;
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public editUser = async (input: EditUserInputDTO) => {
    try {
      const { name, nickname, token } = input;

      if (!name || !nickname) {
        throw new CustomError(
          400,
          'Preencha os campos "id", "name" e "nickname"'
        );
      }

      if (name.length < 4) {
        throw new InvalidName();
      }

      const { id } = authenticator.getTokenData(token);

      const editUserInput: EditUserInput = {
        id,
        name,
        nickname,
      };

      const userDatabase = new UserDatabase();
      await userDatabase.editUser(editUserInput);
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };
}
