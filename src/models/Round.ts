import { DataTypes, Model } from "sequelize";

import sequelize from "../db";

class Round extends Model {
  public id!: number;
  public startDate!: Date;
  public endDate!: Date;
  public totalPoints!: number;
}

Round.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    totalPoints: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, modelName: "Round" },
);

export default Round;
