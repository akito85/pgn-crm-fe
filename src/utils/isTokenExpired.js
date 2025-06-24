export const isTokenExpired = () => {
    const expiresAt = localStorage.getItem('expired_at') || window.sessionStorage.getItem('expired_at');
    const expiresSplit = expiresAt.replace(/\D/g, "");
    const expiresNumber = parseInt(expiresSplit)
    const expiresInSecond = expiresNumber * 60 * 1000;
    const expired = Date.now() + expiresInSecond;
    return Date.now() > expired; 
}


// function printFormattedDate() {
	// 	const currentDate = new Date();

	// 	const day = currentDate.getDate();
	// 	const month = currentDate.toLocaleString('default', { month: 'short' });
	// 	const year = currentDate.getFullYear();
	// 	const hours = currentDate.getHours();
	// 	const minutes = currentDate.getMinutes();
	// 	const seconds = currentDate.getSeconds();

	// 	const paddedDay = String(day).padStart(2, '0');
	// 	const paddedHours = String(hours).padStart(2, '0');
	// 	const paddedMinutes = String(minutes).padStart(2, '0');
	// 	const paddedSeconds = String(seconds).padStart(2, '0');

	// 	const formattedDate = `${paddedDay}/${month}/${year} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`;

	// 	console.log(formattedDate);
	// }
	// setInterval(printFormattedDate, 1000)
	// setInterval(isTokenExpired, 1000)