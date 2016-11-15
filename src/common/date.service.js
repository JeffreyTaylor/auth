
module.exports.toEpoch = (date) => {
  return Math.round(date.getTime() / 1000);
};

module.exports.fromEpoch = (epoch) => {
  return new Date(epoch);
};

module.exports.addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};