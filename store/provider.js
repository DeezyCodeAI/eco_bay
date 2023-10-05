"use client"

import { Provider } from 'react-redux';
import store from '../store/page';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

let persistor = persistStore(store);


export function StoreProvider({ children }) {
    return (
        <>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        {children}
        </PersistGate>
    </Provider>
    </>
    )
}