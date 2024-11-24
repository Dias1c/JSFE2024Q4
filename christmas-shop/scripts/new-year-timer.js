const MS_SECOND = 1000;
const MS_MINUTE = 60 * MS_SECOND;
const MS_HOUR = 60 * MS_MINUTE;
const MS_DAY = 24 * MS_HOUR;

export const getNewYearRemains = ({ year }) => {
  const target = new Date(`${year}-01-01T00:00`);
  let remains = target - Date.now();

  let days = Math.floor(remains / MS_DAY);
  if (days < 0) days = 0;
  remains = remains % MS_DAY;

  let hours = Math.floor(remains / MS_HOUR);
  if (hours < 0) hours = 0;
  remains = remains % MS_HOUR;

  let minutes = Math.floor(remains / MS_MINUTE);
  if (minutes < 0) minutes = 0;
  remains = remains % MS_MINUTE;

  let seconds = Math.floor(remains / MS_SECOND);
  if (seconds < 0) seconds = 0;

  const isFinished = 0 === days + hours + minutes + seconds;

  return { days, hours, minutes, seconds, isFinished };
};
