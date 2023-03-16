import React from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useLoadingContext} from '../Metadata';
import Login from './Login';
import Profile from './Profile';

const pfilter = (v) => ['couchdb', 'ldap', 'offline'].includes(v);

export default function LoginRoute(props) {
  const {ifaceState: {complete_loaded}} = useLoadingContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  if(complete_loaded) {
    if(searchParams.has('return')) {
      setTimeout(() => navigate(searchParams.get('return')));
      return null;
    }
    return <Profile {...props}/>;
  }

  return <Login pfilter={pfilter} {...props}/>;
}
