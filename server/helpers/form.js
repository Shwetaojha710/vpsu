// helpers for form / JSON body values

function isTrue(value) {
  return value === 'true' || value === true || value === 1 || value === '1';
}

function isNotFalse(value) {
  return value !== 'false' && value !== false;
}

function uploadedName(file) {
  return file ? file.filename : '';
}

module.exports = { isTrue, isNotFalse, uploadedName };
