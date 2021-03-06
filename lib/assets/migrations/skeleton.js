'use strict'; // eslint-disable-line lines-around-directive, strict

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * <%= actions %>
 *
 */

const info = <%= info %>;

const migrationCommands = (transaction) => {
  return [
<%= commandsUp %>
  ];
};

const rollbackCommands = (transaction) => {
  return [
<%= commandsDown %>
  ];
};

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          // eslint-disable-next-line prefer-template
          console.log('[#' + index + '] execute: ' + command.fn);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (this.useTransaction) {
    return queryInterface.sequelize.transaction(run);
  }
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) => {
    return execute(queryInterface, sequelize, migrationCommands);
  },
  down: (queryInterface, sequelize) => {
    return execute(queryInterface, sequelize, rollbackCommands);
  },
  info,
};
