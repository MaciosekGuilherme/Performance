export type user = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type AuthenticationData = {
   id: string
}

export type UserInputDTO = {
  name: string;
  email: string;
  password: string;
};

export type LoginInputDTO = {
  email: string;
  password: string;
};

export type RecipeInputDTO = {
  title: string;
  description: string;
  MethodOfPreparation: string;
};