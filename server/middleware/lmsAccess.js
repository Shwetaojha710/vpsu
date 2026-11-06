// Role check for LMS APIs. Runs after auth / lmsAuth.
// Loads the user's faculty / department / teacher assignments from the DB
// and saves them on req.lmsScope for the controllers.
//
// usage: lmsAccess('admin', 'faculty', 'department', 'teacher')

const json = require('../views/jsonView');
const { loadScope } = require('../helpers/lmsScope');

function lmsAccess() {
  const roles = Array.prototype.slice.call(arguments);

  return async function (req, res, next) {
    try {
      const scope = await loadScope(req.admin || req.lmsUser);
      if (roles.length && roles.indexOf(scope.role) === -1) {
        return json.fail(res, 403, 'You do not have permission for this action');
      }
      req.lmsScope = scope;
      next();
    } catch (err) {
      return json.fail(res, err.status || 500, err.message);
    }
  };
}

module.exports = lmsAccess;
