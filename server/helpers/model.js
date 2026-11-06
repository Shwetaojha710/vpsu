function toParentId(value) {
  if (value === undefined || value === null || value === "" || value === "null") {
    return null;
  }
  return Number(value);
}

function withSectionName(row) {
  const data = row.toJSON ? row.toJSON() : row;
  data.section_name = data.section ? data.section.name : null;
  delete data.section;
  return data;
}

module.exports = { toParentId, withSectionName };
