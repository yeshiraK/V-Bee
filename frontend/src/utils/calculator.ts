export interface AttendanceCalculationResult {
  currentPercentage: number;
  isSafe: boolean;
  statusText: string;
  marginClasses: number; // if isSafe, classes can miss; if !isSafe, classes needed
  details: string;
}

/**
 * Pure mathematical calculator for VIT 75% attendance threshold.
 */
export function calculateAttendance(
  attended: number,
  total: number,
  thresholdPercent: number = 75
): AttendanceCalculationResult {
  if (total <= 0) {
    return {
      currentPercentage: 0,
      isSafe: true,
      statusText: 'No classes conducted',
      marginClasses: 0,
      details: 'Attendance will update once classes are conducted.',
    };
  }

  // Ensure attended cannot exceed total in logical calculations
  const validAttended = Math.min(Math.max(0, attended), total);
  const currentPercentage = Number(((validAttended / total) * 100).toFixed(2));
  const t = thresholdPercent / 100;

  if (currentPercentage >= thresholdPercent) {
    // Formula: floor((A - 0.75T) / 0.75)
    const canMiss = Math.max(0, Math.floor((validAttended - t * total) / t));
    return {
      currentPercentage,
      isSafe: true,
      statusText: 'Above Safe Threshold',
      marginClasses: canMiss,
      details:
        canMiss > 0
          ? `You can safely miss ${canMiss} upcoming ${canMiss === 1 ? 'class' : 'classes'} and maintain >= ${thresholdPercent}%.`
          : `You are exactly at ${currentPercentage}%. You cannot miss your next class without dropping below ${thresholdPercent}%.`,
    };
  } else {
    // Formula: ceil((0.75T - A) / (1 - 0.75)) = ceil((0.75T - A) / 0.25)
    const needToAttend = Math.max(1, Math.ceil((t * total - validAttended) / (1 - t)));
    return {
      currentPercentage,
      isSafe: false,
      statusText: 'Below 75% Threshold',
      marginClasses: needToAttend,
      details: `You need to attend ${needToAttend} consecutive ${needToAttend === 1 ? 'class' : 'classes'} to reach ${thresholdPercent}%.`,
    };
  }
}
