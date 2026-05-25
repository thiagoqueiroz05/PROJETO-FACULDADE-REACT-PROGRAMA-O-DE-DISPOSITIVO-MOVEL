export const NavigationContainer = ({ children }) => children;

export const createStackNavigator = () => ({
  Navigator: ({ children }) => children,
  Screen: () => null,
});

export const useNavigation = () => ({
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
});

export const useFocusEffect = (callback) => {
  const React = require('react');
  React.useEffect(() => {
    callback();
  }, []);
};
