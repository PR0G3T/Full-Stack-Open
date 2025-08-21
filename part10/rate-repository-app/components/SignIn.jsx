import React from 'react';
import SignInContainer from './SignInContainer';
import useSignIn from '../hooks/useSignIn';

const SignIn = ({ onTabPress }) => {
  const [signIn, result] = useSignIn();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      const { data } = await signIn({ username, password });
      console.log(data);
      // Redirect to repositories view after successful sign-in
      onTabPress('repositories');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SignInContainer onSubmit={onSubmit} loading={result.loading} />
  );
};

export default SignIn;
