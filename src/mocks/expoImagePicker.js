export const MediaTypeOptions = { Images: 'Images' };
export const requestCameraPermissionsAsync = jest.fn(async () => ({ status: 'granted' }));
export const requestMediaLibraryPermissionsAsync = jest.fn(async () => ({ status: 'granted' }));
export const launchCameraAsync = jest.fn(async () => ({
  canceled: false,
  assets: [{ uri: 'file://mock-camera-photo.jpg' }],
}));
export const launchImageLibraryAsync = jest.fn(async () => ({
  canceled: false,
  assets: [{ uri: 'file://mock-gallery-photo.jpg' }],
}));
