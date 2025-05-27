import { createSlice } from "@reduxjs/toolkit";
import { CommonState } from "../types/common";

const initialState: CommonState = {
	curYear: "",
	commonInfo: {
		color: "",
		start_date: "",
		end_date: "",
		open_status: 0,
		endStatus: false,
		isExist: true,
		adminOn: false,
	},
};

const commonSlice = createSlice({
	name: "common",
	initialState: initialState,
	reducers: {
		change_curYear(state, { payload }) {
			state.curYear = payload;
		},
		change_commonInfo(state, { payload }) {
			state.commonInfo = {
				...state.commonInfo,
				...payload,
			};
		},
	},
});

export default commonSlice.reducer;
