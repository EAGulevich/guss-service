import { DataTypes, Model } from "sequelize";

import sequelize from "../db";
import Round from "./Round";
import User from "./User";

class PlayerRound extends Model {
  public userId!: number;
  public roundId!: number;
  public taps!: number;
  public points!: number;
}

PlayerRound.init(
  {
    taps: { type: DataTypes.INTEGER, defaultValue: 0 },
    points: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    sequelize,
    modelName: "PlayerRound",
    indexes: [{ unique: true, fields: ["userId", "roundId"] }],
  },
);

PlayerRound.belongsTo(User, { foreignKey: "userId" });
PlayerRound.belongsTo(Round, { foreignKey: "roundId" });

export default PlayerRound;
