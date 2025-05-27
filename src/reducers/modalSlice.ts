import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
	name: "modal",
	initialState: {
		// 기본 알람
		modal_alert: false,
		modal_alert_txt: "",
	},
	reducers: {
		on_modal_alert(state, { payload }) {
			state.modal_alert = true;
			state.modal_alert_txt = payload;
		},
		off_modal_alert(state) {
			state.modal_alert = false;
		},
	},
});

export default modalSlice.reducer;
