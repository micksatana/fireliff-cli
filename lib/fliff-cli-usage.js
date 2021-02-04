import addUsage from './fliff-add-usage';
import configUsage from './fliff-config-usage';
import deleteUsage from './fliff-delete-usage';
import getUsage from './fliff-get-usage';
import initUsage from './fliff-init-usage';
import tokenUsage from './fliff-token-usage';
import updateUsage from './fliff-update-usage';

export default [].concat(
  configUsage,
  tokenUsage,
  initUsage,
  addUsage,
  updateUsage,
  deleteUsage,
  getUsage
);

export {
  configUsage,
  tokenUsage,
  initUsage,
  addUsage,
  updateUsage,
  deleteUsage,
  getUsage,
};
