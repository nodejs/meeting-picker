'use strict';
import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
{
    const inputFiles = fs.readdirSync(new URL('input', import.meta.url));
    inputFiles.forEach((fileName) => {
        const expected = fs.readFileSync(new URL(`output/${path.basename(fileName, '.tsv')}.out`, import.meta.url));
        const results = spawnSync(process.argv[0], [url.fileURLToPath(new URL('../meeting-picker.js', import.meta.url)), path.join('test', 'input', fileName)]);
        if (results.error != null) {
            throw results.error;
        }
        assert.strictEqual(results.stderr.toString(), '');
        assert.strictEqual(results.stdout.toString(), expected.toString(), `output for ${fileName} is different than expected`);
    });
}
