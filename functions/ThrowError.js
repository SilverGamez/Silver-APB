const chalk = require('chalk').default;

module.exports = (error) => {
    console.log(chalk.red('\n-------------------------- ERROR --------------------------'));
    console.error(error);
    console.log(chalk.red('-----------------------------------------------------------\n'));
}