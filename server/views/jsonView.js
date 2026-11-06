// View layer for this API: every response is JSON
// { success, message, data }

function ok(res, data, message) {
  return res.json({
    status: true,
    message: message || 'OK',
    data: data
  });
}

function fail(res, status, message) {
  return res.status(status).json({
    status: false,
    message: message,
    data: null
  });
}

module.exports = { ok, fail };
