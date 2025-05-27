import { useQuery } from "@tanstack/react-query";
import { get_normal } from "../../lib/apiFilter";
import API_URL from "../../api/endpoints";

export function useAdminSurveyQuestion(surveyType: string, surveyPage: string) {
	return useQuery({
		// 쿼리 키 - 바뀌는 경우 다른 요청으로 인식
		queryKey: ["adminSurveyQuestion", { surveyType, surveyPage }],
		queryFn: () => get_normal(API_URL.ADMIN_SURVEY, { surveyType, surveyPage }),
		select: (res) => res.data,
		// 해당 쿼리를 실행할지 여부를 제어하는 조건
		enabled: !!surveyType && !!surveyPage,
		refetchOnWindowFocus: false, // 웹 창에 다시포커스되면 다시 queryFn이 실행되는거 방지
	});
}
