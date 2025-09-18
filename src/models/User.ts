import { DataTypes, Model } from "sequelize";

import sequelize from "../db";

export enum Role {
  Survivor = "survivor",
  Nikita = "nikita",
  Admin = "admin",
}

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public role!: Role;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false }, // TODO обработать uniq ошибку на фронте
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM(...Object.values(Role)), allowNull: false },
  },
  { sequelize, modelName: "User" },
);

export default User;
