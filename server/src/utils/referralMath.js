export const calculateReferralCredits = (successfulCount) => {
  const count = Math.max(0, parseInt(successfulCount) || 0);
  const baseReward = count * 500;
  const bonusReward = Math.floor(count / 5) * 500;
  return baseReward + bonusReward;
};
