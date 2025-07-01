export function getDayOrNightIcon(
  iconName: string,
  dateTimeString: string
): string {

  const hours = new Date(dateTimeString).getHours();

  const isDaytime = hours >= 6 && hours < 18;
  
  return isDaytime ? iconName.replace(/.$/,"d") : iconName.replace(/.$/, "n");

}