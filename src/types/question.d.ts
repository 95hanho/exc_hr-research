/* 테이블 질문 ------------------------------------------ */
// table_th 셀 하나에 들어갈 수 있는 타입들 -----
type MultiTableThKey = "weightDoubleFive" | "increaseDecrease";
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
export type MultiTableThCell =
	| "-" // 합쳐진 셀
	| `${MultiTableThPrefixChain}${MultiTableThKeyword}`
	| `${MultiTableThPrefixChain}${string}`
	| string; // table_th
// table_td 셀 하나에 들어갈 수 있는 타입들 -----
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
export type MultiTableTdCell =
	| "-" // 합쳐진 셀을 나타내는 키워드
	| `${MultiTableTdPrefixChain}${MultiTableTdKeyword}`
	| string; // table_td 셀 하나에 들어갈 수 있는 타입들
export type MultiTableSubContents = {
	topAlert?: "weightDoubleFive" | "addDirectly" | string[]; // string[]일 경우 표 제목 행
	topAlertMent?: string; // topAlert 직접 추가 HTML
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
/* 객관식 질문 */
// MultiChoice의 각 선택 항목 타입
type MultiChoiceChoice = {
	content: string; // 선택 항목의 텍스트
	notic?: string | null; // 선택 항목에 대한 추가 알림 (선택적)
};
export type MultiChoiceSubContents = {
	count?: number;
	requiredCount?: boolean;
	half?: boolean;
	choices: MultiChoiceChoice[];
	plural?: boolean; // 다중선택 여부
};
/* 주관식(단답형) 질문 */
export type EtcTextSubContents = {
	placeholder?: string;
	comment?: string;
	requiredTxt?: boolean;
};
/* 주관식(서술형) 질문 */
export type EtcTextareaSubContents = {
	requiredTxt?: boolean;
	placeholder?: string;
};
// Question 전체 유니언 타입
type QuestionCommon = {
	hide?: boolean;
	R_num: number;
	title: string;
	alert?: {
		color: string;
		content: string;
	};
	subPadding?: boolean;
	required?: Record<string, string>;
};

type EmptyQuestion = QuestionCommon & { qType: ""; subContents: Record<string, never> };
type Question =
	| EmptyQuestion
	| (QuestionCommon & { qType: "MultiTable"; subContents: MultiTableSubContents })
	| (QuestionCommon & { qType: "MultiChoice"; options: string[]; subContents: MultiChoiceSubContents })
	| (QuestionCommon & { qType: "EtcText"; subContents: EtcTextSubContents })
	| (QuestionCommon & { qType: "EtcTextarea"; rows?: number; subContents: EtcTextareaSubContents });

// Munhang 타입
export type Munhang = {
	title: string;
	mainTitle?: string;
	mainAlert?: {
		color?: string;
		content?: string;
	};
	required?: Record<string, string>;
	questions: Question[];
	mainHide?: boolean;
};
