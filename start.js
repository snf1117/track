import { spawn } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { exit } from 'process';
import chalk from 'chalk'; // תצטרך להתקין את זה: npm i chalk

const __dirname = dirname(fileURLToPath(import.meta.url));

function run(name, cmd, args, path, color) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      cwd: `${__dirname}/${path}`,
      shell: true
    });

    proc.stdout.on('data', data => {
      process.stdout.write(color(`[${name}] `) + data.toString());
    });

    proc.stderr.on('data', data => {
      process.stderr.write(color(`[${name} ⚠] `) + data.toString());
    });

    proc.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${name} exited with code ${code}`));
      }
    });

    proc.on('error', err => {
      reject(err);
    });
  });
}

async function main() {
  try {
    console.log(chalk.blue('📦 Installing server...'));
    await run('server-install', 'npm', ['install'], 'server', chalk.gray);

    console.log(chalk.blue('📦 Installing frontend...'));
    await run('client-install', 'npm', ['install'], '.', chalk.gray);

    console.log(chalk.green('🚀 Starting backend & frontend...\n'));

    const backend = spawn('npm', ['start'], {
      cwd: `${__dirname}/server`,
      shell: true
    });

    backend.stdout.on('data', data => {
      process.stdout.write(chalk.cyan('[backend] ') + data.toString());
    });

    backend.stderr.on('data', data => {
      process.stderr.write(chalk.red('[backend ❌] ') + data.toString());
    });

    const frontend = spawn('npm', ['run', 'dev'], {
      cwd: __dirname,
      shell: true
    });

    frontend.stdout.on('data', data => {
      process.stdout.write(chalk.magenta('[frontend] ') + data.toString());
    });

    frontend.stderr.on('data', data => {
      process.stderr.write(chalk.red('[frontend ❌] ') + data.toString());
    });

    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Stopping...'));
      backend.kill('SIGINT');
      frontend.kill('SIGINT');
      exit();
    });

  } catch (err) {
    console.error(chalk.red('❌ Error:'), err.message);
    exit(1);
  }
}

main();