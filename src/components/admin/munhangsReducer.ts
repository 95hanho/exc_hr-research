import { EmptyQuestion, Munhang, Question } from "../../types/question";
import { changeSubcontentsParams } from "../../types/survey";

export type MunhangsAction =
	| { type: "init"; payload: Munhang[] }
	| { type: "empty_init" }
	| { type: "reassign_rnum" }
	| ({ type: "change_subcontents" } & changeSubcontentsParams)
	| ({ type: "change_q_subcontents" } & changeSubcontentsParams)
	| { type: "update_munhang_title"; munhangIdx: number; value: string }
	| { type: "insert_munhang" }
	| { type: "delete_munhang"; munhangIdx: number }
	| { type: "update_mainTitle"; munhangIdx: number; value?: string }
	| { type: "update_mainAlert"; munhangIdx: number; payload: Munhang["mainAlert"] }
	| {
			type: "update_q_qType";
			munhangIdx: number;
			questionIdx: number;
			value: string;
	  }
	| {
			type: "update_q_field";
			munhangIdx: number;
			questionIdx: number;
			payload: Record<string, undefined | boolean | string | Record<string, string>>;
	  }
	| {
			type: "delete_q";
			munhangIdx: number;
			questionIdx: number;
	  }
	| {
			type: "insert_q";
			munhangIdx: number;
			questionIdx: number;
	  };

const munhangsReducer = (state: Munhang[], action: MunhangsAction): Munhang[] => {
	switch (action.type) {
		case "init":
			return [...action.payload];
		case "empty_init":
			return [
				{
					title: "기본",
					questions: [
						{
							//   title: "귀사(기관)에서 실시한 교육 형태별 참가인원 비율을 기술해 주십시오.<br>(항목별 가로 합이 100%가 되도록 기술)",
							title: "",
							subContents: {},
						} as EmptyQuestion,
					],
				},
			];
		case "reassign_rnum": {
			let rNum = 0;
			return state.map((munhang) => ({
				...munhang,
				questions: munhang.questions.map((question) => ({
					...question,
					R_num: ++rNum,
				})),
			}));
		}
		case "change_subcontents":
			return state.map((munhang) => ({
				...munhang,
				questions: munhang.questions.map((question) => {
					if (question.R_num != action.R_num) return question;
					else {
						return {
							...question,
							subContents: action.subContents,
						};
					}
				}),
			}));
		case "change_q_subcontents":
			return state.map((munhang) => ({
				...munhang,
				questions: munhang.questions.map((question) => {
					if (question.R_num != action.R_num) return question;
					else {
						return {
							...question,
							subContents: action.subContents,
						};
					}
				}),
			}));
		case "update_munhang_title":
			return state.map((munhang, munhangIdx) =>
				munhangIdx === action.munhangIdx
					? {
							...munhang,
							title: action.value,
					  }
					: munhang
			);
		case "insert_munhang":
			return [
				...state,
				{
					title: "",
					questions: [
						{
							R_num: 0,
							qType: "",
							title: "",
							alert: undefined,
							subPadding: false,
							subContents: {},
						},
					],
				},
			];
		case "delete_munhang":
			return state.filter((_, munhangIdx) => action.munhangIdx !== munhangIdx);
		case "update_mainTitle":
			return state.map((munhang, munhangIdx) =>
				munhangIdx === action.munhangIdx
					? {
							...munhang,
							mainTitle: action.value,
					  }
					: munhang
			);
		case "update_mainAlert":
			return state.map((munhang, munhangIdx) =>
				munhangIdx === action.munhangIdx
					? {
							...munhang,
							mainAlert: action.payload
								? {
										...munhang.mainAlert,
										...action.payload,
								  }
								: action.payload,
					  }
					: munhang
			);
		case "update_q_qType": {
			let newSubContents = {};
			if (action.value === "MultiTable") {
				newSubContents = {
					table_th: [[""]],
					table_td: [[""]],
				};
			} else if (action.value === "MultiChoice") {
				newSubContents = {
					plural: false,
					choices: [
						{ content: "찬성", notic: "" },
						{ content: "반대", notic: "" },
					],
				};
			}
			return state.map((munhang, munhangIdx) =>
				munhangIdx === action.munhangIdx
					? {
							...munhang,
							questions: munhang.questions.map((question, qIdx) =>
								qIdx === action.questionIdx
									? ({
											...question,
											qType: action.value,
											subContents: newSubContents,
									  } as Question)
									: question
							),
					  }
					: munhang
			);
		}
		case "update_q_field":
			return state.map((munhang, munhangIdx) =>
				munhangIdx === action.munhangIdx
					? {
							...munhang,
							questions: munhang.questions.map((question, qIdx) =>
								qIdx === action.questionIdx
									? {
											...question,
											...action.payload,
									  }
									: question
							),
					  }
					: munhang
			);
		case "delete_q": {
			const newMunhangs = state.map((munhang) => ({ ...munhang, questions: [...munhang.questions] }));
			newMunhangs[action.munhangIdx].questions.splice(action.questionIdx, 1);
			if (newMunhangs[action.munhangIdx].questions.length === 0) {
				newMunhangs.splice(action.munhangIdx, 1);
			}
			return newMunhangs;
		}
		case "insert_q": {
			return state.map((munhang) => ({
				...munhang,
				questions: [
					...munhang.questions.slice(0, action.questionIdx),
					{
						title: "",
						subContents: {},
					} as EmptyQuestion,
					...munhang.questions.slice(action.questionIdx),
				],
			}));
		}
		default:
			return state;
	}
};

export default munhangsReducer;
