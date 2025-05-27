import { useQuery } from "@tanstack/react-query";
import { get_normal } from "../../lib/apiFilter";
import API_URL from "../../api/endpoints";

// 설문 정보 조회
export function useSurveyInfo(surveyType: string) {
	return useQuery({
		queryKey: ["surveyInfo", { surveyType }],
		queryFn: () => get_normal(API_URL.SURVEY_INTRO, { surveyType }),
		select: (res) => res.data,
		enabled: !!surveyType,
	});
}
