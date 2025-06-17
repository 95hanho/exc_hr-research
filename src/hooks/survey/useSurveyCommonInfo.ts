import { useQuery } from "@tanstack/react-query";
import { get_normal } from "../../api/apiFilter";
import API_URL from "../../api/endpoints";

interface resultList {
	type: 3 | 4 | 5;
	data: string;
}
interface SurveyCommonInfoResponse {
	result: resultList[];
	remote_status: boolean;
	ip_status: boolean;
}

// 공통 정보 조회
export function useSurveyCommonInfo(surveyYear: string) {
	return useQuery({
		queryKey: ["commonInfo", { surveyYear }],
		queryFn: () => {
			if (surveyYear) return get_normal(API_URL.SURVEY_COMMON, { s_year: surveyYear });
		},
		select: (res): SurveyCommonInfoResponse => res?.data,
		enabled: !!surveyYear,
		refetchOnWindowFocus: true, // 웹 창에 다시포커스되면 다시 queryFn이 실행되는거 방지
	});
}
