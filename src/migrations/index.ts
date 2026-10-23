import * as migration_20261023_014428_initial from './20261023_014428_initial';
import * as migration_20261023_020725_blob_object_key from './20261023_020725_blob_object_key';

export const migrations = [
  {
    up: migration_20261023_014428_initial.up,
    down: migration_20261023_014428_initial.down,
    name: '20261023_014428_initial',
  },
  {
    up: migration_20261023_020725_blob_object_key.up,
    down: migration_20261023_020725_blob_object_key.down,
    name: '20261023_020725_blob_object_key'
  },
];
