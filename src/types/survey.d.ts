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
// 설문 결과값 데이터
export type ResultData = Record<string, string>;
export type SurveyStoreData = {
	progress_raw?: string;
	end?: boolean;
} & ResultData;
export interface SurveyQuestionProps {
	resultData: ResultData;
	changeResultData: (e?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, addObj?: ResultData) => void;
	R_num: number;
}

export type changeSubcontentsParams = {
	R_num: number;
	subContents: MultiTableSubContents | MultiChoiceSubContents | EtcTextSubContents | EtcTextareaSubContents;
};

export interface AdminSurveyQuestionProps {
	R_num: number;
	munhangsDispatch: React.Dispatch<MunhangsAction>;
}

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
