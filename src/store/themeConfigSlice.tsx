import { createSlice } from '@reduxjs/toolkit';
import { theme_id, themeConfig } from '../config';


const initialState = {
    locale: localStorage.getItem(`${theme_id}-locale`) || themeConfig.locale,
    theme: localStorage.getItem(`${theme_id}-theme`) || themeConfig.theme
};

const themeConfigSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setLocale(state, { payload }) {
            state.locale = payload;
            localStorage.setItem(`${theme_id}-locale`, payload);
        },
        setTheme(state, { payload }) {
            state.theme = payload;
            localStorage.setItem(`${theme_id}-theme`, payload);
        },
    },
});

export const { setLocale, setTheme } = themeConfigSlice.actions;

export default themeConfigSlice.reducer;
