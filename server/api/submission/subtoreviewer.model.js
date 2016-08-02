'use strict';

import {Submission} from '../../sqldb'; //lookup sqldb
import {User} from '../../sqldb'; //lookup sqldb




export default function(sequelize, DataTypes) {
  return sequelize.define('Subtoreviewer', {
  	 _subid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },

  	 _revid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true

    }
  });
}





