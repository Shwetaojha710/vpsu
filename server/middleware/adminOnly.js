// CMS APIs are for full admins only.
// Faculty / department / teacher / student logins are limited to LMS APIs.

const json = require('../views/jsonView');
const { isScopedRole } = require('../helpers/lmsScope');

function adminOnly(req, res, next) {
  if (req.admin && isScopedRole(req.admin.role)) {
    return json.fail(res, 403, 'You do not have permission for this action');
  }
  next();
}

module.exports = adminOnly;
