export const setNotificationHandler = jest.fn();
export const requestPermissionsAsync = jest.fn(async () => ({ status: 'granted' }));
export const scheduleNotificationAsync = jest.fn(async () => 'notif-id-123');
export const cancelScheduledNotificationAsync = jest.fn(async () => {});
