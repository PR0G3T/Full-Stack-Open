// Mock expo-constants
jest.mock('expo-constants', () => ({
  statusBarHeight: 44,
  expoConfig: {
    extra: {
      apolloUri: 'http://localhost:4000/graphql',
    },
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Apollo Client
jest.mock('@apollo/client', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useApolloClient: jest.fn(),
  gql: jest.fn((strings, ..._args) => strings.join('')),
}));

// Mock Formik
jest.mock('formik', () => ({
  Formik: ({ children, initialValues, _validationSchema, onSubmit }) => {
    let currentValues = { ...initialValues };
    
    const mockFormikProps = {
      handleChange: jest.fn((field) => (text) => {
        currentValues[field] = text;
      }),
      handleBlur: jest.fn((_field) => () => {}),
      handleSubmit: jest.fn(() => onSubmit(currentValues)),
      values: currentValues,
      errors: {},
      touched: {},
    };
    return children(mockFormikProps);
  },
}));

// Mock Yup
jest.mock('yup', () => ({
  string: () => ({
    required: jest.fn(() => 'Username is required'),
  }),
  object: () => ({
    shape: () => ({
      validate: jest.fn(() => Promise.resolve(true)),
    }),
  }),
}));
