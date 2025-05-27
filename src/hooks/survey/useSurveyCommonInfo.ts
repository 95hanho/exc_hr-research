// hooks/survey/useSurveyCommonInfo.ts
import { useQuery } from "@tanstack/react-query";
import { get_normal } from "../../lib/apiFilter";
import API_URL from "../../api/endpoints";

// 공통 정보 조회
export function useSurveyCommonInfo(surveyYear: string) {
	return useQuery({
		queryKey: ["commonInfo", { surveyYear }],
		queryFn: () => {
			if (surveyYear) return get_normal(API_URL.SURVEY_COMMON, { s_year: surveyYear });
		},
		select: (res) => res?.data,
		enabled: !!surveyYear,
		refetchOnWindowFocus: true, // 웹 창에 다시포커스되면 다시 queryFn이 실행되는거 방지
	});
}
