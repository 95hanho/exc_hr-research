export interface CommonInfo {
	color: string;
	start_date: string;
	end_date: string;
	open_status: number;
	endStatus: boolean;
	isExist: boolean;
	adminOn: boolean;
}

export interface CommonState {
	curYear: string;
	commonInfo: CommonInfo;
}
/* 관리자 ------------------------------ */
// 관리자 공통정보관리
export type AdminCommonInfo = {
	color?: string;
	start_date?: string;
	end_date?: string;
};
// 관리자 설문 리스트
export type AdminSurveyInfo = {
	survey_name: string;
	survey_url: string;
	survey_description: string;
};
