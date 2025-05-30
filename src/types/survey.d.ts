import { ChangeEvent } from "react";

// 인적사항 정보
export interface PersonalInfo {
	R_Name?: string;
	R_Position?: string;
	R_Gender?: string;
	R_Tel_No?: string;
	R_C_Tel_No?: string;
	zonecode?: string;
	addr_road?: string;
	addr_detail?: string;
	R_Email?: string;
	R_Div?: string;
	R_Company_Name?: string;
	R_Part_Name?: string;
	R_Cate?: string;
	R_Cate_Name?: string;
	R_Biz_Reg_No?: string;
	R_COMMON_1_1?: string;
	R_COMMON_1_2?: string;
	R_COMMON_1_3?: string;
	R_COMMON_1_4?: string;
	R_COMMON_1_5?: string;
	R_COMMON_1_6?: string;
	R_COMMON_1_7?: string;
	R_COMMON_1_8?: string;
	R_COMMON_1_9?: string;
	R_COMMON_1_10?: string;
	recommend?: string;
}
export type ResultData = Record<string, string>;
export type SurveyStoreData = Record<string, string | number | boolean | null>;

/*  */

// 설문문항
type CommonQuestion = {
	title: string;
	alert?: {
		color: string;
		content: string;
	};
	subPadding?: boolean;
	required?: Record<string, string>;
};

/*  */
type EmptyQuestion = {
	hide?: boolean;
	qType?: "";
	title: "";
	alert?: null;
	subPadding?: false;
	subContents: Record<string, never>;
	required?: Record<string, string>;
};

/* table_th */
type MultiTableThSumPart = "-"; // 합쳐진 셀
type MultiTableThPrefixChain =
	| ``
	| `$rowSpan${number}|`
	| `$rowSpan${number}|$colSpan${number}|`
	| `$rowSpan${number}|$width${number}|`
	| `$rowSpan${number}|$colSpan${number}|$width${number}|`
	| `$colSpan${number}|`
	| `$colSpan${number}|$width${number}|`
	| `$width${number}|`; // prefix chain을 나타내는 키워드
type MultiTableThKeyword = "R_etc" | "$weight";
type MultiTableThKey = "weightDoubleFive" | "increaseDecrease";
// table_th 셀 하나에 들어갈 수 있는 타입들
export type MultiTableThCell =
	| MultiTableThSumPart
	| `${MultiTableThPrefixChain}${MultiTableThKeyword}`
	| `${MultiTableThPrefixChain}${string}`
	| string; // table_th 셀 하나에 들어갈 수 있는 타입들

/* table_td */
type MultiTableTdSumPart = "-"; // 합쳐진 셀을 나타내는 키워드
type MultiTableTdStyle = "" | `$center|` | `$bold|` | `$cenBold|`; // 스타일을 나타내는 키워드
type MultiTableTdPrefixChain =
	| `${MultiTableTdStyle}`
	| `$colSpan${number}|${MultiTableTdStyle}`
	| `$colSpan${number}|$rowSpan${number}|${MultiTableTdStyle}`
	| `$rowSpan${number}|${MultiTableTdStyle}`; // prefix chain을 나타내는 키워드
export type MultiTableTdKeyword =
	| "R_wei"
	| "R_per"
	| "R_increDecre"
	| "R_increDecre2"
	| "R_check"
	| "R_radio"
	| "R_relCheck"
	| "R_relWeight"
	| "R_year"
	| "R_people"
	| "R_won"
	| "R_time"
	| "R_term"
	| "R_etc"
	| "$index"
	| "$total"
	| "$totalRow"; // table_td 셀 타입 키워드들
// table_td 셀 하나에 들어갈 수 있는 타입들
export type MultiTableTdCell = MultiTableTdSumPart | `${MultiTableTdPrefixChain}${MultiTableTdKeyword}` | string; // table_td 셀 하나에 들어갈 수 있는 타입들

export type MultiTableQuestion = CommonQuestion & {
	qType: "MultiTable";
	tableType?: "excelTable";
	subContents: {
		topAlert?: "weightDoubleFive" | "addDirectly" | string[]; // string[]일 경우 표 제목 행
		topAlertMent: string; // topAlert 직접 추가 HTML
		table_th: MultiTableThKey | MultiTableThCell[] | MultiTableThCell[][];
		table_td: MultiTableTdCell[][];
		fCount?: number; // R_relCheck에서 사용됨
		checkType?: 1 | 2 | 3; // R_check에서 체크하는 타입을 결정
		checkLimit?: {
			all?: number; // R_check에서 모두체크갯수 사용됨
			maxOrder?: number; // R_check에서 순서체크 사용됨
			[key: string]: number;
		};
		checkCountrequired?: boolean; // R_check에서 체크갯수를 채우게 할지
		relCheckLimit?: number; // R_relCheck의 연관 최대 갯수
		table_set?: boolean; // 사이즈, 합치기, 디자인 설정키기
	};
};

// MultiChoice의 각 선택 항목 타입
type MultiChoiceChoice = {
	content: string; // 선택 항목의 텍스트
	notic?: string | null; // 선택 항목에 대한 추가 알림 (선택적)
};

export type MultiChoiceQuestion = CommonQuestion & {
	qType: "MultiChoice";
	options: string[]; // MultiChoice 전용 속성
	subContents: {
		count?: number;
		requiredCount?: boolean;
		half?: boolean;
		choices?: MultiChoiceChoice[]; // 구체화 필요
		plural?: boolean; // 다중선택 여부
	};
};

export type EtcTextQuestion = CommonQuestion & {
	qType: "EtcText";
	subContents: {
		placeholder?: string;
		comment?: string;
		requiredTxt?: boolean;
	};
};

export type EtcTextareaQuestion = CommonQuestion & {
	qType: "EtcTextarea";
	rows?: number;
	subContents: {
		requiredTxt?: boolean;
		placeholder?: string;
	};
};

export interface SurveyQuestionProps {
	resultData: ResultData;
	changeResultData: (e?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, addObj?: ResultData) => void;
	R_num: number;
}
export interface AdminSurveyQuestionProps {
	changeSubcontents: (R_num: number, subContents: Question["subContents"]) => void;
	R_num: number;
}

// Question 전체 유니언 타입
type Question = { hide?: boolean; R_num?: number } & (
	| EmptyQuestion
	| MultiTableQuestion
	| MultiChoiceQuestion
	| EtcTextQuestion
	| EtcTextareaQuestion
);

// Munhang 타입
export type Munhang = {
	title: string;
	mainTitle?: string;
	mainAlert?: {
		color: string;
		content: string;
	};
	required?: Record<string, string>;
	questions: Question[];
	mainHide?: boolean;
};
// 필수사항(required) 설정규칙
export type RequiredHideRule = {
	attr: string;
	values: string[];
	hide: string[];
};
// 문항 보여주기 룰
export type MunhangVisibilityRule = {
	values: string[];
	hide: string[];
};
// 설문 결과값 데이터
