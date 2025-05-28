import { useQuery } from "@tanstack/react-query";
import { get_normal } from "../../lib/apiFilter";
import API_URL from "../../api/endpoints";

// 설문 정보 조회
export function useSurveyRequestManager(email: string, surveyType: string) {
	return useQuery({
		queryKey: ["surveyInfo", { email, surveyType }],
		queryFn: () => get_normal(API_URL.SURVEY_MANAGER, { email, surveyType }),
		select: (res) => res.data,
		enabled: !!email && !!surveyType,
	});
}
