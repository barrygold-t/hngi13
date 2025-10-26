import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Country = sequelize.define("Country", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capital: {
    type: DataTypes.STRING,
  },
  region: {
    type: DataTypes.STRING,
  },
  population: {
    type: DataTypes.BIGINT,
  },
  currency_code: {
    type: DataTypes.STRING,
  },
  exchange_rate: {
    type: DataTypes.FLOAT,
  },
  estimated_gdp: {
    type: DataTypes.FLOAT,
  },
  flag_url: {
    type: DataTypes.STRING,
  },
  last_refreshed_at: {
    type: DataTypes.DATE,
  },
});

export default Country;
