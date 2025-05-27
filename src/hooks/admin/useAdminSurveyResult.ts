import { useQuery } from "@tanstack/react-query";
import { get_normal } from "../../lib/apiFilter";
import API_URL from "../../api/endpoints";

interface AdminSurveyResultInfo {
	code: number;
	data: {
		store_data_list: Record<string, string | number>[];
		tesci_name: string;
		top_menu_list: string[];
	};
}

export function useAdminSurveyResult(surveyType: string, surveyPage: string) {
	return useQuery({
		// 쿼리 키 - 바뀌는 경우 다른 요청으로 인식
		queryKey: ["adminSurveyResult", { surveyType, surveyPage }],
		queryFn: () => get_normal(API_URL.ADMIN_SURVEY_RESULT, { surveyType, surveyPage }),
		select: (res): AdminSurveyResultInfo => res.data,
		// 해당 쿼리를 실행할지 여부를 제어하는 조건
		enabled: !!surveyType && !!surveyPage,
	});
}
