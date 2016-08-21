import debug from 'debug';
import pkg from '../../package.json';

export const log = debug(`${pkg.name}:log`);
export const warn = debug(`${pkg.name}:warn`);
export const error = debug(`${pkg.name}:error`);