export const calculatePriceWithPercentage = (percentage, price) => {
	if (!percentage || !price) return 0;
	const numPrice = Number(price);
	const numPercentage = Number(percentage);
	if (isNaN(numPrice) || isNaN(numPercentage)) return 0;
	const percentageAmount = numPrice * (numPercentage / 100);
	const totalPrice = numPrice + percentageAmount;
	return Math.round(totalPrice);
      };