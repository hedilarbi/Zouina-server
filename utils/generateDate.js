const generateDate = (time, date) => {
  const new_time = new Date(time);
  const new_date = new Date(date);

  let final_date =
    new_date.getFullYear() +
    "/" +
    (new_date.getMonth() + 1) +
    "/" +
    new_date.getDate() +
    " " +
    new_time.getHours() +
    ":" +
    new_time.getMinutes();

  final_date = new Date(final_date);

  return final_date;
};

module.exports = generateDate;
