import React from 'react';
import {useLoadingContext} from '../Metadata';
import Login from './Login';
import Profile from './Profile';

const pfilter = (v) => ['couchdb', 'ldap', 'offline'].includes(v);

export default function LoginRoute(props) {
  const {ifaceState: {complete_loaded}} = useLoadingContext();
  return complete_loaded ? <Profile {...props}/> : <Login pfilter={pfilter} {...props}/>;
}
