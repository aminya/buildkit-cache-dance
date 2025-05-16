import spawnPlease from 'spawn-please'
import cp, { type ChildProcess } from 'child_process';

export async function run(command: string, args: string[]) {
    try {
        
        const res = await spawnPlease(command, args);
        if (res.stderr) {
            console.error(res.stderr);
        }
        if (res.stdout) {
            console.log(res.stdout);
        }
        return res;
    } catch (error) {
        console.error(`Error running command: ${command} ${args.join(' ')}`);
        throw error;
    }
}

export async function runPiped([command1, args1]: [string, string[]], [command2, args2]: [string, string[]]) {
    const cp1 = cp.spawn(command1, args1, { stdio: ['inherit', 'pipe', 'inherit'] });
    const cp2 = cp.spawn(command2, args2, { stdio: ['pipe', 'inherit', 'inherit'] });

    cp1.stdout.pipe(cp2.stdin);

    await Promise.all([assertSuccess(cp1), assertSuccess(cp2)]);
}

function assertSuccess(cp: ChildProcess) {
    return new Promise<void>((resolve, reject) => {
        cp.on('error', (error) => {
            reject(error);
        });
        cp.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`process ${cp.spawnfile} exited with code ${code}`));
            }
            resolve();
        });
    });
}
