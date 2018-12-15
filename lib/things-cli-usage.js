import createUsage from './things-create-usage';
import deleteUsage from './things-delete-usage';
import getUsage from './things-get-usage';

export default [].concat(createUsage, deleteUsage, getUsage);

export { createUsage, deleteUsage, getUsage };
