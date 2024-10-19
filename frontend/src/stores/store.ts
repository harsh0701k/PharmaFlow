import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';
import openAiSlice from './openAiSlice';

import usersSlice from './users/usersSlice';
import appointmentsSlice from './appointments/appointmentsSlice';
import inventoriesSlice from './inventories/inventoriesSlice';
import organizationsSlice from './organizations/organizationsSlice';
import patientsSlice from './patients/patientsSlice';
import prescriptionsSlice from './prescriptions/prescriptionsSlice';
import rolesSlice from './roles/rolesSlice';
import permissionsSlice from './permissions/permissionsSlice';
import organizationSlice from './organization/organizationSlice';

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,
    openAi: openAiSlice,

    users: usersSlice,
    appointments: appointmentsSlice,
    inventories: inventoriesSlice,
    organizations: organizationsSlice,
    patients: patientsSlice,
    prescriptions: prescriptionsSlice,
    roles: rolesSlice,
    permissions: permissionsSlice,
    organization: organizationSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
