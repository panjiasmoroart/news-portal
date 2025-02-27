/* eslint-disable no-unused-vars */
import React from 'react';
import decode_token from '../utils';

const initialState = {
   token: '',
   userInfo: {}
 };
 
 const storeReducer = (state = initialState, action) => {
   switch (action.type) {
      case 'login_success':
         return {
            ...state,
            token: action.payload.token,
            userInfo: decode_token(action.payload.token)
         };

     case 'logout':

       return {
         ...state,
         token: '',
         userInfo: {}
       };

      default:
         return state;
   }
 };
 
 export default storeReducer;
 