// Blocks direct /uploads access to files of unpublished LMS content.
// Those files are only served through /api/lms/contents/:id/download,
// which checks the user's role. Published files stay public as before.

const path = require('path');
const { LmsContent } = require('../models');

const TTL_MS = 60 * 1000;
let draftFiles = new Set();
let loadedAt = 0;
let loading = null;

async function refresh() {
  const rows = await LmsContent.findAll({
    where: { is_published: false },
    attributes: ['file_path']
  });
  draftFiles = new Set(rows.map(function (r) { return r.file_path; }).filter(Boolean));
  loadedAt = Date.now();
}

async function lmsDraftFiles(req, res, next) {
  try {
    if (Date.now() - loadedAt > TTL_MS) {
      loading = loading || refresh().finally(function () { loading = null; });
      await loading;
    }
  } catch (err) {
    // keep the last known list if the DB is not reachable
  }

  const name = path.basename(decodeURIComponent(req.path || ''));
  if (draftFiles.has(name)) {
    return res.status(403).json({ status: false, message: 'Access denied', data: null });
  }
  next();
}

// call after content is created / updated / published so the list is fresh
lmsDraftFiles.invalidate = function () {
  loadedAt = 0;
};

module.exports = lmsDraftFiles;
