import { RequiredHideRule } from "../../types/survey";

export type RequiredListAction =
	| { type: "init"; payload: RequiredHideRule[] }
	| { type: "add_required" }
	| { type: "remove_required"; index: number }
	| { type: "reset_required"; index: number }
	| { type: "update_attr"; index: number; value: string }
	| { type: "update_value"; index: number; valueIndex: number; value: string }
	| { type: "add_value"; index: number }
	| { type: "remove_value"; index: number; valueIndex: number }
	| { type: "update_hide"; index: number; hideIndex: number; value: string }
	| { type: "add_hide"; index: number }
	| { type: "remove_hide"; index: number; hideIndex: number };

const requiredListReducer = (state: RequiredHideRule[], action: RequiredListAction): RequiredHideRule[] => {
	switch (action.type) {
		case "init":
			return [...action.payload];
		case "add_required":
			return [...state, { attr: "", values: [""], hide: [""] }];
		case "remove_required":
			return state.filter((_, index) => index !== action.index);
		case "reset_required":
			return state.map((item, index) => (index === action.index ? { attr: "", values: [""], hide: [""] } : item));
		case "update_attr":
			return state.map((item, index) => (index === action.index ? { ...item, attr: action.value } : item));
		case "update_value":
			return state.map((item, index) =>
				index === action.index
					? {
							...item,
							values: item.values.map((v, vIdx) => (vIdx === action.valueIndex ? action.value : v)),
					  }
					: item
			);
		case "add_value":
			return state.map((item, index) => (index === action.index ? { ...item, values: [...item.values, ""] } : item));
		case "remove_value":
			return state.map((item, index) =>
				index === action.index ? { ...item, values: item.values.filter((_, vIdx) => vIdx !== action.valueIndex) } : item
			);
		case "update_hide":
			return state.map((item, index) =>
				index === action.index
					? {
							...item,
							hide: item.hide.map((h, hIdx) => (hIdx === action.hideIndex ? action.value : h)),
					  }
					: item
			);
		case "add_hide":
			return state.map((item, index) => (index === action.index ? { ...item, hide: [...item.hide, ""] } : item));
		case "remove_hide":
			return state.map((item, index) =>
				index === action.index ? { ...item, hide: item.hide.filter((_, hIdx) => hIdx !== action.hideIndex) } : item
			);
		default:
			return state;
	}
};

export default requiredListReducer;
