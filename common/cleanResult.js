module.exports = function cleanResult(result) {
  const cleaned = {};

  for (const key in result) {
    const value = result[key];

    if (typeof value === "string") {
      cleaned[key] = value.trim(); 
    } else {
      cleaned[key] = value;
    }
  }
  delete cleaned["ssn"];
  delete cleaned["email"];

  return cleaned;
};
