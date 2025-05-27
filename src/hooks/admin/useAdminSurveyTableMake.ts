// hooks/survey/useSurveyCommonInfo.ts
import { post_urlFormData } from "../../lib/apiFilter";
import API_URL from "../../api/endpoints";
import { useMutation } from "@tanstack/react-query";

// 설문 시작하기
export function useAdminSurveyTableMake() {
	return useMutation({
		mutationFn: async ({ surveyType, surveyPage, initData }: { surveyType: string; surveyPage: string; initData: Record<string, string> }) => {
			const res = await post_urlFormData(API_URL.ADMIN_STORE_TABLE, { surveyType, surveyPage, ...initData });
			return res.data;
		},
		/*
		// Mutation이 시작되기 직전에 특정 작업을 수행
		onMutate(a) {},
		onSuccess({ data }) {},
		onError(err) {},
		// 결과에 관계 없이 무언가 실행됨
		onSettled(data, err, params, context) {
			// console.log(data, err, params, context);
		},
        */
	});
}
